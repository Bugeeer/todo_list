from rest_framework.serializers import ModelSerializer, HyperlinkedIdentityField, HyperlinkedRelatedField
from .models import Project
from .models import ToDo
from usersapp.serializers import UserModelSerializer


class ProjectSerializer(ModelSerializer):
    # owner = HyperlinkedIdentityField(view_name='user-detail')
    users = UserModelSerializer(many=True)

    class Meta:
        model = Project
        fields = [
            'id',
            'name',
            'url',
            'users',
            ]


class ProjectsSerializerBase(ModelSerializer):
    class Meta:
        model = Project
        fields = [
            'name',
            'url',
            'users',
            ]


class ToDoSerializer(ModelSerializer):
    project = ProjectSerializer()
    creator = UserModelSerializer()

    class Meta:
        model = ToDo
        exclude = ('is_active',)


class ToDoSerializerBase(ModelSerializer):
    class Meta:
        model = ToDo

        fields = [
            'id',
            'project',
            'text',
            'create',
            'update',
            'creator',
            'is_active',
        ]