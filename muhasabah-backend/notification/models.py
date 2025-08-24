# notifications/models.py

from django.db import models
from django.conf import settings


class Notification(models.Model):
    """
    Represents a single notification for a user.
    Can be marked as read/unread and ordered by creation date.
    """
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="notifications"
    )
    title = models.CharField(
        max_length=150,
        blank=True,
        help_text="Optional short title for the notification."
    )
    message = models.CharField(
        max_length=512,
        help_text="Main notification content."
    )
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]
        verbose_name = "Notification"
        verbose_name_plural = "Notifications"

    def __str__(self):
        title_part = f"{self.title} - " if self.title else ""
        return f"Notification to {self.user.email}: {title_part}{self.message[:40]}"
