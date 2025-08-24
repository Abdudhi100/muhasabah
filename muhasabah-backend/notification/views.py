# notifications/views.py
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Notification
from .serializers import NotificationSerializer


class NotificationListView(APIView):
    """
    Returns a list of notifications for the authenticated user
    along with the unread count.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        queryset = Notification.objects.filter(user=request.user).order_by("-created_at")
        unread_count = queryset.filter(is_read=False).count()
        serializer = NotificationSerializer(queryset, many=True)

        return Response(
            {
                "unread_count": unread_count,
                "notifications": serializer.data
            },
            status=status.HTTP_200_OK
        )


class MarkNotificationReadView(APIView):
    """
    Marks a single notification as read for the authenticated user.
    """
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        try:
            notification = Notification.objects.get(pk=pk, user=request.user)
        except Notification.DoesNotExist:
            return Response(
                {"detail": "Notification not found."},
                status=status.HTTP_404_NOT_FOUND
            )

        if not notification.is_read:
            notification.is_read = True
            notification.save(update_fields=["is_read"])

        return Response(
            {"detail": "Notification marked as read."},
            status=status.HTTP_200_OK
        )
