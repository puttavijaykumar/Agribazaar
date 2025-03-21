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
from django.contrib.auth.decorators import login_required
# from .utils import generate_email_verification_link
# from .utils import generate_email_verification_link
from django.contrib.auth import get_user_model
User = get_user_model()

def register_view(request):
    if request.method == "POST":
        form = RegisterForm(request.POST)
        if form.is_valid():
            user = form.save(commit=False)
            user.is_active = False  # Deactivate user until email verification
            user.save()
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
            login(request, user)
            return redirect("home")  # Redirect to home
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
    return render(request, "home.html") # Make sure home.html exists in templates folder

@login_required(login_url='/login/')
def product_list_farmer(request):
    if not request.user.is_authenticated or request.user.role != 'farmer':  
        return redirect('home')  # Redirect non-farmers to home
    # # Ensure only farmers can access this page
    # if getattr(request.user,"role",None) != 'farmer':  
    #     return redirect('home')  # Redirect non-farmers to home
    
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
    
    return render(request, "farmer_dashboard.html")
