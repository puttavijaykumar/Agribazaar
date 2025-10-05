# management/commands/add_seasonal_harvest_products.py
from django.core.management.base import BaseCommand
from accounts.models import Product  # Replace with your actual app name
from decimal import Decimal

class Command(BaseCommand):
    help = 'Add seasonal harvest sale products with storage containers & processing equipment'
    
    def handle(self, *args, **options):
        # Seasonal Harvest Sale Products - Storage Containers & Processing Equipment
        seasonal_harvest_products = [
            {
                'name': 'Agricultural Storage Container 20ft',
                'description': 'Heavy-duty weatherproof storage container for grain and equipment storage.',
                'price': Decimal('45000.00'),
                'quantity': 10,
                'category': 'harvest',
                'image': 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500&h=300&fit=crop'
            },
            {
                'name': 'Grain Storage Silo',
                'description': 'Large capacity grain storage silo with moisture control system.',
                'price': Decimal('125000.00'),
                'quantity': 5,
                'category': 'harvest',
                'image': 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=500&h=300&fit=crop'
            },
            {
                'name': 'Mobile Grain Cart',
                'description': 'High-capacity mobile grain cart for efficient field-to-storage transport.',
                'price': Decimal('85000.00'),
                'quantity': 8,
                'category': 'harvest',
                'image': 'https://images.unsplash.com/photo-1500595046743-cd271d694d30?w=500&h=300&fit=crop'
            },
            {
                'name': 'Seed Cleaning Machine',
                'description': 'Professional seed cleaning and sorting machine for post-harvest processing.',
                'price': Decimal('95000.00'),
                'quantity': 6,
                'category': 'harvest',
                'image': 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=500&h=300&fit=crop'
            },
            {
                'name': 'Grain Drying System',
                'description': 'Automated grain drying system with temperature and moisture control.',
                'price': Decimal('185000.00'),
                'quantity': 4,
                'category': 'harvest',
                'image': 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=500&h=300&fit=crop'
            },
            {
                'name': 'Harvest Storage Bags (50kg)',
                'description': 'Premium quality moisture-resistant harvest storage bags, pack of 100.',
                'price': Decimal('2500.00'),
                'quantity': 50,
                'category': 'harvest',
                'image': 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=500&h=300&fit=crop'
            },
            {
                'name': 'Cold Storage Container',
                'description': 'Refrigerated container for perishable produce storage and preservation.',
                'price': Decimal('155000.00'),
                'quantity': 3,
                'category': 'harvest',
                'image': 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=500&h=300&fit=crop'
            },
            {
                'name': 'Bulk Feed Storage Bin',
                'description': 'Large capacity feed storage bin with automated dispensing system.',
                'price': Decimal('65000.00'),
                'quantity': 12,
                'category': 'harvest',
                'image': 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=500&h=300&fit=crop'
            },
            {
                'name': 'Portable Processing Unit',
                'description': 'Mobile processing unit for on-site crop cleaning and packaging.',
                'price': Decimal('225000.00'),
                'quantity': 2,
                'category': 'harvest',
                'image': 'https://images.unsplash.com/photo-1605000797499-95a51c5269ae?w=500&h=300&fit=crop'
            },
            {
                'name': 'Harvest Crates (Stackable)',
                'description': 'Durable stackable plastic crates for fruit and vegetable harvesting.',
                'price': Decimal('850.00'),
                'quantity': 200,
                'category': 'harvest',
                'image': 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=500&h=300&fit=crop'
            },
            {
                'name': 'Weighing Scale System',
                'description': 'Digital weighing scale system for accurate harvest measurement.',
                'price': Decimal('15000.00'),
                'quantity': 15,
                'category': 'harvest',
                'image': 'https://images.unsplash.com/photo-1556075798-4825dfaaf498?w=500&h=300&fit=crop'
            },
            {
                'name': 'Ventilated Storage Bin',
                'description': 'Ventilated storage bin for optimal air circulation and crop preservation.',
                'price': Decimal('25000.00'),
                'quantity': 20,
                'category': 'harvest',
                'image': 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=500&h=300&fit=crop'
            }
        ]
        
        # Create product instances for bulk creation
        products_to_create = []
        for product_data in seasonal_harvest_products:
            product = Product(**product_data)
            products_to_create.append(product)
        
        # Bulk create all products at once
        created_products = Product.objects.bulk_create(products_to_create)
        
        self.stdout.write(
            self.style.SUCCESS(
                f'Successfully created {len(created_products)} seasonal harvest products'
            )
        )
        
        # Display created products with discount information
        self.stdout.write('\n' + '='*60)
        self.stdout.write('SEASONAL HARVEST SALE - UP TO 30% OFF!')
        self.stdout.write('='*60)
        
        for product in seasonal_harvest_products:
            # Calculate discounted price (30% off)
            original_price = product["price"]
            discounted_price = original_price * Decimal('0.70')  # 30% off
            savings = original_price - discounted_price
            
            self.stdout.write(
                f'✓ {product["name"]:<35} | '
                f'Was: ₹{original_price:>10} | '
                f'Now: ₹{discounted_price:>10} | '
                f'Save: ₹{savings:>8}'
            )
        
        self.stdout.write('\n' + '='*60)
        self.stdout.write('Limited Time Offer - Storage Containers & Processing Equipment!')
        self.stdout.write('='*60)
