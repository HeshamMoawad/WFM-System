from users.serializers import User , UserSerializer 
from django.db.models import Case, When, IntegerField , F , Q , Value  , Exists , CharField , OuterRef  , Prefetch
from rest_framework.decorators import api_view , permission_classes
from users.views import IsOwner , IsSuperUser , IsManager , IsHR
from commission.serializers import UserCommissionDetails , UserCommissionDetailsSerializer , BasicRecord , Commission
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.status import HTTP_400_BAD_REQUEST
import datetime
from django.utils.timezone import now 

@api_view(["GET"])
@permission_classes([IsOwner | IsSuperUser | IsManager | IsHR])
def get_users_with_has_basic(request:Request):
    f = {key : value for key , value in request.query_params.items()}
    date = f.pop("date",str(now().strftime("%Y-%m")))

    
    first = datetime.datetime.strptime(date, "%Y-%m")
    first = datetime.datetime(first.year , first.month , 1)    
    f.update({"is_superuser":False })
    users_with_basic_annotation = User.objects\
        .filter(**f)\
        .exclude(role="OWNER")\
        .prefetch_related("usercommissiondetails")\
        .annotate(basic=F("usercommissiondetails__basic"))\
        .annotate(
            has_basic=Case(
                When(
                    basicrecord__date__year = first.year ,
                    basicrecord__date__month = first.month , 
                    then=F("basicrecord__basic"),
                    ),
                When(
                    Exists(
                        BasicRecord.objects.filter(user=OuterRef("uuid"), date__year = first.year , date__month = first.month  )
                    ),
                    then= Value(-1) ,
                    ),
                default=None,
                output_field=IntegerField(),
            ),
            project_name =Case(
                When(
                    basicrecord__date__year = first.year ,
                    basicrecord__date__month = first.month , 
                    then=F("basicrecord__project__name"),
                    ),
                When(
                    Exists(
                        BasicRecord.objects.filter(user=OuterRef("uuid"), date__year = first.year , date__month = first.month  )
                    ),
                    then= Value("-") ,
                    ),
                default=None,
                output_field=CharField(),
            ),
        ).filter(Q(has_basic__gte = 0)|(Q(has_basic__isnull=True)&Q(is_active=True))).order_by("department","project","role").distinct() # Q(has_basic__gte=0)| Q(has_basic__isnull=True)

    return Response({
        "results":UserSerializer(users_with_basic_annotation,many=True).data
    }) 
    



@api_view(["GET"])
@permission_classes([IsOwner | IsSuperUser | IsManager])
def get_users_with_basic_commission(request:Request):
    f = {key : value for key , value in request.query_params.items()}
    date = f.pop("date",str(now().strftime("%Y-%m")))
    if date :
        first = datetime.datetime.strptime(date, "%Y-%m")
        first = datetime.datetime(first.year , first.month , 1)       
        f.update({"is_superuser":False })
        users_with_basic_annotation = User.objects\
            .filter(**f)\
            .exclude(role="OWNER")\
            .annotate(
                has_basic=Case(
                    When(
                        basicrecord__date__year = first.year ,
                        basicrecord__date__month = first.month , 
                        then=F("basicrecord__basic"),
                     ),
                    When(
                        Exists(
                            BasicRecord.objects.filter(user=OuterRef("uuid"), date__year = first.year , date__month = first.month  )
                        ),
                        then= Value(-1) ,
                     ),
                    default=None,
                    output_field=IntegerField(),
                ),
                has_commission= Case(
                    When(
                        commission__date__year = first.year ,
                        commission__date__month = first.month , 
                        then=F("commission__salary"),
                     ),
                    When(
                        Exists(
                            Commission.objects.filter(user=OuterRef("uuid"), date__year = first.year , date__month = first.month  )
                        ),
                        then= Value(-1) ,
                     ),
                    default=None,
                    output_field=IntegerField(),
                ),
                            project_name =Case(
                When(
                    basicrecord__date__year = first.year ,
                    basicrecord__date__month = first.month , 
                    then=F("basicrecord__project__name"),
                    ),
                When(
                    Exists(
                        BasicRecord.objects.filter(user=OuterRef("uuid"), date__year = first.year , date__month = first.month  )
                    ),
                    then= Value("-") ,
                    ),
                default=None,
                output_field=CharField(),
            ),

            )\
            .filter(Q(has_basic__gte = 0)|(Q(has_basic__isnull=True)&Q(is_active=True)))\
                .filter(Q(has_commission__gte = 0)|(Q(has_commission__isnull=True)&Q(is_active=True)))\
                    .order_by("department","project","role")\
                    .distinct()
            

        return Response({
            "results":UserSerializer(users_with_basic_annotation,many=True).data
        }) 
    else :
        return Response({},HTTP_400_BAD_REQUEST)









