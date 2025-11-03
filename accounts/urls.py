from django.urls import path
# from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import (
    RegisterView
)

from django.http import JsonResponse

def api_root(request):
    return JsonResponse({"message": "Welcome to Agribazaar API"})

urlpatterns = [
    path('', api_root),
    path('register/', RegisterView.as_view(), name='register'),
    # path('otp/generate/', OTPGenerateView.as_view(), name='otp_generate'),
    # path('otp/verify/', OTPVerifyView.as_view(), name='otp_verify'),
    # path('login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    # path('login/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    # path('google-login/', GoogleOAuthLoginView.as_view(), name='google_login'),
    # path('user-type/', UpdateUserTypeView.as_view(), name='update_user_type'),
    # path('dashboard/farmer/', FarmerDashboardView.as_view(), name='farmer_dashboard'),
    # path('dashboard/buyer/', BuyerDashboardView.as_view(), name='buyer_dashboard'),
    # path('dashboard/both/', CombinedDashboardView.as_view(), name='combined_dashboard'),
]
