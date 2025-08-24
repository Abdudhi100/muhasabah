from datetime import date, timedelta
from django.utils import timezone
from django.conf import settings
from django.core.mail import send_mail
from celery import shared_task
import requests

from todos.models import DefaultToDo, PersonalToDo
from checkins.models import DailyCheckIn
from sittings.models import SittingMembership
from accounts.models import User


# ---------------------------------------------------------------------------- #
#                          1. Create Midnight Check-ins                        #
# ---------------------------------------------------------------------------- #

@shared_task
def create_midnight_checkins():
    """
    Runs at midnight to generate check-ins:
    - For each approved sitting member → all default todos
    - For each user → their personal todos
    """
    today = date.today()

    # 1. Default To-Dos for approved sitting members
    memberships = SittingMembership.objects.filter(status='approved')
    for membership in memberships:
        user = membership.student
        for default in DefaultToDo.objects.all():
            DailyCheckIn.objects.get_or_create(
                user=user,
                date=today,
                todo_item=default.title,
                defaults={'is_completed': False}
            )

    # 2. Personal To-Dos for all active users
    for user in User.objects.filter(is_active=True):
        for todo in PersonalToDo.objects.filter(user=user):
            DailyCheckIn.objects.get_or_create(
                user=user,
                date=today,
                todo_item=todo.title,
                defaults={'is_completed': False}
            )


# ---------------------------------------------------------------------------- #
#                    2. Send Missed Check-in Reminders (8AM)                  #
# ---------------------------------------------------------------------------- #

@shared_task
def send_missed_checkin_reminders():
    """
    Runs in the morning (e.g., 8AM) to notify users who missed check-ins yesterday.
    Sends both email and WhatsApp messages.
    """
    yesterday = timezone.now().date() - timedelta(days=1)

    missed_checkins = DailyCheckIn.objects.filter(
        date=yesterday,
        is_completed=False
    ).select_related('user')

    for checkin in missed_checkins:
        user = checkin.user

        # Email reminder
        send_mail(
            subject="Reminder: You missed your check-in yesterday",
            message=(
                f"Assalaam alaykum {user.username},\n\n"
                f"You missed your to-do: '{checkin.todo_item}' on {yesterday}.\n"
                "Try not to miss today's check-in 😊."
            ),
            from_email=settings.EMAIL_HOST_USER,
            recipient_list=[user.email],
            fail_silently=True,
        )

        # WhatsApp reminder (if number exists)
        if user.whatsapp:
            message = (
                f"Reminder: You missed '{checkin.todo_item}' yesterday.\n"
                "Don't miss today's. May Allah strengthen you."
            )
            send_whatsapp(user.whatsapp, message)


# ---------------------------------------------------------------------------- #
#                     3. Helper: Send WhatsApp Message via Termii             #
# ---------------------------------------------------------------------------- #

def send_whatsapp(to, message):
    """
    Sends a WhatsApp message using Termii API.
    """
    try:
        url = "https://api.ng.termii.com/api/sms/send"
        payload = {
            "to": to,
            "from": settings.TERMII_SENDER_ID,
            "sms": message,
            "type": "plain",
            "channel": "whatsapp",
            "api_key": settings.TERMII_API_KEY
        }
        response = requests.post(url, json=payload)
        return response.status_code
    except Exception as e:
        # Optionally log the error
        print(f"[Termii Error] WhatsApp to {to} failed: {str(e)}")
        return None
