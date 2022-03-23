from django.test import TestCase

# Create your tests here.
import json
from django.test import TestCase
from rest_framework import status
from rest_framework.test import APIRequestFactory, force_authenticate, APIClient, APISimpleTestCase, APITestCase
from mixer.backend.django import mixer
from usersapp.models import User
from .models import Project, ToDo
from .views import ProjectViewSet, ToDoViewSet


class TestProjectViewSet(TestCase):

    def setUp(self) -> None:
        self.factory = APIRequestFactory()
        self.client = APIClient()

        self.name = 'Buger'
        self.password = '1'
        self.email = 'caca@mail.ru'

        self.admin = User.objects.create_superuser(
            self.name,
            self.email,
            self.password
        )
        self.url_project = '/api/projects/'
        self.url_todo = '/api/todos/'

        self.data = {
            'name': 'ProjectTestPost',
            'url': 'http://127.0.0.1:8000/api/projecttestpost',
            # 'users': []
        }

        self.data_put = {
            'name': 'ProjectTestPut',
            'url': 'http://127.0.0.1:8000/api/projecttestput',
            'users': [self.admin]
        }

        self.data_todo = {
            'project': '1',
            'text': 'project test remark',
            'user': '1'
        }

        self.data_todo_put = {
            'project': '2',
            'text': 'project test remark 2',
            'user': '2'
        }

    def test_get_list_guest(self):
        request = self.factory.get(self.url_project)
        view = ProjectViewSet.as_view({'get': 'list'})
        response = view(request)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_get_list_admin(self):
        request = self.factory.get(self.url_project)
        view = ProjectViewSet.as_view({'get': 'list'})
        force_authenticate(request, self.admin)
        response = view(request)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_post_project_guest(self):
        project = mixer.blend(Project)
        project.users.add(self.admin)
        response = self.client.post(f"{self.url_project}", {
            'name': project.name,
            'url': project.url,
            'users': [self.admin]
        })
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_post_project_admin(self):
        # project = Project.objects.create(**self.data)
        # project.users.add(self.admin)
        project = mixer.blend(Project)

        self.client.login(username='Buger', password='1')
        response = self.client.patch(
            f"{self.url_project}{project.id}/", {'name': 'ProjectTestPut'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.client.logout()

    def tearDown(self) -> None:
        pass


class TestBookViewSet(APITestCase):
    def setUp(self) -> None:
        self.name = 'Buger'
        self.password = '1'
        self.email = 'caca@mail.ru'
        self.url_project = '/api/projects/'
        self.url_todo = '/api/todos/'

        self.admin = User.objects.create_superuser(
            self.name,
            self.email,
            self.password
        )

    def test_get_list_guest(self):
        response = self.client.get(self.url_project)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_get_list_admin(self):
        self.client.login(username='Buger', password='1')
        response = self.client.get(self.url_project)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def tearDown(self) -> None:
        pass
