# accounts/signals.py

from django.db.models.signals import post_save
from django.contrib.auth.signals import user_logged_in, user_logged_out
from django.dispatch import receiver
from .models import CustomUser, product_farmer, Negotiation, NegotiationMessage, LogActivity

@receiver(user_logged_in)
def log_user_login(sender, request, user, **kwargs):
    LogActivity.objects.create(
        user=user,
        activity_type='Login',
        description=f'User logged in from IP: {request.META.get("REMOTE_ADDR")}'
    )

@receiver(user_logged_out)
def log_user_logout(sender, request, user, **kwargs):
    LogActivity.objects.create(
        user=user,
        activity_type='Logout',
        description='User logged out'
    )

@receiver(post_save, sender=product_farmer)
def log_product_listed(sender, instance, created, **kwargs):
    if created:
        LogActivity.objects.create(
            user=instance.product_farmer,
            activity_type='Product Listed',
            description=f'Listed new product: {instance.productName}'
        )

@receiver(post_save, sender=Negotiation)
def log_negotiation_started(sender, instance, created, **kwargs):
    if created:
        LogActivity.objects.create(
            user=instance.buyer,
            activity_type='Negotiation Started',
            description=f'Started a new negotiation for product: {instance.product.productName}'
        )

# For NegotiationMessage, you can log when a message is sent
@receiver(post_save, sender=NegotiationMessage)
def log_negotiation_message_sent(sender, instance, created, **kwargs):
    if created:
        LogActivity.objects.create(
            user=instance.sender,
            activity_type='Negotiation Message Sent',
            description=f'Sent a message in negotiation for {instance.negotiation.product.productName}'
        )