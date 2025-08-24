from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import DefaultToDo, PersonalToDo
from .serializers import DefaultToDoSerializer, PersonalToDoSerializer
from accounts.permissions import IsRole


# ──────────────────────────────────────────────────────────────
#                   DEFAULT TODO VIEWSET
# ──────────────────────────────────────────────────────────────

class DefaultToDoViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing default to-dos (admin/overall_head access).
    """
    queryset = DefaultToDo.objects.all()
    serializer_class = DefaultToDoSerializer
    permission_classes = [IsRole]
    allowed_roles = ['overall_head']  # Or 'sitting_head' if applicable


# ──────────────────────────────────────────────────────────────
#                   PERSONAL TODO VIEWSET
# ──────────────────────────────────────────────────────────────

class PersonalToDoViewSet(viewsets.ModelViewSet):
    """
    ViewSet for personal to-dos.
    Only the authenticated student can manage their own to-dos.
    """
    serializer_class = PersonalToDoSerializer
    permission_classes = [IsRole]
    allowed_roles = ['student']

    def get_queryset(self):
        """
        Return only the current user's personal to-dos.
        """
        return PersonalToDo.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        """
        Automatically assign the current user when creating a to-do.
        """
        serializer.save(user=self.request.user)
