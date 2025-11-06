# accounts/serializers.py
from rest_framework import serializers
from django.contrib.auth.hashers import make_password
from .models import CustomUser
from django.contrib.auth import get_user_model

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
        email = attrs.get('email')
        name = attrs.get('name') or email.split("@")[0]

        # ✅ Create user if does not exist
        user, created = User.objects.get_or_create(
            email=email,
            defaults={
                "username": name,
                "password": make_password(User.objects.make_random_password()),
                "is_active": True,
            }
        )

        attrs['user'] = user
        return attrs

class RoleUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ["role"]
