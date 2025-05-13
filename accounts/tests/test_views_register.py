from django.test import TestCase, Client
from django.urls import reverse
from accounts.models import CustomUser, Role
from unittest.mock import patch

class RegisterViewTest(TestCase):
    def setUp(self):
        self.client = Client()
        self.register_url = reverse('register')
        self.valid_data = {
            'username': 'testuser',
            'email': 'test@example.com',
            'phone_number': '1234567890',
            'password1': 'ValidPassword123!',  # Meets complexity requirements
            'password2': 'ValidPassword123!',
            'roles': ['farmer', 'buyer']
        }

    # Test 1: GET request renders form (no changes)

    # Test 2: Valid POST creates user and redirects
    @patch('accounts.views.send_otp_email')
    def test_valid_post_creates_user_and_redirects(self, mock_send_otp):
        response = self.client.post(self.register_url, data=self.valid_data)
        self.assertEqual(CustomUser.objects.count(), 1)  # Ensure user exists
        user = CustomUser.objects.get(username='testuser')
        self.assertRedirects(response, reverse('verify_otp'))
        mock_send_otp.assert_called_once()

    # Test 3: Invalid POST (password mismatch)
    def test_invalid_post_does_not_create_user(self):
        invalid_data = self.valid_data.copy()
        invalid_data['password2'] = 'wrongpassword'
        response = self.client.post(self.register_url, data=invalid_data)
        self.assertEqual(response.status_code, 200)  # Form re-renders
        self.assertFormError(response.context['form'], 'password2', 'The two password fields didn’t match.')

    # Test 4: Duplicate phone number
    def test_duplicate_phone_number(self):
        CustomUser.objects.create_user(
            username='existinguser',
            email='existing@example.com',
            phone_number='1234567890',
            password='password'
        )
        response = self.client.post(self.register_url, data=self.valid_data)
        self.assertEqual(response.status_code, 200)
        self.assertFormError(response.context['form'], 'phone_number', 'This phone number is already in use.')

    # Test 5: Roles are created
    def test_roles_are_created_if_not_exist(self):
        self.client.post(self.register_url, data=self.valid_data)
        self.assertTrue(Role.objects.filter(name='Farmer').exists())
        self.assertTrue(Role.objects.filter(name='Buyer').exists())