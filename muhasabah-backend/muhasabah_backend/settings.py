from pathlib import Path
import os
from decouple import config
from datetime import timedelta

# ----------------------------------------------------------------------------- #
#                                BASE SETTINGS                                  #
# ----------------------------------------------------------------------------- #

BASE_DIR = Path(__file__).resolve().parent.parent

SECRET_KEY = config("SECRET_KEY")
DEBUG = config("DEBUG", default=True, cast=bool)
ALLOWED_HOSTS = config("ALLOWED_HOSTS", default="*").split(",")

# ----------------------------------------------------------------------------- #
#                               APPLICATIONS                                    #
# ----------------------------------------------------------------------------- #

DJANGO_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
]

THIRD_PARTY_APPS = [
    "rest_framework",
    "rest_framework_simplejwt",
    "rest_framework_simplejwt.token_blacklist",
    "corsheaders",  # ✅ only once
    "phonenumber_field",
    "django_extensions",
    "django_celery_beat",
    "allauth",
    "allauth.account",
    "allauth.socialaccount",
    "allauth.socialaccount.providers.google",
    "dj_rest_auth",
    "dj_rest_auth.registration",
    "rest_framework.authtoken",
]

LOCAL_APPS = [
    "accounts",
    "sittings",
    "swot",
    "todos",
    "checkins",
    "navigation",
    "notification",
    "comments",
]

INSTALLED_APPS = DJANGO_APPS + THIRD_PARTY_APPS + LOCAL_APPS

# ----------------------------------------------------------------------------- #
#                                MIDDLEWARE                                     #
# ----------------------------------------------------------------------------- #

MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "corsheaders.middleware.CorsMiddleware",  # CORS middleware must be high up
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
    "allauth.account.middleware.AccountMiddleware",
]

# ----------------------------------------------------------------------------- #
#                                 URL / WSGI                                    #
# ----------------------------------------------------------------------------- #

ROOT_URLCONF = "muhasabah_backend.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

WSGI_APPLICATION = "muhasabah_backend.wsgi.application"

# ----------------------------------------------------------------------------- #
#                                DATABASE                                        #
# ----------------------------------------------------------------------------- #

DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.postgresql",
        "NAME": config("DB_NAME"),
        "USER": config("DB_USER"),
        "PASSWORD": config("DB_PASSWORD"),
        "HOST": config("DB_HOST", default="localhost"),
        "PORT": config("DB_PORT", default="5432"),
    }
}

# ----------------------------------------------------------------------------- #
#                         AUTH & USER MODEL                                     #
# ----------------------------------------------------------------------------- #

AUTH_USER_MODEL = "accounts.User"

AUTHENTICATION_BACKENDS = (
    "django.contrib.auth.backends.ModelBackend",
    "allauth.account.auth_backends.AuthenticationBackend",
)

SITE_ID = 1

# Allauth settings
ACCOUNT_EMAIL_REQUIRED = True
ACCOUNT_USERNAME_REQUIRED = False
ACCOUNT_AUTHENTICATION_METHOD = "email"

REST_USE_JWT = True

REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": (
        "rest_framework_simplejwt.authentication.JWTAuthentication",
    ),
}

# ----------------------------------------------------------------------------- #
#                             STATIC & MEDIA FILES                              #
# ----------------------------------------------------------------------------- #

STATIC_URL = "static/"

# ----------------------------------------------------------------------------- #
#                             INTERNATIONALIZATION                              #
# ----------------------------------------------------------------------------- #

LANGUAGE_CODE = "en-us"
TIME_ZONE = "Africa/Lagos"
USE_I18N = True
USE_TZ = True

# ----------------------------------------------------------------------------- #
#                             PASSWORD VALIDATION                               #
# ----------------------------------------------------------------------------- #

AUTH_PASSWORD_VALIDATORS = [
    {"NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator"},
    {"NAME": "django.contrib.auth.password_validation.MinimumLengthValidator"},
    {"NAME": "django.contrib.auth.password_validation.CommonPasswordValidator"},
    {"NAME": "django.contrib.auth.password_validation.NumericPasswordValidator"},
]

# ----------------------------------------------------------------------------- #
#                              EMAIL CONFIGURATION                              #
# ----------------------------------------------------------------------------- #

EMAIL_BACKEND = "django.core.mail.backends.smtp.EmailBackend"
EMAIL_HOST = config("EMAIL_HOST")
EMAIL_PORT = config("EMAIL_PORT", cast=int)
EMAIL_USE_TLS = config("EMAIL_USE_TLS", cast=bool)
EMAIL_HOST_USER = config("EMAIL_HOST_USER")
EMAIL_HOST_PASSWORD = config("EMAIL_HOST_PASSWORD")

# ----------------------------------------------------------------------------- #
#                          CELERY CONFIGURATION                                 #
# ----------------------------------------------------------------------------- #

CELERY_BROKER_URL = "redis://localhost:6379"
CELERY_TIMEZONE = "Africa/Lagos"

# ----------------------------------------------------------------------------- #
#                            WHATSAPP (TERMII)                                  #
# ----------------------------------------------------------------------------- #

TERMII_API_KEY = config("TERMII_API_KEY")
TERMII_SENDER_ID = config("TERMII_SENDER_ID")

# ----------------------------------------------------------------------------- #
#                           SOCIAL PROVIDERS                                    #
# ----------------------------------------------------------------------------- #

SOCIALACCOUNT_PROVIDERS = {
    "google": {
        "SCOPE": ["email", "profile"],
        "AUTH_PARAMS": {"access_type": "online"},
    }
}

# ----------------------------------------------------------------------------- #
#                          SECURITY & CORS/CSRF                                 #
# ----------------------------------------------------------------------------- #

FRONTEND_URL = "http://localhost:3000"

CSRF_TRUSTED_ORIGINS = [
    "http://localhost:3000",
    "https://yourfrontend.com",
]

CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "https://yourfrontend.com",
]
CORS_ALLOW_CREDENTIALS = True

SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True
SECURE_SSL_REDIRECT = False  # Set to True in production

# ----------------------------------------------------------------------------- #
#                          SIMPLE JWT SETTINGS                                  #
# ----------------------------------------------------------------------------- #

SIMPLE_JWT = {
    "ACCESS_TOKEN_LIFETIME": timedelta(minutes=15),
    "REFRESH_TOKEN_LIFETIME": timedelta(days=7),
    "AUTH_COOKIE": "access_token",
    "AUTH_COOKIE_REFRESH": "refresh_token",
}

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"
