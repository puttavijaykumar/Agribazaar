# accounts/tests/test_views_login.py
from django.test import TestCase, Client
from django.urls import reverse
from accounts.models import CustomUser, Role

class LoginViewTest(TestCase):
    def setUp(self):
        self.client = Client()
        self.login_url = reverse('login')
        self.farmer_role = Role.objects.create(name="Farmer")
        self.buyer_role = Role.objects.create(name="Buyer")

        # Create users with UNIQUE phone numbers
        self.user_farmer_buyer = CustomUser.objects.create_user(
            username="farmer_buyer",
            email="fb@example.com",
            phone_number="+1234567890",  # Unique
            password="ValidPass123"
        )
        self.user_farmer_buyer.roles.add(self.farmer_role, self.buyer_role)

    # Test 1: GET request to login page
    def test_login_page_get_request(self):
        response = self.client.get(self.login_url)
        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed(response, "login.html")

    # Test 2: Login with valid credentials (Farmer + Buyer roles)
    def test_login_with_both_roles(self):
        response = self.client.post(self.login_url, {
            "username": "farmer_buyer",
            "password": "ValidPass123"
        })
        self.assertTemplateUsed(response, "role_selection.html")

   