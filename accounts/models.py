from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils import timezone
from datetime import timedelta

class CustomUser(AbstractUser):
    ROLE_CHOICES = (
        ('farmer', 'Farmer'),
        ('buyer', 'Buyer'),
        ('both', 'Both'),
    )

    email = models.EmailField(unique=True)

    role = models.CharField(
        max_length=10,
        choices=ROLE_CHOICES,
        null=True,        # allows role to be empty initially
        blank=True
    )

    # === New fields for OTP verification ===
    otp_code = models.CharField(max_length=6, null=True, blank=True)
    otp_created_at = models.DateTimeField(null=True, blank=True)
    is_verified = models.BooleanField(default=False)  # Set False until OTP verified

    # Optionally add a method to check if OTP is expired
    def is_otp_expired(self):
        if self.otp_created_at:
            return timezone.now() > self.otp_created_at + timedelta(minutes=15)
        return True  # Expired if no creation time

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["username"]

    def __str__(self):
        return self.email
