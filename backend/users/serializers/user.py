from rest_framework.serializers import  ModelSerializer 
from ..models import User
from .project import ProjectSerializer
from .department import DepartmentSerializer

class UserSerializer(ModelSerializer):
    project = ProjectSerializer()
    department = DepartmentSerializer()
    class Meta:
        model = User
        fields = [
            "first_name",
            "last_name",
            "title" ,
            "role",
            "project",
            "basic" ,
            "department"
        ]



