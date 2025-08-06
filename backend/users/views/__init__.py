from rest_framework.views import APIView
from api_views.mixin import (
    PageNumberPagination ,
)
from rest_framework.request import Request
from rest_framework.response import Response
from api_views.models import APIViewSet 
from users.models import (
    User , 
    Project , 
    Department , 
    ArrivingLeaving ,
    Profile,
    Lead,
    Request ,
    FingerPrintID ,
    WhatsappAccount,
    WhatsappNumber,
    )
from users.serializers import (
    ProjectSerializer , 
    DepartmentSerializer , 
    UserSerializer , 
    ArrivingLeavingSerializer ,
    ProfileSerializer ,
    LeadSerializer ,
    RequestSerializer ,
    FingerPrintIDSerializer ,
    WhatsappAccountSerializer,
    WhatsappNumberSerializer,
    )

from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.parsers import FormParser , MultiPartParser 
from permissions.users import IsAgent , IsManager , IsHR , IsOwner , IsSuperUser , IsLeader


class DefaultPagination(PageNumberPagination):
    page_size = 15
    page_size_query_param = 'page_size'
    max_page_size = 100

class CustomPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 100

class Pagination1K(PageNumberPagination):
    page_size = 100
    page_size_query_param = 'page_size'
    max_page_size = 1000


class UsersAPI(APIViewSet):
    # permission_classes = [IsAuthenticated]
    pagination_class = Pagination1K
    model = User
    model_serializer= UserSerializer
    order_by = ('-is_active','-created_at','role')
    search_filters = ["uuid",'username','project' ,"department","annual_count","role","is_active","is_staff","is_superuser","crm_username"]
    creating_filters = ["username","password_normal","is_active","annual_count","role","is_staff","title","project","department","crm_username"]
    requiered_fields = ['username',"password_normal"]
    updating_filters = ["username","password_normal","is_active","annual_count","role","is_staff","title","project","department","crm_username"]
    unique_field:str = 'uuid'
    # permissions_config = {
    #     "GET": [IsSuperUser | IsOwner | IsManager | IsHR],
    #     "POST": [IsSuperUser | IsOwner | IsManager | IsHR],
    #     "PUT": [IsSuperUser | IsOwner | IsManager | IsHR],
    #     "DELETE": [IsSuperUser | IsOwner | IsManager | IsHR],
    # }

class ProjectsAPI(APIViewSet):
    # permission_classes = [IsAuthenticated]
    pagination_class = DefaultPagination
    model = Project
    model_serializer= ProjectSerializer
    order_by = ('name',)
    search_filters = ["uuid",'name']
    creating_filters = ["name","logo","color"]
    requiered_fields = ['name']
    updating_filters = ["name","logo","color"]
    unique_field:str = 'uuid'
    permissions_config = {
        "POST": [IsSuperUser | IsOwner],
        "PUT": [IsSuperUser | IsOwner],
        "DELETE": [IsSuperUser | IsOwner],
    }



class DepartmentsAPI(APIViewSet):
    # permission_classes = [IsAuthenticated]
    pagination_class = DefaultPagination
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
    pagination_class = DefaultPagination
    model = Profile
    model_serializer= ProfileSerializer
    order_by = ('user',)
    search_filters = ["uuid",'user','about']
    updating_filters = ["phone","picture","telegram_id","about"]
    unique_field:str = 'uuid'


class LeadAPI(APIViewSet):
    # permission_classes = [IsAuthenticated]
    pagination_class = DefaultPagination
    model = Lead
    model_serializer= LeadSerializer
    order_by = ('date',)
    search_filters = ["uuid","user","phone","name","date","project"]
    creating_filters = ["phone","name","user","date","project"]
    requiered_fields = ["user","phone","date","project"]
    unique_field:str = 'uuid'


class RequestAPI(APIViewSet):
    # permission_classes = [IsAuthenticated]
    pagination_class = Pagination1K
    model = Request
    model_serializer= RequestSerializer
    order_by = ('-created_at',)
    search_filters = ["uuid","user","details","type","status","date"]
    creating_filters = ["user","details","type","date"]
    requiered_fields =  ["user","details","type","date"]
    updating_filters = ["status","details","type","date"]
    unique_field:str = 'uuid'
    permissions_config = {
        "PUT": [IsSuperUser | IsOwner | IsManager | IsHR ],
        "DELETE": [IsSuperUser | IsOwner | IsManager | IsHR],
    }



class FingerPrintIDAPI(APIViewSet):
    # permission_classes = [IsAuthenticated]
    allowed_methods = ["GET","POST","DELETE"]
    pagination_class = DefaultPagination
    model = FingerPrintID
    model_serializer= FingerPrintIDSerializer
    order_by = ('-created_at',)
    search_filters = ["uuid","user","name","unique_id"]
    creating_filters = ["user","name","unique_id"]
    requiered_fields =  ["user","name","unique_id"]
    unique_field:str = 'uuid'
    permissions_config = {
        "POST": [IsSuperUser | IsOwner | IsManager | IsHR],
        "PUT": [IsSuperUser | IsOwner | IsManager | IsHR],
        "DELETE": [IsSuperUser | IsOwner | IsManager | IsHR],
    }

# class WhatsappAccountAPI(APIViewSet):
#     # permission_classes = [IsAuthenticated]
#     allowed_methods = ["GET","POST","DELETE"]
#     pagination_class = DefaultPagination
#     model = WhatsappAccount
#     model_serializer= WhatsappAccountSerializer
#     order_by = ('-created_at',)
#     search_filters = ["uuid","name","phone"]
#     creating_filters = ["name","phone"]
#     requiered_fields = ["name","phone"]
#     unique_field:str = 'uuid'
#     permissions_config = {
#         "POST": [IsSuperUser | IsOwner | IsManager | IsHR],
#         "PUT": [IsSuperUser | IsOwner | IsManager | IsHR],
#         "DELETE": [IsSuperUser | IsOwner | IsManager | IsHR],
#     }


class WhatsappNumberAPI(APIView):
    permission_classes = [AllowAny]
    serializer_class = WhatsappNumberSerializer
    queryset = WhatsappNumber.objects.all()


    def get(self,request:Request):
        queryset = self.queryset.filter(user=request.user)
        return Response(self.serializer_class(queryset,many=True).data)

    def post(self,request:Request):
        user = request.data.get("user")
        user = None #User.objects.filter(uuid=user).first()
        # if not user :
        #     return Response({"error":"User Not Found"},status=404)
        account = request.data.get("account")
        account = WhatsappAccount.objects.filter(name=account).first()
        if not account :
            return Response({"error":"Account Not Found"},status=404)
        chats = request.data.get("chats",[])
        container = []
        phones = WhatsappNumber.objects.all().values_list("phone",flat=True)
        for chat in chats :
            target_phone = chat.get("id").get("_serialized","")
            if target_phone in phones :
                continue
            row = WhatsappNumber(
                account=account,
                phone=target_phone,
                user=user
            )
            container.append(row)
        WhatsappNumber.objects.bulk_create(container, ignore_conflicts=True)
        return Response(serializer.data)
