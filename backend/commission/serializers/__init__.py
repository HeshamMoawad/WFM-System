# from rest_framework.serializers import  ModelSerializer
from api_views.models import ForeignField , ManyToManyField 
from api_views.serializers import ModelSerializer 
from rest_framework.serializers import Serializer
from users.models import User
from commission.models import (
    CoinChanger,
    DeductionRules,
    TargetSlice,
    Team,
    UserCommissionDetails,
    BasicRecord ,
    Commission ,
)
from users.serializers import UserSerializer , DepartmentSerializer


class CoinChangerSerializer(ModelSerializer):
    class Meta:
        model = CoinChanger
        fields = [
            "uuid",
            "egp_to_sar",
            "date",
            "created_at",
        ]



class DeductionRulesSerializer(ModelSerializer):
    department = DepartmentSerializer()
    class Meta:
        model = DeductionRules
        fields = [
            "uuid",
            "late_time",
            "deduction_days",
            "is_global",
            "department",
        ]

class TargetSliceSerializer(ModelSerializer):
    department = DepartmentSerializer()
    class Meta:
        model = TargetSlice
        fields = [
            "uuid",
            "min_value",
            "max_value",
            "money",
            "is_global",
            "is_money_percentage",
            "department",
        ]


class TeamSerializer(ModelSerializer):
    commission_rules = TargetSliceSerializer(many=True)
    leader = UserSerializer()
    agents = UserSerializer(many=True)
    class Meta:
        model = Team
        fields = [
            "uuid",
            "name",
            "leader",
            "agents",
            "commission_rules",
        ]

class UserCommissionDetailsSerializer(ModelSerializer):
    deduction_rules = DeductionRulesSerializer(many=True, read_only=True)
    commission_rules = TargetSliceSerializer(many=True , read_only=True)
    user = UserSerializer(read_only=True)
    class Meta :
        model = UserCommissionDetails
        fields = [
            "uuid",
            "user",
            "basic",
            "set_deduction_rules",
            "deduction_rules",
            "set_global_commission_rules",
            "commission_rules",
            "will_arrive_at",
            "will_leave_at",
        ]
        many_to_many_models = {
            "deduction_rules": ManyToManyField("deduction_rules",DeductionRules,'uuid') ,
            "commission_rules": ManyToManyField("commission_rules",TargetSlice,'uuid') ,
        }


class BasicRecordSerializer(ModelSerializer):
    user = UserSerializer(read_only=True)
    class Meta :
        model = BasicRecord
        fields = [
            "uuid",
            "user",
            "deduction_days",
            "deduction_money",
            "kpi",
            "gift",
            "date",
            "basic",
        ]
        foreign_models = {
            "user_commission_details": ForeignField("user_commission_details",UserCommissionDetails,'uuid') ,
        }




class CommissionSerializer(ModelSerializer):
    basic = BasicRecordSerializer(read_only=True)
    class Meta :
        model = Commission
        fields = [
            "uuid",
            "basic",
            "commission_team",
            "target",
            "gift",
            "commission",
            "date",
        ]
        foreign_models = {
            "basic": ForeignField("basic",BasicRecord,'uuid') ,
        }
