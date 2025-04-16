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

@login_required(login_url='/login/')
def product_list_farmer(request):
    """ View for farmers to list products """
    # Check if user has the "Farmer" role (Fix applied)
    user_roles = request.user.roles.all()
    if not any(role.name.lower() == 'farmer' for role in user_roles):  
        messages.error(request, "Access denied: You must be a Farmer to list products.")
        return redirect('home')  
    
   
    if request.method == "POST":                                                    
        productName = request.POST.get("productName")
        description = request.POST.get("description")
        price = request.POST.get("price")
        quantity = request.POST.get("quantity")
        image = request.FILES.get("images")
        video = request.FILES.get("video")

        # Validate input
        if not productName or not description or not price:
            messages.error(request, "All fields except video are required.")
            return redirect("product_list_farmer")

        # Save product to database
        product = product_farmer(
            productName=productName,
            description=description,
            price=price,
            quantity=quantity,
            images=image,
            product_vedio=video,
            product_farmer=request.user #assigned to the logged in user
        )
        product.save()
        
        messages.success(request, "Product uploaded successfully!")
        return redirect("product_list_farmer")
    
    return render(request, "product_list_farmer.html")

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

def cart_view(request):
    cart_items = CartItem.objects.filter(user=request.user)
    total = sum(item.product.price * item.quantity for item in cart_items)
    return render(request, 'cart.html',{
        "cart_items": cart_items,
        "total": total,
    })

@login_required
def add_to_cart(request, product_id):
    # logic to add product to cart using session or model
    return JsonResponse({'message': 'Item added to cart'})


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
@require_POST 
def search_products(request):
    try:
        # Parse JSON data from request body
        data = json.loads(request.body)
        search_query = data.get('search_query', '').strip()
        
        if not search_query:
            return JsonResponse({'error': 'Empty search query'}, status=400)
        if search_query == ABUSIVE_WORDS :
            return JsonResponse({'error': 'no abusing words should use otherwise We will block you from the website'}, status=400)
        
        products = product_farmer.objects.filter(name__icontains=search_query )  
          
        product_data = []
        for product in products:       
            image_url = CloudinaryImage(product.images.public_id).build_url(
                width=400,
                height=400,
                crop='fill',
                format='webp'
            ) if product.images else None

            # Build video URL
            video_url = CloudinaryVideo(product.product_vedio.public_id).build_url(
                resource_type="video",
                transformation=[
                    {'width': 600, 'crop': 'scale'},
                    {'fetch_format': 'auto'}
                ]
            ) if product.product_vedio else None

            product_data.append({
                'id': product.id,
                'productName': product.productName,
                'price': product.price,
                'quantity': product.quantity,
                'description': product.description,
                'image_url': image_url,
                'video_url': video_url,
                'farmer': product.product_farmer.username
            })
        
        return JsonResponse({'products': product_data}, safe=False)
    
    except json.JSONDecodeError:
        return JsonResponse({'error': 'Invalid JSON format'}, status=400)
    
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)
    
def product_detail(request, id):
    product = get_object_or_404(MarketplaceProduct, id=id)
    return render(request, 'product_detail.html', {'product': product})

# Display the farmer products 
def farmer_products_view(request):
    farmer_products = product_farmer.objects.all().order_by('-uploaded_at')
    return render(request, 'farmer_disp_products.html', {'farmer_products': farmer_products})