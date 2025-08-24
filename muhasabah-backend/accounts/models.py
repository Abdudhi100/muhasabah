# accounts/models.py
from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils.translation import gettext_lazy as _
from phonenumber_field.modelfields import PhoneNumberField  # pip install django-phonenumber-field[phonenumberslite]


class User(AbstractUser):
    """
    Custom user model with email as the unique identifier,
    role-based access, and extended profile fields.
    """

    class Roles(models.TextChoices):
        STUDENT = "student", _("Student")
        SITTING_HEAD = "sitting_head", _("Sitting Head")
        OVERALL_HEAD = "overall_head", _("Overall Head")

    email = models.EmailField(_("email address"), unique=True)
    role = models.CharField(_("role"), max_length=20, choices=Roles.choices)
    location = models.CharField(_("location"), max_length=100, blank=True)
    is_verified = models.BooleanField(_("email verified"), default=False)
    whatsapp = PhoneNumberField(_("WhatsApp number"), blank=True, region="NG")
    streak = models.PositiveIntegerField(_("streak"), default=0)

    created_at = models.DateTimeField(_("created at"), auto_now_add=True)
    updated_at = models.DateTimeField(_("updated at"), auto_now=True)

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["username"]  # Needed for AbstractUser

    def __str__(self) -> str:
        return self.email

    @property
    def full_name(self) -> str:
        """Return the user's full name or username if missing."""
        return f"{self.first_name} {self.last_name}".strip() or self.username
