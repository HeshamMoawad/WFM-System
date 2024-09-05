from django.db.models import BooleanField, CASCADE, ManyToManyField,  CharField , ForeignKey , SET_NULL ,OuterRef
from users.models import BaseModel , User
# Create your models here.


class Source(BaseModel):
    name = CharField("Source Name" , max_length=100)

    def __str__(self) -> str:
        return self.name
    class Meta:
        verbose_name = 'Source'
        verbose_name_plural = 'Sources'


class UserSources(BaseModel):
    name = CharField("Source Name" , max_length=100)
    sources = ManyToManyField(Source,related_name="usersource_source")
    def __str__(self) -> str:
        return self.name

    class Meta:
        verbose_name = 'User Source'
        verbose_name_plural = 'User Sources'



class Number(BaseModel):
    number = CharField("Number" , max_length=12)
    source = ForeignKey(Source,on_delete=SET_NULL,verbose_name="Source" , null=True)
    def __str__(self) -> str:
        return self.number
    class Meta:
        verbose_name = 'Number'
        verbose_name_plural = 'Numbers'


 
class LiveNumber(BaseModel):
    user = ForeignKey(User,on_delete=SET_NULL,verbose_name="User" , null=True)
    number = ForeignKey(Number,on_delete=CASCADE,verbose_name="Number")
    number_text = CharField("Number As Text" , max_length=12 , blank=True)
    
    def __str__(self) -> str:
        return f"{self.user} - {self.number}"

