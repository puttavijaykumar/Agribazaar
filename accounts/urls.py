from django.urls import path, include
from .views import register_view, login_view, logout_view
from .views import register_view, verify_email
from accounts.views import home

urlpatterns = [
    path('', home, name='home'),
    path("register/", register_view, name="register"),
    path("login/", login_view, name="login"),
    path("logout/", logout_view, name="logout"),
    path('verify-email/<uidb64>/<token>/', verify_email, name='verify_email'),
]
