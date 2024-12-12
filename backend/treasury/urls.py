from django.urls import path , include
from .views import (
    total_treasury , 
    treasury_projects , 
    AdvancesAPIView , 
    OutcomeAPIView , 
    IncomeAPIView , 
    my_notification , 
    seen_notification , 
    add_bulk_outcomes ,
    NotificationAPIView ,
    ProjectsGroupAPIView
    )

urlpatterns = [
    path('total-treasury',total_treasury) ,
    path('treasury-projects',treasury_projects) ,
    path('advance',AdvancesAPIView.as_view()) ,
    path('treasury-income',IncomeAPIView.as_view()) ,
    path('treasury-outcome',OutcomeAPIView.as_view()) ,
    path('outcome-bulk',add_bulk_outcomes) ,
    path('my-notification',my_notification) ,
    path('seen-notification',seen_notification) ,
    path('notifications',NotificationAPIView.as_view()) ,
    path('projects-group',ProjectsGroupAPIView.as_view()) ,
]
