from django.contrib.auth.models import AbstractUser
from django.conf import settings

from django.db import models

# Create your models here.
class Role(models.Model):
    name = models.CharField(max_length=15, unique=True)
    
    def __str__(self):
        return self.name
    
class CustomUser(AbstractUser):
    phone_number = models.CharField(max_length=15,unique=True)  
    roles = models.ManyToManyField(Role, related_name="users")
    
    def __str__(self):
        return f" Username: {self.username}, Email: {self.email}, Phone: {self.phone_number}, roles: {', '.join(role.name for role in self.roles.all())}"
    
class product_farmer(models.Model):
    productName = models.CharField(max_length=50)
    price = models.IntegerField()
    quantity = models.IntegerField()
    description = models.TextField()
    images = models.ImageField(upload_to='product_images/')
    product_vedio = models.FileField(upload_to='product_vedios/',null=True,blank=True)
    uploaded_at = models.DateTimeField(auto_now_add=True)
    product_farmer = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)  
    def __str__(self):
        return f"Product Name: {self.productName}, Price: {self.price}, Quantity: {self.quantity}, Description: {self.description}, Farmer: {self.product_farmer}"
    
class product_show(models.Model):
    productName = models.CharField(max_length=50)
    price = models.IntegerField()
    quantity = models.IntegerField()
    description = models.TextField()
    images = models.ImageField(upload_to='product_images/')
    product_vedio = models.FileField(upload_to='product_vedios/',null=True,blank=True)
    uploaded_at = models.DateTimeField(auto_now_add=True)
    product_farmer = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)  
    def __str__(self):
        return f"Product Name: {self.productName}, Price: {self.price}, Quantity: {self.quantity}, Description: {self.description}, Farmer: {self.product_farmer}"
