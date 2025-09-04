import os
import django
from django.conf import settings
import cloudinary
import cloudinary.uploader
import random

# Set up Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'agribazaar.settings')
django.setup()

from accounts.models import product_farmer, CustomUser, Role

def populate_products():
    """
    Creates and saves a list of sample products with working images to the database.
    """
    try:
        # Get a farmer user to link the products to
        farmer_role = Role.objects.get(name='Farmer')
        farmer_user = CustomUser.objects.filter(roles=farmer_role).first()

        if not farmer_user:
            print("No farmer user found. Please create a farmer user first.")
            return

        products_to_add = [
            {'productName': 'Wheat', 'price': random.randint(2000, 3000), 'quantity': random.randint(300, 700), 'category': 'grains', 'description': 'High-quality wheat from local farms.'},
            {'productName': 'Rice', 'price': random.randint(2500, 3500), 'quantity': random.randint(500, 1000), 'category': 'grains', 'description': 'Basmati rice, a staple for every meal.'},
            {'productName': 'Onions', 'price': random.randint(1000, 2000), 'quantity': random.randint(800, 1200), 'category': 'vegetables', 'description': 'Fresh and crisp onions, perfect for cooking.'},
            {'productName': 'Tomatoes', 'price': random.randint(700, 1500), 'quantity': random.randint(1000, 1500), 'category': 'vegetables', 'description': 'Juicy red tomatoes, ripened under the sun.'},
            {'productName': 'Mangoes', 'price': random.randint(1000, 2000), 'quantity': random.randint(200, 500), 'category': 'fruits', 'description': 'Sweet Alphonso mangoes, a seasonal delight.'},
            {'productName': 'Potatoes', 'price': random.randint(800, 1200), 'quantity': random.randint(1200, 2000), 'category': 'vegetables', 'description': 'Farm-fresh potatoes, suitable for all dishes.'},
        ]

        # Use publicly accessible image URLs
        image_urls = {
            'Wheat': 'https://i.imgur.com/kM3P1Lq.jpeg',
            'Rice': 'https://i.imgur.com/Fj4B8iK.jpeg',
            'Onions': 'https://i.imgur.com/4qD8YpM.jpeg',
            'Tomatoes': 'https://i.imgur.com/839bH3H.jpeg',
            'Mangoes': 'https://i.imgur.com/eBf252t.jpeg',
            'Potatoes': 'https://i.imgur.com/t4T7s1d.jpeg',
        }
        
        products_added_count = 0

        for product_data in products_to_add:
            product_name = product_data['productName']
            image_url = image_urls.get(product_name)

            if image_url:
                try:
                    # Upload image to Cloudinary
                    uploaded_image = cloudinary.uploader.upload(image_url, folder="agribazaar_products")
                    
                    # Create a new product instance with the Cloudinary URL
                    product_farmer.objects.create(
                        **product_data,
                        images=uploaded_image['secure_url'],
                        product_farmer=farmer_user
                    )
                    products_added_count += 1
                    print(f"✅ Successfully added {product_name} with image to the database.")

                except Exception as e:
                    print(f"❌ Failed to upload image or add product for {product_name}: {e}")
            else:
                print(f"⚠️ No image URL found for {product_name}, skipping.")
        
        if products_added_count > 0:
            print(f"\n✅ All {products_added_count} products added successfully.")
        else:
            print("\n⚠️ No products were added. Please check the script for errors.")

    except Exception as e:
        print(f"An error occurred during population: {e}")

if __name__ == '__main__':
    print("Populating products with images...")
    populate_products()