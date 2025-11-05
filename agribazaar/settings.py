# settings.py
from pathlib import Path
from dotenv import load_dotenv
import os
import dj_database_url
from datetime import timedelta
import cloudinary

# --------------------
# Paths & dotenv
# --------------------
BASE_DIR = Path(__file__).resolve().parent.parent
load_dotenv(BASE_DIR / ".env")  # explicit

# --------------------
# Core
# --------------------
SECRET_KEY = os.getenv('SECRET_KEY', 'fallback-secret-key')

# Single source of truth for DEBUG
DEBUG = os.getenv('DEBUG', 'False') == 'True'

ALLOWED_HOSTS = [
    'agribazaar-1.onrender.com',          # Render backend
    'agribazaar-frontend-ui.vercel.app',  # Vercel frontend
    'localhost',
    '127.0.0.1',
]

AUTH_USER_MODEL = "accounts.CustomUser"
# LOGIN_URL = '/login/'
# LOGIN_REDIRECT_URL = "/buyer/dashboard/"

# # --------------------
# Installed apps
# --------------------
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',

    "whitenoise.runserver_nostatic",
    "rest_framework",
    # If using JWT (recommended):
    # "rest_framework_simplejwt",

    'corsheaders',
    'accounts',

    'cloudinary',
    'cloudinary_storage',
]

# --------------------
# Middleware
# --------------------
MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',   # keep first
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

# --------------------
# URLs / WSGI / Templates
# --------------------
ROOT_URLCONF = 'agribazaar.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [BASE_DIR / "templates"],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'agribazaar.wsgi.application'

# --------------------
# Database
# --------------------
DATABASES = {
    "default": dj_database_url.config(default=os.getenv("DATABASE_URL"))
}

# --------------------
# REST Framework (if using JWT globally)
# --------------------
# REST_FRAMEWORK = {
#     "DEFAULT_AUTHENTICATION_CLASSES": (
#         "rest_framework_simplejwt.authentication.JWTAuthentication",
#     ),
#     "DEFAULT_PERMISSION_CLASSES": (
#         "rest_framework.permissions.IsAuthenticated",
#     ),
# }

# SIMPLE_JWT = {
#     "ACCESS_TOKEN_LIFETIME": timedelta(days=7),
#     "REFRESH_TOKEN_LIFETIME": timedelta(days=30),
#     "ALGORITHM": "HS256",
#     "SIGNING_KEY": SECRET_KEY,
# }

# --------------------
# Email (OTP)
# --------------------
EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = 'smtp.gmail.com'
EMAIL_PORT = 587
EMAIL_USE_TLS = True
EMAIL_HOST_USER = os.getenv("EMAIL_HOST_USER")
EMAIL_HOST_PASSWORD = os.getenv('EMAIL_HOST_PASSWORD')
DEFAULT_FROM_EMAIL = EMAIL_HOST_USER

# --------------------
# Cloudinary (media only)
# --------------------
cloudinary.config(
    cloud_name=os.getenv('CLOUDINARY_CLOUD_NAME'),
    api_key=os.getenv('CLOUDINARY_API_KEY'),
    api_secret=os.getenv('CLOUDINARY_API_SECRET')
)

CLOUDINARY_STORAGE = {
    'CLOUD_NAME': os.getenv('CLOUDINARY_CLOUD_NAME'),
    'API_KEY': os.getenv('CLOUDINARY_API_KEY'),
    'API_SECRET': os.getenv('CLOUDINARY_API_SECRET'),
}
DEFAULT_FILE_STORAGE = 'cloudinary_storage.storage.MediaCloudinaryStorage'

# --------------------
# CORS / CSRF
# --------------------
CORS_ALLOW_CREDENTIALS = True
CORS_ALLOWED_ORIGINS = [
    "https://agribazaar-frontend-ui.vercel.app",
   
]

CSRF_TRUSTED_ORIGINS = [
    "https://agribazaar-frontend-ui.vercel.app",
    "https://agribazaar-1.onrender.com",
]

# --------------------
# Static / Media
# --------------------
STATIC_URL = "/static/"
STATIC_ROOT = BASE_DIR / "staticfiles"
STATICFILES_DIRS = [
    BASE_DIR / "static",
]
STATICFILES_STORAGE = "whitenoise.storage.CompressedManifestStaticFilesStorage"

MEDIA_URL = '/media/'
MEDIA_ROOT = BASE_DIR / 'media'

# --------------------
# Security in production
# --------------------
if not DEBUG:
    SECURE_SSL_REDIRECT = True
    SESSION_COOKIE_SECURE = True
    CSRF_COOKIE_SECURE = True

# --------------------
# Tests: in-memory DB (optional)
# --------------------
import sys
if 'test' in sys.argv:
    DATABASES['default'] = {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': ':memory:',
    }

# --------------------
# Logging (optional)
# --------------------
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': { 'console': { 'class': 'logging.StreamHandler' } },
    'root': { 'handlers': ['console'], 'level': 'DEBUG' if DEBUG else 'INFO' },
}
