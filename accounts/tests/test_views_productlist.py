# tests/test_views.py
from django.test import TestCase, Client
from django.urls import reverse
from django.contrib.auth import get_user_model
from django.contrib.messages import get_messages
from unittest.mock import patch
from accounts.forms import ProductUploadForm
from accounts.models import product_farmer, NegotiationSetting, Role

User = get_user_model()

class ProductListFarmerTests(TestCase):
    def setUp(self):
        self.client = Client()
        self.url = reverse('product_list_farmer')
        
        # Create roles
        self.farmer_role = Role.objects.create(name='Farmer')
        self.buyer_role = Role.objects.create(name='Buyer')
        
        # Create test users
        self.farmer = User.objects.create_user(
            email='farmer@test.com', 
            password='testpass123'
        )
        self.farmer.roles.add(self.farmer_role)
        
        self.non_farmer = User.objects.create_user(
            email='buyer@test.com',
            password='testpass123'
        )
        self.non_farmer.roles.add(self.buyer_role)

    def test_unauthenticated_access(self):
        response = self.client.get(self.url)
        self.assertRedirects(response, '/login/?next=/products/list/')

    def test_non_farmer_access(self):
        self.client.login(email='buyer@test.com', password='testpass123')
        response = self.client.get(self.url)
        messages = list(get_messages(response.wsgi_request))
        self.assertEqual(str(messages[0]), "Access denied: You must be a Farmer to list products.")
        self.assertRedirects(response, reverse('home'))

    def test_farmer_get_request(self):
        self.client.login(email='farmer@test.com', password='testpass123')
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed(response, 'product_list_farmer.html')
        self.assertIsInstance(response.context['form'], ProductUploadForm)

    @patch('cloudinary.uploader.destroy')
    def test_valid_form_submission(self, mock_destroy):
        self.client.login(email='farmer@test.com', password='testpass123')
        form_data = {
            'name': 'Organic Apples',
            'description': 'Fresh organic apples',
            'price': 2.99,
            'quantity': 100,
            'negotiation_type': 'FIXED',
            'validity_hours': 24,
            'validity_days': 1
        }
        
        response = self.client.post(self.url, data=form_data)
        messages = list(get_messages(response.wsgi_request))
        
        self.assertEqual(product_farmer.objects.count(), 1)
        self.assertEqual(NegotiationSetting.objects.count(), 1)
        self.assertEqual(str(messages[0]), "Product uploaded successfully!")
        self.assertRedirects(response, self.url)

    @patch('cloudinary.uploader.destroy')
    def test_rejected_content_submission(self, mock_destroy):
        self.client.login(email='farmer@test.com', password='testpass123')
        
        # Mock form with rejected content attributes
        with patch('your_app.forms.ProductUploadForm') as mock_form:
            mock_instance = mock_form.return_value
            mock_instance.is_valid.return_value = True
            mock_instance.rejected_image_public_id = 'rejected_img123'
            mock_instance.rejected_video_public_id = 'rejected_vid456'
            
            response = self.client.post(self.url, {})
            
        # Refresh user from DB
        self.farmer.refresh_from_db()
        
        # Verify Cloudinary deletions
        mock_destroy.assert_any_call('rejected_img123')
        mock_destroy.assert_any_call('rejected_vid456')
        
        # Verify user blocking
        self.assertFalse(self.farmer.is_active)
        
        # Verify messages and redirect
        messages = list(get_messages(response.wsgi_request))
        self.assertEqual(str(messages[0]), "Your account has been blocked due to inappropriate content.")
        self.assertRedirects(response, reverse('home'))

    def test_invalid_form_submission(self):
        self.client.login(email='farmer@test.com', password='testpass123')
        response = self.client.post(self.url, data={})
        messages = list(get_messages(response.wsgi_request))
        self.assertEqual(str(messages[0]), "Please correct the errors in the form.")
        self.assertEqual(response.status_code, 200)

    @patch('cloudinary.uploader.destroy')
    def test_negotiation_settings_update(self, mock_destroy):
        self.client.login(email='farmer@test.com', password='testpass123')
        
        # First submission
        self.client.post(self.url, {
            'name': 'Test Product',
            'price': 10.00,
            'negotiation_type': 'FIXED',
            'validity_hours': 24
        })
        
        # Second submission with different values
        self.client.post(self.url, {
            'name': 'Test Product',
            'price': 10.00,
            'negotiation_type': 'NEGOTIABLE',
            'validity_days': 2
        })
        
        product = product_farmer.objects.first()
        settings = NegotiationSetting.objects.get(product=product)
        
        self.assertEqual(NegotiationSetting.objects.count(), 1)
        self.assertEqual(settings.negotiation_type, 'NEGOTIABLE')
        self.assertEqual(settings.validity_days, 2)

    def test_blocked_user_access(self):
        # Block the user first
        self.farmer.is_active = False
        self.farmer.save()
        
        self.client.login(email='farmer@test.com', password='testpass123')
        response = self.client.get(self.url)
        self.assertRedirects(response, reverse('home'))