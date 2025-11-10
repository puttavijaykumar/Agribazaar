# accounts/serializers.py
from rest_framework import serializers
from django.contrib.auth.hashers import make_password
from .models import CustomUser
from django.contrib.auth import get_user_model
import secrets
from .models import Product


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