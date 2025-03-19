from datetime import datetime
from rest_framework.decorators import api_view, permission_classes
from rest_framework.status import HTTP_200_OK, HTTP_400_BAD_REQUEST
from rest_framework.request import Request
from rest_framework.response import Response
from users.models import User
from users.serializers import  ReportRecord ,ReportRecordSerializer , LeadSerializer , Lead , Project , Department , UserSerializer , ProjectSerializer
from users.views import IsAuthenticated , IsOwner , IsSuperUser , IsManager , IsLeader
from django.utils import timezone
import json
from django.db.models import Count , Q , OuterRef , Exists
from commission.serializers import Team , TeamSerializer
from itertools import chain


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def add_report(request: Request):
    user:User = request.user
    date = request.data.get("date",None)
    if date :
        date = datetime.strptime(date , '%Y-%m-%d')
    else :
        date = timezone.now().date()
    data = request.data.copy()
    data.pop("date")
    obj = ReportRecord(user=request.user,date = date , json_data=json.dumps(data))
    obj.save()
    return Response(ReportRecordSerializer(obj).data)
 

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def check_report(request: Request):
    user:User = request.user
    obj = ReportRecord.objects.filter(user=request.user,date = timezone.now().date() )
    return Response({"canReport":  False if obj else True})



@api_view(["GET"])
@permission_classes([IsLeader|IsOwner|IsSuperUser|IsManager])
def get_reports(request: Request):
    user:User = request.user
    # if user.has_perm("view_reportrecord"):
    proj_filterd = request.query_params.get("project",None)
    date_filterd = request.query_params.get("date",None)
    if date_filterd :
        date_filterd = datetime.strptime(date_filterd , '%Y-%m-%d')
    
    users_in_project = Project.objects.get(uuid=proj_filterd).user_set.filter(department__name="Marketing",is_active=True)
    reports_exist_subquery = ReportRecord.objects.filter(
        user = OuterRef('uuid'),
        date = date_filterd , 
        user__is_active=True,
    )
    users_with_exist_flag = users_in_project.annotate(
        exist=Exists(reports_exist_subquery)
    ).filter(exist=False)
    objs = ReportRecord.objects.filter(user__in= users_in_project , user__is_active=True, date = date_filterd.date()).all()
    reports=[]
    for user in users_with_exist_flag:
        reports.append(ReportRecord(user=user,date=date_filterd,json_data="{}"))
        
    return Response({
        "results" : ReportRecordSerializer(list(chain(objs , reports)),many=True).data
    })
    # return Response({},status=HTTP_400_BAD_REQUEST)


@api_view(["GET"])
@permission_classes([IsManager | IsSuperUser | IsOwner])
def get_leads_report(request:Request):
    projects = Project.objects.all()
    date = request.query_params.get("date",None)
    f = {}
    if date :
        try :
            date = datetime.strptime(date,"%Y-%m-%d")
            f["date__day"] = date.day
        except Exception as e:
            date = datetime.strptime(date,"%Y-%m")
        f["date__year"] = date.year
        f["date__month"] = date.month
        
    result = {
        "total" : Lead.objects.filter(**f).count(),
        "projects":{},
        "users":[]
    }
    for proj in projects :
        result["projects"][proj.name] = {
            "total" : Lead.objects.filter(project=proj,**f).count(),
            "name" : proj.name,
            "color" : proj.color
        }
    
    users = User.objects.filter(department__name="Marketing",role="AGENT",is_active=True).exclude(is_superuser=True).annotate(
        total=Count("lead",filter=Q(**{f"lead__{key}":val for key , val in f.items()}))
    )
    result["users"] = UserSerializer(users,many=True).data
    return Response(result)
    
    
@api_view(["GET"])
@permission_classes([IsLeader | IsManager | IsSuperUser | IsOwner])
def get_projects_to_report(request:Request):
    if request.user.is_superuser or  request.user.role == "OWNER" or request.user.role == "MANAGER" :
        return Response(ProjectSerializer(Project.objects.all(),many=True).data)
    team = Team.objects.filter(leader=request.user).first()
    if team :
        projects = Project.objects.filter(user__in=team.agents.all()).distinct()
        return Response(ProjectSerializer(projects,many=True).data)
    return Response(ProjectSerializer([request.user.project],many=True).data)