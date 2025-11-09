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




