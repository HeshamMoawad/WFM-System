from rest_framework.response import Response
from rest_framework.decorators import api_view , permission_classes
from rest_framework.request import Request
# from users.views.auth import  AuthenticateUser
from users.models import ArrivingLeaving , User 
from django.utils import timezone
from users.serializers import RequestSerializer 
from users.views import IsAuthenticated



@api_view(["POST"])
@permission_classes([IsAuthenticated])
def arreive(request: Request):
    obj,created = ArrivingLeaving.objects.get_or_create(user=request.user,date=timezone.now().date())
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
        return Response({"details":f"You are not Arrived Yet !!"})




@api_view(["GET"])
@permission_classes([IsAuthenticated])
def arrive_leave_details(request: Request): 
    try :
        obj = ArrivingLeaving.objects.get(user=request.user,date=timezone.now().date())
        return Response({"details":f"","arrived_at":obj.arriving_at , "leaved_at":obj.leaving_at})
    except ArrivingLeaving.DoesNotExist :
        return Response({"details":f"You are not Arrived Yet !!","arrived_at":None , "leaved_at":None})




@api_view(["POST"])
def test(request:Request):

    print(f"\n--{request.user}--\n")

    print(request.data)
    ser = RequestSerializer(data = request.data)
    # print(ser.is_valid() , ser)
    if ser.is_valid():
        ser.save()

