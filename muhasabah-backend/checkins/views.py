from datetime import date

from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from .models import DailyCheckIn
from .serializers import DailyCheckInSerializer
from accounts.permissions import IsRole  # Optional: use if RBAC is active


class DailyCheckInViewSet(viewsets.ModelViewSet):
    """
    Handles CRUD operations for daily check-ins.
    - Only allows users to view/edit their own check-ins.
    - Prevents editing of past check-ins.
    """
    serializer_class = DailyCheckInSerializer
    permission_classes = [IsAuthenticated]  # Add IsRole if needed

    def get_queryset(self):
        return DailyCheckIn.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        if instance.date != date.today():
            return Response(
                {"detail": "You cannot edit past check-ins."},
                status=status.HTTP_403_FORBIDDEN
            )
        return super().update(request, *args, **kwargs)
