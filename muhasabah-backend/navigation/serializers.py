# navigation/serializers.py

from rest_framework import serializers
from .models import MenuItem


class MenuItemSerializer(serializers.ModelSerializer):
    """
    Serializer for MenuItem objects.
    Used to return navigation menu data based on user role.
    """

    class Meta:
        model = MenuItem
        fields = [
            "id",
            "title",
            "path",
            "icon",
            "role",
            "order",
            "visible",
        ]
        read_only_fields = ["id"]
