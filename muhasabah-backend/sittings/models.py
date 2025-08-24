from django.db import models
from datetime import date
from accounts.models import User
from todos.models import DefaultToDo
from checkins.models import DailyCheckIn
from .tasks import send_approval_email_task

# ──────────────────────────────────────────────────────────────
#                          Sitting Model
# ──────────────────────────────────────────────────────────────

class Sitting(models.Model):
    """
    Represents a Muhasabah sitting (group) led by a sitting head.
    """
    name = models.CharField(max_length=100)
    location = models.CharField(max_length=100)
    sitting_head = models.ForeignKey(User, on_delete=models.CASCADE, related_name='headed_sittings')
    day_of_week = models.CharField(max_length=10)
    max_members = models.PositiveIntegerField()
    status = models.CharField(max_length=20)  # e.g., 'active', 'archived'

    def __str__(self):
        return self.name

# ──────────────────────────────────────────────────────────────
#                    Sitting Membership Model
# ──────────────────────────────────────────────────────────────

class SittingMembership(models.Model):
    """
    Represents a student's membership in a sitting.
    Automatically assigns default todos and sends email upon approval.
    """
    student = models.ForeignKey(User, on_delete=models.CASCADE)
    sitting = models.ForeignKey(Sitting, on_delete=models.CASCADE)
    status = models.CharField(max_length=10, default='pending')  # 'pending' or 'approved'
    joined_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('student', 'sitting')

    def save(self, *args, **kwargs):
        creating = self._state.adding
        previous = None

        if not creating:
            previous = SittingMembership.objects.get(pk=self.pk)

        # Restrict one approved sitting per student
        if (creating or previous.status != 'approved') and self.status == 'approved':
            if SittingMembership.objects.filter(
                student=self.student, status='approved'
            ).exclude(pk=self.pk).exists():
                raise ValueError("This student is already approved in another sitting.")

        super().save(*args, **kwargs)

        if (creating or (previous and previous.status != 'approved')) and self.status == 'approved':
            self.assign_default_todos()
            self.send_approval_email()

    def assign_default_todos(self):
        """
        Assigns default to-dos to the user upon approval.
        """
        defaults = DefaultToDo.objects.all()
        today = date.today()

        for todo in defaults:
            DailyCheckIn.objects.get_or_create(
                user=self.student,
                date=today,
                todo_item=todo.title,
                defaults={'is_completed': False}
            )

    def send_approval_email(self):
        """
        Sends email notification to user after approval using Celery task.
        """
        send_approval_email_task.delay(
            self.student.email,
            self.student.username,
            self.sitting.name
        )

# ──────────────────────────────────────────────────────────────
#                 Sitting Evaluation Model
# ──────────────────────────────────────────────────────────────

class SittingEvaluation(models.Model):
    """
    Weekly evaluation submitted by the sitting head for their sitting group.
    """
    sitting = models.ForeignKey(Sitting, on_delete=models.CASCADE)
    head = models.ForeignKey(User, on_delete=models.CASCADE)
    week = models.PositiveIntegerField()
    summary = models.TextField()
    score = models.PositiveIntegerField()
    submitted_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Week {self.week} - {self.sitting.name}"

# ──────────────────────────────────────────────────────────────
#                       Message Model
# ──────────────────────────────────────────────────────────────

class Message(models.Model):
    """
    A message sent by a user to their sitting group.
    """
    sender = models.ForeignKey(User, on_delete=models.CASCADE)
    sitting = models.ForeignKey(Sitting, on_delete=models.CASCADE)
    content = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.sender.username} in {self.sitting.name}"
