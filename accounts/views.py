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
            user.save()      # Save user first to get an ID
            
             # Assign roles based on selection
            for role_name in selected_roles:
                role, created = Role.objects.get_or_create(name=role_name.capitalize())  
                user.roles.add(role)
            
            user.is_active = False  # Deactivate user until email verification
            user.save()  # Save user first to get an ID
            send_verification_email(request, user)
            return HttpResponse("Check your email to verify your account.")  
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


def send_verification_email(request, user):
    try:
        token = default_token_generator.make_token(user)
        uid = urlsafe_base64_encode(force_bytes(user.pk))
        verification_url = request.build_absolute_uri(reverse('verify_email', kwargs={'uidb64': uid, 'token': token}))
        
        subject = "Verify Your AgriBazaar Account"
        message = f"Hello {user.username},\n\nClick the link below to verify your email:\n\n{verification_url}\n\nThank you!"
        from_email = 'vijaykumarputta08@gmail.com'
        send_mail(subject, message, from_email, [user.email])
        messages.success(request, "Verification email has been sent.  check your inobx.")
        logger.info(f"✅ Verification email sent to {user.email}")
        
    except BadHeaderError:
        logger.error("🚨 Invalid header found while sending email.")
        return HttpResponse("Invalid header found.")
    
    except Exception as e:
        logger.error (f"🚨 Email sending failed: {e}")
        logger.error(f"Email sending failed: {e}")
        
def verify_email(request, uidb64, token):
    try:
        uid = force_str(urlsafe_base64_decode(uidb64))
        user = User.objects.get(pk=uid)
    except (TypeError, ValueError, OverflowError, User.DoesNotExist):
        user = None

    if user and default_token_generator.check_token(user, token):
        user.is_active = True
        user.save()
        messages.success(request, "Your email has been verified! You can now log in.")
        return redirect("login")  # Redirect to login page after successful verification
    else:
        messages.error(request, "Invalid or expired verification link. Please register again.")
        return redirect("register")  # Redirect to register page  
    

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
    return render(request, "home.html",{
        'category_icons':category_icons,
        'offers': offers,
        'market_prices': prices,
        'crop_images': crop_images,
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
# def product_list_farmer(request):
#     """ View for farmers to list products """
#     # Check if user has the "Farmer" role (Fix applied)
#     user_roles = request.user.roles.all()
#     if not any(role.name.lower() == 'farmer' for role in user_roles):  
#         messages.error(request, "Access denied: You must be a Farmer to list products.")
#         return redirect('home')  
    
   
#     if request.method == "POST":                                                    
#         productName = request.POST.get("productName")
#         description = request.POST.get("description")
#         price = request.POST.get("price")
#         quantity = request.POST.get("quantity")
#         image = request.FILES.get("images")
#         video = request.FILES.get("video")

#         # Validate input
#         if not productName or not description or not price:
#             messages.error(request, "All fields except video are required.")
#             return redirect("product_list_farmer")

#         # Save product to database
#         product = product_farmer(
#             productName=productName,
#             description=description,
#             price=price,
#             quantity=quantity,
#             images=image,
#             product_vedio=video,
#             product_farmer=request.user #assigned to the logged in user
#         )
#         product.save()
        
#         messages.success(request, "Product uploaded successfully!")
#         return redirect("product_list_farmer")
    
#     return render(request, "product_list_farmer.html")

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
    offers = Offer.objects.filter(active=True)
    prices = MarketPrice.objects.all()


    return render(request, "buyer_dashboard.html" ,{
        'offers': offers,
        'market_prices': prices,
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
    return render(request, f"crops/{crop_name}.html", {"crop": crop_name})

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



@login_required
def negotiation_inbox(request):
    inbox = NegotiationMessage.objects.filter(receiver=request.user).order_by('-timestamp')
    sent = NegotiationMessage.objects.filter(sender=request.user).order_by('-timestamp')
    
    
    # Mark all unread messages as read when viewed
    # unread_messages = inbox.filter(is_read=False)
    # unread_messages.update(is_read=True)

    return render(request, 'farmer/negotiation_inbox.html', {
        'inbox': inbox,
        'sent': sent,
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

