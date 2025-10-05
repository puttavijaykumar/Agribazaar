# management/commands/add_products_with_images.py
from django.core.management.base import BaseCommand
from accounts.models import Product  # Replace with your actual app name
from decimal import Decimal

class Command(BaseCommand):
    help = 'Add fresh products with Cloudinary images'
    
    def handle(self, *args, **options):
        # Modern Farming Equipment Products
        modern_equipment_products = [
            {
                'name': 'Tractor Model X',
                'description': '50 HP tractor for medium farms.',
                'price': Decimal('500000.00'),
                'quantity': 5,
                'category': 'equipment',
                'image': 'https://res.cloudinary.com/dpiogqjk4/image/upload/v1759651716/tractor_model_X_rlh2xp.jpg'  # Replace with actual Cloudinary URL
            },
            {
                'name': 'Mini Power Tiller',
                'description': 'Compact tiller for small farmers.',
                'price': Decimal('85000.00'),
                'quantity': 15,
                'category': 'equipment',
                'image': 'https://res.cloudinary.com/dpiogqjk4/image/upload/v1759652129/Mini_power_Tiller_z7yxl5.png'  # Replace with actual Cloudinary URL
            },
            {
                'name': 'Rotavator',
                'description': 'Heavy duty rotavator for soil preparation.',
                'price': Decimal('120000.00'),
                'quantity': 8,
                'category': 'equipment',
                'image': 'https://res.cloudinary.com/dpiogqjk4/image/upload/v1759652153/Rotavator_mgyxmu.jpg'  # Replace with actual Cloudinary URL
            },
            {
                'name': 'Seed Drill Machine',
                'description': 'Efficient seeder for wheat and rice.',
                'price': Decimal('95000.00'),
                'quantity': 12,
                'category': 'equipment',
                'image': 'https://res.cloudinary.com/dpiogqjk4/image/upload/v1759652186/seed_drill_machine_pexypz.jpg'  # Replace with actual Cloudinary URL
            }
        ]
        
        # Organic Farming Products
        organic_products = [
            {
                'name': 'Organic Wheat Seeds',
                'description': 'High-quality organic wheat seeds for sustainable farming.',
                'price': Decimal('120.00'),
                'quantity': 50,
                'category': 'organic',
                'image': 'https://res.cloudinary.com/dpiogqjk4/image/upload/v1759652226/organic_wheat_seeds_fmpj79.jpg'  # Replace with actual Cloudinary URL
            },
            {
                'name': 'Organic Rice Seeds',
                'description': 'Premium basmati rice seeds.',
                'price': Decimal('150.00'),
                'quantity': 40,
                'category': 'organic',
                'image': 'https://res.cloudinary.com/dpiogqjk4/image/upload/v1759652251/organic_rice_seeds_asktyl.jpg'  # Replace with actual Cloudinary URL
            },
            {
                'name': 'Organic Maize Seeds',
                'description': 'Non-GMO, high germination maize seeds.',
                'price': Decimal('90.75'),
                'quantity': 60,
                'category': 'organic',
                'image': 'https://res.cloudinary.com/dpiogqjk4/image/upload/v1759652280/organic_maize_seeds_ov3kvl.jpg'  # Replace with actual Cloudinary URL
            },
            {
                'name': 'Organic Tomato Seeds',
                'description': 'High-yield organic tomato seeds.',
                'price': Decimal('85.00'),
                'quantity': 35,
                'category': 'organic',
                'image': 'https://res.cloudinary.com/dpiogqjk4/image/upload/v1759652335/organic_tamato_seeds_ywj2ww.jpg'  # Replace with actual Cloudinary URL
            },
            {
                'name': 'Organic Onion Seeds',
                'description': 'Quality onion seeds for organic farming.',
                'price': Decimal('95.00'),
                'quantity': 45,
                'category': 'organic',
                'image': 'https://res.cloudinary.com/dpiogqjk4/image/upload/v1759652368/organic_onion_seeds_xhwyex.jpg'  # Replace with actual Cloudinary URL
            },
            {
                'name': 'Organic Potato Seeds',
                'description': 'High-yield potato seeds.',
                'price': Decimal('110.00'),
                'quantity': 25,
                'category': 'organic',
                'image': 'https://res.cloudinary.com/dpiogqjk4/image/upload/v1759652404/organic_potato_seeds_bazcxa.jpg'  # Replace with actual Cloudinary URL
            },
            {
                'name': 'Organic Brinjal Seeds',
                'description': 'Premium brinjal seeds for organic cultivation.',
                'price': Decimal('75.00'),
                'quantity': 30,
                'category': 'organic',
                'image': 'https://res.cloudinary.com/dpiogqjk4/image/upload/v1759652550/organic_brinjal_seeds_fopdkc.jpg'  # Replace with actual Cloudinary URL
            }
        ]
        
        # Combine all products
        all_products = modern_equipment_products + organic_products
        
        # Create product instances for bulk creation
        products_to_create = []
        for product_data in all_products:
            product = Product(**product_data)
            products_to_create.append(product)
        
        # Bulk create all products at once
        created_products = Product.objects.bulk_create(products_to_create)
        
        self.stdout.write(
            self.style.SUCCESS(
                f'Successfully created {len(created_products)} products with images'
            )
        )
        
        # Display created products
        for product in all_products:
            self.stdout.write(f'✓ {product["name"]} - ₹{product["price"]} ({product["category"]})')
