from datetime import datetime ,timedelta
from typing import  List, Tuple , Union , Generator ,overload
from utils.parsers import parse_date , _types_protector


DATE_FORMATS = [
    "%d-%m-%Y",
    "%Y-%m-%d", 
    "%Y/%m/%d", 
    "%d/%m/%Y",
]



class GenerateDate:
    def __init__(
                self,
                from_date:Union[datetime,str] , 
                to_date:Union[datetime,str] , 
                split_by:int=1 , 
                as_generator:bool=False
                    )-> Union[
                                List[Tuple[datetime,datetime]],
                                Generator[Tuple[datetime,datetime],None,None]
                            ] : ...
    def __new__(
                cls,
                from_date:Union[datetime,str] , 
                to_date:Union[datetime,str] , 
                split_by:int=1 , 
                as_generator:bool=False
                    )-> Union[
                                List[Tuple[datetime,datetime]],
                                Generator[Tuple[datetime,datetime],None,None]
                            ] :
        _types_protector(from_date,[datetime,str])
        _types_protector(to_date,[datetime,str])
        _types_protector(split_by,int)

        if isinstance(from_date,str): from_date = parse_date(from_date,DATE_FORMATS)
        if isinstance(to_date,str): to_date = parse_date(to_date,DATE_FORMATS)
        
        date_squence = (from_date,to_date)
        from_date = min(date_squence)
        to_date = max(date_squence)

        step = int((to_date-from_date).days / split_by)
        if not as_generator:
            return [(from_date + timedelta(days=index*split_by),min(from_date+timedelta(days=(index+1)*split_by) , to_date)) for index in range(step+1)]
        else :
            def generator():
                current = from_date
                for _ in range(step+1):
                    new_current = current + timedelta(days=split_by)
                    if new_current > to_date :
                        new_current = to_date
                    yield (current,new_current)
                    current  += timedelta(days=split_by)
            return generator()
