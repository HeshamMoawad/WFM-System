from typing import List
from django.shortcuts import render
from rest_framework.decorators import api_view , permission_classes
from users.views import IsAuthenticated
from rest_framework.request import Request
from rest_framework.response import Response
from django.core.cache import cache
from .models import Source , UserSources , Number , LiveNumber
from math import ceil 
from users.models import UserTypes
from django.db.models import Exists , OuterRef
from .serializer import NumberSerializer
# Create your views here.


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def get_data(request:Request):
    uuid = request.user.uuid
    count = cache.get(uuid,0)
    
    if count >= 150 and request.user.role != UserTypes.OWNER and not request.user.is_superuser :
        return Response({"error":"rate limit exceeded"})
    
    
    needed_count = request.data.get("count",20)
    source = request.data.get("user_source",None)
    source = UserSources.objects.get(uuid= source) if source else UserSources.objects.first()
    take = ceil(needed_count/source.sources.count())
    
    
    result:List[Number] = []
    for source in source.sources.iterator() :
        numbers = Number.objects.filter(source=source).annotate(
            in_live = Exists(LiveNumber.objects.filter(number=OuterRef('uuid')))
        ).filter(in_live=False)[:take]
        result += numbers   
    
    
    
    LiveNumber.objects.bulk_create([LiveNumber(number=n,user=request.user,number_text=n.number) for n in result])
    cache.set( uuid , count + len(result) , 36000 )
    
    return Response({
        "count" : len(result),
        "results" : NumberSerializer(result,many=True).data
    })
    
    