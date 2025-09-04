from accounts.forms import ProductUploadForm
from accounts.models import CustomUser
from django.core.files import File
import os

def upload_rice_images():
    farmer_user = CustomUser.objects.filter(roles__name="Farmer").first()
    if not farmer_user:
        print("No farmer user found.")
        return

    rice_folder = r"D:\agribazaar\static\images\rice"
    for filename in os.listdir(rice_folder):
        filepath = os.path.join(rice_folder, filename)

        with open(filepath, "rb") as f:
            form = ProductUploadForm(
                data={
                    "productName": filename.split(".")[0],
                    "price": 100,
                    "quantity": 50,
                    "description": "Bulk uploaded rice product",
                    "category": "grains",
                },
                files={"images": File(f)},
            )

            if form.is_valid():
                form.save(user=farmer_user)
                print(f"Uploaded {filename}")
            else:
                print(f"Failed {filename}: {form.errors}")
