# swot/views.py
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import SWOT
from .serializers import SWOTSerializer
from .permissions import IsRole  # Assuming you have a custom permission

class SWOTViewSet(viewsets.ModelViewSet):
    """
    ViewSet for handling CRUD operations on a user's SWOT analysis.
    Each user can only access and update their own SWOT.
    Only users with the 'student' role can access this view.
    """
    serializer_class = SWOTSerializer
    permission_classes = [IsAuthenticated, IsRole]
    allowed_roles = ['student']  # Custom attribute for IsRole to check

    def get_queryset(self):
        """
        Return only the current user's SWOT entry.
        """
        return SWOT.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        """
        Automatically assign the user during SWOT creation.
        """
        serializer.save(user=self.request.user)
