from django.contrib.auth.backends import BaseBackend , ModelBackend



class CustomBackend(BaseBackend):

    def has_perm(self, user_obj, perm, obj = ...):
        return super().has_perm(user_obj, perm, obj) and user_obj.can_do(perm)