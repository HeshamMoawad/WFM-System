from api_views.models import APIViewSet
from permissions.users import IsSuperUser ,IsOwner
from users.views import DefaultPagination , IsAuthenticated 
from commission.models import (
    UserCommissionDetails , 
    DeductionRules,
    TargetSlice,
    BasicRecord
    )
from commission.serializers import UserCommissionDetailsSerializer , DeductionRulesSerializer , TargetSliceSerializer , BasicRecordSerializer


class UserCommissionDetailsAPI(APIViewSet):
    allowed_methods = ["GET","PUT"]
    permission_classes = [IsAuthenticated]
    pagination_class = DefaultPagination
    model = UserCommissionDetails
    model_serializer= UserCommissionDetailsSerializer
    order_by = ('user',)
    search_filters = ["uuid","user"]
    unique_field:str = 'uuid'
    updating_filters = ["basic","set_deduction_rules","deduction_rules","set_global_commission_rules","commission_rules","will_arrive_at","will_leave_at"]


class DeductionRulesAPI(APIViewSet):
    permission_classes = [IsAuthenticated]
    pagination_class = DefaultPagination
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
    pagination_class = DefaultPagination
    model = TargetSlice
    model_serializer= TargetSliceSerializer
    order_by = ('-created_at',)
    search_filters = ["uuid"]
    creating_filters = ["min_value","max_value","money","is_money_percentage" , "is_global" , "department"]
    requiered_fields = ["min_value","max_value","money","is_money_percentage" , "is_global" , "department"]
    updating_filters = ["min_value","max_value","money","is_money_percentage" , "is_global" , "department"]
    unique_field:str = 'uuid'


class BasicRecordAPI(APIViewSet):
    permission_classes = [IsSuperUser , IsOwner]
    allowed_methods = ["GET","PUT","POST","DELETE"]
    pagination_class = DefaultPagination
    model = BasicRecord
    model_serializer= BasicRecordSerializer
    order_by = ('-created_at',)
    search_filters = ["uuid","user_commission_details","date"]
    creating_filters = ["user_commission_details","deduction_days","deduction_money","kpi" , "gift" , "basic" , "date"]
    requiered_fields = ["user_commission_details","deduction_days","deduction_money","kpi" , "gift" , "basic" , "date"]
    updating_filters = ["deduction_days","deduction_money","kpi" , "gift" , "basic"]
    unique_field:str = 'uuid'


