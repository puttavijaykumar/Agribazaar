import resend
import os

resend.api_key = os.getenv("RESEND_API_KEY")

def send_email(to_email, subject, html_content):
    response = resend.Emails.send({
        "from": os.getenv("RESEND_SENDER_EMAIL"),
        "to": to_email,
        "subject": subject,
        "html": html_content,
    })
    return response
