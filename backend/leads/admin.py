from django.contrib import admin
from import_export import resources ,fields ,widgets
from import_export.admin import ImportExportModelAdmin 
from .models import Number , Source ,UserSources , LiveNumber , User
from utils.admin_utils import FieldSets
import uuid

class NumberResource(resources.ModelResource):
    uuid = fields.Field(column_name='uuid', attribute='uuid', default=uuid.uuid4)
    source = fields.Field(
        column_name='source',
        attribute='source',
        widget=widgets.ForeignKeyWidget(Source, 'name')  # Using 'name' to match Source
    )

    class Meta:
        model = Number
        fields = ('uuid', 'number', 'source')  # Include the necessary fields
        export_order = ('uuid', 'number', 'source')
        import_id_fields = ['uuid']  # Use UUID instead of id

        
class LiveNumberResource(resources.ModelResource):
    uuid = fields.Field(column_name='uuid', attribute='uuid', default=uuid.uuid4)
    user = fields.Field(
        column_name='user',
        attribute='user',
        widget=widgets.ForeignKeyWidget(User, 'username')  # Using 'name' to match Source
    )
    class Meta:
        model = LiveNumber
        fields = ('uuid','user','number','number_text')
        export_order = ('uuid','user','number','number_text')
        import_id_fields = ['uuid']  # Use UUID instead of id
    


class SourceAdminSite(ImportExportModelAdmin):
    list_display = ["name"]
    readonly_fields = ['uuid',"created_at","updated_at" ]
    search_fields = ['name']  
    fieldsets = FieldSets([
            'Source Fields' ,
            'Other Fields'
        ],[
            [
                'name', 
            ],[
                "uuid" ,
                "created_at",
                "updated_at" ,
            ]
    ]).fieldsets


class UserSourcesAdminSite(ImportExportModelAdmin):
    list_display = ["name"]
    readonly_fields = ['uuid',"created_at","updated_at" ]
    search_fields = ['name']  
    fieldsets = FieldSets([
            'UserSources Fields' ,
            'Other Fields'
        ],[
            [
                'name', 
                'sources', 
            ],[
                "uuid" ,
                "created_at",
                "updated_at" ,
            ]
    ]).fieldsets

class NumberAdminSite(ImportExportModelAdmin):
    list_display = ["number",'source']
    list_filter = ["source"]
    resource_class = NumberResource
    readonly_fields = ['uuid',"created_at","updated_at" ]
    search_fields = ['number','source']  
    fieldsets = FieldSets([
            'Number Fields' ,
            'Other Fields'
        ],[
            [
                'number', 
                'source', 
            ],[
                "uuid" ,
                "created_at",
                "updated_at" ,
            ]
    ]).fieldsets
    
    
    
class LiveNumberAdminSite(ImportExportModelAdmin):
    list_display = ["user",'number']
    list_filter = ["user"]
    resource_class = LiveNumberResource
    readonly_fields = ['uuid',"created_at","updated_at" ]
    search_fields = ['user__username','number']  
    fieldsets = FieldSets([
            'LiveNumber Fields' ,
            'Other Fields'
        ],[
            [
                'user', 
                'number', 
                'number_text', 
            ],[
                "uuid" ,
                "created_at",
                "updated_at" ,
            ]
    ]).fieldsets
    
    
    


admin.site.register(Number , NumberAdminSite)
admin.site.register(Source , SourceAdminSite)
admin.site.register(LiveNumber , LiveNumberAdminSite)
admin.site.register(UserSources , UserSourcesAdminSite)
