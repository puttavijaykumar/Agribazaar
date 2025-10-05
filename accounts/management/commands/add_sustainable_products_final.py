# management/commands/add_sustainable_products_final.py
from django.core.management.base import BaseCommand
from accounts.models import Product, Banner  # Replace with your actual app name
from decimal import Decimal

class Command(BaseCommand):
    help = 'Add 20 sustainable farming products that match the model structure perfectly'
    
    def handle(self, *args, **options):
        # 20 Sustainable Farming Products with Government Subsidy Eligibility
        sustainable_products = [
            # Solar-Powered Equipment (5 products)
            {
                'name': 'Solar Irrigation Pump 5HP',
                'description': 'Complete solar-powered irrigation system with 5HP pump. Government subsidy eligible. Zero electricity bills and eco-certified for sustainable farming.',
                'price': Decimal('85000.00'),
                'quantity': 15,
                'category': 'sustainable',
                'image': 'https://images.unsplash.com/photo-1509391366360-2e959784a276?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
            },
            {
                'name': 'Solar Water Heater System',
                'description': 'Eco-friendly solar water heating for livestock and dairy farms. 50% government subsidy available. Reduces energy costs by 80% annually.',
                'price': Decimal('25000.00'),
                'quantity': 25,
                'category': 'sustainable',
                'image': 'https://images.unsplash.com/photo-1497440001374-f26997328c1b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
            },
            {
                'name': 'Solar Greenhouse Controller',
                'description': 'Automated climate control powered by solar energy. Smart greenhouse management with temperature and humidity monitoring. Eco-certified technology.',
                'price': Decimal('45000.00'),
                'quantity': 12,
                'category': 'sustainable',
                'image': 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
            },
            {
                'name': 'Solar Panel Mounting Kit',
                'description': 'Professional solar panel mounting system for farm installations. Easy installation with all hardware included. Government approved components.',
                'price': Decimal('18000.00'),
                'quantity': 30,
                'category': 'sustainable',
                'image': 'https://images.unsplash.com/photo-1509391366360-2e959784a276?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
            },
            {
                'name': 'Solar Battery Storage System',
                'description': 'High-capacity lithium battery storage for solar systems. 10-year warranty with government subsidy support. 24/7 power backup for farms.',
                'price': Decimal('65000.00'),
                'quantity': 20,
                'category': 'sustainable',
                'image': 'https://images.unsplash.com/photo-1497440001374-f26997328c1b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
            },
            
            # Smart Agriculture Technology (4 products)
            {
                'name': 'IoT Soil Monitoring Kit',
                'description': 'Real-time soil health monitoring with smartphone app. Measures pH, moisture, nutrients. Precision agriculture tool with data analytics.',
                'price': Decimal('15000.00'),
                'quantity': 40,
                'category': 'sustainable',
                'image': 'https://images.unsplash.com/photo-1574180045827-681f8a1a9622?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
            },
            {
                'name': 'Smart Drip Irrigation System',
                'description': 'Weather-based automated irrigation with mobile control. Saves 70% water with precision delivery. Government water conservation subsidy eligible.',
                'price': Decimal('35000.00'),
                'quantity': 25,
                'category': 'sustainable',
                'image': 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
            },
            {
                'name': 'GPS Precision Sprayer',
                'description': 'GPS-guided precision sprayer reduces pesticide usage by 60%. Variable rate application technology. Eco-certified sustainable equipment.',
                'price': Decimal('120000.00'),
                'quantity': 8,
                'category': 'sustainable',
                'image': 'https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
            },
            {
                'name': 'Agricultural Drone System',
                'description': 'AI-powered crop monitoring drone with HD cameras. Pest detection, crop health analysis, and yield prediction. Professional agriculture technology.',
                'price': Decimal('125000.00'),
                'quantity': 6,
                'category': 'sustainable',
                'image': 'https://images.unsplash.com/photo-1473968512647-3e447244af8f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
            },
            
            # Renewable Energy Solutions (3 products)
            {
                'name': 'Wind-Solar Hybrid System',
                'description': 'Combined wind and solar power generation. 100% renewable energy for farms. Maximum government subsidies available. Complete energy independence.',
                'price': Decimal('185000.00'),
                'quantity': 5,
                'category': 'sustainable',
                'image': 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
            },
            {
                'name': 'Biogas Plant Complete Kit',
                'description': 'Generate biogas from farm waste. Convert organic waste to cooking gas and electricity. Government approved eco-solution with installation support.',
                'price': Decimal('75000.00'),
                'quantity': 10,
                'category': 'sustainable',
                'image': 'https://images.unsplash.com/photo-1497436072909-f5e4be769fe6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
            },
            {
                'name': 'Solar Electric Fence System',
                'description': 'Eco-friendly livestock containment with solar charging. Zero maintenance costs. Weather-resistant with 5-year warranty. Easy installation.',
                'price': Decimal('12000.00'),
                'quantity': 50,
                'category': 'sustainable',
                'image': 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
            },
            
            # Organic & Bio Solutions (4 products)
            {
                'name': 'Bio-Fertilizer Production Kit',
                'description': 'Solar-powered bio-fermenter for organic fertilizer production. Convert farm waste to high-quality bio-fertilizer. Reduces chemical dependency by 90%.',
                'price': Decimal('28000.00'),
                'quantity': 20,
                'category': 'sustainable',
                'image': 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
            },
            {
                'name': 'Compost Turner Machine Electric',
                'description': 'Electric-powered compost turner for organic fertilizer. Eco-certified sustainable equipment. Government subsidy for organic farming tools.',
                'price': Decimal('55000.00'),
                'quantity': 12,
                'category': 'sustainable',
                'image': 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
            },
            {
                'name': 'Vermiculture Farming System',
                'description': 'Complete worm farming setup for organic fertilizer production. Sustainable soil health solution. Government supported eco-farming initiative.',
                'price': Decimal('8500.00'),
                'quantity': 75,
                'category': 'sustainable',
                'image': 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
            },
            {
                'name': 'Beneficial Insects Release Kit',
                'description': 'Natural pest control using beneficial insects. Reduces pesticide use by 90%. Eco-certified biological pest management solution.',
                'price': Decimal('5500.00'),
                'quantity': 100,
                'category': 'sustainable',
                'image': 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
            },
            
            # Water Conservation Systems (4 products)
            {
                'name': 'Rainwater Harvesting System',
                'description': 'Complete rainwater collection and filtration system. Government water conservation subsidy eligible. 10,000L capacity with purification.',
                'price': Decimal('42000.00'),
                'quantity': 18,
                'category': 'sustainable',
                'image': 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
            },
            {
                'name': 'Micro-Sprinkler Kit Advanced',
                'description': 'Water-efficient micro-sprinkler irrigation. 60% water savings with uniform coverage. Government eco-certification for sustainable farming.',
                'price': Decimal('16000.00'),
                'quantity': 35,
                'category': 'sustainable',
                'image': 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
            },
            {
                'name': 'Greywater Recycling Plant',
                'description': 'Farm greywater treatment and reuse system. Reduces water consumption by 50%. Eco-friendly wastewater management with government approval.',
                'price': Decimal('35000.00'),
                'quantity': 15,
                'category': 'sustainable',
                'image': 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
            },
            {
                'name': 'Smart Water Management Controller',
                'description': 'IoT-based water management with real-time monitoring. Mobile app control with water usage analytics. Precision irrigation technology.',
                'price': Decimal('22000.00'),
                'quantity': 28,
                'category': 'sustainable',
                'image': 'https://images.unsplash.com/photo-1574180045827-681f8a1a9622?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
            }
        ]
        
        # Clear existing sustainable products
        from accounts.models import Product
        existing_count = Product.objects.filter(category='sustainable').count()
        if existing_count > 0:
            Product.objects.filter(category='sustainable').delete()
            self.stdout.write(f'🗑️  Cleared {existing_count} existing sustainable products')
        
        # Create new products
        products_to_create = []
        for product_data in sustainable_products:
            product = Product(**product_data)
            products_to_create.append(product)
        
        # Bulk create all products
        created_products = Product.objects.bulk_create(products_to_create)
        
        # 🔧 FIX: Handle multiple banners properly
        try:
            # Use filter().first() instead of get() to avoid MultipleObjectsReturned
            banner = Banner.objects.filter(section='sustainable').first()
            if banner:
                if banner.related_category != 'sustainable':
                    banner.related_category = 'sustainable'
                    banner.save()
                    self.stdout.write('✅ Updated banner linking to sustainable category')
                else:
                    self.stdout.write('✅ Banner already properly linked to sustainable category')
            else:
                self.stdout.write('⚠️  No sustainable banner found - run create_all_banners command first')
                
            # Clean up duplicate banners (optional)
            sustainable_banners = Banner.objects.filter(section='sustainable')
            if sustainable_banners.count() > 1:
                # Keep the first one, delete the rest
                banners_to_delete = sustainable_banners[1:]
                for banner_to_delete in banners_to_delete:
                    banner_to_delete.delete()
                self.stdout.write(f'🧹 Cleaned up {len(banners_to_delete)} duplicate sustainable banners')
                
        except Exception as e:
            self.stdout.write(f'⚠️  Banner check failed: {e}')
        
        self.stdout.write(
            self.style.SUCCESS(
                f'✅ Successfully created {len(created_products)} sustainable products!'
            )
        )
        
        # Display summary
        self.stdout.write('\n' + '='*60)
        self.stdout.write('🌱 SUSTAINABLE FARMING SOLUTIONS - 20 PRODUCTS ADDED')
        self.stdout.write('='*60)
        self.stdout.write(f'💰 Total Products: {len(sustainable_products)}')
        self.stdout.write(f'📦 Total Stock: {sum(p["quantity"] for p in sustainable_products)} units')
        self.stdout.write(f'💵 Catalog Value: ₹{sum(p["price"] for p in sustainable_products):,}')
        self.stdout.write('='*60)
