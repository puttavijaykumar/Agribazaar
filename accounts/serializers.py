# accounts/serializers.py
from rest_framework import serializers
from django.contrib.auth.hashers import make_password
from .models import CustomUser
from django.contrib.auth import get_user_model
import secrets
from .models import Product
from .models import RecentlyViewed, Wishlist
from .models import Order,OrderItem
from .models import Cart,CartItem
from .models import Notification
from .models import UserSettings
from .models import RewardTransaction
from .models import AdminCatalogProduct

from .models import Address


class RegisterSerializer(serializers.ModelSerializer):
    password2 = serializers.CharField(write_only=True)

    class Meta:
        model = CustomUser
        fields = ["username", "email", "password", "password2"]

    def validate(self, attrs):
        if attrs["password"] != attrs["password2"]:
            raise serializers.ValidationError({"password": "Passwords do not match"})
        return attrs

    def create(self, validated_data):
        validated_data.pop("password2")
        user = CustomUser.objects.create(
            username=validated_data["username"],
            email=validated_data["email"],
            password=make_password(validated_data["password"])
        )
        user.is_active = True  # ✅ No OTP needed
        user.save()
        return user


User = get_user_model()

class GoogleAuthSerializer(serializers.Serializer):
    email = serializers.EmailField()
    name = serializers.CharField(required=False, allow_blank=True)

    def validate(self, attrs):
        email = attrs.get("email")
        name = attrs.get("name") or email.split("@")[0]

        #  Generate random password manually
        random_password = secrets.token_urlsafe(16)

        user, created = User.objects.get_or_create(
            email=email,
            defaults={
                "username": name,
                "password": make_password(random_password),
                "is_active": True,
            }
        )

        attrs["user"] = user
        return attrs

class RoleUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ["role"]


class ProductSerializer(serializers.ModelSerializer):
    owner = serializers.ReadOnlyField(source='owner.email')  # Show owner's email

    class Meta:
        model = Product
        fields = [
            'id',
            'name',
            'price',
            'description',
            'quantity',
            'image1',
            'image2',
            'image3',
            'image4',
            'validity_days',
            'owner',
            'created_at',
            'updated_at',
        ]
        read_only_fields = ['owner', 'created_at', 'updated_at']

    def create(self, validated_data):
        # Attach the user who created the product as owner automatically
        user = self.context['request'].user
        validated_data['owner'] = user
        return super().create(validated_data)
    
    
class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ["username", "email", "role",
                "home_name", "street", "village", "mandal", "district", "state", "pincode"]
        
        
        
class SalesByDateSerializer(serializers.Serializer):
    date = serializers.DateField()
    amount = serializers.DecimalField(max_digits=12, decimal_places=2)

class SalesByProductSerializer(serializers.Serializer):
    product__name = serializers.CharField()
    quantity = serializers.IntegerField()
    revenue = serializers.DecimalField(max_digits=12, decimal_places=2)

class SalesAnalyticsSerializer(serializers.Serializer):
    total_sales_amount = serializers.DecimalField(max_digits=14, decimal_places=2)
    sales_count = serializers.IntegerField()
    by_date = SalesByDateSerializer(many=True)
    by_product = SalesByProductSerializer(many=True)


# Reuse your existing ProductSerializer for product details
class ProductSerializer(serializers.ModelSerializer):
    owner = serializers.ReadOnlyField(source='owner.email')

    class Meta:
        model = Product
        fields = [
            'id', 'name', 'price', 'description', 'quantity',
            'image1', 'image2', 'image3', 'image4',
            'validity_days', 'owner', 'created_at', 'updated_at',
        ]
        read_only_fields = ['owner', 'created_at', 'updated_at']


# Recently Viewed Serializer - show product and viewed date
class RecentlyViewedSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)

    class Meta:
        model = RecentlyViewed
        fields = ['product', 'viewed_at']


# Wishlist Serializer - show product and date added
class WishlistSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)

    class Meta:
        model = Wishlist
        fields = ['product', 'added_at']


# Recommended Serializer - can reuse ProductSerializer or extend if needed
class RecommendedSerializer(serializers.ModelSerializer):
    owner = serializers.ReadOnlyField(source='owner.email')

    class Meta:
        model = Product
        fields = ProductSerializer.Meta.fields


# Top Sellers Serializer - include user info and aggregate sales
class TopSellerSerializer(serializers.ModelSerializer):
    total_quantity_sold = serializers.IntegerField()
    email = serializers.EmailField(source='email')

    class Meta:
        model = CustomUser
        fields = ['id', 'username', 'email', 'total_quantity_sold']
        
        
class OrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderItem
        fields = '__all__'

class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    class Meta:
        model = Order
        fields = '__all__'

# added for Cart and CartItem models
class CartItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = CartItem
        fields = '__all__'

class CartSerializer(serializers.ModelSerializer):
    items = CartItemSerializer(many=True, read_only=True)
    class Meta:
        model = Cart
        fields = '__all__'

# Notification Serializer
class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = '__all__'


class UserSettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserSettings
        exclude = ['user']  # user is set automatically from request

    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)
    
    
class RewardTransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = RewardTransaction
        fields = ['id', 'points', 'description', 'created_at']
        
class AddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = Address
        fields = '__all__'
        read_only_fields = ['user']

    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)
    
    
class AdminCatalogProductSerializer(serializers.ModelSerializer):
    # Add computed fields
    discounted_price = serializers.SerializerMethodField()
    offer_label = serializers.SerializerMethodField()
    
    class Meta:
        model = AdminCatalogProduct
        fields = [
            'id',
            'name',
            'price',
            'discounted_price',
            'description',
            'category',
            'offer_category',
            'offer_label',
            'image1',
            'image2',
            'image3',
            'image4',
            'stock',
            'is_featured',
            'discount_percent',
            'farmer_name',
            'farmer_location',
            'warranty_period',
            'fertilizer_type',
            'created_at',
            'updated_at',
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
    
    def get_discounted_price(self, obj):
        """Calculate price after discount"""
        if obj.discount_percent:
            discounted = float(obj.price) * (1 - obj.discount_percent / 100)
            return round(discounted, 2)
        return float(obj.price)
    
    def get_offer_label(self, obj):
        """Get formatted offer label"""
        labels = {
            'flash_deal': 'Flash Deal',
            'seasonal': 'Seasonal',
            'limited_stock': 'Limited Stock',
            'trending': 'Trending',
            'none': 'Regular'
        }
        return labels.get(obj.offer_category, 'Product')