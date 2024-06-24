from rest_framework.serializers import SerializerMethodField
from api_views.serializers import ModelSerializer ,  ForeignField , ManyToManyField  
import json
from datetime import datetime
from commission.models import UserCommissionDetails , DeductionRules
from core.calculator import Calculator
from ..models import (
    Department , 
    User , 
    Project , 
    ArrivingLeaving , 
    Profile,
    Lead,
    Request ,
    UpdateHistory , 
    FingerPrintID
    )


class DepartmentSerializer(ModelSerializer):

    class Meta:
        model = Department
        fields = [
            "uuid",
            "name",
        ]


class ProjectSerializer(ModelSerializer):

    class Meta:
        model = Project
        fields = [
            "uuid",
            "name",
            "logo" ,
        ]

class ProfileSerializer(ModelSerializer):
    class Meta:
        model = Profile
        fields = [
            "uuid",
            # "user",
            "phone",
            "picture",
            "telegram_id",
            "about",
        ]

class UserSerializer(ModelSerializer):
    project = ProjectSerializer(read_only=True)
    department = DepartmentSerializer(read_only=True)
    profile = ProfileSerializer(read_only=True)

    class Meta:
        model = User
        fields = [
            "uuid",
            "username",
            "role",
            "project",
            "department",
            "title" ,
            "first_name",
            "last_name",
            "is_superuser",
            "is_active",
            "_password",
            "profile",
        ]
        foreign_models = {
            "department": ForeignField("department",Department,'uuid') ,
            "project": ForeignField("project",Project,'uuid') ,
        }
    def create(self, validated_data: dict, *args, **kwargs):
        validated_data.pop("is_superuser",None)
        validated_data.pop("is_staff",None)
        return super().create(validated_data, *args, **kwargs)


class ArrivingLeavingSerializer(ModelSerializer):
    late = SerializerMethodField()
    departure = SerializerMethodField()
    deuration = SerializerMethodField()
    deduction = SerializerMethodField()

    def get_late(self,obj:ArrivingLeaving):
        calculator = Calculator()
        return calculator.calc_late(obj)

    def get_departure(self,obj:ArrivingLeaving):
        calculator = Calculator()
        return calculator.calc_departure(obj)

    def get_deuration(self,obj:ArrivingLeaving):
        calculator = Calculator()
        return calculator.calc_deuration(obj)

    def get_deduction(self,obj:ArrivingLeaving):
        calculator = Calculator()
        late_time = calculator.calc_late(obj)
        details:UserCommissionDetails = obj.user.usercommissiondetails
        total= 0 
        if details.set_deduction_rules :
            total += calculator.calc_global_deduction(late_time)
        else :
            total += calculator.calc_custom_deduction(late_time,details)
        return total 


    class Meta:
        model = ArrivingLeaving
        fields = [
            "uuid",
            "user",
            "date",
            "arriving_at",
            "leaving_at",
            "deuration",
            "late",
            "departure",
            "deduction",
        ]



class LeadSerializer(ModelSerializer):
    class Meta:
        model = Lead
        fields = [
            "uuid",
            "phone",
            "name",
            "date",
            "project",
        ]

class FingerPrintIDSerializer(ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = FingerPrintID
        fields = [
            "uuid",
            "user",
            "name",
            "unique_id",
            "created_at",
            "updated_at",

        ]
        foreign_models = {
            "user": ForeignField("user",User,'uuid') ,
        }




class RequestSerializer(ModelSerializer):
    user = UserSerializer(read_only=True)
    class Meta:
        model = Request
        fields = [
            "uuid",
            "user",
            "details",
            "type",
            "note",
            "department",
            "status",
            "created_at",
            "updated_at",

        ]
        foreign_models = {
            "department": ForeignField("department",Department,'uuid') ,
            "user": ForeignField("user",User,'uuid') ,
        }



class UpdateHistorySerializer(ModelSerializer):
    previous = SerializerMethodField()
    def get_previous(self,obj:UpdateHistory):
        return json.loads(obj.previous_values)

    class Meta:
        model = UpdateHistory
        fields = [
            "user",
            "updated_at",
            "previous",
            "model_name",
            "model_uuid",
        ]


