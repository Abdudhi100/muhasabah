from django.db import models
from datetime import date
from accounts.models import User
from todos.models import PersonalToDo
from checkins.models import DailyCheckIn


class SWOT(models.Model):
    """
    Represents a personal SWOT analysis for a user.
    Automatically generates 4 related personal to-dos on creation.
    """
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    strengths = models.TextField()
    weaknesses = models.TextField()
    opportunities = models.TextField()
    threats = models.TextField()

    def __str__(self):
        return f"{self.user.username}'s SWOT"

    def save(self, *args, **kwargs):
        creating = self._state.adding
        super().save(*args, **kwargs)

        # Only assign SWOT todos if newly created
        if creating:
            self.assign_swot_todos()

    def assign_swot_todos(self):
        """
        Automatically assigns 4 personal to-dos based on user's SWOT input.
        """
        today = date.today()

        try:
            strength = self.strengths.splitlines()[0]
            weakness = self.weaknesses.splitlines()[0]
            opportunity = self.opportunities.splitlines()[0]
            threat = self.threats.splitlines()[0]
        except IndexError:
            # If any field is empty, skip assignment
            return

        todos = [
            {
                "title": f"Build on strength: {strength}",
                "is_good_habit": True
            },
            {
                "title": f"Overcome weakness: {weakness}",
                "is_good_habit": True
            },
            {
                "title": f"Leverage opportunity: {opportunity}",
                "is_good_habit": True
            },
            {
                "title": f"Address threat: {threat}",
                "is_good_habit": False
            },
        ]

        for item in todos:
            todo = PersonalToDo.objects.create(
                user=self.user,
                title=item["title"],
                is_good_habit=item["is_good_habit"]
            )

            DailyCheckIn.objects.get_or_create(
                user=self.user,
                date=today,
                todo_item=todo.title,
                defaults={'is_completed': False}
            )
