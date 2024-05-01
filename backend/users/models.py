from django.db import models
from django.contrib.auth.models import AbstractUser 
from .managers import (
        CustomUserManager ,
        AgentObjects ,
        ManagerObjects ,
        OwnerObjects
    )
from .types import UserTypes , RequestTypes , RequestStatuses
from utils.models_utils import image_upload_path , validate_lead_number , validate_role , validate_user_number
from django.db.models.signals import pre_save , post_save
from core.models import BaseModel
import json
# from django.utils import timezone
from django.urls import reverse



class Project(BaseModel):
    name = models.CharField(verbose_name="Project Name", max_length=100)
    logo = models.ImageField(verbose_name="Logo", upload_to='projects-logo/')
    def __str__(self):
        return self.name


class Department(BaseModel):
    name = models.CharField(verbose_name="Department Name", max_length=100)
    def __str__(self):
        return self.name


class User(AbstractUser , BaseModel):
    ## managers with customization
    objects = CustomUserManager()
    owners = OwnerObjects()
    managers = ManagerObjects()
    agents = AgentObjects()

    ### other normal fields

    _password = models.CharField(verbose_name='Password Without Hash (Required)', max_length=128)
    project = models.ForeignKey(Project,verbose_name="Project" , on_delete=models.SET_NULL , null=True)
    role = models.CharField(max_length=100 , verbose_name="Role" , choices=UserTypes.choices , default=UserTypes.AGENT, validators=[validate_role])
    title = models.CharField(max_length=100 , verbose_name="Title" , default='Agent')
    department = models.ForeignKey( Department,verbose_name="Department", on_delete=models.SET_NULL, null=True)

    def __str__(self):
        return f"{self.username}"
    
    def save(self,*args,**kwargs):
        self.set_password(self._password)
        kwargs.pop("user",None)
        return super().save(*args,**kwargs)

    class Meta:
        verbose_name = "User"


class ArrivingLeaving(BaseModel):
    user = models.ForeignKey(User,verbose_name="User" , on_delete=models.CASCADE )
    date = models.DateField(verbose_name="Day Date",auto_now_add=True )
    arriving_at = models.DateTimeField(verbose_name="Arrining Date & Time",auto_now_add=True)
    leaving_at = models.DateTimeField(verbose_name="Leaving Date & Time",null=True)
    deuration_between = models.PositiveIntegerField(verbose_name="Deuration in secounds" , null=True)

    def save(self,*args,**kwargs):
        if self.leaving_at:
            self.deuration_between = (self.leaving_at - self.arriving_at).total_seconds()
        return super().save(*args,**kwargs)

    class Meta:
        # set model as str 
        unique_together = ['date','user']
        verbose_name = "Arriving Leaving"
        verbose_name_plural = "Arriving Leaving"



class Profile(BaseModel):
    user = models.OneToOneField(User,verbose_name="User" , on_delete=models.CASCADE )
    phone = models.CharField(max_length=11 ,null=True,verbose_name="Phone Number" , validators=[validate_user_number])
    picture = models.ImageField(verbose_name="Profile Picture"  ,upload_to=image_upload_path  ,blank=True, null=True)
    telegram_id = models.PositiveIntegerField(verbose_name="Telegram ID" ,blank=True, null=True)
    about = models.TextField(verbose_name="About Text" , blank=True)
    
    class Meta: ...



class Lead(BaseModel):
    user = models.ForeignKey(User,verbose_name="User" , on_delete=models.SET_NULL , null=True )
    phone = models.CharField(max_length=13 ,verbose_name="Phone Number" , validators=[validate_lead_number])
    name = models.CharField(verbose_name="Lead Name", max_length=100)
    date = models.DateField(verbose_name="Day Date", null=True )
    project = models.ForeignKey(Project,verbose_name="Project" , on_delete=models.SET_NULL , null=True)
    class Meta:
        unique_together = ['user','phone']


class UpdateHistory(models.Model):
    user = models.ForeignKey(User, verbose_name="User", on_delete=models.SET_NULL, null=True)
    updated_at = models.DateTimeField( verbose_name="Updated At", auto_now_add=True)
    previous_values = models.TextField()  # Use TextField instead of JSONField
    model_name = models.CharField( max_length = 100 )  # Store the name of the model
    model_uuid = models.UUIDField()  # Store the UUID of the model instance

    class Meta:
        verbose_name = "Update History"
        verbose_name_plural = "Update Histories"

    def __str__(self):
        return f"{self.model_name} - {self.model_uuid} - {self.updated_at.date()}"


class Request(BaseModel):
    user = models.ForeignKey(User,verbose_name="User" , on_delete=models.SET_NULL , null=True )
    details = models.TextField(verbose_name="Details", max_length=100)
    type = models.CharField(verbose_name="Request Type", max_length=50, choices=RequestTypes.choices ,default=RequestTypes.GLOBAL)
    department = models.ForeignKey(Department,verbose_name="Department" , on_delete=models.SET_NULL , null=True)
    status = models.CharField(verbose_name="Request Status", max_length=50, choices=RequestStatuses.choices ,default=RequestStatuses.PENDING)

    def save(self,*args,**kwargs):
        self.department = self.user.department
        return super().save(*args,**kwargs)


class Notification(BaseModel):

    # user = models.ForeignKey(User,verbose_name="User" , on_delete=models.SET_NULL , null=True )
    department = models.ForeignKey(Department)
    details = models.TextField(verbose_name="Details", max_length=100)


def profile_creator_signal(sender:User, instance:User, created:bool, **kwargs):
    if created:
        profile , is_created = Profile.objects.get_or_create(user=instance)
        if is_created:
            profile.save()
    

def create_update_history(sender, instance:BaseModel, **kwargs):
    if issubclass(sender, BaseModel):  # Check if the sender is a subclass of BaseModel
        previous_values = {}
        # print(sender , instance)
        try : 
            old_instance = sender.objects.get(uuid=instance.uuid)
        except sender.DoesNotExist:
            return
        for field in instance._meta.fields:
            previous_values[field.name] = str(getattr(old_instance, field.name))
        previous_values_str = json.dumps(previous_values)
        UpdateHistory.objects.create(
            user=kwargs.get("by",None),  
            previous_values=previous_values_str,
            model_name=sender.__name__,  # Get the name of the model
            model_uuid=instance.uuid
        )



post_save.connect(profile_creator_signal, sender=User)
pre_save.connect(create_update_history, sender=Project)
pre_save.connect(create_update_history, sender=Department)
pre_save.connect(create_update_history, sender=User)
pre_save.connect(create_update_history, sender=ArrivingLeaving)
pre_save.connect(create_update_history, sender=Profile)
pre_save.connect(create_update_history, sender=Lead)



