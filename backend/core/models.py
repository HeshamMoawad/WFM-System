from django.db import models
from django.db.models.signals import pre_save
import uuid
from django.contrib.contenttypes.models import ContentType
from django.contrib.auth.models import Permission , Group
from django.db.models import QuerySet
# Create your models here.


class BaseModel(models.Model):
    uuid = models.UUIDField(verbose_name='UUID' , max_length= 250 , default=uuid.uuid4 , primary_key=True , editable=False)
    created_at = models.DateTimeField(verbose_name="Creation Date & Time",auto_now_add=True )
    updated_at = models.DateTimeField(verbose_name="Update Date & Time",auto_now=True )

    class Meta:
        abstract = True



class BaseFilter(BaseModel):
    content_type = models.ForeignKey(
        ContentType,
        models.CASCADE,
        verbose_name='content type',
    )
    get_queryset_text = models.TextField(verbose_name="Filter execute code context (user,queryset)",max_length=2000)
    layer_index = models.PositiveIntegerField(verbose_name="layer of index",default=0)
    
    def execute(self,**kwargs)-> QuerySet:
        kwargs['queryset'] = None
        exec(self.get_queryset_text,{},kwargs)
        return kwargs['queryset']
    
    class Meta:
        abstract = True


class BasePage(BaseModel):
    name = models.CharField(verbose_name="Page name",max_length=150,unique=True)
    def page_as_number(self)-> int:
        return "".join(list(map(lambda x :str(ord(x)),self.name)))

    class Meta:
        abstract = True

    def __str__(self):
        return f"<{self.__class__.__name__} {self.name} => {self.page_as_number()}>"