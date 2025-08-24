from django.db import models
from accounts.models import User


class DailyCheckIn(models.Model):
    """
    Stores each user's daily check-in record for a specific to-do item.
    Tracks timestamps for creation and last update.
    """
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='daily_checkins')
    date = models.DateField()
    todo_item = models.CharField(max_length=255)
    is_completed = models.BooleanField(default=False)
    notes = models.TextField(blank=True)

    # Timestamp tracking
    created_at = models.DateTimeField(auto_now_add=True)  # When check-in was first created
    updated_at = models.DateTimeField(auto_now=True)      # When it was last updated

    class Meta:
        unique_together = ('user', 'date', 'todo_item')
        ordering = ['-date']
        verbose_name = 'Daily Check-In'
        verbose_name_plural = 'Daily Check-Ins'

    def __str__(self):
        return f"{self.user.email} | {self.date} | {'✅' if self.is_completed else '❌'}"
