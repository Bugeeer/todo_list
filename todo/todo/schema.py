from dataclasses import fields
from unicodedata import name
import graphene
from graphene_django import DjangoObjectType
from todoapp.models import Project, ToDo
from usersapp.models import User


class ProjectType(DjangoObjectType):
    class Meta:
        model = Project
        fields = '__all__'


class ToDoType(DjangoObjectType):
    class Meta:
        model = ToDo
        fields = '__all__'


class UserType(DjangoObjectType):
    class Meta:
        model = User
        fields = '__all__'


class Query(graphene.ObjectType):
    all_projects = graphene.List(ProjectType)
    all_todos = graphene.List(ToDoType)
    all_users = graphene.List(UserType)

    project_by_id = graphene.Field(ProjectType, id=graphene.Int(required=True))
    todo_by_project_name = graphene.List(ToDoType, name=graphene.String(required=True))

    def resolve_all_projects(root, info):
        return Project.objects.all()

    def resolve_all_todos(root, info):
        return ToDo.objects.all()

    def resolve_all_users(root, info):
        return User.objects.all()

    def resolve_project_by_id(self, info, id):
        try:
            return Project.objects.get(id=id)
        except Project.DoesNotExist:
            return None

    def resolve_todo_by_project_name(self, root, name=None):
        todos = ToDo.objects.all()
        if name:
            todos = todos.filter(project__name=name)
        return todos


class ProjectMutation(graphene.Mutation):
    class Arguments:
        name = graphene.String()
        add_user_id = graphene.Int()
        remove_user_id = graphene.Int()

    project = graphene.Field(ProjectType)

    @classmethod
    def mutate(cls, root, info, id, name=None, add_user_id=None, remove_user_id=None):
        project = Project.objects.get(pk=id)
        if name:
            project.name = name
            project.save()
        if add_user_id:
            user = User.objects.get(pk=add_user_id)
            project.users.add(user)
            project.save()
        if remove_user_id:
            user = User.objects.get(pk=remove_user_id)
            project.users.remove(user)
        return ProjectMutation(project=project)


class ToDoMutation(graphene.Mutation):
    class Arguments:
        text = graphene.String()
        set_active = graphene.Boolean()
        id = graphene.ID()

    todo = graphene.Field(ToDoType)

    @classmethod
    def mutate(cls, root, info, id, text=None, set_active=None):
        todo = ToDo.objects.get(pk=id)
        if text:
            todo.text = text
            todo.save()
        if set_active is not None:
            todo.is_active = set_active
            todo.save()
        return ToDoMutation(todo=todo)


class Mutation(graphene.ObjectType):
    update_project = ProjectMutation.Field()
    update_todo = ToDoMutation.Field()


schema = graphene.Schema(query=Query, mutation=Mutation)
