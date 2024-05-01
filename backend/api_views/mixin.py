from rest_framework.views import APIView
from permissions.models import CustomBasePermission 
# from rest_framework.permissions import BasePermission 
from rest_framework.serializers import ModelSerializer
from rest_framework.pagination import PageNumberPagination
from rest_framework.request import Request
from auth import AuthenticateUser , AuthenticateMixins
from users.models import User 
from typing import List , Tuple , Dict
from .parser import RequestParser
from django.db.models import Model
from utils.decorator import handle_errors
from rest_framework.response import Response
from rest_framework.status import HTTP_200_OK,HTTP_400_BAD_REQUEST
from django.db.models import QuerySet

class CreateUpdateMixins():
    pass



class APIViewMixins(APIView):
    permission_classes:List[CustomBasePermission] = []
    allowed_methods = ["GET","POST","PUT","DELETE"]
    pagination_class:PageNumberPagination = None
    model:Model = None
    model_serializer:ModelSerializer = None
    order_by:List = []
    search_filters:List[str] = ["uuid","username"]
    creating_filters:List[str] = ["*"]
    requiered_fields:List[str] = []
    updating_filters:List[str] = ["*"]
    unique_field:str = 'id'
    auth_class:AuthenticateMixins = AuthenticateUser
    foreign_models:Dict = {}
    many_to_many_models:Dict = {}
    use_serializer_for_create = False

    def _get(self,request:Request):
        user , parser = self._get_user_and_parser(request,self.search_filters)
        queryset = self.model.objects.filter(**parser.params).all().distinct().order_by(*self.order_by)
        queryset = self.filter_queryset_with_permissions(user,queryset)
        if self.pagination_class :
            return self.get_pagination_data(queryset,request)
        return self.model_serializer(queryset , many=True).data


    def _post(self,request:Request):
        user , parser = self._get_user_and_parser(request,self.creating_filters)

        fields = dict(**parser.body,**parser.foreign_models,**parser.many_to_many_models)
        if not all(field in fields.keys() for field in self.requiered_fields):
            raise NotImplementedError(f"Must include required fields ({ ' ,'.join(self.requiered_fields) })")

        
        obj = self.model(**parser.body)
        if parser.foreign_models :
            for key in parser.foreign_models.keys():
                field_obj = self.foreign_models[key]
                setattr(obj,key,field_obj.get_value(parser.foreign_models[key]))

        if parser.many_to_many_models :
            for key in parser.many_to_many_models.keys():
                field_obj = self.many_to_many_models[key]
                field_obj.add_to_model(obj,parser.many_to_many_models[key])
        
        obj.validate_unique()
        self.check_object_permissions(request,obj)
        obj.save()
        return self.model_serializer(obj).data


    def _put(self,request:Request):
        
        if not self.use_serializer_for_create:
            user , parser = self._get_user_and_parser(request,self.updating_filters)
            
            id = RequestParser(request,self.search_filters).params.get(self.unique_field)
            print({self.unique_field:id} , parser.foreign_models , parser.many_to_many_models , parser.body)
            obj = self.model.objects.get(**{self.unique_field:id})

            for key , value in parser.body.items():
                setattr(obj,key,value)

            if parser.foreign_models :
                for key in parser.foreign_models.keys():
                    field_obj = self.foreign_models[key]
                    setattr(obj,key,field_obj.get_value(parser.foreign_models[key]))

            if parser.many_to_many_models :
                for key in parser.many_to_many_models.keys():
                    field_obj = self.many_to_many_models[key]
                    field_obj.set_to_model(obj,parser.many_to_many_models[key])
            obj.validate_unique()
            self.check_object_permissions(request,obj)
            obj.save()
            return self.model_serializer(obj).data
        else :
            print("\nserializer\n")
            obj = self.model.objects.get(**{self.unique_field:request.query_params.get("uuid")})

            serializer = self.model_serializer(obj,data=request.data)
            if serializer.is_valid():
                serializer.save()
            print(serializer)
            return serializer.data


    def _delete(self , request:Request ):
        user , parser = self._get_user_and_parser(request,[self.unique_field])
        id = parser.params.get(self.unique_field)
        obj = self.model.objects.get(**{self.unique_field:id})
        self.check_object_permissions(request,obj)
        obj.delete()
        return self.model_serializer(obj).data
        

    def _get_user_and_parser(self , request:Request , filters ):
        user ,  token  = self.auth_class(request)
        parser = RequestParser( request , filters , list(self.foreign_models.keys()) , list(self.many_to_many_models.keys()))
        return user , parser


    def filter_queryset_with_permissions(self,user,queryset:QuerySet)->QuerySet:
        filter_kwargs = {}
        exclode_kwargs = {}
        for perm_class in self.permission_classes :
            perm_class = perm_class() 
            filter_kwargs.update(perm_class.filter_objects_by(user).get(self.model.__name__,{}).get(user.role,{}))
            exclode_kwargs.update(perm_class.exclude_objects_by(user).get(self.model.__name__,{}).get(user.role,{}))
        # print(".....................",filter_kwargs,f"\n{self.model.__name__}\n",exclode_kwargs,".....................")
        return queryset.filter(**filter_kwargs).exclude(**exclode_kwargs)
        

    def get_pagination_data(self,queryset,request:Request):
        paginator = self.pagination_class()
        result = paginator.paginate_queryset(queryset,request)
        return {
            'count': len(result) if result else 0 ,
            'next':paginator.get_next_link(),
            'previous':paginator.get_previous_link(),
            "results": self.model_serializer( result , many=True ).data
        }

