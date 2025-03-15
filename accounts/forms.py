from django import forms
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth import get_user_model

User = get_user_model()

class RegisterForm(UserCreationForm):
    email = forms.EmailField(required=True)
    phone_number = forms.CharField(max_length=15)

    class Meta:
        model = User
        fields = ['username', 'email', 'phone_number', 'password1', 'password2']
        help_texts = {
            'username': None,  # Removes the help text
        }
    
    def save(self, commit=True):
        user = super().save(commit=False)
        user.is_active = False  # Deactivate the account until verified
        if commit:
            user.save()
        return user    