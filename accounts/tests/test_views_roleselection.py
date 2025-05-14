from django.test import TestCase, Client
from django.urls import reverse
import json

class RoleSelectionViewTests(TestCase):
    def setUp(self):
        self.client = Client()
        self.url = reverse('role_selection')  # Update with your actual URL name

    def test_valid_farmer_role(self):
        # Test valid Farmer role selection
        data = {"role": "Farmer"}
        response = self.client.post(
            self.url,
            data=json.dumps(data),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, 200)
        self.assertJSONEqual(
            response.content,
            {"redirect": "/farmer/dashboard/?role=Farmer"}
        )

    def test_valid_buyer_role(self):
        # Test valid Buyer role selection
        data = {"role": "Buyer"}
        response = self.client.post(
            self.url,
            data=json.dumps(data),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, 200)
        self.assertJSONEqual(
            response.content,
            {"redirect": "/buyer/dashboard/?role=Buyer"}
        )

    def test_invalid_role(self):
        # Test invalid role (e.g., "Supplier")
        data = {"role": "Supplier"}
        response = self.client.post(
            self.url,
            data=json.dumps(data),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, 400)
        self.assertJSONEqual(response.content, {"error": "Invalid role"})

    def test_invalid_json(self):
        # Test non-JSON data
        response = self.client.post(
            self.url,
            data="role=Farmer",  # Plain text instead of JSON
            content_type='text/plain'
        )
        self.assertEqual(response.status_code, 400)
        self.assertJSONEqual(response.content, {"error": "Invalid JSON"})

    def test_get_request(self):
        # Test GET method (should be rejected)
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, 405)
        self.assertJSONEqual(response.content, {"error": "Invalid request method"})

    def test_missing_role_key(self):
        # Test missing "role" key in JSON
        data = {"invalid_key": "Farmer"}
        response = self.client.post(
            self.url,
            data=json.dumps(data),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, 400)
        self.assertJSONEqual(response.content, {"error": "Invalid role"})

    def test_case_sensitivity(self):
        # Test lowercase role ("farmer" instead of "Farmer")
        data = {"role": "farmer"}
        response = self.client.post(
            self.url,
            data=json.dumps(data),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, 400)
        self.assertJSONEqual(response.content, {"error": "Invalid role"})

    def test_csrf_exemption(self):
        # Verify CSRF exemption works
        data = {"role": "Farmer"}
        response = self.client.post(
            self.url,
            data=json.dumps(data),
            content_type='application/json',
            # No CSRF token included
        )
        self.assertEqual(response.status_code, 200)  # Should pass without CSRF errors