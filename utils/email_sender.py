import resend
from django.conf import settings

resend.api_key = settings.RESEND_API_KEY

def send_email(to_email, subject, html_content):
    return resend.Emails.send({
        "from": settings.RESEND_FROM_EMAIL,
        "to": to_email,
        "subject": subject,
        "html": html_content,
    })
