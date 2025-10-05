# management/commands/fix_seasonal_banner.py
from django.core.management.base import BaseCommand
from accounts.models import Banner  # Replace with your actual app name

class Command(BaseCommand):
    help = 'Fix Seasonal Harvest Sale banner configuration with permanent banner image'
    
    def handle(self, *args, **options):
        # Get or create the seasonal harvest banner
        banner, created = Banner.objects.get_or_create(
            section='harvest',
            defaults={
                'title': 'Seasonal Harvest Sale',
                'subtitle': 'Up to 30% OFF on Storage Containers & Processing Equipment',
                'description': 'Limited Time Offer - Professional storage solutions and processing equipment for efficient harvest management. Quality guaranteed with best prices.',
                'discount_badge': '30% OFF',
                'page_slug': 'seasonal-harvest-sale',
                'related_category': 'harvest',  # ⭐ This must match Product.category
                # ⭐ Permanent banner image from Unsplash (free to use commercially)
                'image': 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=1200&h=400&fit=crop&crop=center&auto=format&q=80'
            }
        )
        
        if not created:
            # Update existing banner to ensure correct configuration
            banner.related_category = 'harvest'
            banner.description = 'Limited Time Offer - Professional storage solutions and processing equipment for efficient harvest management. Quality guaranteed with best prices.'
            # Update with permanent banner image
            banner.image = 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=1200&h=400&fit=crop&crop=center&auto=format&q=80'
            banner.save()
            self.stdout.write('Updated existing banner with permanent image')
        else:
            self.stdout.write('Created new banner with permanent image')
            
        self.stdout.write(f'Banner related_category: {banner.related_category}')
        self.stdout.write(f'Banner image URL: {banner.image}')
        
        # Check products in harvest category
        from accounts.models import Product
        harvest_products = Product.objects.filter(category='harvest')
        self.stdout.write(f'Products with category="harvest": {harvest_products.count()}')
        
        if harvest_products.exists():
            self.stdout.write('Harvest products found:')
            for product in harvest_products:
                self.stdout.write(f'  - {product.name} (₹{product.price})')
        else:
            self.stdout.write('⚠️  No harvest products found. Run: python manage.py add_seasonal_harvest_products')
            
        # Display banner summary
        self.stdout.write('\n' + '='*60)
        self.stdout.write('SEASONAL HARVEST SALE BANNER CONFIGURED')
        self.stdout.write('='*60)
        self.stdout.write(f'Title: {banner.title}')
        self.stdout.write(f'Subtitle: {banner.subtitle}')
        self.stdout.write(f'Slug: {banner.page_slug}')
        self.stdout.write(f'Related Category: {banner.related_category}')
        self.stdout.write(f'Discount Badge: {banner.discount_badge}')
        self.stdout.write('Image: ✅ Permanent harvest storage image added')
        self.stdout.write('='*60)
