from django.urls import path
from .views import register_view, login_view, logout_view,home
from .views import register_view, verify_email

urlpatterns = [
    path("", home, name="home"),  # Homepage
    path("register/", register_view, name="register"),
    path("login/", login_view, name="login"),
    path("logout/", logout_view, name="logout"),
    path('verify-email/<uidb64>/<token>/', verify_email, name='verify_email'),
]
