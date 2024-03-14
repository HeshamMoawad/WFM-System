from django.contrib import admin
from .models import (
    User , 
    Department ,
    Project ,
)
from .utils import FieldSets

# Register your models here.
class UserAdminSite(admin.ModelAdmin):
    list_display = ("username",'role',"project","is_staff","is_superuser")
    list_filter = ("project","role")
    readonly_fields = ['uuid']
    search_fields = ['username' , 'uuid' , 'first_name']  
    fieldsets = FieldSets([
            'Login Fields' ,
            'Company Fields',
            'Other Fields'
        ],[
            [
                "uuid" ,
                'username',
                '_password',
                'is_superuser',
                'is_staff',
                'is_active',
            ] ,
            [
                "project",
                "role",
                "title",
                "department" ,
                "basic" ,
            ],
            [
                "first_name",
                "last_name",
            ]
    ]).fieldsets


admin.site.register(User , UserAdminSite)
admin.site.register(Department)
admin.site.register(Project)
