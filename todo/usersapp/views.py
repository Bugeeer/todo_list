from django.shortcuts import get_object_or_404
from rest_framework import mixins, viewsets, status, permissions
from rest_framework.response import Response
from rest_framework.generics import ListAPIView, RetrieveAPIView, DestroyAPIView, UpdateAPIView
from rest_framework.decorators import action
from rest_framework.renderers import JSONRenderer
from rest_framework.viewsets import ModelViewSet
from .models import User
from .serializers import UserModelSerializer, UserAdvancedModelSerializer


class UserModelViewSet(mixins.ListModelMixin,
                       mixins.RetrieveModelMixin,
                       mixins.UpdateModelMixin,
                       viewsets.GenericViewSet):
    queryset = User.objects.all()
    serializer_class = UserModelSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_serializer_class(self):
        if self.request.version == '2.0':
            return UserAdvancedModelSerializer
        return UserModelSerializer

    def list(self, request):
        users = User.objects.all()
        serializer = self.get_serializer_class()(users, many=True)
        return Response(serializer.data)

    def retrieve(self, request, pk=None):
        user = get_object_or_404(User, pk=pk)
        serializer = self.get_serializer_class()(user)
        return Response(serializer.data)

    def partial_update(self, request, pk=None):
        user = get_object_or_404(User, pk=pk)
        print(request.data)
        serializer = self.get_serializer_class()(
            user, data=request.data, partial=True)
        if serializer.is_valid():
            user = serializer.save()
            serializer = self.get_serializer_class()(user)
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
