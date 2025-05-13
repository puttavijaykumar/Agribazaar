from django.test import TestCase
from django.urls import reverse
from accounts.models import CustomUser, Role
from django.contrib.auth import get_user_model

class RegisterViewTest(TestCase):

    def setUp(self):
        # Create necessary roles before running the tests
        self.farmer_role = Role.objects.create(name="farmer")
        self.admin_role = Role.objects.create(name="admin")

    def test_register_view_post_valid_data(self):
        # Prepare test data for the registration
        post_data = {
            "username": "testuser",
            "password1": "password123",
            "password2": "password123",
            "roles": ["farmer"]  # Assign the 'farmer' role
        }

        # Send POST request to register view
        response = self.client.post(reverse("register"), data=post_data)

        # Debugging: Check if response is a redirect
        print(response.status_code)  # Should print 302 if successful

        # Check that the response redirects to OTP verification page
        self.assertEqual(response.status_code, 302)  # Redirects after successful form submission

        # Fetch the user that was created using CustomUser model
        user = CustomUser.objects.get(username="testuser")

        # Check if the user has the 'farmer' role
        self.assertTrue(user.roles.filter(name="farmer").exists())
        
    def test_register_view_post_invalid_data(self):
        # Prepare test data with mismatched passwords
        post_data = {
            "username": "testuser",
            "password1": "password123",
            "password2": "wrongpassword",  # This will fail
            "roles": ["farmer"]
        }

        # Send POST request to register view
        response = self.client.post(reverse("register"), data=post_data)

        # Ensure the form is not valid and the response is the registration page with the form
        self.assertEqual(response.status_code, 200)
        
        # Debugging: Check if form errors are present
        print(response.context["form"].errors)  # Print form errors to debug

        # Check for form errors on 'password2'
        self.assertFormError(response, 'form', 'password2', "The two password fields didn't match.")

    def test_role_creation_if_not_exists(self):
        # Test if role is created if not present
        post_data = {
            "username": "testuser2",
            "password1": "password123",
            "password2": "password123",
            "roles": ["admin"]  # New role 'admin'
        }

        # Send POST request to register view
        response = self.client.post(reverse("register"), data=post_data)

        # Debugging: Check if response redirects after registration
        print(response.status_code)

        # Check if the role is created in the database
        self.assertTrue(Role.objects.filter(name="admin").exists())

        # Fetch the user and check the assigned role using CustomUser
        user = CustomUser.objects.get(username="testuser2")
        self.assertTrue(user.roles.filter(name="admin").exists())
