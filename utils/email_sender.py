# agribazaar/utils/email_sender.py

import requests
import os

RESEND_API_KEY = os.getenv("RESEND_API_KEY")
SENDER_EMAIL = os.getenv("RESEND_SENDER_EMAIL")

def send_email(to_email, subject, html_content):
    url = "https://api.resend.com/emails"
    payload = {
        "from": SENDER_EMAIL,
        "to": to_email,
        "subject": subject,
        "html": html_content,
    }

    headers = {
        "Authorization": f"Bearer {RESEND_API_KEY}",
        "Content-Type": "application/json",
    }

    response = requests.post(url, json=payload, headers=headers)
    return response.json()
