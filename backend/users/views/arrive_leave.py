from rest_framework.response import Response
from rest_framework.decorators import api_view , permission_classes
from rest_framework.request import Request
from users.views.auth import  AuthenticateUser
from users.models import ArrivingLeaving , User 
from django.utils import timezone
from users.serializers import RequestSerializer 
from users.views import IsAuthenticated



@api_view(["POST"])
@permission_classes([IsAuthenticated])
def arreive(request: Request):
    user , token = AuthenticateUser(request)
    obj,created = ArrivingLeaving.objects.get_or_create(user=user,date=timezone.now().date())
    obj.save()
    at = obj.arriving_at.strftime('%Y/%m/%d - %H:%M:%S')
    if not created:
        return Response({"details":f"Already Arrived !! {at}","arrived_at":obj.arriving_at})
    return Response({"details":f"Successfully Arrived {created} {at}","arrived_at":obj.arriving_at})

    

# @api_view(["POST"])
# @permission_classes([IsAuthenticated])
# def leave(request: Request):
#     user , token = AuthenticateUser(request)
#     try :
#         obj = ArrivingLeaving.objects.get(user=user,date=timezone.now().date())
#         if not obj.leaving_at :
#             obj.leaving_at = timezone.now()
#             at = obj.leaving_at.strftime('%Y/%m/%d - %H:%M:%S')
#             obj.save()
#             return Response({"details":f"Successfully Leaved {at}","leaved_at":obj.leaving_at})
#         else :
#             at = obj.leaving_at.strftime('%Y/%m/%d - %H:%M:%S')
#             return Response({"details":f"Already Leaved {at}","leaved_at":obj.leaving_at})
#     except ArrivingLeaving.DoesNotExist :
#         return Response({"details":f"You are not Arrived Yet !!"})


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def leave(request: Request):
    user , token = AuthenticateUser(request)
    try :
        obj = ArrivingLeaving.objects.get(user=user,date=timezone.now().date())
        obj.leaving_at = timezone.now()
        at = obj.leaving_at.strftime('%Y/%m/%d - %H:%M:%S')
        obj.save()
        return Response({"details":f"Successfully Leaved {at}","leaved_at":obj.leaving_at})
    except ArrivingLeaving.DoesNotExist :
        return Response({"details":f"You are not Arrived Yet !!"})


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def arrive_leave_details(request: Request):
    user , token = AuthenticateUser(request)
    try :
        obj = ArrivingLeaving.objects.get(user=user,date=timezone.now().date())
        return Response({"details":f"","arrived_at":obj.arriving_at , "leaved_at":obj.leaving_at})
    except ArrivingLeaving.DoesNotExist :
        return Response({"details":f"You are not Arrived Yet !!","arrived_at":None , "leaved_at":None})





@api_view(["POST"])
def test(request:Request):
    # user= User.objects.get(uuid=request.data.pop("user"))

    # data = request.data.copy()
    # data.update({"user":user})
    print(request.data)
    ser = RequestSerializer(data = request.data)
    # print(ser.is_valid() , ser)
    if ser.is_valid():
        ser.save()


    # # Define the start and end dates for the specified date range
    # start_date = datetime(2024, 4, 1)
    # end_date = datetime(2024, 5, 1)
    # user= User.objects.get(username="test")
    
    # # Filter the ArrivingLeaving objects for the specified date range
    # arriving_leaving_objects = ArrivingLeaving.objects.filter(
    #     date__gte=start_date.date(),
    #     date__lte=end_date.date(),
    #     leaving_at__isnull=False ,
    #     user=user
    # )
    # print(arriving_leaving_objects, user.usercommissiondetails)

    # print(arriving_leaving_objects,"arriving_leaving_objects")


    # # Calculate total days in the date range
    # # total_days = (end_date - start_date).days

    # # Calculate late arrivals for each user
    # late_arrivals = arriving_leaving_objects.filter(leaving_at__gt=F('arriving_at')).values('user').annotate(
    #     late_count=Count('user')
    # )

    # print(late_arrivals,"late_arrivals")

    # # Calculate total expected days for each user
    # user_expected_days = arriving_leaving_objects.values('user').annotate(
    #     expected_days=Count('date', distinct=True)
    # )
    # print(user_expected_days ,"user_expected_days")

    # # Calculate late percentage for each user
    # user_late_percentage = {}
    # for user in user_expected_days:
    #     late_count = next(
    #         (item['late_count'] for item in late_arrivals if item['user'] == user['user']), 0
    #     )
    #     expected_days = user['expected_days']
    #     if expected_days > 0:
    #         late_percentage = (late_count / expected_days) * 100
    #         user_late_percentage[user['user']] = late_percentage

    # # Optionally, calculate overall late percentage for all users
    # overall_late_percentage = sum(user_late_percentage.values()) / len(user_late_percentage) if user_late_percentage else 0

    # print("Late Percentage for Each User:")
    # for user_id, late_percentage in user_late_percentage.items():
    #     print(f"User ID: {user_id}, Late Percentage: {late_percentage:.2f}%")

    # print(f"Overall Late Percentage: {overall_late_percentage:.2f}%")


