from rest_framework.serializers import SerializerMethodField,  ModelSerializer 
import json
from django.http import HttpRequest

from ..models import (
    Department , 
    User , 
    Project , 
    ArrivingLeaving , 
    Profile,
    Lead,
    Request ,
    UpdateHistory , 
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
    project = ProjectSerializer()
    department = DepartmentSerializer()
    profile = ProfileSerializer()
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
            "profile",
        ]


class ArrivingLeavingSerializer(ModelSerializer):
    class Meta:
        model = ArrivingLeaving
        fields = [
            "uuid",
            "user",
            "date",
            "arriving_at",
            "leaving_at",
            "deuration_between",
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


class RequestSerializer(ModelSerializer):
    class Meta:
        model = Request
        fields = [
            "uuid",
            "user",
            "details",
            "type",
            "department",
            "status",
        ]


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


