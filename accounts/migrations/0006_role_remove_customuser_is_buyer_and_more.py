# Generated by Django 5.1.7 on 2025-03-26 08:25

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0005_product_show'),
    ]

    operations = [
        migrations.CreateModel(
            name='Role',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=15, unique=True)),
            ],
        ),
        migrations.RemoveField(
            model_name='customuser',
            name='is_buyer',
        ),
        migrations.RemoveField(
            model_name='customuser',
            name='is_farmer',
        ),
        migrations.AddField(
            model_name='customuser',
            name='roles',
            field=models.ManyToManyField(related_name='users', to='accounts.role'),
        ),
    ]
