from django.contrib import admin
from .models import (
    User , 
    Department ,
    Project ,
)


# Register your models here.
class UserAdminSite(admin.ModelAdmin):
    list_display = ("username",'role',"project","is_staff","is_superuser")
    list_filter = ("project","role")
    # search_fields = ['username']  


admin.site.register(User , UserAdminSite)
admin.site.register(Department)
admin.site.register(Project)
