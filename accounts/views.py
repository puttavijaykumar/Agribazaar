from rest_framework.response import Response
from rest_framework import generics, status
from django.core.mail import send_mail
from django.utils import timezone
from datetime import timedelta
import random

from .models import CustomUser, OTP
from .serializers import RegisterSerializer

class RegisterView(generics.CreateAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = RegisterSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()

        # ✅ Return success so frontend can move to OTP page
        return Response(
            {"message": "User registered. Proceed to OTP verification.", "email": user.email},
            status=status.HTTP_201_CREATED,
        )


class SendOTPView(generics.GenericAPIView):

    def post(self, request):
        email = request.data.get("email")

        try:
            user = CustomUser.objects.get(email=email)
        except CustomUser.DoesNotExist:
            return Response({"error": "User not found"}, status=404)

        otp = random.randint(100000, 999999)

        OTP.objects.create(
            email=email,
            hashed_otp=str(otp),
            expires_at=timezone.now() + timedelta(minutes=5)
        )

        send_mail(
            "Your AgriBazaar OTP Code",
            f"Your OTP is: {otp} (valid for 5 minutes)",
            "no-reply-agribazaar@gmail.com",
            [email]
        )

        return Response({"message": "OTP sent successfully"}, status=200)


class VerifyOtpView(generics.GenericAPIView):
    def post(self, request):
        email = request.data.get("email")
        otp_input = request.data.get("otp")

        try:
            otp_obj = OTP.objects.filter(email=email).latest("created_at")
        except OTP.DoesNotExist:
            return Response({"error": "No OTP found"}, status=400)

        if otp_obj.expires_at < timezone.now():
            return Response({"error": "OTP expired"}, status=400)

        if otp_obj.hashed_otp != otp_input:
            return Response({"error": "Invalid OTP"}, status=400)

        user = CustomUser.objects.get(email=email)
        user.is_active = True
        user.save()

        return Response({"message": "OTP verified successfully"}, status=200)
