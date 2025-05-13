from django.test import TestCase, Client
from django.urls import reverse
from django.contrib.auth import get_user_model
from django.core import mail
from unittest.mock import patch
import time

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

    # TC_OTP_DO1: Send OTP during registration
    @patch('random.randint', return_value=123456)
    def test_send_otp_email(self, mock_randint):
        session = self.client.session
        session.update({'otp': '123456', 'otp_user_id': self.user.id})
        session.save()

        response = self.client.get(reverse('verify_otp'))
        self.assertContains(response, "Enter OTP")

        # Verify session data and email
        self.assertEqual(self.client.session['otp'], '123456')
        self.assertEqual(len(mail.outbox), 1)
        self.assertRedirects(response, reverse('verify_otp'))

    # TC_OTP_DO2: Resend OTP (authenticated)
    @patch('random.randint', return_value=654321)
    def test_resend_otp_authenticated(self, mock_randint):
        self.client.force_login(self.user)
        response = self.client.get(reverse('resend_otp'))
        self.assertEqual(self.client.session['otp'], '654321')
        self.assertRedirects(response, reverse('verify_otp'))

    # TC_OTP_DO3: Resend OTP (unauthenticated)
    def test_resend_otp_unauthenticated(self):
        response = self.client.get(reverse('resend_otp'))
        self.assertRedirects(response, f"{reverse('login')}?next={reverse('resend_otp')}")

    # TC_OTP_DO4: Valid OTP verification
    def test_valid_otp_verification(self):
        session = self.client.session
        session.update({'otp': '123456', 'otp_user_id': self.user.id})
        session.save()

        response = self.client.post(reverse('verify_otp'), {'otp': '123456'})
        self.user.refresh_from_db()
        self.assertTrue(self.user.is_active)
        self.assertRedirects(response, reverse('login'))

    # TC_OTP_DO5: Invalid OTP verification
    def test_invalid_otp_verification(self):
        session = self.client.session
        session.update({'otp': '123456', 'otp_user_id': self.user.id})
        session.save()

        response = self.client.post(reverse('verify_otp'), {'otp': '000000'})
        self.assertContains(response, "Invalid OTP")
        self.assertFalse(self.user.is_active)

    # TC_OTP_DO6: Expired OTP session
    def test_expired_otp_session(self):
        session = self.client.session
        session.update({'otp': '123456', 'otp_user_id': self.user.id})
        session.set_expiry(1)  # 1 second expiry
        session.save()
        
        time.sleep(2)  # Wait for session to expire
        response = self.client.post(reverse('verify_otp'), {'otp': '123456'})
        self.assertRedirects(response, reverse('register'))