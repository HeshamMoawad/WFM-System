from rest_framework.response import Response
from rest_framework.decorators import api_view , permission_classes
from rest_framework.request import Request
from commission.models import DeductionRules
from users.models import ArrivingLeaving , User 
from users.serializers import ArrivingLeavingSerializer
from django.utils import timezone
from users.views import IsAuthenticated
import pandas as pd
from rest_framework.status import HTTP_400_BAD_REQUEST
from datetime import date, timedelta, datetime
from django.db.models import F 
from django.utils.timezone import make_aware


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def arreive(request: Request):
    try :
        obj = ArrivingLeaving.objects.get(user=request.user,date=timezone.now().date())
        created = False
    except ArrivingLeaving.DoesNotExist :
        obj = ArrivingLeaving(user=request.user,date=timezone.now().date())
        obj.arriving_at = timezone.now()
        created = True    
    obj.save()
    at = obj.arriving_at.strftime('%Y/%m/%d - %H:%M:%S')
    if not created:
        return Response({"details":f"Already Arrived !! {at}","arrived_at":obj.arriving_at})
    return Response({"details":f"Successfully Arrived {created} {at}","arrived_at":obj.arriving_at})



@api_view(["POST"])
@permission_classes([IsAuthenticated])
def leave(request: Request):
    try :
        obj = ArrivingLeaving.objects.get(user=request.user,date=timezone.now().date())
        obj.leaving_at = timezone.now()
        at = obj.leaving_at.strftime('%Y/%m/%d - %H:%M:%S')
        obj.save()
        return Response({"details":f"Successfully Leaved {at}","leaved_at":obj.leaving_at})
    except ArrivingLeaving.DoesNotExist :
        return Response({"details":f"You are not Arrived Yet !!"},status=HTTP_400_BAD_REQUEST)




@api_view(["GET"])
@permission_classes([IsAuthenticated])
def arrive_leave_details(request: Request): 
    try :
        obj = ArrivingLeaving.objects.get(user=request.user,date=timezone.now().date())
        return Response({"details":f"","arrived_at":obj.arriving_at , "leaved_at":obj.leaving_at})
    except ArrivingLeaving.DoesNotExist :
        return Response({"details":f"You are not Arrived Yet !!","arrived_at":None , "leaved_at":None})




@api_view(["GET"])
@permission_classes([IsAuthenticated])
def arrive_leave_details_table(request: Request): 
    start = request.query_params.get("start",None)
    end = request.query_params.get("end",None)
    user = request.query_params.get("user",None)
    if all( start ,  end , user ):
        date_range = pd.date_range(start=start,end=end)
        user = User.objects.get(uuid=user)
        try :
            obj = ArrivingLeaving.objects.get(user=request.user,date=timezone.now().date())
            return Response({"details":f"","arrived_at":obj.arriving_at , "leaved_at":obj.leaving_at})
        except ArrivingLeaving.DoesNotExist :
            return Response({"details":f"You are not Arrived Yet !!","arrived_at":None , "leaved_at":None})

    else :
        return Response({},HTTP_400_BAD_REQUEST)




#########################################################################

from rest_framework.views import APIView






def get_date_range_for_custom_month(year, month):
    if month == 1:
        start_date = date(year - 1, 12, 26)
        end_date = date(year, 1, 24)
    else:
        start_date = date(year, month - 1, 26)
        end_date = date(year, month, 25)
    return start_date, end_date

def get_all_days_in_custom_month(start_date, end_date):
    current_day = start_date
    days = []
    while current_day <= end_date:
        if current_day.weekday() not in (4, 5):  # 4 is Friday, 5 is Saturday
            days.append(current_day)
        current_day += timedelta(days=1)
    return days

def get_monthly_history(user, year, month):
    start_date, end_date = get_date_range_for_custom_month(year, month)
    all_days = get_all_days_in_custom_month(start_date, end_date)
    
    records = ArrivingLeaving.objects.filter(
        user=user,
        date__range=(start_date, end_date)
    ).prefetch_related("user","user__usercommissiondetails").annotate(
        will_arrive_at=F("user__usercommissiondetails__will_arrive_at"),
        will_leave_at=F("user__usercommissiondetails__will_leave_at"),
        set_deduction_rules=F("user__usercommissiondetails__set_deduction_rules"),
    ) 

    records_lookup = {record.date: record for record in records}
    
    history = []
    for day in all_days:
        if day in records_lookup:
            record = records_lookup[day]
            history.append(record)
        else:
            history.append(ArrivingLeaving(
                user=user,
                date=day,
                arriving_at= None,
                leaving_at= None,
            ))
    return history


def get_monthly_history_lated_only( date:datetime , department:str=None):
    if all([date, department]) :
        f = {"date":date.date(),"user__is_superuser":False,"user__department__uuid":department}
    else :
        f = {"date":date.date(),"user__is_superuser":False}
    records = ArrivingLeaving.objects.filter(
        **f
    ).prefetch_related("user","user__usercommissiondetails","user__usercommissiondetails__deduction_rules").annotate(
        will_arrive_at=F("user__usercommissiondetails__will_arrive_at"),
        will_leave_at=F("user__usercommissiondetails__will_leave_at"),
        set_deduction_rules=F("user__usercommissiondetails__set_deduction_rules"),
    )
    return records




class MonthlyHistoryView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request:Request):
        user_id = request.query_params.get("user_id",None)
        year = request.query_params.get("year",None)
        month = request.query_params.get("month",None)
        if not all([user_id,year,month]):
            return Response({},status=HTTP_400_BAD_REQUEST)
        user = User.objects.get(uuid=user_id)
        history = get_monthly_history(user, int(year), int(month))
        cache= {}
        rules = DeductionRules.objects.filter(is_global=True).values("late_time","deduction_days")
        serializer = ArrivingLeavingSerializer(history,rules=rules,cache=cache, many=True)
        return Response({"results":serializer.data , "count":len(history)})
        
    def post(self, request:Request):
        date = request.query_params.get("date",None)
        department = request.query_params.get("department",None)
        try :
            date_parsed = datetime.strptime(date,"%d-%m-%Y")
            date= True
        except Exception as e :
            date=False
        cache = {}
        if not date:
            return Response({},status=HTTP_400_BAD_REQUEST)
        history = get_monthly_history_lated_only(date_parsed , department)
        rules = DeductionRules.objects.filter(is_global=True).values("late_time","deduction_days")
        serializer = ArrivingLeavingSerializer(history,rules=rules,cache=cache, many=True)
        return Response({"results": serializer.data, "count":len(history)})
