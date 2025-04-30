from django.contrib.auth.models import AbstractUser
from django.conf import settings
from django.contrib.auth.models import User
from django.db import models
from django.db.models.signals import post_save
from django.dispatch import receiver
from cloudinary.models import CloudinaryField
from django import forms
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
    images = CloudinaryField('image', null=True, blank=True)
    product_vedio = CloudinaryField('video', null=True, blank=True)
    uploaded_at = models.DateTimeField(auto_now_add=True)
    product_farmer = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)  
    
    def is_valid_for_display(self):
        try:
            setting = self.negotiationsetting
            expiry_time = setting.get_expiry_datetime()
            return timezone.now() < expiry_time
        except:
            return True  # Show if no setting or error
        
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
    
class Offer(models.Model):
    product_type = models.CharField(max_length=100)
    discount = models.IntegerField()  # percentage
    description = models.TextField()
    active = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.product_type} - {self.discount}% Off"

class MarketPrice(models.Model):
    product_name = models.CharField(max_length=100)
    price_per_kg = models.DecimalField(max_digits=10, decimal_places=2)
    last_updated = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.product_name} - ₹{self.price_per_kg}/kg"
    
class MarketplaceProduct(models.Model):
    CATEGORY_CHOICES = [
        ('seeds', 'Seeds'),
        ('fertilizers', 'Fertilizers'),
        ('tools', 'Tools'),
        ('equipment', 'Equipment'),
        ('organic', 'Organic'),
    ]
    name = models.CharField(max_length=100)
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    stock = models.IntegerField()
    description = models.TextField()
    images_market = CloudinaryField('image', null=True, blank=True)
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} ({self.category}) - ₹{self.price}"
    
class CartItem(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    product_marketplace = models.ForeignKey(MarketplaceProduct, null=True, blank=True, on_delete=models.CASCADE)
    product_farmer = models.ForeignKey(product_farmer, null=True, blank=True, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)
    added_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        if self.product_marketplace:
            return f"{self.user.username} - {self.product_marketplace.name} x{self.quantity}"
        elif self.product_farmer:
            return f"{self.user.username} - {self.product_farmer.productName} x{self.quantity}"
        return f"{self.user.username} - Unknown Product x{self.quantity}"
    
from datetime import timedelta
from django.utils import timezone

class NegotiationSetting(models.Model):
    NEGOTIATION_TYPE_CHOICES = [
        ('active', 'Active'),
        ('passive', 'Passive'),
    ]

    product = models.OneToOneField('product_farmer', on_delete=models.CASCADE)
    negotiation_type = models.CharField(max_length=10, choices=NEGOTIATION_TYPE_CHOICES)
    validity_hours = models.PositiveIntegerField(null=True, blank=True, help_text="Only for active type")
    validity_days = models.PositiveIntegerField(null=True, blank=True, help_text="Only for passive type")

    def get_expiry_datetime(self):
        now = timezone.now()
        if self.negotiation_type == 'active' and self.validity_hours:
            return now + timedelta(hours=self.validity_hours)
        elif self.negotiation_type == 'passive' and self.validity_days:
            return now + timedelta(days=self.validity_days)
        return now  # fallback
    
class Negotiation(models.Model):
    product = models.ForeignKey('product_farmer', on_delete=models.CASCADE)
    buyer = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='negotiations_as_buyer',null=True)  # Allow null temporarily
    seller = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='negotiations_as_seller',null=True,blank=True)
    negotiation_type = models.CharField(max_length=10, choices=[('active', 'Active'), ('passive', 'Passive')],default='active')
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField(null=True, blank=True)

    def is_expired(self):
        if self.expires_at is None:
            return False
        return timezone.now() > self.expires_at

    def __str__(self):
        return f"Negotiation for {self.product.productName} (Buyer: {self.buyer.username}, Seller: {self.seller.username})"

class NegotiationMessage(models.Model):
    negotiation = models.ForeignKey(Negotiation, on_delete=models.CASCADE, related_name='messages')
    sender = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, db_index=True)
    message = models.TextField()
    receiver = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='received_negotiations',null=True,blank=True,db_index=True)
    proposed_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    is_read = models.BooleanField(default=False)
    timestamp = models.DateTimeField(auto_now_add=True,db_index=True)

    def __str__(self):
        return f"{self.sender.username} at {self.timestamp.strftime('%Y-%m-%d %H:%M')}"
