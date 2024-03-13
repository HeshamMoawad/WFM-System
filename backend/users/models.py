from django.db import models
from django.contrib.auth.models import AbstractUser 
from .managers import (
        CustomUserManager ,
        AgentObjects ,
        ManagerObjects ,
        OwnerObjects
    )
from .types import UserTypes
# Create your models here.

class Project(models.Model):
    name = models.CharField(verbose_name="Project Name", max_length=100)
    logo = models.ImageField(verbose_name="Logo", upload_to='projects-logo/')
    def __str__(self):
        return self.name


class Department(models.Model):
    name = models.CharField(verbose_name="Project Name", max_length=100)
    def __str__(self):
        return self.name


class User(AbstractUser):

    objects = CustomUserManager()

    owners = OwnerObjects()

    managers = ManagerObjects()

    agents = AgentObjects()

    _password = models.CharField(verbose_name='Password Without Hash (Required)', max_length=128)

    project = models.ForeignKey(Project, on_delete=models.SET_NULL , null=True)

    role = models.CharField(max_length=100 , verbose_name="Role" , choices=UserTypes.choices , null=True)

    title = models.CharField(max_length=100 , verbose_name="Title" , default='Agent')

    basic = models.BigIntegerField(verbose_name="Basic Salary"  , null=True)

    department = models.ForeignKey(Department, on_delete=models.SET_NULL, null=True)

    ## Global commission rules

    ## custom commission rules

    def __str__(self):
        return f"{self.username}"
    
    def save(self,*args,**kwargs):
        self.set_password(self._password)
        return super().save(*args,**kwargs)

    class Meta:
        verbose_name = "User"

