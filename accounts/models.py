from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils import timezone
from datetime import timedelta
from django.conf import settings
from cloudinary.models import CloudinaryField



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
        null=True,
        blank=True
    )

    # Address fields
    home_name = models.CharField(max_length=100, blank=True)
    street = models.CharField(max_length=100, blank=True)
    village = models.CharField(max_length=100, blank=True)
    mandal = models.CharField(max_length=100, blank=True)
    district = models.CharField(max_length=100, blank=True)
    state = models.CharField(max_length=100, blank=True)
    pincode = models.CharField(max_length=10, blank=True)

    # OTP fields
    otp_code = models.CharField(max_length=6, null=True, blank=True)
    otp_created_at = models.DateTimeField(null=True, blank=True)
    is_verified = models.BooleanField(default=False)

    def is_otp_expired(self):
        if self.otp_created_at:
            return timezone.now() > self.otp_created_at + timedelta(minutes=15)
        return True  # Expired if no creation time

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["username"]

    def __str__(self):
        return self.email


CATEGORY_CHOICES = [
    ("Grains", "Grains"),
    ("Spices", "Spices"),
    ("Fruits", "Fruits"),
    ("Vegetables", "Vegetables"),
    ("Dairy", "Dairy"),
    ("Seeds", "Seeds"),
    ("Oilseeds", "Oilseeds"),                 
    ("Dry Fruits", "Dry Fruits"),             
    ("Organic Products", "Organic Products"), 
    ("Farm Animals", "Farm Animals"),    
    # ("Machinery", "Machinery"),
    ("Uncategorized", "Uncategorized"),
]


class Product(models.Model):
    name = models.CharField(max_length=100)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    description = models.TextField()
    quantity = models.FloatField()
    # Up to 4 images, all optional (now use CloudinaryField)
    image1 = CloudinaryField('image', blank=True, null=True)
    image2 = CloudinaryField('image', blank=True, null=True)
    image3 = CloudinaryField('image', blank=True, null=True)
    image4 = CloudinaryField('image', blank=True, null=True)
    validity_days = models.PositiveIntegerField(default=30)
    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='products'
    )
    
    category = models.CharField(
        max_length=40,
        choices=CATEGORY_CHOICES,
        default="Uncategorized"
    )
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.name} ({self.owner.email})"
    
class Sale(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField()
    price = models.DecimalField(max_digits=10, decimal_places=2)  # per unit price
    total = models.DecimalField(max_digits=12, decimal_places=2)  # quantity * price
    owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        self.total = self.quantity * self.price
        super().save(*args, **kwargs)



class RecentlyViewed(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='recently_viewed')
    product = models.ForeignKey('Product', on_delete=models.CASCADE, related_name='recently_viewed_by')
    viewed_at = models.DateTimeField(default=timezone.now)

    class Meta:
        ordering = ['-viewed_at']
        unique_together = ['user', 'product']

    def __str__(self):
        return f"{self.user.email} viewed {self.product.name} at {self.viewed_at}"


class Wishlist(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='wishlist_items')
    product = models.ForeignKey('Product', on_delete=models.CASCADE, related_name='wishlisted_by')
    added_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-added_at']
        unique_together = ['user', 'product']

    def __str__(self):
        return f"{self.user.email} wishlisted {self.product.name}"


class Order(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=30)
    total = models.DecimalField(max_digits=10, decimal_places=2)
    delivery_address = models.ForeignKey('Address', on_delete=models.SET_NULL, null=True, blank=True)
    # ...other order meta fields

class OrderItem(models.Model):
    order = models.ForeignKey(Order, related_name='items', on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField()
    price = models.DecimalField(max_digits=10, decimal_places=2)

# Cart and CartItem models for shopping cart functionality
class Cart(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)

class CartItem(models.Model):
    cart = models.ForeignKey(Cart, related_name='items', on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField()

# Notifcations model 

class Notification(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    read = models.BooleanField(default=False)

# User settings model for storing user preferences

class UserSettings(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='settings')
    dark_mode = models.BooleanField(default=False)
    language = models.CharField(max_length=15, default='en')
    notifications_enabled = models.BooleanField(default=True)
    newsletter_opt_in = models.BooleanField(default=False)
    currency_preference = models.CharField(max_length=5, default="INR")
    default_shipping_address = models.ForeignKey('Address', null=True, blank=True, on_delete=models.SET_NULL, related_name='+')
    default_payment_method = models.CharField(max_length=24, blank=True)
    show_personalized_recommendations = models.BooleanField(default=True)
    order_updates_via_sms = models.BooleanField(default=False)
    wishlist_visibility = models.CharField(max_length=8, default="private", choices=[("private", "Private"), ("public", "Public")])
    review_reminders_enabled = models.BooleanField(default=True)

# Points and Rewards model for tracking user rewards
class RewardTransaction(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    points = models.IntegerField()  # +10 (earned), -20 (used)
    description = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'{self.user.email} | {self.points} pts | {self.description}'
    
# Multiple Address model for storing user addresses

class Address(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='addresses')
    line1 = models.CharField(max_length=128)
    line2 = models.CharField(max_length=128, blank=True)
    city = models.CharField(max_length=32)
    district = models.CharField(max_length=32)
    state = models.CharField(max_length=32)
    postal_code = models.CharField(max_length=12)
    is_default = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.line1}, {self.city}, {self.state}"


    
# Admin Catalog Product model for managing products in admin catalog
class AdminCatalogProduct(models.Model):
    CATEGORY_CHOICES = [
        ("Seeds", "Seeds"),
        ("Fertilizers", "Fertilizers"),
        ("Tools", "Tools"),
        ("Equipment", "Equipment"),
        ("Irrigation", "Irrigation"),
        ("Top Offers", "Top Offers Only"),  # REMOVED emoji
    ]
    
    # NEW: Offer category choices
    OFFER_CHOICES = [
        ('none', 'Not an Offer'),
        ('flash_deal', 'Flash Deal'),
        ('seasonal', 'Seasonal Offer'),
        ('limited_stock', 'Limited Stock'),
        ('trending', 'Trending Now'),
    ]
    
    name = models.CharField(max_length=100)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    description = models.TextField()
    category = models.CharField(max_length=40, choices=CATEGORY_CHOICES)
    image1 = CloudinaryField('image', blank=True, null=True)
    image2 = CloudinaryField('image', blank=True, null=True)
    image3 = CloudinaryField('image', blank=True, null=True)
    image4 = CloudinaryField('image', blank=True, null=True)
    stock = models.PositiveIntegerField(default=0)
    
    # EXISTING FIELDS FOR TOP OFFERS
    is_featured = models.BooleanField(default=False)  # Mark as featured/top offer
    discount_percent = models.IntegerField(default=0)  # Discount percentage
    farmer_name = models.CharField(max_length=255, blank=True, null=True)
    farmer_location = models.CharField(max_length=255, blank=True, null=True)
    warranty_period = models.CharField(max_length=50, blank=True, null=True)  # for Tools/Equipment
    fertilizer_type = models.CharField(max_length=50, blank=True, null=True)  # for Fertilizer-specific info
    
    # NEW FIELD: Offer Category (separate from product category)
    offer_category = models.CharField(
        max_length=20,
        choices=OFFER_CHOICES,
        default='none',
        help_text="Select offer type to display in Top Offers section"
    )
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.name} ({self.category})"
