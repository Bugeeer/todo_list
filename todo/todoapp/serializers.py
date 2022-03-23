from rest_framework.serializers import ModelSerializer, HyperlinkedIdentityField, HyperlinkedRelatedField
from .models import Project
from .models import ToDo


class ProjectSerializer(ModelSerializer):
    # owner = HyperlinkedIdentityField(view_name='user-detail')
    users = HyperlinkedRelatedField(many=True, view_name='user-detail', read_only=True)

    class Meta:
        model = Project
        fields = '__all__'


class ProjectsSerializerBase(ModelSerializer):
    class Meta:
        model = Project
        fields = [
            'name',
            'url',
            'users',
            ]


class ToDoSerializer(ModelSerializer):
    project = HyperlinkedIdentityField(view_name='project-detail')
    creator = HyperlinkedIdentityField(view_name='user-detail')

    class Meta:
        model = ToDo
        exclude = ('is_active',)


class ToDoSerializerBase(ModelSerializer):
    class Meta:
        model = ToDo

        fields = [
            'project',
            'text',
            'create_at',
            'update_at',
            'user',
            'is_active',
        ]