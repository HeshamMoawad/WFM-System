from django.urls import path , include
from commission.views import UserCommissionDetailsAPI , DeductionRulesAPI , TargetSlicesAPI , BasicRecordAPI , CoinChangerAPI
from ..views.basic import get_users_with_has_basic 

urlpatterns = [
    path('user-commission-details',UserCommissionDetailsAPI.as_view()),
    path('deduction-rules',DeductionRulesAPI.as_view()),
    path('target-slices',TargetSlicesAPI.as_view()),
    path('users-basic',get_users_with_has_basic),
    path('basic-details',BasicRecordAPI.as_view()),
    path('coin-changer',CoinChangerAPI.as_view()),
]
