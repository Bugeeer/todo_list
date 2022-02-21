from django_filters import rest_framework as filters
from .models import ToDo


class TodoFilter(filters.FilterSet):
    create = filters.DateFromToRangeFilter()

    class Meta:
        model = ToDo
        fields = ['project', 'create']