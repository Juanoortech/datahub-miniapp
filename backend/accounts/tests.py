from django.test import TestCase
from ninja.testing import TestClient
from accounts.api import router as accounts_router


# class HelloTest(TestCase):
#     def test_hello(self):
#         client = TestClient(accounts_router)
#         response = client.get("/")
#         self.assertEqual(response.status_code, 200)
