from django.db import models

# Create your models here.
from django.db import models
from django.conf import settings

class Comment(models.Model):
    """
    Stores comments sent from one user (author) to another (recipient).
    Can be linked to a Sitting, To-Do, or Check-In item.
    """
    author = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="comments_sent"
    )
    recipient = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="comments_received"
    )
    text = models.TextField()
    
    # Optional links
    sitting = models.ForeignKey(
        "sittings.Sitting",
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name="comments"
    )
    todo_item = models.CharField(max_length=255, null=True, blank=True)
    checkin = models.ForeignKey(
        "checkins.DailyCheckIn",
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name="comments"
    )

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"Comment from {self.author} to {self.recipient} - {self.text[:30]}"
