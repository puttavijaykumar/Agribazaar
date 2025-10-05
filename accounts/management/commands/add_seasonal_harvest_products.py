# management/commands/fix_harvest_images.py
from django.core.management.base import BaseCommand
from accounts.models import Product  # Replace with your actual app name
from decimal import Decimal

class Command(BaseCommand):
    help = 'Fix seasonal harvest products with accurate, relevant images'
    
    def handle(self, *args, **options):
        # Updated products with more accurate images
        updated_products = [
            {
                'name': 'Agricultural Storage Container 20ft',
                'description': 'Heavy-duty weatherproof storage container for grain and equipment storage.',
                'price': Decimal('45000.00'),
                'quantity': 10,
                'category': 'harvest',
                # ✅ Actual shipping container for storage
                'image': 'https://images.unsplash.com/photo-1586201375761-83865001e31c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'
            },
            {
                'name': 'Grain Storage Silo',
                'description': 'Large capacity grain storage silo with moisture control system.',
                'price': Decimal('125000.00'),
                'quantity': 5,
                'category': 'harvest',
                # ✅ Actual grain silos
                'image': 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'
            },
            {
                'name': 'Mobile Grain Cart',
                'description': 'High-capacity mobile grain cart for efficient field-to-storage transport.',
                'price': Decimal('85000.00'),
                'quantity': 8,
                'category': 'harvest',
                # ✅ Farm equipment/machinery
                'image': 'https://images.unsplash.com/photo-1500595046743-cd271d694d30?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'
            },
            {
                'name': 'Seed Cleaning Machine',
                'description': 'Professional seed cleaning and sorting machine for post-harvest processing.',
                'price': Decimal('95000.00'),
                'quantity': 6,
                'category': 'harvest',
                # ✅ Agricultural machinery
                'image': 'https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'
            },
            {
                'name': 'Grain Drying System',
                'description': 'Automated grain drying system with temperature and moisture control.',
                'price': Decimal('185000.00'),
                'quantity': 4,
                'category': 'harvest',
                # ✅ Industrial drying equipment
                'image': 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'
            },
            {
                'name': 'Harvest Storage Bags (50kg)',
                'description': 'Premium quality moisture-resistant harvest storage bags, pack of 100.',
                'price': Decimal('2500.00'),
                'quantity': 50,
                'category': 'harvest',
                # ✅ Keep current - grain bags are good
                'image': 'https://images.unsplash.com/photo-1586201375761-83865001e31c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'
            },
            {
                'name': 'Cold Storage Container',
                'description': 'Refrigerated container for perishable produce storage and preservation.',
                'price': Decimal('155000.00'),
                'quantity': 3,
                'category': 'harvest',
                # ✅ Refrigerated storage container
                'image': 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'
            },
            {
                'name': 'Bulk Feed Storage Bin',
                'description': 'Large capacity feed storage bin with automated dispensing system.',
                'price': Decimal('65000.00'),
                'quantity': 12,
                'category': 'harvest',
                # ✅ Actual storage bins/silos
                'image': 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'
            }
        ]
        
        # Update existing products with better images
        from accounts.models import Product
        
        for product_data in updated_products:
            try:
                product = Product.objects.get(name=product_data['name'], category='harvest')
                product.image = product_data['image']
                product.save()
                self.stdout.write(f'✅ Updated {product.name} with relevant image')
            except Product.DoesNotExist:
                self.stdout.write(f'⚠️  Product {product_data["name"]} not found')
        
        self.stdout.write(
            self.style.SUCCESS('Harvest product images updated with more relevant visuals!')
        )
