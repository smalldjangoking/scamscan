"""Admin panel authentication backend"""
import os
from sqladmin import Admin, ModelView
from sqladmin.authentication import AuthenticationBackend
from starlette.requests import Request
from fastapi import HTTPException
from database.models import Users, Reports, Addresses, Comments, Whois
from services import get_user_by_email, verify_password, admin_token_valid
from database.database_settings import async_session_maker 
import logging

logger = logging.getLogger(__name__)


class AdminAuth(AuthenticationBackend):
    async def login(self, request: Request) -> bool:
        form = await request.form()
        username, password = form.get("username"), form.get("password")

        async with async_session_maker() as db_session:
            user = await get_user_by_email(username, db_session)

            if not user:
                print("User not found")
                return False

            if not verify_password(password, user.hashed_password):
                print("Password is incorrect")
                return False
            
            if not user.is_superuser:
                print("User is not superuser")
                return False
            print("Access granted")
            request.session.update({"user_id": user.id})

            return True

    async def logout(self, request: Request) -> bool:
        request.session.clear()
        return True

    async def authenticate(self, request: Request) -> bool:
        user_id = request.session.get("user_id")

        if not user_id:
            return False

        async with async_session_maker() as db_session:
            if not await admin_token_valid(user_id, db_session):
                return False

        return True

class UserAdmin(ModelView, model=Users):
    name = "User"
    name_plural = "Users"
    icon = "fa-solid fa-users"

    column_list = [
        Users.id,
        Users.email,
        Users.nickname,
        Users.name,
        Users.surname,
        Users.is_active,
        Users.is_superuser,
        Users.is_email_verified,
        Users.created_at,
        Users.last_login,
    ]

    column_searchable_list = [Users.email, Users.nickname, Users.name]
    column_sortable_list = [Users.id, Users.created_at, Users.last_login, Users.is_active]
    column_default_sort = [(Users.id, True)]

    column_details_exclude_list = [Users.hashed_password]
    form_excluded_columns = [Users.hashed_password, Users.reports, Users.comments]


class ReportAdmin(ModelView, model=Reports):
    name = "Report"
    name_plural = "Reports"
    icon = "fa-solid fa-flag"

    column_list = [
        Reports.id,
        Reports.report_title,
        Reports.slug,
        Reports.user_id,
        Reports.address_id,
        Reports.views,
        Reports.created_at,
        Reports.updated_at,
    ]

    column_searchable_list = [Reports.report_title, Reports.slug]
    column_sortable_list = [Reports.id, Reports.views, Reports.created_at]
    column_default_sort = [(Reports.id, True)]

    form_excluded_columns = [Reports.comments]


class AddressAdmin(ModelView, model=Addresses):
    name = "Address"
    name_plural = "Addresses"
    icon = "fa-solid fa-address-book"

    column_list = [
        Addresses.id,
        Addresses.subject,
        Addresses.website_url,
        Addresses.crypto_address,
        Addresses.crypto_name,
        Addresses.created_at,
    ]

    column_searchable_list = [Addresses.website_url, Addresses.crypto_address, Addresses.crypto_name]
    column_sortable_list = [Addresses.id, Addresses.subject, Addresses.created_at]
    column_default_sort = [(Addresses.id, True)]

    form_excluded_columns = [Addresses.reports, Addresses.whois]


class CommentAdmin(ModelView, model=Comments):
    name = "Comment"
    name_plural = "Comments"
    icon = "fa-solid fa-comments"

    column_list = [
        Comments.id,
        
        Comments.report_id,
        Comments.user_id,
        Comments.comment,
        Comments.created_at,
        Comments.parent_comment_id,
    ]

    column_searchable_list = [Comments.comment]
    column_sortable_list = [Comments.id, Comments.created_at, Comments.report_id]
    column_default_sort = [(Comments.id, True)]

    form_excluded_columns = [Comments.children]


class WhoisAdmin(ModelView, model=Whois):
    name = "Whois"
    name_plural = "Whois Records"
    icon = "fa-solid fa-globe"

    column_list = [
        Whois.id,
        Whois.address_id,
        Whois.registrar_name,
        Whois.domain_age,
        Whois.web_create_date,
        Whois.web_expire_date,
        Whois.created_at,
    ]

    column_sortable_list = [Whois.id, Whois.domain_age, Whois.web_create_date]
    column_default_sort = [(Whois.id, True)]


def setup_admin(app, engine):
    secret_key = os.getenv("ADMIN_SECRET_KEY", "")
    if not secret_key:
        raise RuntimeError("ADMIN_SECRET_KEY is not set in environment variables")

    authentication_backend = AdminAuth(secret_key=secret_key)
    admin = Admin(app, engine, authentication_backend=authentication_backend)

    admin.add_view(UserAdmin)
    admin.add_view(ReportAdmin)
    admin.add_view(AddressAdmin)
    admin.add_view(CommentAdmin)
    admin.add_view(WhoisAdmin)

    return admin
