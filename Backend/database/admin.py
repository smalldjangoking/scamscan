from sqladmin import Admin, ModelView
from database.models import Users


class UserAdmin(ModelView, model=Users):
    name = "User"
    name_plural = "Users"

    column_list = [
        Users.id,
        Users.email,
        Users.name,
        Users.is_active,
        Users.is_email_verified,
        Users.last_login,
    ]


def setup_admin(app, engine):
    admin = Admin(app, engine)
    admin.add_view(UserAdmin)
    return admin
