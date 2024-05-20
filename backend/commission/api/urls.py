from django.urls import path , include
from commission.views import UserCommissionDetailsAPI , DeductionRulesAPI , TargetSlicesAPI

urlpatterns = [
    path('user-commission-details',UserCommissionDetailsAPI.as_view()),
    path('deduction-rules',DeductionRulesAPI.as_view()),
    path('target-slices',TargetSlicesAPI.as_view()),
]
