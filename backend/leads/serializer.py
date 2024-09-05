from api_views.serializers import ModelSerializer ,  ForeignField , ManyToManyField  
from .models import Number , Source ,UserSources , LiveNumber , User



        
class SourceSerializer(ModelSerializer):
    class Meta:
        model = Source
        fields = [
            "uuid",
            "name",
        ]
        
        
class UserSourcesSerializer(ModelSerializer):
    class Meta:
        model = UserSources
        fields = [
            "uuid",
            "name",
            "sources",
        ]
        many_to_many_models ={
            "sources" : ManyToManyField("sources",Source,"uuid")
        }

        
class NumberSerializer(ModelSerializer):
    class Meta:
        model = Number
        fields = [
            "uuid",
            "number",
            "source",
        ]
        foreign_models = {
            "source": ForeignField("source",Source,'uuid') ,
        }
        
        
class LiveNumberSerializer(ModelSerializer):
    class Meta:
        model = LiveNumber
        fields = [
            "uuid",
            "user",
            "number",
            "number_text",
        ]
        foreign_models = {
            "user": ForeignField("user",User,'uuid') ,
            "number": ForeignField("number",Number,'uuid') ,
        }
        
