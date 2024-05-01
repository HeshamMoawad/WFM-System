from .models import CustomBasePermission
from .utils import generate_perm

class IsAgent(CustomBasePermission):
    user_types = {
            "AGENT":{"is_superuser":False , "role":"AGENT"},
            "MANAGER":{"is_superuser":False},
            "OWNER":{},
            "HR":{"is_superuser":False},
        }

    def filter_objects_by(self, user, *args, **kwargs):
        return {"User":self.resolve(user)}

    def resolve(self,user):
        if user.is_superuser :
            return {}
        return self.user_types[user.role]

    def has_object_permission(self, request, view, obj):
        """
        Return `True` if permission is granted, `False` otherwise.
        """
        return True

