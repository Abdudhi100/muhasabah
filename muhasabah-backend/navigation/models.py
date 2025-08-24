# navigation/models.py

from django.db import models


ROLE_CHOICES = (
    ("student", "Student"),
    ("sitting_head", "Sitting Head"),
    ("overall_head", "Overall Head"),
    ("admin", "Admin"),
)


class MenuItem(models.Model):
    """
    Represents a single menu item visible to users with a specific role.
    Ordered by `order` for display purposes.
    """
    title = models.CharField(max_length=80)
    path = models.CharField(
        max_length=200,
        help_text="Frontend route path (e.g., /dashboard)"
    )
    icon = models.CharField(
        max_length=100,
        blank=True,
        help_text="Lucide-react or Shadcn UI icon name."
    )
    role = models.CharField(
        max_length=20,
        choices=ROLE_CHOICES,
        help_text="Role that can access this menu item."
    )
    order = models.PositiveIntegerField(
        default=0,
        help_text="Order of display; lower numbers appear first."
    )
    visible = models.BooleanField(
        default=True,
        help_text="Whether this menu item should be shown."
    )

    class Meta:
        ordering = ["order"]
        verbose_name = "Menu Item"
        verbose_name_plural = "Menu Items"

    def __str__(self):
        return f"{self.title} ({self.role})"
