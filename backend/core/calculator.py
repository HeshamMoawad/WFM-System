from users.models import (
    User ,
    Project , 
    Department , 
    ArrivingLeaving ,
    Profile,
    Lead,
)
from commission.models import (
    UserCommissionDetails , 
    User,
    DeductionRules,
    TargetSlice,
    Department
)
from datetime import datetime
from typing import List


class Calculator(object):

    def calc_late(self,obj:ArrivingLeaving):
        company_start_time = datetime.combine(datetime.today(),getattr(obj,"will_arrive_at"))
        arrival_time = datetime.combine(datetime.today(), obj.arriving_at.time())
        if arrival_time > company_start_time:
            lateness = arrival_time - company_start_time
            return int(round(lateness.total_seconds(),0))  # Return lateness in seconds
        return 0

    def calc_departure(self,obj:ArrivingLeaving):
        company_end_time = datetime.combine(datetime.today(), getattr(obj,"will_leave_at"))
        if obj.leaving_at :
            leaving_time = datetime.combine(datetime.today(), obj.leaving_at.time())
            if company_end_time > leaving_time :
                departureness = company_end_time - leaving_time
                return int(round(departureness.total_seconds(),0))  # Return lateness in seconds
        return 0

    def calc_deduction(self,late_time:int , rules:List[dict]):
        total_deduction = 0
        for rule in rules:
            if not (late_time < rule["late_time"]):
                total_deduction += rule["deduction_days"]
                break
        return total_deduction

