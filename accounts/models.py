from django.contrib.auth.models import AbstractUser
from django.db import models

# Create your models here.
class CustomUser(AbstractUser):
    phone_number = models.CharField(max_length=15,unique=True)
    
    def __str__(self):
        return f" Username: {self.username}, Email: {self.email}, Phone: {self.phone_number}"