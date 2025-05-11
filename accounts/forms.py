from django import forms
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth import get_user_model
from django.core.exceptions import ValidationError
from .models import product_farmer, NegotiationSetting
import cloudinary
import cloudinary.uploader

User = get_user_model()


ROLE_CHOICES = [
    ('farmer', 'Farmer'),
    ('buyer', 'Buyer'),
]

class RegisterForm(UserCreationForm):
    email = forms.EmailField(required=True)
    phone_number = forms.CharField(max_length=15)
    roles = forms.MultipleChoiceField(
        choices=ROLE_CHOICES,
        widget=forms.CheckboxSelectMultiple,
        required=True,  # Ensure at least one role is selected
        label="Select Role(s)"
    )
    password1 = forms.CharField(
        widget=forms.PasswordInput(attrs={'placeholder': 'Enter Password'}),
        strip=False,
        label="Password",
        help_text=""
    )
    password2 = forms.CharField(
        widget=forms.PasswordInput(attrs={'placeholder': 'Confirm Password'}),
        strip=False,
        label="Confirm Password",
        help_text=""
    )
    class Meta:
        model = User
        fields = ['username', 'email', 'phone_number', 'password1', 'password2','roles']
      
        help_texts = {
            'username': None,  # Remove username help text
            
        }
    
    def save(self, commit=True):
        user = super().save(commit=False)
        user.is_active = False  # Deactivate the account until verified
        if commit:
            user.save()
        return user    
    
MAX_IMAGE_SIZE_MB = 1
MAX_VIDEO_SIZE_MB = 5
 
class ProductUploadForm(forms.ModelForm):
    # These fields are not in product_farmer, but we add them manually for the form
    negotiation_type = forms.ChoiceField(
        choices=[('active', 'Active'), ('passive', 'Passive')],
        required=False
    )
    validity_hours = forms.IntegerField(required=False)
    validity_days = forms.IntegerField(required=False)

    class Meta:
        model = product_farmer
        fields = ['productName', 'price', 'quantity', 'description', 'category','images', 'product_vedio']
        
    def clean_images(self):
        image = self.cleaned_data.get('images') #images is model class field of proproduct_farmer class
        if image:
            if image.size > MAX_IMAGE_SIZE_MB * 1024 * 1024:
                raise ValidationError("Image file size must be under 1MB.")

            # Upload to Cloudinary with moderation enabled
            result = cloudinary.uploader.upload(image)
            if result.get("moderation") and result["moderation"][0]["status"] == "rejected":
                # Store the result for use in the view later
                self.rejected_image_public_id = result["public_id"]
                raise ValidationError("Inappropriate image content detected.")
            
            # Store approved Cloudinary result if needed
            self.cleaned_data['image_cloudinary_result'] = result

        return image
    def clean_product_vedio(self):
        video = self.cleaned_data.get('product_vedio')
        if video:
            if video.size > MAX_VIDEO_SIZE_MB * 1024 * 1024:
                raise ValidationError("Video file size must be under 5MB.")

            # Upload to Cloudinary with moderation
            result = cloudinary.uploader.upload_large(
                video,
                resource_type="video"
                
            )
            if result.get("moderation") and result["moderation"][0]["status"] == "rejected":
                self.rejected_video_public_id = result["public_id"]
                raise ValidationError("Inappropriate video content detected.")

            self.cleaned_data['video_cloudinary_result'] = result

        return video
    
    def save(self, commit=True, user=None):
        product = super().save(commit=False)
        if user:
            product.product_farmer = user
        if commit:
            product.save()
        return product