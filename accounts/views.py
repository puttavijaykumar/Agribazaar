from django.contrib.auth import login, logout, authenticate
from django.shortcuts import render, redirect
from django.contrib.auth.models import User
from django.contrib.sites.shortcuts import get_current_site
from django.template.loader import render_to_string
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes, force_str
from django.contrib.auth.tokens import default_token_generator
from django.core.mail import send_mail, BadHeaderError
from django.http import HttpResponse
from django.urls import reverse
from .forms import RegisterForm
from django.contrib import messages
import logging
logger = logging.getLogger(__name__)
from .models import product_farmer
import json
from django.http import JsonResponse
from django.contrib.auth.decorators import login_required
from .models import Role, CustomUser 
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.csrf import csrf_protect
from django.contrib.auth import get_user_model
from .models import FarmerWallet, Transaction, PayoutRequest
from .models import Offer, MarketPrice,MarketplaceProduct
User = get_user_model()

def register_view(request):
    if request.method == "POST":
        form = RegisterForm(request.POST)
        if form.is_valid():
            user = form.save(commit=False)

            selected_roles = form.cleaned_data.get("roles", [])  # Get selected roles
            
            user.is_active = False  # Deactivate user until email verification
            user.save()      # Save user first to get an ID
            
             # Assign roles based on selection
            for role_name in selected_roles:
                role, created = Role.objects.get_or_create(name=role_name.capitalize())  
                user.roles.add(role)
                
            send_otp_email(request, user)
            return redirect(verify_otp)
           
    else:
        form = RegisterForm()
    return render(request, "register.html", {"form": form})

def login_view(request):   
    if request.method == "POST":
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)
        if user is not None: # If the authentication is succeeds
            login(request, user)  # Logs in the user
            user_roles = user.roles.values_list("name", flat=True)

            if "Farmer" in user_roles and "Buyer" in user_roles:
                # Let user choose where to go
                return render(request, "role_selection.html")
            elif "Farmer" in user_roles:
                return redirect("farmer_dashboard")
            elif "Buyer" in user_roles:
                return redirect("buyer_dashboard")

            return redirect("default_dashboard")  # Default redirect if no roles found

        else: #If authentication fails   
            return render(request, "login.html", {"error": "Invalid Credentials"})
    return render(request, "login.html")

def logout_view(request):
    logout(request)
    return redirect("login")  # Redirect to login page after logout

import random
from django.core.cache import cache  # optional for storing OTP
from datetime import timedelta

def send_otp_email(request, user):
    try:
        otp = random.randint(100000, 999999)

        # Save OTP to session or use cache/db
        request.session['otp'] = str(otp)
        request.session['otp_user_id'] = user.id
        request.session.set_expiry(300)  # OTP expires in 5 minutes

        subject = "AgriBazaar Account OTP Verification"
        message = f"Hello {user.username},\n\n Your OTP for AgriBazaar email verification is: {otp}\n\nIt is valid for 5 minutes.\n\nThank you!"
        from_email = 'vijaykumarputta08@gmail.com'
        send_mail(subject, message, from_email, [user.email])
        
       
        messages.success(request, "OTP has been sent to your email. Please enter it to verify your account.")
        
        logger.info(f"✅ OTP sent to {user.email}")
        return redirect("verify_otp")  # Page where user enters OTP

    except BadHeaderError:
        logger.error("🚨 Invalid header found while sending OTP email.")
        return HttpResponse("Invalid header found.")
    except Exception as e:
        logger.error(f"🚨 OTP Email sending failed: {e}")
        return HttpResponse("OTP sending failed.")

@login_required
def resend_otp(request):
    try:
        user = request.user
        return send_otp_email(request, user)  # Resend OTP logic is same
    except Exception as e:
        logger.error(f"🚨 Resend OTP failed: {e}")
        messages.error(request, "Unable to resend OTP. Please try again later.")
        return redirect("verify_otp")
    
def verify_otp(request):
    
    if request.method == "POST":
        entered_otp = request.POST.get("otp")
        session_otp = request.session.get("otp")
        user_id = request.session.get("otp_user_id")

        if entered_otp and session_otp and entered_otp == session_otp:
            try:
                user = User.objects.get(id=user_id)
                user.is_active = True
                user.save()
                messages.success(request, "Your email has been verified successfully!")
                logger.info(f"✅ OTP verified and user {user.email} activated.")
                return redirect("login")
            except User.DoesNotExist:
                messages.error(request, "User does not exist.")
                return redirect("register")
        else:
            messages.error(request, "Invalid OTP. Please try again.")
            return redirect("verify_otp")
    
    return render(request, "otp/verify_otp.html")  # your template
        
import requests
def home(request):
    category_icons = [
        {'category': 'seeds', 'icon': '🌱'},
        {'category': 'fertilizers', 'icon': '🌿'},
        {'category': 'tools', 'icon': '🔧'},
        {'category': 'equipment', 'icon': '🚜'},
        {'category': 'organic', 'icon': '🥦'},
    ]
    crop_images = [
        {'crop': 'wheat', 'image': 'wheat.png'},
        {'crop': 'rice', 'image': 'rice.jpeg'},
        {'crop': 'maize', 'image': 'maize.png'},
        {'crop': 'sugarcane', 'image': 'sugarcane.jpeg'},
        {'crop': 'vegetables', 'image': 'vegetables.jpg'}
    ]
    offers = Offer.objects.filter(active=True)
    prices = MarketPrice.objects.all()
    url = 'https://newsapi.org/v2/everything?q=farming%20agriculture&apiKey=f986edd1afe64a47988b934616f61f81&pageSize=3&language=en'
    response = requests.get(url)
    news_data = response.json()

    farming_news = []
    if news_data.get("status") == "ok":
        for article in news_data["articles"]:
            farming_news.append({
                "title": article["title"],
                "summary": article["description"] or "",
            })

    return render(request, "home.html",{
        'category_icons':category_icons,
        'offers': offers,
        'market_prices': prices,
        'crop_images': crop_images,
        'farming_news': farming_news,
    })
   

@login_required(login_url='/login/')
def default_dashboard(request):
    return render(request, "default_dashboard.html")

@login_required(login_url='/login/')
def farmer_dashboard(request):
    """ Renders the farmer dashboard without handling POST requests for role selection. """

    # Debugging: Print the request method
    print("Request method:", request.method)  

    # Only render the dashboard on GET request
    return render(request, "farmer_dashboard.html")

@csrf_exempt # Use this only for testing; better use CSRF tokens properly
def role_selection_view(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            selected_role = data.get("role")

            if selected_role == "Farmer":
                return JsonResponse({"redirect": "/farmer/dashboard/?role=Farmer"})  
            elif selected_role == "Buyer":
                return JsonResponse({"redirect": "/buyer/dashboard/?role=Buyer"})  
            else:
                return JsonResponse({"error": "Invalid role"}, status=400)

        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON"}, status=400)

    return JsonResponse({"error": "Invalid request method"}, status=405)

from .forms import ProductUploadForm
import cloudinary.uploader
@login_required(login_url='/login/')
def product_list_farmer(request):
    """ View for farmers to list products """

    # Check if user has the "Farmer" role
    user_roles = request.user.roles.all()
    if not any(role.name.lower() == 'farmer' for role in user_roles):  
        messages.error(request, "Access denied: You must be a Farmer to list products.")
        return redirect('home')  

    if request.method == "POST":
        form = ProductUploadForm(request.POST, request.FILES)
        
        if form.is_valid():
            if hasattr(form, 'rejected_image_public_id') or hasattr(form, 'rejected_video_public_id'):
                if hasattr(form, 'rejected_image_public_id'):
                    cloudinary.uploader.destroy(form.rejected_image_public_id)
                if hasattr(form, 'rejected_video_public_id'):
                    cloudinary.uploader.destroy(form.rejected_video_public_id)

                # Block the user
                request.user.is_active = False
                request.user.save()
                messages.error(request, "Your account has been blocked due to inappropriate content.")
                return redirect("home")

            # Save product with logged-in user
            product = form.save(user=request.user)

            # Save negotiation settings
            negotiation_type = form.cleaned_data.get('negotiation_type')
            validity_hours = form.cleaned_data.get('validity_hours')
            validity_days = form.cleaned_data.get('validity_days')

            if negotiation_type:
                NegotiationSetting.objects.update_or_create(
                    product=product,
                    defaults={
                        'negotiation_type': negotiation_type,
                        'validity_hours': validity_hours,
                        'validity_days': validity_days,
                    }
                )

            messages.success(request, "Product uploaded successfully!")
            return redirect("product_list_farmer")
        else:
            messages.error(request, "Please correct the errors in the form.")
    else:
        form = ProductUploadForm()

    return render(request, "product_list_farmer.html", {'form': form})

@login_required
def farmer_account(request):
    farmer_wallet,created = FarmerWallet.objects.get_or_create(farmer=request.user)
    transactions = Transaction.objects.filter(farmer=request.user).order_by('-date')
    payout_requests = PayoutRequest.objects.filter(farmer=request.user).order_by('-request_date')
    
    # Debugging: Print a message if a new wallet was created
    if created:
        print(f"New wallet created for farmer: {request.user.username}")
        
    context = {
        'wallet': farmer_wallet,
        'transactions': transactions,
        'payout_requests': payout_requests
    }
    return render(request, 'accounts_dashboard.html')

from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas

@login_required
def download_transaction_pdf(request):
    farmer = request.user
    transactions = Transaction.objects.filter(farmer=farmer).order_by('-date')

    response = HttpResponse(content_type='application/pdf')
    response['Content-Disposition'] = 'attachment; filename="transaction_history.pdf"'

    pdf = canvas.Canvas(response, pagesize=letter)
    pdf.setTitle("Transaction History")
    
    # PDF Header
    pdf.setFont("Helvetica-Bold", 16)
    pdf.drawString(200, 750, "Transaction History")
    pdf.setFont("Helvetica", 12)
    pdf.drawString(50, 730, f"Farmer: {farmer.username}")

    # Table Header
    pdf.drawString(50, 700, "Order ID")
    pdf.drawString(200, 700, "Amount")
    pdf.drawString(300, 700, "Status")
    pdf.drawString(400, 700, "Date")

    y = 680  # Start position for table rows

    for transaction in transactions:
        pdf.drawString(50, y, transaction.order_id)
        pdf.drawString(200, y, f"₹{transaction.amount}")
        pdf.drawString(300, y, transaction.status)
        pdf.drawString(400, y, transaction.date.strftime("%Y-%m-%d"))
        y -= 20  # Move to the next row

        if y < 50:  # If page limit is reached, add a new page
            pdf.showPage()
            y = 750  # Reset position for new page

    pdf.showPage()
    pdf.save()
    return response

@login_required
def buyer_dashboard(request):
    category_icons = [
        {'category': 'seeds', 'icon': '🌱'},
        {'category': 'fertilizers', 'icon': '🌿'},
        {'category': 'tools', 'icon': '🔧'},
        {'category': 'equipment', 'icon': '🚜'},
        {'category': 'organic', 'icon': '🥦'},
    ]
    crop_images = [
        {'crop': 'wheat', 'image': 'wheat.png'},
        {'crop': 'rice', 'image': 'rice.jpeg'},
        {'crop': 'maize', 'image': 'maize.png'},
        {'crop': 'sugarcane', 'image': 'sugarcane.jpeg'},
        {'crop': 'vegetables', 'image': 'vegetables.jpg'}
    ]
    offers = Offer.objects.filter(active=True)
    prices = MarketPrice.objects.all()


    return render(request, "buyer_dashboard.html" ,{
        'offers': offers,
        'market_prices': prices,
        'category_icons':category_icons,
        'crop_images': crop_images,
    })
from .models import CartItem


@login_required
def add_to_cart(request):
    try:
        data = json.loads(request.body)
        product_id = data.get('product_id')
        product_type = data.get('product_type')

        if not product_id or not product_type:
            return JsonResponse({'error': 'Missing product ID or product type.'}, status=400)

        # Fetch product based on product_type
        if product_type == 'ProductFarmer':
            product = get_object_or_404(product_farmer, id=product_id)
            cart_item, created = CartItem.objects.get_or_create(
            user=request.user,
            product_farmer = product,
            defaults={'quantity': 1}
        )
        elif product_type == 'MarketPlaceProduct':
            product = get_object_or_404(MarketplaceProduct, id=product_id)
            cart_item, created = CartItem.objects.get_or_create(
            user=request.user,  
            product_marketplace = product,
            defaults={'quantity': 1}
        )
        else:
            return JsonResponse({'error': 'Invalid product type.'}, status=400)

        if not created:
            # If already in cart, increase quantity
            cart_item.quantity += 1
            cart_item.save()

        return JsonResponse({'message': 'Product added to cart successfully!'})

    except json.JSONDecodeError:
        return JsonResponse({'error': 'Invalid JSON.'}, status=400)

    except Exception as e:
        print(f"Error adding to cart: {e}")
        return JsonResponse({'error': 'Something went wrong.'}, status=500)
    
@login_required   
def view_cart(request):
    cart_items = CartItem.objects.filter(user=request.user)
    total_price = 0

    for item in cart_items:
        if item.product_farmer:
            total_price += item.quantity * item.product_farmer.price
        elif item.product_marketplace:
            total_price += item.quantity * item.product_marketplace.price

    context = {
        'cart_items': cart_items,
        'total_price': total_price,
    }
    return render(request, 'view_cart.html', context)

@login_required
def buy_product(request):
    if request.method == 'POST':
        try:
            # Get data from the POST request (form data)
            product_id = request.POST.get('product_id')
            price = request.POST.get('price')
            product_type = request.POST.get('product_type')

            if not product_id:
                return JsonResponse({'error': 'Invalid product ID provided.'}, status=400)

            # Fetch the product from the database
            product = get_object_or_404(product_farmer, id=product_id)
            
            if price is None:
                price = product.price  # Use the product's original price if price is not provided
            
            # Save the data in session for later use (like on the checkout page)
            request.session['buy_now_product_id'] = product_id
            request.session['buy_now_product_type'] = product_type  # Assuming `product_type` exists
            request.session['buy_now_price'] = price 
            
            # Redirect to checkout page or return a success message
            return redirect('checkout_buy_now')

        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
    
    else:
        return JsonResponse({'error': 'Invalid request method.'}, status=405)
    
def checkout_buy_now(request):
    # Fetch data from session
    product_id = request.session.get('buy_now_product_id')
    product_type = request.session.get('buy_now_product_type')
    price = request.session.get('buy_now_price', 0) 
    
    if not product_id or not product_type:
        # If session is empty, redirect to cart or home
        return redirect('view_cart')  # or 'home' or wherever you want

    # Fetch product based on type
    product = None
    if product_type == 'ProductFarmer':
        product = product_farmer.objects.filter(id=product_id).first()
    elif product_type == 'ProductMarketplace':
        product = MarketplaceProduct.objects.filter(id=product_id).first()

    if not product:
        # Redirect back to the page the user came from
        referer = request.META.get('HTTP_REFERER')
        if referer:
            return redirect(referer)
        else:    
            return redirect('view_cart')  
        
    context = {
        'product': product,
        'product_type': product_type,
        'price': price,  # Pass the price to the template
    }
    return render(request, 'checkout_buy_now.html', context)
 
def account(request):
    
    # Logic for account details page
    return render(request, 'account.html')

from django.shortcuts import render, get_object_or_404
from .models import MarketplaceProduct

def category_products(request, category):

    category = category.lower()
    # Validate if the category is in defined choices
    valid_categories = dict(MarketplaceProduct.CATEGORY_CHOICES).keys()
    if category not in valid_categories:
        return render(request, '404.html', status=404)  # Optional: handle invalid category

    # Filter products by the given category (case-insensitive)
    products = MarketplaceProduct.objects.filter(category__iexact=category)

    # Render the template with filtered products
    return render(request, 'category_products.html', {
        'category': category.title(),
        'products': products
    })
    
def crop_detail_view(request, crop_name):
    crop_name_lower = crop_name.lower()

    if crop_name_lower == "vegetable" or crop_name_lower == "vegetables":
        farmer_products = product_farmer.objects.filter(category__iexact="vegetables")
        market_products = MarketplaceProduct.objects.filter(category__iexact="Vegetables")
    else:
        farmer_products = product_farmer.objects.filter(productName__iexact=crop_name)
        market_products = MarketplaceProduct.objects.filter(name__icontains=crop_name)

    context = {
        'crop_name': crop_name.title(),
        'farmer_products': farmer_products,
        'market_products': market_products
    }

    return render(request, f"crops/{crop_name}.html", context)


# Smart Search Functionality
import re
from cloudinary import CloudinaryImage, CloudinaryVideo 
from django.views.decorators.http import require_POST

ABUSIVE_WORDS = ['xnxx', 'sex', 'baustard','blowjob','sexy','fuck','fuck off']

def search_results(request):
    query = request.GET.get('q', '')
    
    if any(word in query.lower() for word in ABUSIVE_WORDS):
        return render(request, 'search_results.html', {
            'products': [],
            'marketplace_products': [],
            'combined_products': [],
            'query': query,
            'abusive': True,
            'request': request
        })

    farmer_products_all = product_farmer.objects.filter(productName__icontains=query)

    now = timezone.now()
    valid_farmer_products = []

    for product in farmer_products_all:
        try:
            setting = product.negotiationsetting
            if setting.negotiation_type == 'active' and setting.validity_hours is not None:
                expiry_time = product.uploaded_at + timezone.timedelta(hours=setting.validity_hours)
                if now <= expiry_time:
                    valid_farmer_products.append(product)
            elif setting.negotiation_type == 'passive' and setting.validity_days is not None:
                expiry_time = product.uploaded_at + timezone.timedelta(days=setting.validity_days)
                if now <= expiry_time:
                    valid_farmer_products.append(product)
        except NegotiationSetting.DoesNotExist:
            # If no negotiation setting linked, assume product is valid
            valid_farmer_products.append(product)

    marketplace_products = MarketplaceProduct.objects.filter(name__icontains=query)

    # Normalize both model instances into a unified dictionary format
    def normalize_product(obj, source):
        return {
            'id': obj.id, 
            'name': getattr(obj, 'productName', getattr(obj, 'name', '')),
            'price': float(getattr(obj, 'price', 0)),
            'quantity': getattr(obj, 'quantity', getattr(obj, 'stock', 0)),
            'description': obj.description,
            'image': obj.images.url if hasattr(obj, 'images') and obj.images else (
                     obj.images_market.url if hasattr(obj, 'images_market') and obj.images_market else ''),
            'video': obj.product_vedio.url if hasattr(obj, 'product_vedio') and obj.product_vedio else '',
            'category': getattr(obj, 'get_category_display', lambda: "Farmer Product")(),
            'uploaded_at': obj.uploaded_at,
            'source': source,
            'model_name': source 
        }

    # Normalize lists
    normalized_farmer = [normalize_product(p, 'product_farmer') for p in valid_farmer_products]
    normalized_marketplace = [normalize_product(p, 'MarketplaceProduct') for p in marketplace_products]

    # Combine
    combined_products = normalized_farmer + normalized_marketplace

    return render(request, 'search_results.html', {
        'products': valid_farmer_products,
        'marketplace_products': marketplace_products,
        'combined_products': combined_products,
        'query': query,
        'request': request
    })
    
def product_detail(request, id):
    product = get_object_or_404(MarketplaceProduct, id=id)
    return render(request, 'product_detail.html', {'product': product})

#NEGOTIATION
from django.utils import timezone
from .models import NegotiationSetting, Negotiation, NegotiationMessage
@login_required
def negotiate_product(request, product_id):
    product = get_object_or_404(product_farmer, id=product_id)
    user = request.user

    # Get or create Negotiation instance for this user and product
    negotiation, created = Negotiation.objects.get_or_create(
        buyer=user,
        product=product,
        defaults={'seller': product.product_farmer}
    )
    negotiation_setting = None
    try:
        negotiation_setting = NegotiationSetting.objects.get(product=product)
    except NegotiationSetting.DoesNotExist:
        negotiation_setting = None
        
    # Check if negotiation has expired
    negotiation_expired = negotiation.is_expired()

    # Count number of messages sent by each party
    user_message_count = NegotiationMessage.objects.filter(
        negotiation=negotiation,
        sender=user
    ).count()

    max_reached = user_message_count >= 3
    latest_price_message = NegotiationMessage.objects.filter(
    negotiation=negotiation,
    proposed_price__isnull=False
    ).order_by('-timestamp').first()

    if request.method == "POST":
        if negotiation_expired:
            messages.error(request, "Negotiation has expired.")
        elif max_reached:
            messages.warning(request, "You’ve reached your 3-message negotiation limit.")
        else:
            message_text = request.POST.get('negotiation_message')
            if message_text:
                NegotiationMessage.objects.create(
                    negotiation=negotiation,
                    sender=user,
                    receiver=negotiation.product.product_farmer,  # or negotiation.product.owner
                    message=message_text
                )
                messages.success(request, "Negotiation message sent successfully!")
                return redirect('negotiate_product', product_id=product_id)

    messages_history = NegotiationMessage.objects.filter(
        negotiation=negotiation
    ).order_by('timestamp')

    context = {
        'product': product,
        'negotiation': negotiation,
        'negotiation_setting': negotiation_setting,
        'latest_proposed_price': latest_price_message.proposed_price if latest_price_message else product.price,
        'messages_history': messages_history,
        'max_reached': max_reached,
        'negotiation_expired': negotiation_expired,
    }
    return render(request, 'negotiation.html', context)


from django.core.paginator import Paginator

@login_required
def negotiation_inbox(request):
    inbox_list = NegotiationMessage.objects.filter(receiver=request.user)\
        .select_related('sender')\
        .order_by('-timestamp')

    sent_list = NegotiationMessage.objects.filter(sender=request.user)\
        .select_related('receiver')\
        .order_by('-timestamp')

    # Pagination
    inbox_paginator = Paginator(inbox_list, 5)
    sent_paginator = Paginator(sent_list, 5)

    inbox_page = inbox_paginator.get_page(request.GET.get('page'))
    sent_page = sent_paginator.get_page(request.GET.get('sent_page'))

    return render(request, 'farmer/negotiation_inbox.html', {
        'inbox_page': inbox_page,
        'sent_page': sent_page,
    })
    
@login_required
def send_negotiation_reply(request, message_id):
    original_message = get_object_or_404(NegotiationMessage, id=message_id)
    
    # Ensure only the product owner (farmer) can reply
    if request.user != original_message.receiver:
        messages.error(request, "You are not authorized to reply to this message.")
        return redirect('negotiation_inbox')

    if request.method == 'POST':
        reply_text = request.POST.get('reply')
        proposed_price = request.POST.get('proposed_price')  # from a hidden input or field
        # Determine sender/reciever Dynamically
        sender = request.user
        receiver = original_message.sender if original_message.sender != request.user else original_message.receiver
        if reply_text:
            NegotiationMessage.objects.create(
                negotiation=original_message.negotiation,
                sender=request.user,
                receiver=original_message.sender,  # Buyer becomes receiver
                message=reply_text,
                proposed_price=proposed_price if proposed_price else None
            )
            messages.success(request, "Reply sent successfully!")
    print(f"Negotiation Message created: sender={sender.username}, receiver={receiver.username}")

    return redirect('negotiation_inbox')

# admin view to monitor negotiations with real-time updates using AJAX (WebSockets can be added later if needed):
from django.contrib.admin.views.decorators import staff_member_required
@staff_member_required
def monitor_negotiations(request):
    negotiations = Negotiation.objects.select_related('product', 'buyer', 'seller').order_by('-created_at')
    return render(request, 'admin/monitor_negotiations.html', {
        'negotiations': negotiations
    })
    
def view_marketplace_product(request, product_id):
    product = get_object_or_404(MarketplaceProduct, id=product_id)

    context = {
        'product': product
    }
    return render(request, 'view_marketplace_product.html', context)

@login_required
def add_to_cart_category_product(request):
    if request.method != 'POST':
        return JsonResponse({'error': 'Invalid request method'}, status=400)

    product_id = request.POST.get('product_id')
    quantity = int(request.POST.get('quantity', 1))

    try:
        product = MarketplaceProduct.objects.get(pk=product_id)
    except MarketplaceProduct.DoesNotExist:
        return JsonResponse({'error': 'Product not found'}, status=404)

    cart = request.session.get('cart', [])

    # Add or update product in cart
    updated = False
    for item in cart:
        if item['product_id'] == product_id and item['product_type'] == 'MarketplaceProduct':
            item['quantity'] += quantity
            updated = True
            break

    if not updated:
        cart.append({
            'product_id': product_id,
            'product_type': 'MarketPlaceProduct',
            'name': product.name,
            'price': float(product.price),
            'quantity': quantity
        })

    request.session['cart'] = cart
    return JsonResponse({'message': 'Product added to cart successfully'})

@login_required
def view_cart_category_product(request):
    session_cart = request.session.get('cart', [])
    
    # Match the product_type exactly with what's stored in add_to_cart
    category_cart = [item for item in session_cart if item.get('product_type') == 'MarketPlaceProduct']
    
    # Update prices and images from database
    for item in category_cart:
        try:
            product = MarketplaceProduct.objects.get(pk=item['product_id'])
            item['image_url'] = product.images_market.url
            # Update price from DB to ensure latest price
            item['price'] = float(product.price)
        except MarketplaceProduct.DoesNotExist:
            item['image_url'] = ''
            item['price'] = 0.0  # Handle missing products

    # Calculate cart totals
    total_quantity = sum(item['quantity'] for item in category_cart)
    subtotal = sum(item['price'] * item['quantity'] for item in category_cart)
    discount = 0  # Add discount logic if needed
    delivery_charges = 0  # Add delivery logic if needed
    total_amount = subtotal - discount + delivery_charges

    return render(request, 'category_cart_view.html', {
        'cart_items': category_cart,
        'total_quantity': total_quantity,
        'total_price': subtotal,
        'discount': discount,
        'delivery_charges': delivery_charges,
        'total_amount': total_amount,
    })

from django.http import JsonResponse

@login_required
def buy_category_product_now(request):
    if request.method == 'POST':
        # Get the form data
        product_id = request.POST.get('product_id')
        product_type = request.POST.get('product_type')
        price = request.POST.get('price')

        # Fetch the product from the database
        try:
            product = MarketplaceProduct.objects.get(id=product_id)
        except MarketplaceProduct.DoesNotExist:
            return JsonResponse({'error': 'Product not found.'}, status=404)

        # Additional logic can be placed here (e.g., updating cart, creating order, etc.)

        # Prepare context data for the checkout page
        context = {
            'product': product,
            'price': price,
            'product_type': product_type,
            # You can also add other necessary context like user info, cart items, etc.
        }

        # Render the checkout page with the context
        return render(request, 'category_product_checkout.html', context)
    
    # If the request is not POST, handle as an error or redirect
    return JsonResponse({'error': 'Invalid request method.'}, status=400)