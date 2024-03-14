from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework.status import  HTTP_401_UNAUTHORIZED , HTTP_200_OK
from rest_framework.request import Request
from auth import  Login
from auth.constants import AUTH_COOKIE


@api_view(["POST"])
def login(request: Request):
    login_class = Login()
    try :
        data = login_class.login(request)
        status = HTTP_200_OK
        response = Response(data,status)
        response.set_cookie(AUTH_COOKIE , data[AUTH_COOKIE])
    except Exception as e :
        data = {
            "message" : str(e),
            "type" : str(e.__class__.__name__)
        }
        status = HTTP_401_UNAUTHORIZED
        response = Response(data,status)
    return response

@api_view(["GET" , "POST"])
def logout(request: Request):
    response = Response({"message":"Logout successfully"})
    response.delete_cookie(AUTH_COOKIE)
    # response.delete_cookie(CSRF_TOKEN)
    # response.delete_cookie(SESSION_ID)
    return response
