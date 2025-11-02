from django.contrib.auth import authenticate
from django.contrib.auth.hashers import make_password
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.tokens import RefreshToken
from django.utils import timezone
from django.core.mail import send_mail
from django.utils.crypto import get_random_string
from datetime import timedelta

from .models import CustomUser
from .serializers import RegisterSerializer, UserTypeSerializer

# OTP storage dictionary for demo (replace with DB/cache for production)
OTP_STORE = {}

# Registration view
class RegisterView(generics.CreateAPIView):
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]

    def perform_create(self, serializer):
        password = serializer.validated_data['password']
        serializer.save(password=make_password(password))

# OTP generation view
class OTPGenerateView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        email = request.data.get('email')
        if not email:
            return Response({'error': "Email is required"}, status=status.HTTP_400_BAD_REQUEST)

        otp = get_random_string(length=6, allowed_chars='0123456789')
        expiry = timezone.now() + timedelta(minutes=10)
        OTP_STORE[email] = {'otp': otp, 'expiry': expiry}

        send_mail(
            'Your Agribazaar OTP Code',
            f'Your OTP code is {otp}. It is valid for 10 minutes.',
            'no-reply@agribazaar.com',
            [email],
            fail_silently=False,
        )
        return Response({"message": f"OTP sent to {email}"}, status=status.HTTP_200_OK)

# OTP verification view
class OTPVerifyView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        email = request.data.get('email')
        otp = request.data.get('otp')

        if not email or not otp:
            return Response({'error': 'Email and OTP are required'}, status=status.HTTP_400_BAD_REQUEST)

        record = OTP_STORE.get(email)
        if not record:
            return Response({'error': 'No OTP requested for this email'}, status=status.HTTP_400_BAD_REQUEST)

        if record['otp'] != otp:
            return Response({'error': 'Invalid OTP'}, status=status.HTTP_400_BAD_REQUEST)

        if timezone.now() > record['expiry']:
            return Response({'error': 'OTP expired'}, status=status.HTTP_400_BAD_REQUEST)

        # OTP valid, delete from store
        del OTP_STORE[email]

        return Response({'message': 'OTP verified successfully'}, status=status.HTTP_200_OK)


# Login handled by JWT views (urls.py):
# path('login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),

# Google OAuth token handler
class GoogleOAuthLoginView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        token = request.data.get('token')
        # TODO: Verify token with Google API here

        google_info = {
            'email': 'user@example.com',
            'first_name': 'John',
            'last_name': 'Doe',
            'google_id': 'google_unique_id_123',
        }

        try:
            user = CustomUser.objects.get(email=google_info['email'])
        except CustomUser.DoesNotExist:
            user = CustomUser.objects.create(
                username=google_info['email'],
                email=google_info['email'],
                first_name=google_info['first_name'],
                last_name=google_info['last_name'],
                user_type=None
            )
            user.set_unusable_password()
            user.save()

        refresh = RefreshToken.for_user(user)

        return Response({
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'user_type': user.user_type
        })

# Update user type after login
class UpdateUserTypeView(generics.UpdateAPIView):
    serializer_class = UserTypeSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user

# Role-specific dashboard views
class FarmerDashboardView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        if request.user.user_type not in ('farmer', 'both'):
            return Response({"detail": "Unauthorized"}, status=status.HTTP_403_FORBIDDEN)
        return Response({"dashboard": "Farmer dashboard data"})

class BuyerDashboardView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        if request.user.user_type not in ('buyer', 'both'):
            return Response({"detail": "Unauthorized"}, status=status.HTTP_403_FORBIDDEN)
        return Response({"dashboard": "Buyer dashboard data"})

class CombinedDashboardView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        if request.user.user_type != 'both':
            return Response({"detail": "Unauthorized"}, status=status.HTTP_403_FORBIDDEN)
        return Response({"dashboard": "Combined farmer and buyer dashboard data"})
