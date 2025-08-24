# notifications/urls.py

from django.urls import path
from .views import NotificationListView, MarkNotificationReadView

app_name = "notifications"

urlpatterns = [
    path("", NotificationListView.as_view(), name="list"),
    path("<int:pk>/read/", MarkNotificationReadView.as_view(), name="mark_read"),
]
