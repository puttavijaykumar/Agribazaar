from django import forms
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth import get_user_model

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