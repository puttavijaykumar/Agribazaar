# management/commands/add_more_products.py
from django.core.management.base import BaseCommand
from accounts.models import Product  # Replace with your actual app name
from decimal import Decimal

class Command(BaseCommand):
    help = 'Add additional farming equipment products with images'
    
    def handle(self, *args, **options):
        # Additional Modern Farming Equipment Products
        additional_products = [
            {
                'name': 'Farm Safety Helmet',
                'description': 'Professional safety helmet for farm workers.',
                'price': Decimal('850.00'),
                'quantity': 50,
                'category': 'equipment',
                'image': 'https://res.cloudinary.com/dpiogqjk4/image/upload/v1759675453/farm_helmet_y1jwff.jpg'  
            },
            {
                'name': 'Fertilizer Spreader',
                'description': 'Efficient fertilizer spreader for large fields.',
                'price': Decimal('15000.00'),
                'quantity': 8,
                'category': 'equipment',
                'image': 'https://res.cloudinary.com/dpiogqjk4/image/upload/v1759675504/fertilizers_spreader_qoo4ym.jpg'
            },
            {
                'name': 'Irrigation Pipes',
                'description': 'Durable PVC irrigation pipes for farming.',
                'price': Decimal('2500.00'),
                'quantity': 100,
                'category': 'equipment',
                'image': 'https://res.cloudinary.com/dpiogqjk4/image/upload/v1759675545/irrigation_pipes_li1ock.jpg'  # Replace with actual URL
            },
            {
                'name': 'Safety Gloves',
                'description': 'High-quality safety gloves for farm work.',
                'price': Decimal('350.00'),
                'quantity': 200,
                'category': 'equipment',
                'image': 'https://res.cloudinary.com/dpiogqjk4/image/upload/v1759675623/safety_gloves_gizxa5.jpg'
            },
            {
                'name': 'Agricultural Sprayer Pump',
                'description': 'Professional sprayer pump for pesticides and fertilizers.',
                'price': Decimal('12000.00'),
                'quantity': 15,
                'category': 'equipment',
                'image': 'https://res.cloudinary.com/dpiogqjk4/image/upload/v1759675648/sprayer_pump_rn8bps.jpg'  # Replace with actual URL
            },
            {
                'name': 'Water Pump',
                'description': 'Heavy-duty water pump for irrigation systems.',
                'price': Decimal('18000.00'),
                'quantity': 12,
                'category': 'equipment',
                'image': 'https://res.cloudinary.com/dpiogqjk4/image/upload/v1759675694/water_pump_tvvftq.jpg'  # Replace with actual URL
            }
        ]
        
        # Create product instances for bulk creation
        products_to_create = []
        for product_data in additional_products:
            product = Product(**product_data)
            products_to_create.append(product)
        
        # Bulk create all products at once
        created_products = Product.objects.bulk_create(products_to_create)
        
        self.stdout.write(
            self.style.SUCCESS(
                f'Successfully created {len(created_products)} additional products with images'
            )
        )
        
        # Display created products
        for product in additional_products:
            self.stdout.write(f'✓ {product["name"]} - ₹{product["price"]} ({product["category"]})')
