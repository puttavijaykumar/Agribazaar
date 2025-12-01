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

from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from .models import AdminCatalogProduct
from .serializers import AdminCatalogProductSerializer

from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from rest_framework.views import APIView
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
        "canola"
    ]):
        return "Grains"
    if any(word in text for word in ["turmeric", "chilli", "pepper", "cumin", "coriander", "spice"]):
        return "Spices"
    if any(word in text for word in ["apple", "banana", "mango", "orange", "fruit", "lemon", "papaya", "Pomegranate","Guava","Strawberries","berry"]):
        return "Fruits"
    if any(word in text for word in ["potato", "onion", "tomato", "cabbage", "veg", "spinach", "carrot", "cauliflower", "okra", "brinjal","Chillies", "cucumber", "pumpkin", "beans"]):
        return "Vegetables"
    if any(word in text for word in ["milk", "cheese", "butter", "paneer", "dairy", "yogurt", "curd", "ghee"]):
        return "Dairy"
    if any(word in text for word in [
        "cow", "buffalo", "goat","goats","sheep", "calf", "bull", "heifer",
        "poultry", "chicken", "broiler", "layer", "duck", "quail",
        "farm animal", "livestock","hf","jersey", "sahiwal", "desi", "indigenous", "desi cow", "indigenous cow", "indigenous cattle","hen","bull"
    ]):
        return "Farm Animals"
    if any(word in text for word in [
        "organic",
        "bio",
        "natural farming",
    ]):
        return "Organic Products"
    if any(word in text for word in [
        "almond", "badam", "cashew", "kaju", "raisin", "kishmish",
        "walnut", "pista", "pistachio", "apricot", "dates", "anjeer",
        "dry fruit", "dry fruits"
    ]):
        return "Dry Fruits"
    
    if any(word in text for word in [
        "groundnut", "peanut", "sunflower", "mustard", "flax",
        "sesame", "til", "soybean", "soya", "canola", "niger",
        "groundnut oil", "sunflower oil", "mustard oil", "sesame oil","sesame",
        "soybean oil","oil","oils","groundnut seeds","sunflower seeds","mustard seeds","sesame seeds","soybean seeds","seed","seeds","flax seeds"
    ]):
        return "Oilseeds"
    
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
    """
    ViewSet for managing admin catalog products
    """
    # queryset = AdminCatalogProduct.objects.all()
    serializer_class = AdminCatalogProductSerializer
    
    # Enable filtering and searching
    filterset_fields = ['category', 'offer_category']
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    search_fields = ['name', 'description', 'farmer_name']
    ordering_fields = ['price', 'discount_percent', 'created_at']
    ordering = ['-created_at']

    def get_queryset(self):
        """
        Override queryset to exclude Top Offers from regular category filters
        """
        queryset = AdminCatalogProduct.objects.all()
        category = self.request.query_params.get('category', None)
        
        # If filtering by category and it's not "Top Offers", exclude Top Offers from results
        if category and category != "Top Offers":
            queryset = queryset.filter(category=category).exclude(category="Top Offers")
        
        return queryset

    def get_permissions(self):
        """
        Allow anyone to list/retrieve, but only admins can create/update/delete
        """
        if self.action in ['list', 'retrieve']:
            return [permissions.AllowAny()]
        return [permissions.IsAdminUser()]
    
    # Custom action for top offers
    @action(detail=False, methods=['get'], permission_classes=[permissions.AllowAny])
    def top_offers(self, request):
        """
        Get all products in Top Offers category with featured status
        """
        products = AdminCatalogProduct.objects.filter(
            category="Top Offers",
            is_featured=True
        ).order_by('-discount_percent')[:8]
        
        serializer = self.get_serializer(products, many=True)
        return Response(serializer.data)
    
    # Custom action for flash deals
    @action(detail=False, methods=['get'], permission_classes=[permissions.AllowAny])
    def flash_deals(self, request):
        """
        Get all Flash Deal products
        """
        products = AdminCatalogProduct.objects.filter(
            category="Top Offers",
            offer_category='flash_deal',
            is_featured=True
        ).order_by('-discount_percent')[:8]
        
        serializer = self.get_serializer(products, many=True)
        return Response(serializer.data)
    
    # Custom action for seasonal offers
    @action(detail=False, methods=['get'], permission_classes=[permissions.AllowAny])
    def seasonal_offers(self, request):
        """
        Get all Seasonal Offer products
        """
        products = AdminCatalogProduct.objects.filter(
            category="Top Offers",
            offer_category='seasonal',
            is_featured=True
        ).order_by('-created_at')[:8]
        
        serializer = self.get_serializer(products, many=True)
        return Response(serializer.data)
    
    # Custom action for limited stock
    @action(detail=False, methods=['get'], permission_classes=[permissions.AllowAny])
    def limited_stock(self, request):
        """
        Get all Limited Stock products with low inventory
        """
        products = AdminCatalogProduct.objects.filter(
            category="Top Offers",
            offer_category='limited_stock',
            is_featured=True,
            stock__lt=20  # Stock less than 20
        ).order_by('stock')[:8]
        
        serializer = self.get_serializer(products, many=True)
        return Response(serializer.data)
    
    # Custom action for trending
    @action(detail=False, methods=['get'], permission_classes=[permissions.AllowAny])
    def trending(self, request):
        """
        Get all Trending products
        """
        products = AdminCatalogProduct.objects.filter(
            category="Top Offers",
            offer_category='trending',
            is_featured=True
        ).order_by('-created_at')[:10]
        
        serializer = self.get_serializer(products, many=True)
        return Response(serializer.data)
    
    # Custom action for category-specific products
    @action(detail=False, methods=['get'], permission_classes=[permissions.AllowAny])
    def by_category(self, request):
        """
        Get products by category
        Usage: /admin-products/by_category/?category=Seeds
        """
        category = request.query_params.get('category', None)
        
        if not category:
            return Response(
                {"error": "category parameter is required"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        products = AdminCatalogProduct.objects.filter(
            category=category
        ).order_by('-created_at')
        
        serializer = self.get_serializer(products, many=True)
        return Response(serializer.data)


class TopOffersAPIView(APIView):
    """
    Standalone API view for fetching top offers
    """
    def get(self, request):
        try:
            # Fetch ONLY products with category = "Top Offers"
            products = AdminCatalogProduct.objects.filter(
                category="Top Offers",
                is_featured=True
            ).order_by('-discount_percent')[:8]
            
            result = []
            for p in products:
                original_price = float(p.price)
                discount_percent = p.discount_percent or 0
                discounted_price = original_price * (1 - discount_percent / 100)
                
                # Offer type labels without emojis
                offer_labels = {
                    'flash_deal': 'Flash Deal',
                    'seasonal': 'Seasonal',
                    'limited_stock': 'Limited Stock',
                    'trending': 'Trending',
                    'none': 'Top Offer'
                }
                
                result.append({
                    "id": p.id,
                    "title": p.name,
                    "desc": p.description,
                    "img": p.image1.url if p.image1 else "",
                    "discount": f"{discount_percent}%",
                    "originalPrice": original_price,
                    "discountedPrice": round(discounted_price, 2),
                    "farmer": p.farmer_name or 'Unknown Farmer',
                    "location": p.farmer_location or 'India',
                    "stock": p.stock,
                    "offerType": offer_labels.get(p.offer_category, 'Top Offer'),
                    "category": p.category,
                })
            
            return Response(result, status=status.HTTP_200_OK)
        
        except Exception as e:
            return Response(
                {"error": "Failed to fetch top offers", "detail": str(e)}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class CategoryProductsAPIView(APIView):
    """
    Get products by specific category (Seeds, Fertilizers, Tools, Equipment, Irrigation)
    NOT including Top Offers
    """
    def get(self, request, category=None):
        try:
            if not category:
                return Response(
                    {"error": "Category is required"},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Reject if trying to access Top Offers through this endpoint
            if category == "Top Offers":
                return Response(
                    {"error": "Use /top-offers/ endpoint for top offers"},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Get products only from requested category
            products = AdminCatalogProduct.objects.filter(
                category=category
            ).order_by('-created_at')
            
            serializer = AdminCatalogProductSerializer(products, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        
        except Exception as e:
            return Response(
                {"error": "Failed to fetch products", "detail": str(e)}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class FeaturedProductsAPIView(APIView):
    """
    Get all featured products (both Top Offers and regular categories)
    """
    def get(self, request):
        try:
            products = AdminCatalogProduct.objects.filter(
                is_featured=True
            ).order_by('-discount_percent')[:15]
            
            serializer = AdminCatalogProductSerializer(products, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        
        except Exception as e:
            return Response(
                {"error": "Failed to fetch featured products", "detail": str(e)}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

from rest_framework import status
import requests

NEWS_API_URL = "https://newsapi.org/v2/everything"
NEWS_API_KEY = "f986edd1afe64a47988b934616f61f81"

class AgricultureNewsAPIView(APIView):
    def get(self, request):
        params = {
            "q": "farming agriculture",
            "apiKey": NEWS_API_KEY,
            "pageSize": 10,
            "language": "en",
        }
        try:
            response = requests.get(NEWS_API_URL, params=params)
            response.raise_for_status()
            data = response.json().get("articles", [])
            # Optionally filter fields for the frontend
            result = [
                {
                    "title": art.get("title"),
                    "url": art.get("url"),
                    "source": art.get("source", {}).get("name"),
                    "publishedAt": art.get("publishedAt"),
                    "description": art.get("description"),
                    "urlToImage": art.get("urlToImage"),
                }
                for art in data
            ]
            return Response(result)
        except Exception as e:
            return Response({"error": "Failed to fetch news", "detail": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
# Live Market Prices API View
class LiveMarketPriceAPIView(APIView):
    def get(self, request):
        api_key = "579b464db66ec23bdd0000018d6f8bafc93d4a3863116e69aee5d22b"
        limit = request.query_params.get("limit", 50)  # Default limit = 50
        try:
            url = f"https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070?api-key={api_key}&format=json&limit={limit}"
            response = requests.get(url)
            response.raise_for_status()
            data = response.json()
            # Optionally filter or format data
            return Response(data)
        except Exception as e:
            return Response(
                {"error": "Failed to fetch live market prices", "detail": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
