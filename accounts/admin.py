from django.contrib import admin
from .models import CustomUser,Role
from django.contrib.auth.admin import UserAdmin
from .models import Offer, MarketPrice,MarketplaceProduct,product_farmer
from .models import Negotiation,NegotiationMessage,NegotiationSetting


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
admin.site.register(MarketplaceProduct)
admin.site.register(product_farmer)
admin.site.register(Negotiation)
admin.site.register(NegotiationMessage)
admin.site.register(NegotiationSetting)




