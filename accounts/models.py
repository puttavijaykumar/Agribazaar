from django.contrib.auth.models import AbstractUser
from django.db import models
import uuid
from datetime import datetime, timedelta

class CustomUser(AbstractUser):
    email = models.EmailField(unique=True)
    is_email_verified = models.BooleanField(default=False)
    email_otp = models.CharField(max_length=6, blank=True, null=True)
    otp_created_at = models.DateTimeField(blank=True, null=True)

    def __str__(self):
        return self.username

    def create_otp(self):
        import random
        otp = str(random.randint(100000, 999999))
        self.email_otp = otp
        self.otp_created_at = datetime.now()
        self.save()
        return otp

    def otp_is_valid(self):
        if self.otp_created_at:
            expiry_time = self.otp_created_at + timedelta(minutes=10)  # 10 mins expiry
            return datetime.now() <= expiry_time
        return False
