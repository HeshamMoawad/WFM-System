from api_views.mixin import (
    PageNumberPagination ,
)
from api_views.models import APIViewSet 
from users.models import (
    User , 
    Project , 
    Department , 
    ArrivingLeaving ,
    Profile,
    Lead,
    Request
    )
from users.serializers import (
    ProjectSerializer , 
    DepartmentSerializer , 
    UserSerializer , 
    ArrivingLeavingSerializer ,
    ProfileSerializer ,
    LeadSerializer ,
    RequestSerializer ,
    )

from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import FormParser , MultiPartParser 
from permissions.users import IsAgent , IsManager , IsHR , IsOwner , IsSuperUser


class CustomPagination15(PageNumberPagination):
    page_size = 15
    page_size_query_param = 'page_size'
    max_page_size = 100

class CustomPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 100

class Pagination1K(PageNumberPagination):
    page_size = 1000
    page_size_query_param = 'page_size'
    max_page_size = 1000


class UsersAPI(APIViewSet):
    # permission_classes = [IsAuthenticated]
    pagination_class = Pagination1K
    model = User
    model_serializer= UserSerializer
    order_by = ('username',)
    search_filters = ["uuid",'username','project' ,"department","role"]
    creating_filters = ["username","_password","is_active","role","is_staff","title","project","department"]
    requiered_fields = ['username',"_password"]
    updating_filters = ["username","_password","is_active","role","is_staff","title","project","department"]
    unique_field:str = 'uuid'
    permissions_config = {
        "GET": [IsSuperUser | IsOwner],
        "POST": [IsSuperUser | IsOwner],
        "PUT": [IsSuperUser | IsOwner],
        "DELETE": [IsSuperUser | IsOwner],
    }

class ProjectsAPI(APIViewSet):
    # permission_classes = [IsAuthenticated]
    pagination_class = Pagination1K
    model = Project
    model_serializer= ProjectSerializer
    order_by = ('name',)
    search_filters = ["uuid",'name']
    creating_filters = ["name","logo"]
    requiered_fields = ['name']
    updating_filters = ["name","logo"]
    unique_field:str = 'uuid'
    permissions_config = {
        "POST": [IsSuperUser | IsOwner],
        "PUT": [IsSuperUser | IsOwner],
        "DELETE": [IsSuperUser | IsOwner],
    }



class DepartmentsAPI(APIViewSet):
    # permission_classes = [IsAuthenticated]
    pagination_class = Pagination1K
    model = Department
    model_serializer= DepartmentSerializer
    order_by = ('name',)
    search_filters = ["uuid",'name']
    creating_filters = ["name"]
    requiered_fields = ['name']
    updating_filters = ["name"]
    unique_field:str = 'uuid'
    permissions_config = {
        "POST": [IsSuperUser | IsOwner],
        "PUT": [IsSuperUser | IsOwner],
        "DELETE": [IsSuperUser | IsOwner],
    }


class ArrivingLeavingAPI(APIViewSet):
    allowed_methods = ["GET"]
    # permission_classes = [IsAuthenticated]
    pagination_class = Pagination1K
    model = ArrivingLeaving
    model_serializer= ArrivingLeavingSerializer
    order_by = ('date',)
    search_filters = ["uuid","user","date"]
    unique_field:str = 'uuid'


class ProfileAPI(APIViewSet):
    parser_classes=[MultiPartParser , FormParser]
    # permission_classes = [IsAuthenticated ]
    allowed_methods = ["GET","PUT"]
    pagination_class = CustomPagination15
    model = Profile
    model_serializer= ProfileSerializer
    order_by = ('user',)
    search_filters = ["uuid",'user','about']
    updating_filters = ["phone","picture","telegram_id","about"]
    unique_field:str = 'uuid'
    use_serializer_for_create = True
    image_fields = [
        "picture"
    ]


class LeadAPI(APIViewSet):
    # permission_classes = [IsAuthenticated]
    pagination_class = Pagination1K
    model = Lead
    model_serializer= LeadSerializer
    order_by = ('user',)
    search_filters = ["uuid","user","phone","name","date","project"]
    creating_filters = ["phone","name","user","date","project"]
    requiered_fields = ["user","phone","date","project"]
    unique_field:str = 'uuid'


class RequestAPI(APIViewSet):
    # permission_classes = [IsAuthenticated]
    pagination_class = CustomPagination15
    model = Request
    model_serializer= RequestSerializer
    order_by = ('-created_at',)
    search_filters = ["uuid","user","details","type","status"]
    creating_filters = ["user","details","type"]
    requiered_fields =  ["user","details","type"]
    updating_filters = ["status","details","type"]
    unique_field:str = 'uuid'
