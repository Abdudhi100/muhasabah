# sittings/tasks.py
from celery import shared_task
from django.core.mail import send_mail
from django.conf import settings

@shared_task
def send_approval_email_task(email, username, sitting_name):
    subject = "Your Sitting Membership Has Been Approved!"
    message = (
        f"Assalaam alaykum {username},\n\n"
        f"Your request to join the sitting '{sitting_name}' has been approved.\n"
        "You're now eligible to check in and participate.\n\n"
        "Jazaakum Allahu khayran."
    )

    send_mail(
        subject=subject,
        message=message,
        from_email=settings.EMAIL_HOST_USER,
        recipient_list=[email],
        fail_silently=True,
    )
