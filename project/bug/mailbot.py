import threading
import smtplib, ssl
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

sender_email = 'gagansh7171@gmail.com'
password = "wabgfkmgfwtrxwht"

def sendmail(receiver, message):
    context = ssl.create_default_context()
    with smtplib.SMTP_SSL("smtp.gmail.com", 465, context=context) as server:
        server.login(sender_email, password)
        server.sendmail(sender_email, receiver, message.as_string())
    


def message(data):
    message = MIMEMultipart("alternative")
    message["Subject"] = data["subject"]
    message["From"] = sender_email
    message["To"] = data["receiver"]
    text = data["text"]
    html = data["html"]
    text = MIMEText(text, "plain")
    html = MIMEText(html, "html")
    message.attach(text)
    message.attach(html)
    return message


def send_for_purpose(user_list, context):

    base = "http://localhost:3000/"
    subject = ""
    text = ""
    html = ""
    print('purpose called')
    if context["action"] == "add_member":
        subject = "Welcome to the Team! 🥳"
        text = f"""You have been added to the team {context['project'].project_name}"""
        html = f"""\
            <html>
                <body style='text-align:center;'>
                    <h1 style='color:#2d4dad;'>Bug Track</h1><hr />
                    <p>Congratulations! You are now a part of the team <strong>{context['project'].project_name}</strong>.
                        Buckle Up for a new Bug Hunting <a href = "{base}mypage/project/{context['project'].id}/">journey</a>.
                    </p><hr />
                </body>
            </html>
        """
    
    elif context["action"] == "del_member":
        subject = "A warm goodbye from the team! 👋"
        text = f"""You have been removed from the team {context['project'].project_name}"""
        html = f"""\
            <html>
                <body style='text-align:center;'>
                    <h1 style='color:#2d4dad;'>Bug Track</h1><hr />
                    <p>It must have been a great bug hunting voyage in the vessel of <strong>{context['project'].project_name}</strong>.
                        Rest not because there are lot of bugs out there still lurking in the shadows. Let the tracking <a href="{base}">begin</a>
                    </p><hr />
                </body>
            </html>
        """

    elif context["action"] == "new_bug":
        subject = "A new bug has been reported! 🧐"
        text = f"""A new bug has been reported in {context['project'].project_name}"""
        html = f"""\
            <html>
                <body style='text-align:center;'>
                    <h1 style='color:#2d4dad;'>Bug Track</h1><hr />
                    <p>A new Bug has been reported in the project <b>{context['project'].project_name}</b> titled <b>{context['bug'].head}</b>. Check it <a href="{base}mypage/bug/{context['bug'].id}/">out</a>
                    </p><hr />
                </body>
            </html>
        """

    elif context["action"] == "bug_resolved":
        subject = "A Bug has been resolved! ✌️"
        text = f"""A bug has been resolved in {context['project'].project_name}"""
        html = f"""\
            <html>
                <body style='text-align:center;'>
                    <h1 style='color:#2d4dad;'>Bug Track</h1><hr />
                    <p>A Bug has been resloved in the project <b>{context['project'].project_name}</b> titled <b>{context['bug'].head}</b>. Check it <a href="{base}mypage/bug/{context['bug'].id}/">out</a>
                    </p><hr />
                </body>
            </html>
        """

    elif context["action"] == "bug_assignment":
        subject = "A Bug has been assigned to you! 🤞"
        text = f"""A bug has been assigned to you in {context['project'].project_name}"""
        html = f"""\
            <html>
                <body style='text-align:center;'>
                    <h1 style='color:#2d4dad;'>Bug Track</h1><hr />
                    <p>A Bug has been assigned to you in the project <b>{context['project'].project_name}</b> titled <b>{context['bug'].head}</b>. Check it <a href="{base}mypage/bug/{context['bug'].id}/">out</a>
                    </p><hr />
                </body>
            </html>
        """

    if (subject != "") and (text != "") and (html != ""):
        for user in user_list:
            data = {
                "receiver": user.email,
                "subject": subject,
                "text": text,
                "html": html,
            }

            msg = message(data)
            print("Sending")
            sendmail(user.email, msg)
            print("Sent")
    else:
        print("No data")


class MailBot(threading.Thread):
    def __init__(self, user_list, context, *args, **kwargs):
        super(MailBot, self).__init__(*args, **kwargs)
        self.user_list = user_list
        self.context = context
        print('initial')

    def run(self):
        send_for_purpose(self.user_list, self.context)
        return