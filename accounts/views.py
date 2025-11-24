# accounts/views.py
from rest_framework.response import Response
from rest_framework import generics, status
from django.contrib.auth import authenticate
from .serializers import RegisterSerializer
from .models import CustomUser
from rest_framework.views import APIView
from django.contrib.auth import get_user_model, login
from django.contrib.auth.hashers import make_password
from .serializers import GoogleAuthSerializer,RoleUpdateSerializer
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import CustomUser
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes,authentication_classes
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.authentication import JWTAuthentication

from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.utils.encoding import force_bytes, force_str
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.core.mail import send_mail
from django.contrib.auth import get_user_model
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
# from utils.email_sender import send_email
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes, force_str
from django.contrib.auth.tokens import default_token_generator as token_generator
from django.contrib.auth import get_user_model


import os
from django.core.mail import send_mail
from django.contrib.auth.tokens import PasswordResetTokenGenerator
import secrets
from django.utils import timezone
from datetime import timedelta
from .serializers import ProductSerializer
from rest_framework import viewsets, permissions
from .models import Product
from .models import Sale
from .serializers import UserProfileSerializer
from rest_framework import filters
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser

        
from .serializers import SalesAnalyticsSerializer
from django.db.models import Sum
from django.db.models.functions import TruncDate

from .serializers import OrderItemSerializer,OrderSerializer
from .models import Order,OrderItem
from .serializers import CartItemSerializer,CartSerializer
from .models import Cart,CartItem
from .models import Notification
from .serializers import NotificationSerializer

from .models import UserSettings
from .serializers import UserSettingsSerializer
from rest_framework.generics import RetrieveUpdateAPIView

from .models import RewardTransaction
from .serializers import RewardTransactionSerializer
from rest_framework.generics import ListAPIView

from .models import Address
from .serializers import AddressSerializer
from rest_framework.generics import ListAPIView
from django_filters.rest_framework import DjangoFilterBackend

from .models import AdminCatalogProduct
from .serializers import AdminCatalogProductSerializer

User = get_user_model()
token_generator = PasswordResetTokenGenerator()


# User Registration View
class RegisterView(generics.CreateAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = RegisterSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save(is_verified=False)

        # Generate OTP, save and email
        otp_code = generate_otp()
        user.otp_code = otp_code
        user.otp_created_at = timezone.now()
        user.save()

        send_mail(
            subject="Your AgriBazaar Registration OTP",
            message=f"Your OTP code for AgriBazaar registration is: {otp_code}\nValid for 15 minutes.",
            from_email=os.getenv('EMAIL_HOST_USER'),
            recipient_list=[user.email],
            fail_silently=False,
        )

        return Response({"message": "Registration successful. Please enter the OTP sent to your email."}, status=201)
    
    
    
    
def generate_otp():
    return f"{secrets.randbelow(900000) + 100000}"

@api_view(['POST'])
def verify_otp(request):
    email = request.data.get("email")
    otp_code = request.data.get("otp")

    try:
        user = User.objects.get(email=email)
        if not user.otp_code or not user.otp_created_at:
            return Response({"error": "No OTP requested. Register again."}, status=400)
        if timezone.now() - user.otp_created_at > timedelta(minutes=15):
            return Response({"error": "OTP expired. Register again."}, status=400)
        if user.otp_code != otp_code:
            return Response({"error": "Incorrect OTP."}, status=400)

        user.is_verified = True
        user.otp_code = None
        user.otp_created_at = None
        user.save()
        return Response({"message": "OTP verified! You can now log in."}, status=200)
    except User.DoesNotExist:
        return Response({"error": "User not found."}, status=404)

# Login Via Email and Password
class LoginView(generics.GenericAPIView):
    def post(self, request):
        email = request.data.get("email")
        password = request.data.get("password")

        user = authenticate(request, email=email, password=password)

        if user is None:
            return Response({"detail": "Invalid email or password"}, status=400)

        if not user.is_verified:
            return Response({"detail": "Email not verified. Please verify OTP sent to your email."}, status=403)

        refresh = RefreshToken.for_user(user)

        return Response({
            "refresh": str(refresh),
            "access": str(refresh.access_token),
            "email": user.email,
            "username": user.username,
            "role": user.role
        }, status=200)


User = get_user_model()
token_generator = PasswordResetTokenGenerator()

@api_view(['POST'])
def password_reset_request(request):
    email = request.data.get("email")
    if not email:
        return Response({"error": "Email is required"}, status=400)

    try:
        user = User.objects.get(email=email)
    except User.DoesNotExist:
        # Never reveal user existence for security
        return Response({"message": "If the email exists, reset link will be sent."}, status=200)

    uid = urlsafe_base64_encode(force_bytes(user.pk))
    token = token_generator.make_token(user)

    # Use environment variable for frontend base URL (set on Vercel)
    frontend_url = os.getenv('FRONTEND_URL', 'https://agribazaar-frontend-ui.vercel.app')
    reset_url = f"{frontend_url}/reset-password/{uid}/{token}"

    subject = "Reset Your AgriBazaar Password"
    html_content = f"""
    <h2>🔐 Password Reset Request</h2>
    <p>You recently requested to reset your password.</p>
    <p>Click the button below to reset your password:</p>
    <a href="{reset_url}" style="padding: 10px 18px; background:#2d8e4a; color:white; text-decoration:none; border-radius:6px;">
        Reset Password
    </a>
    <br><br>
    <p>If you did not request this, please ignore this email.</p>
    """

    try:
        send_mail(
            subject=subject,
            message='',
            from_email=os.getenv('EMAIL_HOST_USER'),
            recipient_list=[email],
            html_message=html_content,
            fail_silently=False,
        )
    except Exception as e:
        return Response({"error": f"Failed to send email: {str(e)}"}, status=500)

    return Response({"message": "✅ Password reset link sent to email"}, status=200)


@api_view(['POST'])
def password_reset_confirm(request, uid, token):
    password = request.data.get("password")
    if not password:
        return Response({"error": "Password required"}, status=400)

    try:
        user_id = force_str(urlsafe_base64_decode(uid))
        user = User.objects.get(pk=user_id)
    except:
        return Response({"error": "Invalid link"}, status=400)

    if not token_generator.check_token(user, token):
        return Response({"error": "Invalid or expired token"}, status=400)

    user.set_password(password)
    user.save()

    return Response({"message": "Password reset successful!"}, status=200)

        
@api_view(['POST'])
def google_login(request):
    serializer = GoogleAuthSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    user = serializer.validated_data['user']

    refresh = RefreshToken.for_user(user)

    return Response({
        "refresh": str(refresh),
        "access": str(refresh.access_token),
        "email": user.email,
        "username": user.username,
        "role": user.role  
    })
    
    

@api_view(['POST'])
@authentication_classes([JWTAuthentication])   # ✅ Important
@permission_classes([IsAuthenticated])
def set_role(request):
    serializer = RoleUpdateSerializer(instance=request.user, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response({"role": serializer.data["role"]})
    return Response(serializer.errors, status=400)



@api_view(['GET', 'PUT'])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def user_profile(request):
    user = request.user
    if request.method == "GET":
        serializer = UserProfileSerializer(user)
        return Response(serializer.data)

    elif request.method == "PUT":
        serializer = UserProfileSerializer(user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# View function to list his uploaded products
class MyProductListView(ListAPIView):
    serializer_class = ProductSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Product.objects.filter(owner=self.request.user).order_by('-created_at')

# Categorizing the products

def infer_category(name, description):
    text = f"{name} {description}".lower()
    # Map keywords to top-level categories from your dropdown
    if any(word in text for word in [
        "wheat", "rice", "barley", "maize", "corn", "millet", "sorghum", "oats",
        "grain", "paddy", "basmati", "boiled rice", "dal", "chana", "gram", "moong", "masoor",
        "groundnut", "sunflower", "mustard", "flax", "sesame", "soybean", "canola"
    ]):
        return "Grains"
    if any(word in text for word in ["turmeric", "chilli", "pepper", "cumin", "mustard", "coriander", "spice"]):
        return "Spices"
    if any(word in text for word in ["apple", "banana", "mango", "orange", "fruit", "lemon", "papaya", "berry"]):
        return "Fruits"
    if any(word in text for word in ["potato", "onion", "tomato", "cabbage", "veg", "spinach", "carrot", "cauliflower", "okra"]):
        return "Vegetables"
    if any(word in text for word in ["milk", "cheese", "butter", "paneer", "dairy", "yogurt", "curd", "ghee"]):
        return "Dairy"
    if any(word in text for word in ["seed", "seeds", "hybrid"]):
        if any(word in text for word in ["groundnut", "sunflower", "mustard", "flax", "sesame", "soybean", "canola"]):
            return "Seeds"
    if any(word in text for word in ["tractor", "harvester", "sprayer", "tools", "plough", "machinery", "equipment", "pump", "motor"]):
        return "Machinery"
    return "Uncategorized"

# Farmer products uploading function
class ProductViewSet(viewsets.ModelViewSet):
    serializer_class = ProductSerializer
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser, JSONParser]
    filter_backends = [filters.SearchFilter, DjangoFilterBackend]
    filterset_fields = ['category']
    search_fields = ['name', 'description']


    def get_queryset(self):
        # Return products owned by logged-in user only
        return Product.objects.all().order_by('-created_at')
    
    def perform_create(self, serializer):
        name = self.request.data.get("name", "")
        description = self.request.data.get("description", "")
        category = infer_category(name, description)
        serializer.save(owner=self.request.user, category=category)

        
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def sales_analytics(request):
    user = request.user
    date_from = request.GET.get("from")
    date_to = request.GET.get("to")

    sales = Sale.objects.filter(owner=user)
    if date_from and date_to:
        sales = sales.filter(created_at__date__gte=date_from, created_at__date__lte=date_to)

    total_sales_amount = sales.aggregate(total=Sum("total"))["total"] or 0
    sales_count = sales.count()

    # Sales grouped by date
    by_date = (
        sales
        .annotate(date=TruncDate('created_at'))
        .values('date')
        .annotate(amount=Sum('total'))
        .order_by('date')
    )

    # Sales by product
    by_product = (
        sales
        .values("product__name")
        .annotate(quantity=Sum("quantity"), revenue=Sum("total"))
        .order_by("-revenue")
    )

    data = {
        "total_sales_amount": total_sales_amount,
        "sales_count": sales_count,
        "by_date": list(by_date),
        "by_product": list(by_product),
    }

    serializer = SalesAnalyticsSerializer(data)
    return Response(serializer.data)


# Recently Viewed Products
class RecentlyViewedListView(generics.ListAPIView):
    serializer_class = ProductSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        # Assuming a RecentlyViewed model linking user to products with timestamp
        return Product.objects.filter(
            recentlyviewed__user=user
        ).order_by('-recentlyviewed__viewed_at').distinct()


# Wishlist Products
class WishlistListView(generics.ListAPIView):
    serializer_class = ProductSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        # Assuming a Wishlist model linking user to products
        return Product.objects.filter(
            wishlist__user=user
        ).order_by('-wishlist__added_at')


# Recommended Products
class RecommendedListView(generics.ListAPIView):
    serializer_class = ProductSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        # For now, return latest products as placeholder for recommender logic
        return Product.objects.order_by('-created_at')[:20]


# Top Sellers
class TopSellersListView(generics.ListAPIView):
    serializer_class = ProductSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        # Aggregate sales grouped by owner, order desc by quantity sold
        # Return limited sellers' products for top sellers
        top_sellers = (
            Product.objects.values('owner')
            .annotate(total_quantity=Sum('sale__quantity'))
            .order_by('-total_quantity')
            .values_list('owner', flat=True)
        )
        # Return products of those top sellers (owners)
        return Product.objects.filter(owner__in=top_sellers[:10])


# New Arrivals
class NewArrivalsListView(generics.ListAPIView):
    serializer_class = ProductSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        # Filter products by created_at recent first, limit 20
        return Product.objects.order_by('-created_at')[:20]


# Seasonal Picks
class SeasonalPicksListView(generics.ListAPIView):
    serializer_class = ProductSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        # Filter products with seasonal picks tag or flag; here assuming filter by name for demo
        return Product.objects.filter(name__icontains='seasonal').order_by('-created_at')[:20]
    
    
class OrderListView(generics.ListAPIView):
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]
    def get_queryset(self):
        return Order.objects.filter(user=self.request.user)

class OrderDetailView(generics.RetrieveAPIView):
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]
    queryset = Order.objects.all()
    
# Cart Views
class CartDetailView(generics.RetrieveAPIView):
    serializer_class = CartSerializer
    permission_classes = [permissions.IsAuthenticated]
    def get_object(self):
        return Cart.objects.get(user=self.request.user)


# Notification Views can be added similarly
class NotificationListView(generics.ListAPIView):
    serializer_class = NotificationSerializer
    permission_classes = [permissions.IsAuthenticated]
    def get_queryset(self):
        return Notification.objects.filter(user=self.request.user)

# User Settings View
class UserSettingsView(RetrieveUpdateAPIView):
    serializer_class = UserSettingsSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        settings, _ = UserSettings.objects.get_or_create(user=self.request.user)
        return settings

# Reward Points and Transactions Views
class RewardPointsSummaryView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        points = RewardTransaction.objects.filter(user=request.user).aggregate(total=Sum('points'))['total'] or 0
        return Response({'reward_points': points})

class RewardTransactionListView(ListAPIView):
    serializer_class = RewardTransactionSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return RewardTransaction.objects.filter(user=self.request.user).order_by('-created_at')
    
    
class AddressListCreateView(generics.ListCreateAPIView):
    serializer_class = AddressSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Address.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class AddressDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = AddressSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Address.objects.filter(user=self.request.user)
    


class AdminCatalogProductViewSet(viewsets.ModelViewSet):
    queryset = AdminCatalogProduct.objects.all()
    serializer_class = AdminCatalogProductSerializer
    filterset_fields = ['category']
    filter_backends = [DjangoFilterBackend]

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [permissions.AllowAny()]
        return [permissions.IsAdminUser()]