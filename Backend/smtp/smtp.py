import asyncio
from email.message import EmailMessage
import aiosmtplib
import os
from dotenv import load_dotenv
from jinja2 import Environment, FileSystemLoader, select_autoescape

load_dotenv()

BASE_DIR = os.path.dirname(__file__)
WEBSITE_URL = os.getenv('WEBSITE_URL')


env = Environment(
    loader=FileSystemLoader(BASE_DIR),
    autoescape=select_autoescape(["html", "xml"])
)

def render_template(template_name: str, **context) -> str:
    template = env.get_template(template_name)
    return template.render(**context)


async def send_confirm_email(to_email: str, nickname: str, token: str) -> None:
    confirm_url = WEBSITE_URL + 'confirm/email/' + token
    subject = "Confirm your email — ScamScan.io"
    plain = (
        f"Hi {nickname},\n\n"
        f"Please confirm your email:\n{confirm_url}\n"
    )
    html = render_template("email_confirm.html", nickname=nickname, confirm_url=confirm_url)

    msg = EmailMessage()
    msg["From"] = "ScamScan.io <no-reply@scamscan.io>"
    msg["To"] = to_email
    msg["Subject"] = subject
    msg.set_content(plain)
    msg.add_alternative(html, subtype="html")

    await send_email(msg)

async def send_reset_password(to_email: str, nickname: str, token: str) -> None:
    reset_url = WEBSITE_URL + 'confirm/password/' + token
    subject = "Reset your password — ScamScan.io"
    plain = (
        f"Hi {nickname},\n\n"
        f"Reset your password with this link:\n{reset_url}\n"
    )
    html = render_template("reset_password.html", nickname=nickname, reset_url=reset_url)

    msg = EmailMessage()
    msg["From"] = "ScamScan.io <no-reply@scamscan.io>"
    msg["To"] = to_email
    msg["Subject"] = subject
    msg.set_content(plain)
    msg.add_alternative(html, subtype="html")

    await send_email(msg)


async def send_email(msg: EmailMessage) -> None:
    await aiosmtplib.send(
        msg,
        hostname=os.getenv("SMTP_HOST"),
        port=os.getenv("SMTP_PORT"),
        username=os.getenv("SMTP_USER"),
        password=os.getenv("SMTP_PASS"),
        start_tls=True,
    )
