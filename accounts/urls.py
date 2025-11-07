# accounts/urls.py
from django.urls import path
from .views import RegisterView, LoginView, set_role
from .views import google_login
from .views import password_reset_request, password_reset_confirm



urlpatterns = [
    path("register/", RegisterView.as_view(), name="register"),
    path("login/", LoginView.as_view(), name="login"),
    path("google-login/", google_login),
    path("forgot-password/", password_reset_request, name="forgot-password"),
    path("reset-password/<uid>/<token>/", password_reset_confirm, name="reset-password"),

    path('set-role/', set_role, name="set-role"),

]
