from commission.models import ActionPlan
from commission.serializers import ActionPlanSerializer
from rest_framework.response import Response
from rest_framework.request import Request
from rest_framework.decorators import api_view , permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.status import HTTP_200_OK , HTTP_400_BAD_REQUEST
from users.views import IsOwner , IsSuperUser , IsManager



@api_view(["GET","POST"])
@permission_classes([IsOwner | IsSuperUser | IsManager])
def get_action_plan(request:Request):
    if request.method == "GET" :
        filters = request.query_params
        action_plan = ActionPlan.objects.filter(**filters)
        return Response({"count":action_plan.count(),"results":ActionPlanSerializer(action_plan,many=True).data},HTTP_200_OK)
    elif request.method == "POST" :
        action_plan = ActionPlan(**request.data)
        action_plan.save()
        return Response(ActionPlanSerializer(action_plan).data,HTTP_200_OK)
    return Response({},HTTP_400_BAD_REQUEST)