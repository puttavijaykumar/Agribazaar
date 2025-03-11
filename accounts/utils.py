from django.core.mail import send_mail
from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes
from django.contrib.auth import get_user_model

User = get_user_model()

def send_verification_email(request, user):
    token = default_token_generator.make_token(user)
    uid = urlsafe_base64_encode(force_bytes(user.pk))
    verification_link = request.build_absolute_uri(f"/verify-email/{uid}/{token}/")

    send_mail(
        "Verify Your Email",
        f"Click the link to verify your email: {verification_link}",
        "your-email@example.com",
        [user.email],
        fail_silently=False,
    )
