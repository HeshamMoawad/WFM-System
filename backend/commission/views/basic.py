from users.serializers import User , UserSerializer
from django.db.models import Case, When, IntegerField , F
from rest_framework.decorators import api_view , permission_classes
from users.views import IsOwner , IsSuperUser
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.status import HTTP_400_BAD_REQUEST
import datetime


@api_view(["GET"])
@permission_classes([IsOwner or IsSuperUser])
def get_users_with_has_basic(request:Request):
    date = request.query_params.get("date",None)
    if date :

        first = datetime.datetime.strptime(date, "%Y-%m")
        first = datetime.datetime(first.year , first.month , 1).date()
        sec = datetime.datetime(first.year , first.month + 1 , 1).date()        
        users_with_basic_annotation = User.objects.filter(is_superuser=False).exclude(role="OWNER").annotate(
            has_basic=Case(
                When(usercommissiondetails__basicrecord__date__gte= first, then=F("usercommissiondetails__basicrecord__basic")),
                When(usercommissiondetails__basicrecord__date__lte= sec, then=F("usercommissiondetails__basicrecord__basic")),
                
                default=None,
                output_field=IntegerField()
            )
        )
        return Response({
            "results":UserSerializer(users_with_basic_annotation,many=True).data
        }) 

    else :
        return Response({},HTTP_400_BAD_REQUEST)








