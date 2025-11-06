# accounts/urls.py
from django.urls import path
from .views import RegisterView, LoginView,GoogleRegisterView, set_role
from .views import google_login

urlpatterns = [
    path("register/", RegisterView.as_view(), name="register"),
    path("login/", LoginView.as_view(), name="login"),
    path('register/google/', GoogleRegisterView.as_view()),  # ✅ Add this
    path("google-login/", google_login),
    path('set-role/', set_role, name="set-role"),



]
