# Generated by Django 5.1.7 on 2025-05-11 08:28

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0013_alter_negotiationmessage_timestamp'),
    ]

    operations = [
        migrations.AddField(
            model_name='product_farmer',
            name='category',
            field=models.CharField(choices=[('fruits', 'Fruits'), ('vegetables', 'Vegetables'), ('grains', 'Grains'), ('others', 'Others')], default='others', max_length=20),
        ),
    ]
