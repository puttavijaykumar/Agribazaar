# Generated by Django 5.1.7 on 2025-03-21 19:20

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0003_customuser_is_buyer_customuser_is_farmer'),
    ]

    operations = [
        migrations.AlterField(
            model_name='customuser',
            name='is_buyer',
            field=models.BooleanField(default=True),
        ),
    ]
