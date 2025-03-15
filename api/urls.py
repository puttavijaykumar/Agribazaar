from django.urls import path
from .views import *

urlpatterns = [
    path("generate_registration_otp/", GenerateRegistrationOtpAPIView.as_view(), name = "generate_registration_otp"),
    path("registration/", RegistrationAPIView.as_view(), name = "registration"),
    path("login/", LoginAPIView.as_view(), name = "login"),
    path("generate_reset_password_otp/", GenerateResetPasswordAPIView.as_view(), name = "generate_reset_password_otp"),
    path("reset_password/", ResetPasswordAPIView.as_view(), name = "reset_password"),
    path("logout/", LogoutAPIView.as_view(), name = "logout"),

    path("upload_file/", FileUploadAPIView.as_view(), name = "upload_file"),
    path("download_file/", FileDownloadAPIView.as_view(), name = "download_file"),
    path("delete_file/", FileDeleteAPIView.as_view(), name = "delete_file"),
]