import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

class Email:

    def __init__(self, from_email = "swdproject2025@gmail.com", smtp_user = "swdproject2025@gmail.com", smtp_password = "eeunaemhvoqvmohv"):
        self.from_email = from_email
        self.smtp_user = smtp_user
        self.smtp_password = smtp_password
        self.smtp_server = "smtp.gmail.com"
        self.smtp_port = 587

        self.server = smtplib.SMTP(self.smtp_server, self.smtp_port)
        self.server.starttls()  # Upgrade the connection to a secure encrypted SSL/TLS connection
        self.server.login(self.smtp_user, self.smtp_password)

    def send_email(self, subject, body, to_email):
        
        msg = MIMEMultipart()
        msg['From'] = self.from_email
        msg['To'] = to_email
        msg['Subject'] = subject

        msg.attach(MIMEText(body, 'plain'))
      
        self.server.send_message(msg)
        print("Email sent successfully!")
    
    def close(self):
        self.server.quit()

def main():

    email = Email("swdproject2025@gmail.com", "swdproject2025@gmail.com", "eeunaemhvoqvmohv")
    email.send_email(
        subject="Test Email 3",
        body="This is a test email 3.",
        to_email="amoghthusoo@gmail.com"
    )

if(__name__ == "__main__"):
    main()

# swdproject2025@gmail.com
# eeunaemhvoqvmohv