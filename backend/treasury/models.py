from django.db import models
from django.db.models.signals import pre_save
from core.models import  BaseModel 
from users.models import User , create_update_history



class TreasuryIncome(BaseModel):
    creator = models.ForeignKey(User,verbose_name="Creator" , on_delete=models.SET_NULL , null=True ,  limit_choices_to={'role': 'OWNER'} )#limit_choices_to={'role': 'OWNER'}
    amount = models.PositiveIntegerField(verbose_name="Amount")
    details = models.CharField(verbose_name="Details" , max_length=250 )


class Advance(BaseModel):
    creator = models.ForeignKey(User,verbose_name="Creator" ,  on_delete=models.SET_NULL , null=True , related_name="advance_creator" , limit_choices_to={'role': 'OWNER'})#limit_choices_to={'role': 'OWNER'}
    user = models.ForeignKey(User,verbose_name="Taker" ,  on_delete=models.SET_NULL , null=True , related_name="advance_taker" ,limit_choices_to={'role__in': ['AGENT','MANAGER','HR']})#limit_choices_to={'role': 'OWNER'}
    amount = models.PositiveIntegerField(verbose_name="Amount")


class TreasuryOutcome(BaseModel):
    creator = models.ForeignKey(User,verbose_name="Creator" ,  on_delete=models.SET_NULL , null=True , limit_choices_to={'role': 'OWNER'})#limit_choices_to={'role': 'OWNER'}
    amount = models.PositiveIntegerField(verbose_name="Amount")
    details = models.CharField(verbose_name="Details" , max_length=250 )



pre_save.connect(create_update_history, sender=TreasuryIncome)
pre_save.connect(create_update_history, sender=TreasuryOutcome)
pre_save.connect(create_update_history, sender=Advance)
