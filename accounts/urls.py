# accounts/urls.py
from django.urls import path
from .views import RegisterView, LoginView, set_role
from .views import google_login
from .views import password_reset_request, password_reset_confirm,user_profile
from .views import verify_otp
from .views import ProductViewSet
from .views import sales_analytics  # Import the new sales analytics view



product_list = ProductViewSet.as_view({
    'get': 'list',
    'post': 'create',
})

product_detail = ProductViewSet.as_view({
    'get': 'retrieve',
    'put': 'update',
    'patch': 'partial_update',
    'delete': 'destroy',
})

urlpatterns = [
    path("register/", RegisterView.as_view(), name="register"),
    path("login/", LoginView.as_view(), name="login"),
    path("google-login/", google_login),
    path("verify-otp/", verify_otp, name="verify-otp"),
    path("forgot-password/", password_reset_request, name="forgot-password"),
    path("reset-password/<uid>/<token>/", password_reset_confirm, name="reset-password"),
    path('set-role/', set_role, name="set-role"),
    path('api/profile/', user_profile, name='user-profile'),
    
    # Explicit URLs for Product API
    path('products/', product_list, name='product-list'),
    path('products/<int:pk>/', product_detail, name='product-detail'),
    path('analytics/', sales_analytics, name='sales-analytics'),

]
