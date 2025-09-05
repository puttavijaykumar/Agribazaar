from django.contrib.postgres.operations import TrigramExtension
from django.db import migrations

class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0016_logactivity_product_farmer'),  # last migration
    ]

    operations = [
        TrigramExtension(),
    ]
