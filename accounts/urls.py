# accounts/urls.py
from django.urls import path
from .views import RegisterView, LoginView, set_role
from .views import google_login
from .views import password_reset_request, password_reset_confirm,user_profile
from .views import verify_otp
from .views import ProductViewSet
from .views import sales_analytics  # Import the new sales analytics view

from .views import RecentlyViewedListView,WishlistListView,RecommendedListView
from .views import TopSellersListView,NewArrivalsListView,SeasonalPicksListView
from .views import OrderListView,OrderDetailView,CartDetailView,NotificationListView
from .views import UserSettingsView

from .views import AddressListCreateView, AddressDetailView
from .views import MyProductListView


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
    path('my-products/', MyProductListView.as_view(), name='my-products'),
    # Explicit URLs for Product API
    path('products/', product_list, name='product-list'),
    path('products/<int:pk>/', product_detail, name='product-detail'),
    path('analytics/', sales_analytics, name='sales-analytics'),
    
    # New Dashboard feature APIs
    path('users/me/recently-viewed/', RecentlyViewedListView.as_view(), name='recently-viewed'),
    path('users/me/wishlist/', WishlistListView.as_view(), name='wishlist'),
    path('users/me/recommended/', RecommendedListView.as_view(), name='recommended'),
    path('sellers/top/', TopSellersListView.as_view(), name='top-sellers'),
    path('products/new-arrivals/', NewArrivalsListView.as_view(), name='new-arrivals'),
    path('products/seasonal-picks/', SeasonalPicksListView.as_view(), name='seasonal-picks'),
    
    # Order APIs
    path('orders/', OrderListView.as_view(), name='order-list'),
    path('orders/<int:pk>/', OrderDetailView.as_view(), name='order-detail'),
    
    # Cart APIs can be added here in the future
    path('cart/', CartDetailView.as_view(), name='cart-detail'),
    # Notification APIs can be added here in the future
    path('notifications/', NotificationListView.as_view(), name='notification-list'),
    path('settings/', UserSettingsView.as_view(), name='user-settings'),

    path('addresses/', AddressListCreateView.as_view(), name='address-list-create'),
    path('addresses/<int:pk>/', AddressDetailView.as_view(), name='address-detail'),
    
]
