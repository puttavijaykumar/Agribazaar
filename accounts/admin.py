from django.contrib import admin
from .models import AdminCatalogProduct

@admin.register(AdminCatalogProduct)
class AdminCatalogProductAdmin(admin.ModelAdmin):
    list_display = [
        'name', 
        'category', 
        'price', 
        'discount_percent', 
        'is_featured',  # Show featured status in list
        'stock'
    ]
    
    list_filter = [
        'category',
        'is_featured',  # Filter by featured
        'discount_percent'
    ]
    
    search_fields = ['name', 'description', 'farmer_name']
    
    fieldsets = (
        ('Basic Info', {
            'fields': ('name', 'category', 'description', 'price', 'stock')
        }),
        ('Images & Media', {
            'fields': ('image1',)
        }),
        ('Farmer Details', {
            'fields': ('farmer_name', 'farmer_location')
        }),
        ('Offers & Featured', {
            'fields': ('is_featured', 'discount_percent'),  # Group these together
            'description': 'Mark as featured to show in Top Offers section'
        }),
    )
