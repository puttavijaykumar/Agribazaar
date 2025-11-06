# accounts/models.py
from django.contrib.auth.models import AbstractUser
from django.db import models

class CustomUser(AbstractUser):

    ROLE_CHOICES = (
        ('farmer', 'Farmer'),
        ('buyer', 'Buyer'),
        ('both', 'Both'),
    )

    email = models.EmailField(unique=True)

    # ✅ Role will be chosen after login
    role = models.CharField(
        max_length=10,
        choices=ROLE_CHOICES,
        null=True,        # allows role to be empty initially
        blank=True
    )

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["username"]

    def __str__(self):
        return self.email