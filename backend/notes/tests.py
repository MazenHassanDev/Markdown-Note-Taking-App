from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient
from django.contrib.auth.models import User

# Create your tests here.

class NoteTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(username = "Mazen", password = "Mazen1234")
        self.client.force_authenticate(user=self.user)

        note_data = {'title': "Test Note", "content": "Test Content"}
        self.note_response = self.client.post(reverse('save_notes'), note_data)
        self.note_id = self.note_response.data['id']


#Get without token - invalid 401
    def test_get_no_token(self):
        self.client.force_authenticate(user=None)
        response = self.client.get(reverse('list_notes'))
        self.assertEqual(response.status_code, 401)


#Get with token - success 200
    def test_get_with_token(self):
        response = self.client.get(reverse('list_notes'))
        self.assertEqual(response.status_code, 200)


#Post - 201 created
    def test_post_note(self):
        response = self.client.post(reverse('save_notes'), {'title': "Test Note", "content": "Test Content"})
        self.assertEqual(response.status_code, 201)

#Post missing fields = 400
    def test_post_invalid_note(self):
        response = self.client.post(reverse('save_notes'), {'title': "Test Title"})
        self.assertEqual(response.status_code, 400)

#Delete - 204
    def test_delete_note(self):
        response = self.client.delete(reverse('delete_note', kwargs={'pk': self.note_id}))
        self.assertEqual(response.status_code, 204)

#Delete other user note - 404
    def test_delete_other_user_note(self):
        second_user = User.objects.create_user(username="OtherUser", password="OtherPassword")
        self.client.force_authenticate(user = second_user)
        second_note = self.client.post(reverse('save_notes'), {'title': "second note", "content": "second note content"})
        second_note_id = second_note.data['id']

        self.client.force_authenticate(user=self.user)
        response = self.client.delete(reverse('delete_note', kwargs={'pk': second_note_id}))
        self.assertEqual(response.status_code, 404)