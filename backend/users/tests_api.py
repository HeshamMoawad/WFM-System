from rest_framework.test import APITestCase
from django.urls import reverse 
from rest_framework import status
from users.models import User , FingerPrintID
from django.conf import settings
from rest_framework_simplejwt.tokens import RefreshToken
from users.views.authenticate import wrap_data

class UserApiTest(APITestCase):
    def setUp(self):
        self.login_without_fid = {'username': 'test.test', 'password': 'test123'}
        self.login = {**self.login_without_fid,"unique_id":"testtesttest"}
        self.user = User(**self.login_without_fid , password_normal = self.login_without_fid['password'])
        self.user.save()
        self.fingerprint = FingerPrintID.objects.create(name = "t" ,user=self.user,unique_id=self.login["unique_id"])
        self.fingerprint.save()
        self.url = reverse('login')

    def test_login_user_without(self):
        response = self.client.post(self.url, self.login_without_fid, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_login_user(self):
        response = self.client.post(self.url, data=self.login , format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn(settings.SIMPLE_JWT["EXPIRE"], response.json())
        self.assertIn(settings.SIMPLE_JWT["AUTH_HEADER"], response.json())
        self.assertTrue(settings.SIMPLE_JWT["AUTH_COOKIE"] in response.cookies.keys())

    def test_user_already_login(self):
        token = RefreshToken.for_user(self.user).access_token
        expected = wrap_data(self.user,token,True)
        response = self.client.post(self.url, data={settings.SIMPLE_JWT["AUTH_BODY"]:f"{token}"},format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertDictEqual(response.json(), expected)
    
    def test_invalid_token(self):
        response = self.client.post(self.url, data={settings.SIMPLE_JWT["AUTH_BODY"]:f"asdasd561a1sd61a6sd"},format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_logout(self):
        token = RefreshToken.for_user(self.user).access_token
        response = self.client.post(reverse('logout'), data={settings.SIMPLE_JWT["AUTH_BODY"]:f"{token}"},format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
