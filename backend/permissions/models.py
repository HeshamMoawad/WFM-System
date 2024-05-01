from rest_framework.permissions import BasePermissionMetaclass 
from django.contrib.auth import get_user_model
from users.models import UserTypes
from auth.utils import fetch_user
from auth import AuthenticateUser
User = get_user_model()




class CustomBasePermission(metaclass=BasePermissionMetaclass):
    """
    A base class from which all permission classes should inherit.
    """
    def has_permission(self, request, view):
        """
        Return `True` if permission is granted, `False` otherwise.
        """
        return True

    def has_object_permission(self, request, view, obj):
        """
        Return `True` if permission is granted, `False` otherwise.
        """
        return True

    def filter_objects_by(self , user:User , *args , **kwargs):
        """
        Return `dict` of Model kwargs filter .
        """
        return {}

    def exclude_objects_by(self, user:User , *args , **kwargs):
        """
        Return `dict` of Model kwargs exclude .
        """
        return {}



class IsAuthenticated(CustomBasePermission):
    """
    Allows access only to authenticated users.
    """
    def has_permission(self, request, view):
        return bool(fetch_user(request,AuthenticateUser))


