from django.urls import path , include
from users.views.report_views import (
    add_report , 
    check_report , 
    get_reports , 
    get_leads_report , 
    get_projects_to_report
    )
from users.views.authenticate import login , logout
from users.views import (
    ProjectsAPI , 
    DepartmentsAPI , 
    UsersAPI ,
    ArrivingLeavingAPI ,
    LeadAPI ,
    ProfileAPI ,
    RequestAPI ,
    FingerPrintIDAPI
     )
from users.views.arrive_leave import arreive , leave , arrive_leave_details  , MonthlyHistoryView
from users.views.forget_pass import forget_password
from users.views.leads import upload_sheet , save_upload , user_leads , del_old_lead


urlpatterns = [
    path('login',login ,name="login"),
    path('logout',logout) ,
    path('arrive',arreive) ,
    path('leave',leave) , 
    path('arrive-leave-details',arrive_leave_details) , 
    path('user',UsersAPI.as_view()) ,
    path('project',ProjectsAPI.as_view()) ,
    path('department',DepartmentsAPI.as_view()) ,
    path('arriving-leaving',ArrivingLeavingAPI.as_view()) ,
    path('arriving-leaving-list',MonthlyHistoryView.as_view()) ,
    path('lead',LeadAPI.as_view()) ,
    path('profile',ProfileAPI.as_view()) ,
    path('request',RequestAPI.as_view()) ,
    path('device-access',FingerPrintIDAPI.as_view()) ,
    path('send_password',forget_password) ,
    path('upload-sheet',upload_sheet) ,
    path('save-upload',save_upload) ,
    path('user-leads',user_leads) ,
    
    path('add-report',add_report) ,
    path('check-report',check_report) ,
    path('get-reports',get_reports) ,
    
    
    
    path('leads-report',get_leads_report) ,
    path('get-my-projects',get_projects_to_report) ,

    path('testing',del_old_lead)
]
