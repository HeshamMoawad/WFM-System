from api_views.models import APIViewSet 
from users.views import CustomPagination , IsAuthenticated 
from commission.models import (
    UserCommissionDetails , 
    DeductionRules,
    TargetSlice,
    )
from commission.serializers import UserCommissionDetailsSerializer , DeductionRulesSerializer , TargetSliceSerializer


class UserCommissionDetailsAPI(APIViewSet):
    allowed_methods = ["GET","PUT"]
    permission_classes = [IsAuthenticated]
    pagination_class = CustomPagination
    model = UserCommissionDetails
    model_serializer= UserCommissionDetailsSerializer
    order_by = ('user',)
    search_filters = ["uuid","user"]
    unique_field:str = 'uuid'
    updating_filters = ["basic","set_deduction_rules","first_name","last_name","deduction_rules","set_global_commission_rules","commission_rules","will_arrive_at","will_leave_at"]


class DeductionRulesAPI(APIViewSet):
    permission_classes = [IsAuthenticated]
    pagination_class = CustomPagination
    model = DeductionRules
    model_serializer= DeductionRulesSerializer
    order_by = ('late_time',)
    search_filters = ["uuid"]
    creating_filters = ["late_time","deduction_days","is_global","department"]
    requiered_fields = ["late_time","deduction_days"]
    updating_filters = ["late_time","deduction_days","is_global","department"]
    unique_field:str = 'uuid'


class TargetSlicesAPI(APIViewSet):
    permission_classes = [IsAuthenticated]
    pagination_class = CustomPagination
    model = TargetSlice
    model_serializer= TargetSliceSerializer
    order_by = ('-created_at',)
    search_filters = ["uuid"]
    creating_filters = ["min_value","max_value","money","is_money_percentage" , "is_global" , "department"]
    requiered_fields = ["min_value","max_value","money","is_money_percentage" , "is_global" , "department"]
    updating_filters = ["min_value","max_value","money","is_money_percentage" , "is_global" , "department"]
    unique_field:str = 'uuid'


