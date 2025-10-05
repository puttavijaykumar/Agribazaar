import requests
from django.core.management.base import BaseCommand
from cloudinary.uploader import upload
from accounts.models import Banner, Product
from django.utils.text import slugify


class Command(BaseCommand):
    help = "Add 'Sustainable Farming Solutions' banner and related products with Cloudinary images"

    def handle(self, *args, **options):
        # ----------------------------
        # 1️⃣  Create or update Banner
        # ----------------------------
        banner_data = {
            "section": "sustainable",
            "title": "Sustainable Farming Solutions",
            "subtitle": "Get government subsidies on eco-friendly equipment",
            "description": "Empowering farmers through renewable energy tools and eco-certified equipment that promote long-term soil health and sustainable practices.",
            "discount_badge": "Eco-Certified",
            "page_slug": "sustainable-farming-solutions",
            "related_category": "sustainable",
            "image_url": "https://images.unsplash.com/photo-1590402494682-9f08d1e86d4d",
        }

        banner, created = Banner.objects.get_or_create(
            page_slug=banner_data["page_slug"],
            defaults={
                "section": banner_data["section"],
                "title": banner_data["title"],
                "subtitle": banner_data["subtitle"],
                "description": banner_data["description"],
                "discount_badge": banner_data["discount_badge"],
                "related_category": banner_data["related_category"],
            },
        )

        if created or not banner.image:
            try:
                self.stdout.write("📤 Uploading banner image...")
                upload_result = upload(
                    banner_data["image_url"], folder="agribazaar/banners"
                )
                banner.image = upload_result["public_id"]
                banner.save()
                self.stdout.write(self.style.SUCCESS("✅ Banner created/updated successfully."))
            except Exception as e:
                self.stdout.write(self.style.ERROR(f"❌ Banner image upload failed: {e}"))
        else:
            self.stdout.write(self.style.WARNING("⚠️ Banner already exists — skipped."))

        # ------------------------------------
        # 2️⃣  Add products under this category
        # ------------------------------------
        products_data = [
            {
                "name": "Solar-Powered Water Pump",
                "description": "Energy-efficient pump powered entirely by solar energy for sustainable irrigation.",
                "price": 18500.00,
                "quantity": 10,
                "image_url": "https://images.unsplash.com/photo-1603112579763-70f2e7ec7bb1",
            },
            {
                "name": "Compost Bioreactor",
                "description": "Accelerates composting process and turns organic waste into fertilizer within days.",
                "price": 7600.00,
                "quantity": 25,
                "image_url": "https://images.unsplash.com/photo-1586773860414-9e00b9e9a84b",
            },
            {
                "name": "Drip Irrigation Kit (Eco Edition)",
                "description": "Smart water-saving irrigation system ideal for sustainable farms.",
                "price": 9200.00,
                "quantity": 18,
                "image_url": "https://images.unsplash.com/photo-1626882048554-b5b0fcb4b26d",
            },
            {
                "name": "Biodegradable Mulch Film",
                "description": "Decomposes naturally in soil, reduces weed growth and soil evaporation.",
                "price": 2300.00,
                "quantity": 40,
                "image_url": "https://images.unsplash.com/photo-1501004318641-b39e6451bec6",
            },
            {
                "name": "Wind-Powered Grain Dryer",
                "description": "Uses wind energy to gently dry harvested grains — cuts energy costs by 80%.",
                "price": 25500.00,
                "quantity": 5,
                "image_url": "https://images.unsplash.com/photo-1528137871618-79d2761e3fd5",
            },
        ]

        added, skipped = 0, 0

        for item in products_data:
            if Product.objects.filter(name=item["name"]).exists():
                skipped += 1
                self.stdout.write(self.style.WARNING(f"⚠️ Skipping existing: {item['name']}"))
                continue

            try:
                self.stdout.write(f"📤 Uploading image for {item['name']}...")
                upload_result = upload(item["image_url"], folder="agribazaar/sustainable")

                Product.objects.create(
                    name=item["name"],
                    description=item["description"],
                    price=item["price"],
                    quantity=item["quantity"],
                    image=upload_result["public_id"],
                    category="sustainable",
                )
                added += 1
                self.stdout.write(self.style.SUCCESS(f"✅ Added: {item['name']}"))

            except Exception as e:
                self.stdout.write(self.style.ERROR(f"❌ Failed to add {item['name']}: {e}"))

        self.stdout.write(self.style.SUCCESS(f"\nSummary: {added} added, {skipped} skipped."))
