# accounts/urls.py
from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import CookieTokenObtainPairView
from .views import (
    RegisterView,
    VerifyEmailView,
    ResendVerificationEmailView,
    PasswordResetRequestView,
    PasswordResetConfirmView,
    LogoutView,
    UserProfileView,
    UserPermissionsView,
    CookieTokenObtainPairView,   # Optional: if you have a separate cookie login endpoint
)

urlpatterns = [
    # 🔐 Registration & Email Verification
    path("register/", RegisterView.as_view(), name="register"),
    path("verify-email/<uid>/<token>/", VerifyEmailView.as_view(), name="verify_email"),
    path("resend-verification/", ResendVerificationEmailView.as_view(), name="resend_verification"),

    # 🔑 Authentication (Cookie & JWT)
    path("token/", CookieTokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("cookie-token/", CookieTokenObtainPairView.as_view(), name="cookie_token"),  # Optional

    # 🔁 Password Reset
    path("password-reset/", PasswordResetRequestView.as_view(), name="password_reset"),
    path(
        "password-reset-confirm/<uidb64>/<token>/",
        PasswordResetConfirmView.as_view (),
        name="password_reset_confirm",
    ),

    # 🚪 Logout
    path("logout/", LogoutView.as_view(), name="logout"),

    # 👤 User Profile & Permissions
    path("profile/", UserProfileView.as_view(), name="user_profile"),
    path("permissions/", UserPermissionsView.as_view(), name="user_permissions"),
]
