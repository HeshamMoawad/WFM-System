from django.urls import path 
from ..views.authenticate import login , logout

urlpatterns = [
    path('login',login ),
    path('logout',logout)
]
