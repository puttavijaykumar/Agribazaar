from django.urls import path
from .views import RegisterView, SendOTPView, VerifyOtpView

urlpatterns = [
    path("register/", RegisterView.as_view(), name="register"),
    path("send-otp/", SendOTPView.as_view(), name="send-otp"),
    path("verify-otp/", VerifyOtpView.as_view(), name="verify-otp"),
]
