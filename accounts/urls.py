from django.urls import path, include
from .views import register_view, login_view, logout_view
from .views import register_view, verify_email
from accounts.views import home
from django.contrib.auth import views as auth_views

urlpatterns = [
    path('', home, name='home'),
    path("register/", register_view, name="register"),
    path("login/", login_view, name="login"),
    path("logout/", logout_view, name="logout"),
    path('verify-email/<uidb64>/<token>/', verify_email, name='verify_email'),
    path('password_reset/', auth_views.PasswordResetView.as_view(), name='password_reset'),
    path('password_reset/done', auth_views.PasswordResetDoneView.as_view(), name='password_reset_done'),
    path('reset/<uidb64>/<token>/', auth_views.PasswordResetConfirmView.as_view(), name='password_reset_confirm'),
    path('reset/done/', auth_views.PasswordResetCompleteView.as_view(), name='password_reset_complete'),
]
