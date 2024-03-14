from django.db import models
from django.contrib.auth.models import AbstractUser 
from .managers import (
        CustomUserManager ,
        AgentObjects ,
        ManagerObjects ,
        OwnerObjects
    )
from .types import UserTypes
from uuid import uuid4


class Project(models.Model):
    name = models.CharField(verbose_name="Project Name", max_length=100)
    logo = models.ImageField(verbose_name="Logo", upload_to='projects-logo/')
    def __str__(self):
        return self.name


class Department(models.Model):
    name = models.CharField(verbose_name="Department Name", max_length=100)
    def __str__(self):
        return self.name


class User(AbstractUser):
    ## managers with customization
    objects = CustomUserManager()
    owners = OwnerObjects()
    managers = ManagerObjects()
    agents = AgentObjects()

    ### other normal fields 
    uuid = models.CharField(verbose_name='UUID' , max_length= 250 , default=uuid4 )

    _password = models.CharField(verbose_name='Password Without Hash (Required)', max_length=128)

    project = models.ForeignKey(Project,verbose_name="Project" , on_delete=models.SET_NULL , null=True)

    role = models.CharField(max_length=100 , verbose_name="Role" , choices=UserTypes.choices , null=True)

    title = models.CharField(max_length=100 , verbose_name="Title" , default='Agent')

    basic = models.BigIntegerField(verbose_name="Basic Salary"  , null=True)

    department = models.ForeignKey( Department,verbose_name="Department", on_delete=models.SET_NULL, null=True)

    deduction_rules = models.BooleanField(verbose_name="Set Deduction Rules" , default=True)

    ## Global commission rules

    ## custom commission rules

    def __str__(self):
        return f"{self.username}"
    
    def save(self,*args,**kwargs):
        self.set_password(self._password)
        if self.is_superuser or self.role == UserTypes.OWNER:
            self.deduction_rules = False
        return super().save(*args,**kwargs)

    class Meta:
        verbose_name = "User"

