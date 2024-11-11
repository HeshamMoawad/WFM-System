import datetime
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework.status import HTTP_400_BAD_REQUEST
from rest_framework.request import Request
from users.constants import AUTH_COOKIE
from users.models import User
from users.serializers import UserSerializer
from django.conf import settings
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.authentication import JWTAuthentication



def check_exist(request:Request):
    if request.query_params.dict().keys() :
        data = request.query_params.dict()
    elif request.data.keys() :
        data = request.data
    else :
        data = {}
    return data, ("username" in data ) and ("password" in data) and ("unique_id" in data)    

def wrap_data(user,token,test:bool=False):
    data = UserSerializer(user).data
    data.update({settings.SIMPLE_JWT["AUTH_HEADER"]:f"{token}"})
    data.update({settings.SIMPLE_JWT["EXPIRE"]:datetime.datetime.fromtimestamp(token['exp']).isoformat()})
    response = Response(data)
    response.set_cookie(settings.SIMPLE_JWT["AUTH_COOKIE"],f"{token}")
    if test:
        return data
    return response


@api_view(["POST","GET"])
def login(request: Request):
    if request.user.is_anonymous :
        data , exist = check_exist(request)
        if exist :
            username,password,unique_id = data['username'] ,  data['password'] ,  data['unique_id']
            user = User.objects.filter(username=username).first()
            if user and user.check_password(password) and ( user.is_superuser or user.fingerprintid_set.filter(unique_id=unique_id).first()) :
                token:RefreshToken = RefreshToken.for_user(user).access_token
                return wrap_data(user,token)
        return Response({},status=HTTP_400_BAD_REQUEST)
    else :
        a:JWTAuthentication = request.successful_authenticator
        user , token = a.authenticate(request)
        return wrap_data(user,token)


@api_view(["GET" , "POST"])
def logout(request: Request):
    response = Response({"message":"Logout successfully"})
    response.delete_cookie(AUTH_COOKIE)
    return response
