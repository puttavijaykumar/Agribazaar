from django.urls import path, include
from .views import register_view, login_view, logout_view
from .views import register_view, verify_email
from .views import product_list_farmer
from .views import buyer_dashboard,default_dashboard,farmer_dashboard,role_selection_view,category_products,account
from .views import download_transaction_pdf,farmer_account
from .views import crop_detail_view,search_results,product_detail,negotiate_product,view_marketplace_product,send_negotiation_reply
from .views import negotiation_inbox,add_to_cart,monitor_negotiations,view_cart,buy_product
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
    path('products/list/', product_list_farmer, name='product_list_farmer'),
    path("farmer/dashboard/", farmer_dashboard, name="farmer_dashboard"),
    path("buyer/dashboard/", buyer_dashboard, name="buyer_dashboard"),
    path("buyer/dashboard/productshow/",buyer_dashboard, name="product_show"),
    path("default/dashboard/", default_dashboard, name="default_dashboard"),
    path("role_selection/", role_selection_view, name="role_selection_view"),
    path('farmer/transactions/download/', download_transaction_pdf, name='download_transaction_pdf'),
    path('farmer/account/', farmer_account, name='farmer_account'),
    path('category/<str:category>/', category_products, name='category_products'),
    path('addtocart/', add_to_cart, name='add_to_cart'),
    path('buy/product/', buy_product, name='buy_product'),
    path('viewcart/', view_cart, name='view_cart'),
    path('account/', account, name='account'),
    path('crop/<str:crop_name>/', crop_detail_view, name='crop_detail_view'),
    path('search-products/', search_results, name='search_results'),
    path('product/<int:id>/', product_detail, name='product_detail'),
    path('negotiate/<int:product_id>/', negotiate_product, name='negotiate_product'),
    path('negotiation/reply/<int:message_id>/', send_negotiation_reply, name='send_negotiation_reply'),
    path('negotiation/inbox/', negotiation_inbox, name='negotiation_inbox'),
    path('product/marketplace/<int:product_id>/', view_marketplace_product, name='view_marketplace_product'),
    path('monitor/negotiations/', monitor_negotiations, name='monitor_negotiations')

]
