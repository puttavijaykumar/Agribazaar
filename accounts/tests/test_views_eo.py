# tests.py
from django.test import TestCase, Client
from django.urls import reverse
from django.contrib.auth import get_user_model
from django.core import mail
from unittest.mock import patch
from django.utils import timezone

User = get_user_model()

class OTPViewsTest(TestCase):
    def setUp(self):
        self.client = Client()
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            phone_number='+1234567890',
            password='testpass123',
            is_active=False
        )

    @patch('random.randint', return_value=123456)
    def test_send_otp_email(self, mock_randint):
        response = self.client.post(reverse('register'), {
            'username': 'newuser',
            'email': 'new@example.com',
            'phone_number': '+1234567891',
            'password1': 'testpass123',
            'password2': 'testpass123',
            'roles': ['farmer']
        })
        self.assertEqual(len(mail.outbox), 1)
        self.assertEqual(self.client.session['otp'], '123456')

    @patch('random.randint', return_value=654328)
    def test_resend_otp_authenticated(self, mock_randint):
        self.client.force_login(self.user)
        response = self.client.get(reverse('resend_otp'), follow=True)
        session = response.wsgi_request.session
        self.assertEqual(session.get('otp'), '654328')
        self.assertEqual(len(mail.outbox), 1)

    def test_resend_otp_unauthenticated(self):
        response = self.client.get(reverse('resend_otp'))
        self.assertRedirects(response, f"{reverse('login')}?next={reverse('resend_otp')}")

    def test_valid_otp_verification(self):
        session = self.client.session
        session.update({'otp': '123456', 'otp_user_id': self.user.id})
        session.save()
        response = self.client.post(reverse('verify_otp'), {'otp': '123456'})
        self.user.refresh_from_db()
        self.assertTrue(self.user.is_active)
        self.assertRedirects(response, reverse('login'))

    def test_invalid_otp_verification(self):
        session = self.client.session
        session.update({'otp': '123456', 'otp_user_id': self.user.id})
        session.save()
        response = self.client.post(reverse('verify_otp'), {'otp': '000000'}, follow=True)
        self.assertContains(response, "Invalid OTP")

    def test_expired_otp_session(self):
        session = self.client.session
        session.update({'otp': '123456', 'otp_user_id': self.user.id})
        session.set_expiry(timezone.now() - timezone.timedelta(seconds=10))  # Expired
        session.save()
        response = self.client.post(reverse('verify_otp'), {'otp': '123456'})
        self.assertRedirects(response, reverse('register'))