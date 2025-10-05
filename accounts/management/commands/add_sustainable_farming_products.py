# management/commands/add_sustainable_farming_products.py
from django.core.management.base import BaseCommand
from accounts.models import Banner  # Replace with your actual app name
from decimal import Decimal

class Command(BaseCommand):
    help = 'Add 20 sustainable farming products with eco-friendly images and government subsidy eligibility'
    
    def handle(self, *args, **options):
        # Sustainable Farming Solutions - 20 Eco-Friendly Products
        sustainable_products = [
            # Solar-Powered Equipment
            {
                'name': 'Solar Irrigation Pump System',
                'description': 'Complete solar-powered irrigation system with government subsidy eligibility. Zero electricity bills.',
                'price': Decimal('85000.00'),
                'quantity': 15,
                'category': 'sustainable',
                'image': 'https://images.unsplash.com/photo-1509391366360-2e959784a276?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'
            },
            {
                'name': 'Solar Water Heater for Livestock',
                'description': 'Eco-certified solar water heating system for dairy and poultry farms. 50% government subsidy available.',
                'price': Decimal('25000.00'),
                'quantity': 25,
                'category': 'sustainable',
                'image': 'https://images.unsplash.com/photo-1497440001374-f26997328c1b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'
            },
            {
                'name': 'Solar-Powered Greenhouse Controller',
                'description': 'Automated greenhouse climate control powered by solar energy. Reduces energy costs by 80%.',
                'price': Decimal('45000.00'),
                'quantity': 12,
                'category': 'sustainable',
                'image': 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'
            },
            
            # Precision Agriculture & Smart Equipment
            {
                'name': 'GPS-Guided Precision Sprayer',
                'description': 'Reduces pesticide usage by 60% with precise application. Eligible for green technology subsidies.',
                'price': Decimal('120000.00'),
                'quantity': 8,
                'category': 'sustainable',
                'image': 'https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'
            },
            {
                'name': 'IoT Soil Monitoring System',
                'description': 'Real-time soil health monitoring with smartphone app. Certified eco-friendly technology.',
                'price': Decimal('15000.00'),
                'quantity': 30,
                'category': 'sustainable',
                'image': 'https://images.unsplash.com/photo-1574180045827-681f8a1a9622?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'
            },
            {
                'name': 'Smart Drip Irrigation Controller',
                'description': 'Weather-based automated irrigation system. Saves 70% water usage with government certification.',
                'price': Decimal('18000.00'),
                'quantity': 40,
                'category': 'sustainable',
                'image': 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'
            },
            
            # Renewable Energy Equipment
            {
                'name': 'Wind-Solar Hybrid Power System',
                'description': 'Combined wind and solar power for farms. 100% renewable energy with maximum subsidies.',
                'price': Decimal('185000.00'),
                'quantity': 5,
                'category': 'sustainable',
                'image': 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'
            },
            {
                'name': 'Biogas Plant Starter Kit',
                'description': 'Complete biogas generation system from farm waste. Government approved eco-solution.',
                'price': Decimal('75000.00'),
                'quantity': 10,
                'category': 'sustainable',
                'image': 'https://images.unsplash.com/photo-1497436072909-f5e4be769fe6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'
            },
            {
                'name': 'Solar-Powered Electric Fence',
                'description': 'Eco-friendly livestock containment system. Zero maintenance with solar charging.',
                'price': Decimal('8500.00'),
                'quantity': 50,
                'category': 'sustainable',
                'image': 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'
            },
            
            # Organic & Bio Solutions
            {
                'name': 'Organic Compost Turner Machine',
                'description': 'Electric-powered compost turner for organic fertilizer production. Certified sustainable equipment.',
                'price': Decimal('65000.00'),
                'quantity': 12,
                'category': 'sustainable',
                'image': 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'
            },
            {
                'name': 'Vermiculture Farming Kit',
                'description': 'Complete worm farming system for organic fertilizer. Government supported eco-farming solution.',
                'price': Decimal('5500.00'),
                'quantity': 100,
                'category': 'sustainable',
                'image': 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'
            },
            {
                'name': 'Beneficial Insects Release System',
                'description': 'Natural pest control system using beneficial insects. Reduces pesticide use by 90%.',
                'price': Decimal('3500.00'),
                'quantity': 75,
                'category': 'sustainable',
                'image': 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'
            },
            
            # Water Conservation Equipment
            {
                'name': 'Rainwater Harvesting System',
                'description': 'Complete rainwater collection and storage system. Eligible for water conservation subsidies.',
                'price': Decimal('35000.00'),
                'quantity': 20,
                'category': 'sustainable',
                'image': 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'
            },
            {
                'name': 'Micro-Sprinkler Irrigation Kit',
                'description': 'Water-efficient micro-sprinkler system. 60% water savings with government eco-certification.',
                'price': Decimal('12000.00'),
                'quantity': 35,
                'category': 'sustainable',
                'image': 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'
            },
            {
                'name': 'Greywater Recycling System',
                'description': 'Farm greywater treatment and reuse system. Reduces water consumption and waste.',
                'price': Decimal('28000.00'),
                'quantity': 18,
                'category': 'sustainable',
                'image': 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'
            },
            
            # Electric & Battery-Powered Equipment
            {
                'name': 'Electric Farm Vehicle',
                'description': 'Zero-emission electric utility vehicle for farm operations. Government EV subsidy eligible.',
                'price': Decimal('95000.00'),
                'quantity': 8,
                'category': 'sustainable',
                'image': 'https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'
            },
            {
                'name': 'Battery-Powered Pruning Tools',
                'description': 'Complete set of electric pruning tools. Eco-certified with zero emissions operation.',
                'price': Decimal('8500.00'),
                'quantity': 60,
                'category': 'sustainable',
                'image': 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'
            },
            {
                'name': 'Solar Charging Station for Tools',
                'description': 'Solar-powered charging dock for electric farm tools. Complete energy independence.',
                'price': Decimal('15000.00'),
                'quantity': 25,
                'category': 'sustainable',
                'image': 'https://images.unsplash.com/photo-1509391366360-2e959784a276?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'
            },
            
            # Advanced Eco-Technology
            {
                'name': 'Agricultural Drone with AI',
                'description': 'AI-powered crop monitoring drone. Precision agriculture with minimal environmental impact.',
                'price': Decimal('125000.00'),
                'quantity': 6,
                'category': 'sustainable',
                'image': 'https://images.unsplash.com/photo-1473968512647-3e447244af8f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'
            },
            {
                'name': 'Hydroponic Growing System',
                'description': 'Soilless growing system with 95% water efficiency. Modern sustainable farming technology.',
                'price': Decimal('55000.00'),
                'quantity': 15,
                'category': 'sustainable',
                'image': 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'
            }
        ]
        
        # Clear existing sustainable products to avoid duplicates
        from accounts.models import Product
        existing_count = Product.objects.filter(category='sustainable').count()
        if existing_count > 0:
            Product.objects.filter(category='sustainable').delete()
            self.stdout.write(f'Cleared {existing_count} existing sustainable products')
        
        # Create product instances for bulk creation
        products_to_create = []
        for product_data in sustainable_products:
            product = Product(**product_data)
            products_to_create.append(product)
        
        # Bulk create all products at once
        created_products = Product.objects.bulk_create(products_to_create)
        
        self.stdout.write(
            self.style.SUCCESS(
                f'Successfully created {len(created_products)} sustainable farming products with eco-certification'
            )
        )
        
        # Display created products with subsidy information
        self.stdout.write('\n' + '='*80)
        self.stdout.write('🌱 SUSTAINABLE FARMING SOLUTIONS - ECO-CERTIFIED PRODUCTS 🌱')
        self.stdout.write('='*80)
        self.stdout.write('✅ Government Subsidies Available | ♻️ Eco-Friendly Certification')
        self.stdout.write('='*80)
        
        total_value = sum(product['price'] for product in sustainable_products)
        
        category_counts = {
            'Solar-Powered': 0,
            'Smart Technology': 0,
            'Renewable Energy': 0,
            'Organic Solutions': 0,
            'Water Conservation': 0,
            'Electric Equipment': 0,
            'Advanced Technology': 0
        }
        
        for i, product in enumerate(sustainable_products, 1):
            # Categorize products
            if 'Solar' in product['name']:
                category = 'Solar-Powered'
            elif 'IoT' in product['name'] or 'Smart' in product['name'] or 'GPS' in product['name']:
                category = 'Smart Technology'
            elif 'Wind' in product['name'] or 'Biogas' in product['name']:
                category = 'Renewable Energy'
            elif 'Organic' in product['name'] or 'Compost' in product['name'] or 'Vermi' in product['name'] or 'Insects' in product['name']:
                category = 'Organic Solutions'
            elif 'Water' in product['name'] or 'Rainwater' in product['name'] or 'Irrigation' in product['name']:
                category = 'Water Conservation'
            elif 'Electric' in product['name'] or 'Battery' in product['name']:
                category = 'Electric Equipment'
            else:
                category = 'Advanced Technology'
            
            category_counts[category] += 1
            
            subsidy_info = "🏛️ Gov. Subsidy" if product['price'] > Decimal('50000.00') else "💚 Eco-Cert"
            
            self.stdout.write(
                f'{i:2d}. {product["name"]:<35} | '
                f'₹{product["price"]:>9} | '
                f'Qty: {product["quantity"]:>3} | '
                f'{subsidy_info}'
            )
        
        self.stdout.write('\n' + '='*80)
        self.stdout.write('📊 PRODUCT CATEGORIES SUMMARY:')
        for category, count in category_counts.items():
            if count > 0:
                self.stdout.write(f'   {category}: {count} products')
        
        self.stdout.write(f'\n💰 Total Catalog Value: ₹{total_value:,}')
        self.stdout.write('🌍 All products are eco-certified and eligible for government subsidies')
        self.stdout.write('♻️ Reduces carbon footprint and promotes sustainable agriculture')
        self.stdout.write('='*80)
