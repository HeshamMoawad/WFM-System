from typing import Dict, List
from rest_framework.serializers import SerializerMethodField , DateField 
from api_views.serializers import ModelSerializer ,  ForeignField , ManyToManyField  
import json
from datetime import datetime
from core.calculator import Calculator
from django.contrib.auth.models import Permission
from commission.models import BasicRecord
from ..models import (
    Department,
    ReportRecord , 
    User , 
    Project , 
    ArrivingLeaving , 
    Profile,
    Lead,
    Request ,
    UpdateHistory , 
    FingerPrintID ,
    MainPage,
    SubPage ,
    BasePage , 
    )


class MultiDateFormatField(DateField):
    def to_internal_value(self, value):
        formats = ['%Y-%m-%d' , '%d-%m-%Y']
        for fmt in formats:
            try:
                return datetime.strptime(value, fmt).date()
            except ValueError:
                continue
        self.fail('invalid',format=' ,'.join(formats))
        
class PermissionSerializer(ModelSerializer):
    class Meta:
        model = Permission
        fields = [
            "name",
            "codename",
        ]

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
            "color"
        ]

class ProfileSerializer(ModelSerializer):
    picture = SerializerMethodField()

    def get_picture(self, obj:Profile):
        if obj.picture:
            return obj.picture.url[1:]
        return None
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
    has_basic = SerializerMethodField()
    has_commission = SerializerMethodField()
    basic = SerializerMethodField()
    basic_project_name = SerializerMethodField()
    total = SerializerMethodField()
    def get_has_basic(self,obj): return getattr(obj,"has_basic",None)
    def get_has_commission(self,obj): return getattr(obj,"has_commission",None)  
    def get_total(self,obj): return getattr(obj,"total",None)
    def get_basic(self,obj): return getattr(obj,"basic",None)
    def get_basic_project_name(self,obj):  return getattr(obj,"project_name",None)

    
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
            "has_basic",
            "has_commission",
            "password_normal",
            "profile",
            "total",
            "crm_username",
            "annual_count",
            "basic",
            "basic_project_name",
            "fp_id",
        ]
        foreign_models = {
            "department": ForeignField("department",Department,'uuid') ,
            "project": ForeignField("project",Project,'uuid') ,
        }
    
    
    def create(self, validated_data: dict, *args, **kwargs):
        validated_data.pop("is_superuser",None)
        validated_data.pop("is_staff",None)
        return super().create(validated_data, *args, **kwargs)

class BasicRecordSerializer(ModelSerializer):
    user = UserSerializer(read_only=True)
    project = ProjectSerializer(read_only=True)
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
            "take_annual",
            "basic",
            "project",
        ]
        foreign_models = {
            "user": ForeignField("user",User,'uuid') ,
        }

class ArrivingLeavingSerializer(ModelSerializer):
    user = UserSerializer()
    late = SerializerMethodField()
    departure = SerializerMethodField()
    deuration = SerializerMethodField()
    deduction = SerializerMethodField()
    project = SerializerMethodField()

    def __init__(self, instance=None, data=... ,rules:List[dict]=[],cache:Dict[str,List[dict]]={}, **kwargs):
        self.__rules = rules
        self.__cache = cache
        self._calculator = Calculator()
        super().__init__(instance, data, **kwargs)
        
    def get_late(self,obj:ArrivingLeaving):
        if getattr(obj,'will_arrive_at',None):
            if obj.arriving_at :
                return self._calculator.calc_late(obj)
        return 0
    
    def get_departure(self,obj:ArrivingLeaving):
        if getattr(obj,'will_arrive_at',None):
            if obj.leaving_at :
                return self._calculator.calc_departure(obj)
        return 0
    
    def get_deuration(self,obj:ArrivingLeaving):
        if getattr(obj,'will_arrive_at',None):
            if obj.leaving_at : 
                return int(round((obj.leaving_at - obj.arriving_at).total_seconds(),0))
        return 0
    def get_project(self,obj:ArrivingLeaving):
        if getattr(obj,'project',None):
            return obj.project.name
        return None
    
    def get_deduction(self,obj:ArrivingLeaving):
        if getattr(obj,'will_arrive_at',None):
            if obj.arriving_at :
                late_time = self._calculator.calc_late(obj)
                total = 0 
                # if getattr(obj.user.usercommissiondetails,"set_deduction_rules",True) :
                total += self._calculator.calc_deduction(late_time,self.__rules)
                # else :
                #     if obj.user not in self.__cache :
                #         rules = obj.user.usercommissiondetails.deduction_rules.values("deduction_days","late_time")
                #         self.__cache[obj.user] = rules
                #     else :
                #         rules = self.__cache[obj.user]
                #     total += self._calculator.calc_deduction(late_time,rules)
                return total 
        return 1

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
            "project",
            "deduction",
        ]


class LeadSerializer(ModelSerializer):
    user = SerializerMethodField()
    
    def get_user(self,obj):
        return getattr(obj.user,"username",None)
    
    class Meta:
        model = Lead
        fields = [
            "uuid",
            "user",
            "phone",
            "name",
            "date",
            "project",
        ]
        foreign_models = {
            "user": ForeignField("user",User,'uuid') ,
        }

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
    date = MultiDateFormatField()
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
            "date",
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


class ReportRecordSerializer(ModelSerializer):
    data = SerializerMethodField()
    user = UserSerializer(read_only=True)
    def get_data(self,obj:ReportRecord)-> dict :
        return obj.as_json()

    class Meta:
        model = ReportRecord
        fields = [
            "user",
            "data",
            "updated_at",
            "created_at",
        ]



class BasePageSerializer(ModelSerializer):
    index = SerializerMethodField()

    def get_index(self,obj:BasePage):
        return obj.page_as_number()
    
    class Meta:
        model = BasePage
        fields = [
            "index",
        ]
        abstract=True


class MainPageSerializer(BasePageSerializer):
    class Meta (BasePageSerializer.Meta):
        model = MainPage
        
class SubPageSerializer(BasePageSerializer):
    class Meta (BasePageSerializer.Meta):
        model = SubPage
        fields = BasePageSerializer.Meta.fields + ['main_page']