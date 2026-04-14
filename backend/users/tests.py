from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient
from django.contrib.auth.models import User
from rest_framework_simplejwt.tokens import RefreshToken


# Create your tests here.
class RegisterTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.url = reverse('register')

    def test_register_success(self):
        data = {"username": "mazen", "email": "mazen@gmail.com", "password": "testpassword@123"}
        response = self.client.post(self.url, data)
        self.assertEqual(response.status_code, 201)

    def test_duplicate_username(self):
        data = {"username": "mazen", "email": "mazen@gmail.com", "password": "testpassword@123"}
        self.client.post(self.url, data)
        data2 = {"username": "mazen", "email": "fawzy@gmail.com", "password": "secretpassword@123"}
        response = self.client.post(self.url, data2)
        self.assertEqual(response.status_code, 400)

    def test_invalid_password(self):
        data = {"username": "mazen", "email": "mazen@gmail.com", "password": "12345"}
        response = self.client.post(self.url, data)
        self.assertEqual(response.status_code, 400)

class LoginTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.url = reverse('login')
        User.objects.create_user(username="mazen", email="mazen@gmail.com", password="Mazen1234")

    def test_valid_tokens(self):
        data = {"username": "mazen", "password": "Mazen1234"}
        response = self.client.post(self.url, data)
        self.assertEqual(response.status_code, 200)
        self.assertIn('access', response.data)
        self.assertIn('refresh', response.data)

    def test_invalid_password(self):
        data = {"username": "mazen", "password": "Wrong1234"}
        response = self.client.post(self.url, data)
        self.assertEqual(response.status_code, 401)

    def test_username_doesnt_exist(self):
        data = {"username": "randomUser", "password": "random12345"}
        response = self.client.post(self.url, data)
        self.assertEqual(response.status_code, 401)

class LogoutTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.url = reverse('logout')
        User.objects.create_user(username="Mazen", password="Mazen1234")

    def test_blacklist_refresh(self):
        data = {"username": "Mazen", "password": "Mazen1234"}
        login_response = self.client.post(reverse('login'), data)

        access_token = login_response.data['access']
        refresh_token = login_response.data['refresh']

        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + access_token)

        response = self.client.post(self.url, {'refresh': refresh_token})
        self.assertEqual(response.status_code, 200)

    def test_invalid_refresh(self):
        refresh_token = "abce1234"
        response = self.client.post(self.url, {'refresh': refresh_token})
        self.assertEqual(response.status_code, 401)



        
    


        

