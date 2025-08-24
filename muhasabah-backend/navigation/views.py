# navigation/views.py

from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import MenuItem
from .serializers import MenuItemSerializer


class MenuListView(APIView):
    """
    Returns a list of menu items for the currently authenticated user's role.
    Menu items are filtered by `visible=True` and ordered by `order`.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        role = getattr(request.user, "role", None)

        # Retrieve menu items for the user's role
        items = MenuItem.objects.filter(role=role, visible=True).order_by("order")

        # Serialize results
        serializer = MenuItemSerializer(items, many=True)
        return Response(serializer.data)
