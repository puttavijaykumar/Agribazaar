from django.contrib import admin
from .models import CustomUser,Role
from django.contrib.auth.admin import UserAdmin
from .models import Offer, MarketPrice,MarketplaceProduct,product_farmer
from .models import Negotiation,NegotiationMessage,NegotiationSetting,LogActivity


class CustomUserAdmin(UserAdmin):
    model = CustomUser
    fieldsets = UserAdmin.fieldsets + (
       ("User Roles", {"fields": ("roles",)}),
    )
    filter_horizontal = ("roles",)
    
admin.site.register(Role) 
admin.site.register(CustomUser) 
admin.site.register(Offer)
admin.site.register(MarketPrice)
# admin.site.register(MarketplaceProduct)
admin.site.register(product_farmer)
admin.site.register(Negotiation)
admin.site.register(NegotiationMessage)
admin.site.register(NegotiationSetting)


@admin.register(MarketplaceProduct)
class MarketplaceProductAdmin(admin.ModelAdmin):
    list_display = ['name', 'category', 'price']

@admin.register(LogActivity)
class LogActivityAdmin(admin.ModelAdmin):
    list_display = ['user', 'activity_type', 'timestamp', 'description']
    list_filter = ['activity_type', 'timestamp', 'user']
    search_fields = ['user__username', 'description']
    readonly_fields = ['user', 'activity_type', 'description', 'timestamp']
