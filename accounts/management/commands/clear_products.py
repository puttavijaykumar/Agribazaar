# management/commands/clear_products.py
from django.core.management.base import BaseCommand
from accounts.models import Product  # Replace 'myapp' with your actual app name

class Command(BaseCommand):
    help = 'Clear all existing products from database'
    
    def handle(self, *args, **options):
        # Count existing products
        product_count = Product.objects.count()
        
        # Delete all products
        Product.objects.all().delete()
        
        self.stdout.write(
            self.style.SUCCESS(
                f'Successfully deleted {product_count} products'
            )
        )
