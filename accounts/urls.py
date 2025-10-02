from django.urls import path, include
from .views import register_view, login_view, logout_view
from .views import register_view, verify_otp,resend_otp
from .views import product_list_farmer
from .views import buyer_dashboard,default_dashboard,farmer_dashboard,role_selection_view,category_products,account
from .views import download_transaction_pdf,farmer_account
from .views import crop_detail_view,search_results,product_detail,negotiate_product,view_marketplace_product,send_negotiation_reply
from .views import negotiation_inbox,add_to_cart,monitor_negotiations,view_cart,buy_product,checkout_buy_now
from .views import user_activity_log,admin_activity_log,get_activity_trends_data,user_analytics_dashboard,get_activity_breakdown_data,get_most_viewed_products_data,farmer_products_view
from .models import LogActivity
from accounts.views import home
from .views import buy_category_product_now,add_to_cart_category_product,view_cart_category_product,discounted_products,market_price_detail,banner_detail
from django.contrib.auth import views as auth_views

urlpatterns = [
    path('', home, name='home'),
    path("register/", register_view, name="register"),
    path("login/", login_view, name="login"),
    path("logout/", logout_view, name="logout"),
    path('verify-otp/', verify_otp, name='verify_otp'),
    path('resend-otp/', resend_otp, name='resend_otp'),
    path('password_reset/', auth_views.PasswordResetView.as_view(), name='password_reset'),
    path('password_reset/done', auth_views.PasswordResetDoneView.as_view(), name='password_reset_done'),
    path('reset/<uidb64>/<token>/', auth_views.PasswordResetConfirmView.as_view(), name='password_reset_confirm'),
    path('reset/done/', auth_views.PasswordResetCompleteView.as_view(), name='password_reset_complete'),
    path('products/list/', product_list_farmer, name='product_list_farmer'),
    path("farmer/dashboard/", farmer_dashboard, name="farmer_dashboard"),
    path("buyer/dashboard/", buyer_dashboard, name="buyer_dashboard"),
    path("buyer/dashboard/productshow/",buyer_dashboard, name="product_show"),
    path("default/dashboard/", default_dashboard, name="default_dashboard"),
    path("role_selection/", role_selection_view, name="role_selection_view"),
    path('farmer/transactions/download/', download_transaction_pdf, name='download_transaction_pdf'),
    path('farmer/account/', farmer_account, name='farmer_account'),
    path('addtocart/', add_to_cart, name='add_to_cart'),
    path('buy/product/', buy_product, name='buy_product'),
    path('viewcart/', view_cart, name='view_cart'),
    path('checkout/buy-now/', checkout_buy_now, name='checkout_buy_now'),
    path('account/', account, name='account'),
    path('crop/<str:crop_name>/', crop_detail_view, name='crop_detail_view'),
    path('search-products/', search_results, name='search_results'),
    # path('product/<int:id>/', product_detail, name='product_detail'),
    path('product/<str:product_type>/<int:id>/', product_detail, name='product_detail'),
    path('negotiate/<int:product_id>/', negotiate_product, name='negotiate_product'),
    path('negotiation/reply/<int:message_id>/', send_negotiation_reply, name='send_negotiation_reply'),
    path('negotiation/inbox/', negotiation_inbox, name='negotiation_inbox'),
    path('product/marketplace/<int:product_id>/', view_marketplace_product, name='view_marketplace_product'),
    path('monitor/negotiations/', monitor_negotiations, name='monitor_negotiations'),
    path('add-to-cart-category-product/', add_to_cart_category_product, name='add_to_cart_category_product'),
    path('category/cart/', view_cart_category_product, name='view_cart_category_product'),
    path('category/<str:category>/', category_products, name='category_products'),
    path('category/product/buy',buy_category_product_now, name='buy_category_product_now'),
    path('activity/me/', user_activity_log, name='user_activity_log'),
    path('admin/activities/', admin_activity_log, name='admin_activity_log'),
    path('api/activity-trends/', get_activity_trends_data, name='api_activity_trends'),
    path('analytics/', user_analytics_dashboard, name='user_analytics'),
    path('api/activity-breakdown/', get_activity_breakdown_data, name='api_activity_breakdown'),
    path('api/most-viewed-products/', get_most_viewed_products_data, name='api_most_viewed_products'),
    path('farmer/my-products/', farmer_products_view, name='farmer_products_view'),
    path('offers/<int:offer_id>/', discounted_products, name='discounted_products'),
    path('market-price/<str:commodity_name>/', market_price_detail, name='market_price_detail'),
    path("banner/<slug:slug>/", banner_detail, name="banner_detail"),


]



