from .models import CookieAuthentication , HeaderAuthentication , BodyAuthentication 
from .mixin import AuthenticateMixins , LoginMixins
from users.serializers import UserSerializer


class AuthenticateUser(AuthenticateMixins):
    auth_classes = [
        CookieAuthentication ,
        HeaderAuthentication ,
        BodyAuthentication  , 
    ]


class Login(LoginMixins):
    auth_class = AuthenticateUser
    user_serializer =  UserSerializer

