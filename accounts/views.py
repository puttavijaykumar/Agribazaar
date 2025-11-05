from rest_framework import generics, status
from rest_framework.response import Response
from django.core.mail import send_mail
from .models import CustomUser
from .serializers import RegisterSerializer
from rest_framework.views import APIView

class RegisterView(generics.CreateAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = RegisterSerializer

    def perform_create(self, serializer):
        user = serializer.save()
        # Generate OTP and send to user's email
        otp = user.create_otp()
        send_mail(
            subject="Your Agribazaar OTP Verification Code",
            message=f"Your OTP code is {otp}. It will expire in 10 minutes.",
            from_email=None,  # Uses DEFAULT_FROM_EMAIL
            recipient_list=[user.email],
            fail_silently=False,
        )

class VerifyOtpView(APIView):
    def post(self, request, *args, **kwargs):
        email = request.data.get("email")
        otp = request.data.get("otp")
        try:
            user = CustomUser.objects.get(email=email)
        except CustomUser.DoesNotExist:
            return Response({"detail": "User not found"}, status=status.HTTP_404_NOT_FOUND)

        if user.is_email_verified:
            return Response({"detail": "Email already verified"}, status=status.HTTP_400_BAD_REQUEST)

        if user.email_otp != otp:
            return Response({"detail": "Invalid OTP"}, status=status.HTTP_400_BAD_REQUEST)

        if not user.otp_is_valid():
            return Response({"detail": "OTP expired"}, status=status.HTTP_400_BAD_REQUEST)

        # Mark email as verified
        user.is_email_verified = True
        user.email_otp = ""
        user.otp_created_at = None
        user.save()

        return Response({"detail": "Email verified successfully"})
