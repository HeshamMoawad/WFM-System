from django.contrib.auth.models import BaseUserManager
from .types import UserTypes


class CustomUserManager(BaseUserManager):
    def create_user(self, username, email=None, password=None, **extra_fields):
        if not username:
            raise ValueError('The Username field must be set')
        
        user = self.model(username=username, email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, username, email=None, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')

        return self.create_user(username, email, password, **extra_fields)


class ManagerObjects(BaseUserManager):
    def get_queryset(self,*args,**kwargs):
        return super().get_queryset(*args, **kwargs).filter(role=UserTypes.MANAGER)

class OwnerObjects(BaseUserManager):
    def get_queryset(self,*args,**kwargs):
        return super().get_queryset(*args, **kwargs).filter(role=UserTypes.OWNER)
        
class AgentObjects(BaseUserManager):
    def get_queryset(self,*args,**kwargs):
        return super().get_queryset(*args, **kwargs).filter(role=UserTypes.AGENT)
