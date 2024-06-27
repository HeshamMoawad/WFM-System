from django.contrib import admin
from import_export import resources
from import_export.admin import ImportExportModelAdmin

from .models import (
    User , 
    Department ,
    Project ,
    ArrivingLeaving ,
    Lead ,
    Profile ,
    UpdateHistory , 
    Request , 
    FingerPrintID
)
from utils.admin_utils import FieldSets

class UserResource(resources.ModelResource):
    class Meta:
        model = User  



# Register your models here..
class UserAdminSite(ImportExportModelAdmin):
    resource_classes = [UserResource]
    list_display = ("username",'role',"project","is_active","is_staff","is_superuser")
    list_filter = ("project","role")
    readonly_fields = ['uuid',"created_at","updated_at"]
    search_fields = ['username' , 'uuid' , 'first_name']  
    fieldsets = FieldSets([
            'Login Fields' ,
            'Company Fields',
            'Other Fields'
        ],[
            [
                'username',
                '_password',
                'is_active',
                'is_staff',
                'is_superuser',
                "first_name",
                "last_name",

            ] ,
            [
                "project",
                "role",
                "title",
                "department" ,
            ],
            [
                "uuid" ,
                "created_at",
                "updated_at"
            ]
    ]).fieldsets

class ProfileAdminSite(admin.ModelAdmin):
    list_display = ["user","telegram_id"]
    list_filter = ["user"]
    readonly_fields = ['uuid',"created_at","updated_at"]
    search_fields = ['user__username' , 'uuid' , 'telegram_id']  
    fieldsets = FieldSets([
            'Profile Fields' ,
            'Other Fields'
        ],[
            [
                'user',
                'picture',
                'telegram_id',
                'about',
            ],[
                "uuid" ,
                "created_at",
                "updated_at"
            ]
    ]).fieldsets

class ArrivingLeavingResource(resources.ModelResource):
    class Meta:
        model = ArrivingLeaving  


class ArrinigLeavingAdminSite(ImportExportModelAdmin):
    resource_classes = [ArrivingLeavingResource]
    list_display = ["user","date","arriving_at","leaving_at",]
    list_filter = ["user","date"]
    readonly_fields = ['uuid',"created_at","updated_at","date" ,"arriving_at"]
    search_fields = ['user__username' , 'uuid' , 'date']  
    fieldsets = FieldSets([
            'Attendance Fields' ,
            'Other Fields'
        ],[
            [
                'user',
                'date',
                'arriving_at',
                'leaving_at',
            ],[
                "uuid" ,
                "created_at",
                "updated_at"
            ]
    ]).fieldsets


class LeadAdminSite(admin.ModelAdmin):
    list_display = ["user","phone",'project',"date"]
    list_filter = ["user","date" ,'project']
    readonly_fields = ['uuid',"created_at","updated_at"]
    search_fields = ['phone' ,'name', 'uuid' , 'date']  
    fieldsets = FieldSets([
            'Lead Fields' ,
            'Other Fields'
        ],[
            [
                'user',
                'phone',
                'name',
                'date',
                'project',
            ],[
                "uuid" ,
                "created_at",
                "updated_at"
            ]
    ]).fieldsets


class ProjectAdminSite(admin.ModelAdmin):
    list_display = ["name"]
    # list_filter = ["user","date" ,'project']
    readonly_fields = ['uuid',"created_at","updated_at"]
    # search_fields = ['name', 'uuid']  
    fieldsets = FieldSets([
            'Profile Fields' ,
            'Other Fields'
        ],[
            [
                'name',
                'logo',
            ],[
                "uuid" ,
                "created_at",
                "updated_at"
            ]
    ]).fieldsets


class DepartmentAdminSite(admin.ModelAdmin):
    list_display = ["name"]
    # list_filter = ["user","date" ,'project']
    readonly_fields = ['uuid',"created_at","updated_at"]
    # search_fields = ['name', 'uuid']  
    fieldsets = FieldSets([
            'Profile Fields' ,
            'Other Fields'
        ],[
            [
                'name',
            ],[
                "uuid" ,
                "created_at",
                "updated_at"
            ]
    ]).fieldsets




class UpdateHistoryAdminSite(admin.ModelAdmin):
    list_display = ["model_uuid","user" ,"model_name", "updated_at"]
    list_filter = ["user" ,  "model_name","updated_at"]
    readonly_fields = ["updated_at"]
    search_fields = ['model_name', 'model_uuid' , "user__username"]  
    fieldsets = FieldSets([
            'UpdateHistory Fields' ,
            'Other Fields'
        ],[
            [
                'model_uuid',
                'model_name',
                'user',
                'previous_values',
            ],[
                "updated_at"
            ]
    ]).fieldsets


class RequestAdminSite(admin.ModelAdmin):
    list_display = ["user" ,"type","status", "department","date"]
    list_filter = ["user" ,  "department"]
    readonly_fields = ['uuid',"created_at","updated_at" , "department" ]
    search_fields = ['user__username','details', 'department__name']  
    fieldsets = FieldSets([
            'UpdateHistory Fields' ,
            'Other Fields'
        ],[
            [
                'user',
                'type',
                'status',
                'details',
                'note',
                'date',
            ],[
                "uuid" ,
                "created_at",
                "updated_at" ,
                "department",
            ]
    ]).fieldsets


class FingerPrintIDAdminSite(admin.ModelAdmin):
    list_display = ["user","name" ,"unique_id"]
    list_filter = ["user" ]
    readonly_fields = ['uuid',"created_at","updated_at" ]
    search_fields = ['user__username',"unique_id" ,"name"]  
    fieldsets = FieldSets([
            'FingerPrintID Fields' ,
            'Other Fields'
        ],[
            [
                'name', 
                'user',
                'unique_id',
            ],[
                "uuid" ,
                "created_at",
                "updated_at" ,
            ]
    ]).fieldsets

admin.site.site_title = "WFM-System"
admin.site.site_header = "WFM-System"
admin.site.register(User , UserAdminSite)
admin.site.register(Department, DepartmentAdminSite)
admin.site.register(Project , ProjectAdminSite)
admin.site.register(Profile,ProfileAdminSite)
admin.site.register(ArrivingLeaving,ArrinigLeavingAdminSite)
admin.site.register(Lead,LeadAdminSite)
admin.site.register(Request,RequestAdminSite)
admin.site.register(UpdateHistory , UpdateHistoryAdminSite)
admin.site.register(FingerPrintID , FingerPrintIDAdminSite)
