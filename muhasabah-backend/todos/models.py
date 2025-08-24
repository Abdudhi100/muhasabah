from django.db import models
from accounts.models import User


# ──────────────────────────────────────────────────────────────
#                      DEFAULT TODO MODEL
# ──────────────────────────────────────────────────────────────

class DefaultToDo(models.Model):
    """
    Represents a default to-do item assigned to all approved users in a sitting.
    """
    CATEGORY_CHOICES = (
        ('solat', 'Solat'),
        ('tilawah', 'Tilawah'),
        ('swot', 'SWOT'),
    )

    title = models.CharField(max_length=100)
    description = models.TextField()
    frequency = models.CharField(max_length=10)  # daily or weekly
    order = models.PositiveIntegerField(help_text="Position in display order")
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES)

    def __str__(self):
        return self.title


# ──────────────────────────────────────────────────────────────
#                      PERSONAL TODO MODEL
# ──────────────────────────────────────────────────────────────

class PersonalToDo(models.Model):
    """
    Represents a personalized to-do created for or by the user.
    Includes SWOT-related and self-directed habits.
    """
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='personal_todos')
    title = models.CharField(max_length=100)
    is_good_habit = models.BooleanField(default=True)
    is_private = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - {self.title}"
