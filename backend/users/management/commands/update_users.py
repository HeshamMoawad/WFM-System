
from typing import Any, List , Tuple
from django.core.management.base import BaseCommand , CommandParser
from django.conf import settings 
import os , json
from datetime import datetime , timedelta
from commission.models import UserCommissionDetails
from django.db.models import F , TimeField
from django.db.models.functions import Coalesce

class Command(BaseCommand):
    help = 'Update Users Commission Details ( Arrive & Leave )'

    def add_arguments(self, parser:CommandParser):
        parser.add_argument("--arrive",type=float ,default=None, help='hours of timedelta to update "will_arrive_at" in objects ')
        parser.add_argument("--leave", type=float ,default=None, help='hours of timedelta to update "will_leave_at" in objects ')
        parser.add_argument("--filter" ,nargs='+', help='filters to apply of UserCommissionDetails objects to update')
        parser.add_argument("--exclude" ,nargs='+', help='exclude to apply of UserCommissionDetails objects to update')
        
    def handle(self, *args, **kwargs): 
        accepted = False
        print(kwargs)
        try :
            filters , excludes= self.parse_filters_excludes(kwargs)
            self.stdout.write(self.style.SUCCESS(f"Success to parse [filter : {filters} , exclude : {excludes}]"))
            accepted = True
        except Exception as e :
            self.stdout.write(self.style.ERROR(str(e)))
        if accepted:
            arrive = kwargs.get("arrive",None)
            leave = kwargs.get("leave",None)
            self.stdout.write(self.style.SUCCESS(f"Will Update => Arrive : {arrive} | Leave : {leave}"))

            updates = {}
            updates.update({"will_arrive_at":Coalesce(F("will_arrive_at"), timedelta(hours=float(arrive)))}) if arrive else None
            updates.update({"will_leave_at":Coalesce(F("will_leave_at"), timedelta(hours=float(leave)))}) if leave else None
            print(UserCommissionDetails.objects.filter(**filters).exclude(**excludes).update(**updates) if updates else None)
            UserCommissionDetails.objects.filter(**filters).exclude(**excludes).update(**updates) if updates else None
            self.stdout.write(self.style.SUCCESS(f"Updated Success !!"))
        
    def parse_filters_excludes(self,kwargs:dict)-> Tuple[dict]:
        return self.parse_list_as_dict(kwargs.get("filter") if kwargs.get("filter") else []) , self.parse_list_as_dict(kwargs.get("exclude") if kwargs.get("exclude") else [])
    
    def parse_list_as_dict(self,args:List[str])-> dict:
        return {arg[0]:self.parse_value(arg[1]) for arg in [arg.split("=") for arg in args]}
    
    def parse_value(self,value:str)-> Any:
        if value.lower() == "true":
            return True
        elif value.lower() == "false":
            return False
        else :
            return value
        