import pandas as pd
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.status import HTTP_200_OK, HTTP_400_BAD_REQUEST
from rest_framework.request import Request
from users.models import Lead , User 
from commission.models import Additional , Team
from users.serializers import  LeadSerializer
from users.views import IsAuthenticated , IsOwner , IsSuperUser
from django.db import connection 
import datetime , numpy,calendar
from django.db.models import Q , Case , Count
from datetime import date
from django.db.models.functions import TruncDate
from utils.filters import filter_queryset_with_permissions
from utils.parsers import parse_date
from django.contrib.auth.models import Group
from users.models import User , Project

DATE_FORMATS = [
    "%Y-%m-%d - %H:%M", # 2024-09-08 - 06:35
    "%Y-%m-%d %H:%M:%S", # 2024-09-08 06:35
    "%m/%d/%Y %H:%M", # 8/28/2024 11:48
]



@api_view(["POST"])
@permission_classes([IsAuthenticated])
def upload_sheet(request: Request):
    user:User = request.user
    # if user.has_perm("upload_lead"):
    if 'file' not in request.FILES:
        return Response({"error": "No file uploaded"}, status=HTTP_400_BAD_REQUEST)

    file = request.FILES['file']
    
    try:
        df = pd.read_excel(file)
        df = df[["Market","Phone","Date"]]
    except Exception as e:
        return Response({"error": f"Error reading Excel file: {str(e)}"}, status=HTTP_400_BAD_REQUEST)

    if 'Phone' not in df.columns or 'Market' not in df.columns:
        return Response({"error": "Excel file must contain 'Phone' and 'Market' columns"}, status=HTTP_400_BAD_REQUEST)
    
    
    crm_names = User.objects.filter(~Q(crm_username="") & ~Q(crm_username=None) ).values_list("crm_username",flat=True)
    
    df = df[df["Market"].isin(crm_names)]
    
    
    df["Date"] = df["Date"].map(lambda date : parse_date(str(date), DATE_FORMATS) )
    
    
    df["Phone"] = df["Phone"].map(str)
    
    
    df["Market"] = df["Market"].map(lambda crm_username : User.objects.filter(crm_username=crm_username).first() )
    
    
    df["Market"] = df["Market"].map(lambda user : str(user.uuid).replace("-","") if user else numpy.nan)
    
    df.dropna(inplace=True)
    df.rename(columns={
        "Market" : "user_id",
        "Phone" :"phone"
    },inplace=True)
    response_data = {
        "total_count": len(df),
    }
    return Response(response_data, status=HTTP_200_OK)
    # return Response({},status=HTTP_400_BAD_REQUEST)

@api_view(["POST"])
@permission_classes([IsOwner|IsSuperUser])
def save_upload(request:Request):
    user:User = request.user
    # if user.has_perm("upload_lead"):

    if 'file' not in request.FILES:
        return Response({"error": "No file uploaded"}, status=HTTP_400_BAD_REQUEST)

    file = request.FILES['file']
    
    try:
        df = pd.read_excel(file)
        df = df[["Market","Phone","Date","Name"]]
    except Exception as e:
        return Response({"error": f"Error reading Excel file: {str(e)}"}, status=HTTP_400_BAD_REQUEST)

    if 'Phone' not in df.columns or 'Market' not in df.columns:
        return Response({"error": "Excel file must contain 'Phone' and 'Market' columns"}, status=HTTP_400_BAD_REQUEST)
    
    crm_names = User.objects.filter(~Q(crm_username="") & ~Q(crm_username=None) ).values_list("crm_username",flat=True)
    
    df = df[df["Market"].isin(crm_names)]


    df["Date"] = df["Date"].map(lambda date : parse_date(str(date), DATE_FORMATS)) #
    
    
    df["Phone"] = df["Phone"].map(str)
    
    
    df["Market"] = df["Market"].map(lambda crm_username : User.objects.filter(crm_username=crm_username).first() )
    
        
    database_frame = pd.read_sql_query(str(Lead.objects.all().query),connection)
    
    database_frame.rename(columns={
        "user_id" : "Market",
        "phone" : "Phone" ,
    },inplace=True)
    
    objects = [ 
            Lead(
                user = row["Market"] ,
                phone = row["Phone"] ,
                name = getattr(row,"Name",""),
                date =  row["Date"] ,
                project = getattr(row["Market"],"project",None),
                ) 
            for index , row in df.iterrows()
            if isinstance(row["Market"],User)
            ]
    leads = Lead.objects.bulk_create(objects,ignore_conflicts=True)
    return Response(LeadSerializer(leads,many=True).data, status=HTTP_200_OK)
    # return Response({},status=HTTP_400_BAD_REQUEST)




@api_view(["POST"])
@permission_classes([IsAuthenticated])
def user_leads(request:Request):
    user:User = request.user
    # if user.has_perm("add_commission"):
    user_uuid = request.query_params.get("user_uuid")
    month = request.query_params.get("month")
    year = request.query_params.get("year")
    last_day = calendar.monthrange(int(year), int(month))[1]
    date_range = (
        date(int(year),int(month),1) ,
        date( int(year) , int(month) , last_day) + datetime.timedelta(days=1)
    )
    leads = Lead.objects.filter(date__range = date_range ,user__uuid = user_uuid)        
    lead_counts = (
        leads
        .annotate(day=TruncDate('date'))
        .values('day')
        .annotate(lead_count=Count('uuid'))
        .filter(lead_count__gte=5)
        .count()
    )
    
    teams_details = []
    teams = Team.objects.filter(leader__uuid= user_uuid)
    for team in teams:
        teams_details.append({
            "name" : team.name,
            "total" : Lead.objects.filter(date__range = date_range ,user__in = team.agents.all() ).count()
        })
    additional = Additional.objects.first()
    return Response({"total":leads.count(),"plus":lead_counts,"teams": teams_details, "plus_value":lead_counts * getattr(additional,"plus",30)  , "plus_price" : getattr(additional,"plus",30), "american_leads_price": getattr(additional,"american_leads",30)})
    # return Response({},status=HTTP_400_BAD_REQUEST)



@api_view(["POST"])
@permission_classes([IsAuthenticated])
def del_old_lead(request:Request):
    numbers = request.data.get("numbers",[])
    project = request.data.get("project",None)
    if project and (request.user.is_superuser or  request.user.role == "OWNER" or request.user.role == "MANAGER"):
        leads = Lead.objects.filter(phone__in=numbers,project__uuid=project)
    else:
        team = Team.objects.filter(leader=request.user).first()
        if team :
            projects = Project.objects.filter(user__in=team.agents.all()).distinct()
        leads = Lead.objects.filter(phone__in=numbers,project__in=projects)
    leads = filter_queryset_with_permissions(request.user,leads,Lead)
    count = leads.count()
    leads.delete()
    return Response({"count":count})