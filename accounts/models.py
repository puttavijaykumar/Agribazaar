from django.contrib.auth.models import AbstractUser
from django.conf import settings
from django.contrib.auth.models import User
from django.db import models
from django.db.models.signals import post_save
from django.dispatch import receiver


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
    
    @property
    def is_farmer(self):
        return self.roles.filter(name="farmer").exists()
    
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
    
@receiver(post_save, sender=CustomUser)
def create_farmer_wallet(sender, instance, created, **kwargs):
    if created:  # Only create a wallet when a new user is created
        if instance.is_farmer:  # Assuming you have a field to differentiate farmers
            FarmerWallet.objects.create(farmer=instance) 
            
class FarmerWallet(models.Model):
    farmer = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    balance = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    pending_balance = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    withdrawn_balance = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)

class Transaction(models.Model):
    farmer = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    order_id = models.CharField(max_length=20)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=20, choices=[('Pending', 'Pending'), ('Completed', 'Completed')])
    date = models.DateTimeField(auto_now_add=True)

class PayoutRequest(models.Model):
    farmer = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=20, choices=[('Pending', 'Pending'), ('Approved', 'Approved'), ('Rejected', 'Rejected')])
    request_date = models.DateTimeField(auto_now_add=True)