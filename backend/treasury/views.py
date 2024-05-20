from rest_framework.decorators import api_view , permission_classes
from rest_framework.request import Request
from rest_framework.response import Response
from permissions.models import CustomBasePermission
from django.db.models import Sum
from auth.utils import fetch_user
from users.views.auth import AuthenticateUser 
from users.views import CustomPagination15
from .serializer import (
    AdvanceSerializer , 
    Advance , 
    TreasuryOutcome , 
    TreasuryIncome , 
    TreasuryOutcomeSerializer ,
    TreasuryIncomeSerializer , 
    Notification ,
    NotificationSerializer,
    )
from api_views.models import APIViewSet
from django.utils.timezone import now
# Create your views here.

class IsAuthenticated(CustomBasePermission):
    """
    Allows access only to authenticated users.
    """
    def has_permission(self, request, view):
        return bool(fetch_user(request,AuthenticateUser))


class AdvancesAPIView(APIViewSet):
    permission_classes = [IsAuthenticated]
    allowed_methods = ["GET","POST"]
    pagination_class = CustomPagination15
    model = Advance
    model_serializer= AdvanceSerializer
    order_by = ('created_at',)
    search_filters = ["uuid",'user',"creator","amount","created_at"]
    creating_filters = ["user","creator","amount"]
    requiered_fields = ["user","creator","amount"]
    # updating_filters = ["name"]
    unique_field:str = 'uuid'
    auth_class = AuthenticateUser


class OutcomeAPIView(APIViewSet):
    permission_classes = [IsAuthenticated]
    allowed_methods = ["GET","POST","DELETE"]
    pagination_class = CustomPagination15
    model = TreasuryOutcome
    model_serializer= TreasuryOutcomeSerializer
    order_by = ('created_at',)
    search_filters = ["uuid",'details',"creator","amount","created_at"]
    creating_filters = ["details","creator","amount"]
    requiered_fields = ["details","creator","amount"]
    # updating_filters = ["name"]
    unique_field:str = 'uuid'
    auth_class = AuthenticateUser


class IncomeAPIView(APIViewSet):
    permission_classes = [IsAuthenticated]
    allowed_methods = ["GET","POST","DELETE"]
    pagination_class = CustomPagination15
    model = TreasuryIncome
    model_serializer= TreasuryIncomeSerializer
    order_by = ('created_at',)
    search_filters = ["uuid",'details',"creator","amount","created_at"]
    creating_filters = ["details","creator","amount"]
    requiered_fields = ["details","creator","amount"]
    # updating_filters = ["name"]
    unique_field:str = 'uuid'
    auth_class = AuthenticateUser


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def total_treasury(request:Request):
    user = fetch_user(request,AuthenticateUser)
    if user:
        if user.role == "OWNER" or user.is_superuser:
            income = TreasuryIncome.objects.aggregate(total_sum=Sum('amount'))['total_sum']
            outcome = TreasuryOutcome.objects.aggregate(total_sum=Sum('amount'))['total_sum']
            income = income if income else 0
            outcome = outcome if outcome else 0
            return Response({
                "income":income,
                "outcome":outcome,
                "total":income - outcome,
            })
    return Response({ 
        "details":"You are not logged in !!" if not user else "You can't see that"
        })


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def my_notification(request:Request):
    user = fetch_user(request,AuthenticateUser)
    nots = Notification.objects.filter(for_users=user,deadline__gte = now()).order_by("-created_at")  #.exclude(seen_by_users=user)
    return Response(NotificationSerializer(nots,many=True).data) 



@api_view(["POST"])
@permission_classes([IsAuthenticated])
def seen_notification(request:Request):
    user = fetch_user(request,AuthenticateUser)
    notification_uuid = request.query_params.get("uuid","")
    if not notification_uuid:
        return Response({"details":"You must provide a notification uuid"})
    noti = Notification.objects.get(uuid=notification_uuid)
    noti.seen_by_users.add(user)
    return Response(NotificationSerializer(noti).data) 

