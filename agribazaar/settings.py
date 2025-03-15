"""
Django settings for agribazaar project.

Generated by 'django-admin startproject' using Django 5.1.6.

For more information on this file, see
https://docs.djangoproject.com/en/5.1/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/5.1/ref/settings/
"""

from pathlib import Path
import os
import dj_database_url 
# Security settings
# Database configuration
import pymysql
pymysql.install_as_MySQLdb()
 

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/5.1/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
# SECRET_KEY = 'django-insecure-yu6h+kl*e$m^+walqvybzv4iz76=0o&g=c(uy&ejp_s=340er*'



DEBUG = os.getenv('DEBUG', 'True' if os.getenv('RENDER') is None else 'False') == 'True'

DEBUG = False


# ALLOWED_HOSTS = ["127.0.0.1", "192.168.56.1"]
# ALLOWED_HOSTS = config('ALLOWED_HOSTS', default='agribazaar-lxdu.onrender.com,localhost,127.0.0.1').split(',')
# Print ALLOWED_HOSTS to verify

# Application definition
  # Debugging to check if it loads correctly
INSTALLED_APPS = [
    
    'accounts',
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
]
AUTH_USER_MODEL = 'accounts.CustomUser'

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'agribazaar.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [BASE_DIR/"templates"],
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


# Database
# https://docs.djangoproject.com/en/5.1/ref/settings/#databases
SECRET_KEY = os.getenv('DJANGO_SECRET_KEY', 'fallback-secret-key')#render secrete key from environment variable
# SECURITY WARNING: don't run with debug turned on in production!


 # Make sure to install this package
# DATABASE_URL = os.getenv("MYSQL_URL")
ALLOWED_HOSTS = ['.vercel.app','127.0.0.1','localhost']
print("✅ ALLOWED_HOSTS:", ALLOWED_HOSTS)

# from dotenv import load_dotenv
# load_dotenv()
# DATABASE_URL = os.getenv('DATABASE_URL','mysql://root:YgHihGOQauBRHDQzhoJGXApMDgEecNZm@mysql.railway.internal:3306/railway')  # Fetch from environment variable
# DATABASES = {
#     'default': {
#         'ENGINE': 'mysql.connector.django',  # Use mysql-connector-python
#         'NAME':  os.getenv('railway',default='agribazaar'),
#         'USER': os.getenv('root',default='root'),
#         'PASSWORD': os.getenv('YgHihGOQauBRHDQzhoJGXApMDgEecNZm',default='Vijay@2025sql'),  #Vijay@2025sql'
#         'HOST':  os.getenv('mainline.proxy.rlwy.net',default='127.0.0.1'),
#         'PORT': os.getenv('59144',default=3306),
#         'OPTIONS': {
#             'init_command': "SET sql_mode='STRICT_TRANS_TABLES'"
#             # 'autocommit': True,
#         }
#     }
# }

# DATABASE_URL = "mysql://root:YgHihGOQauBRHDQzhoJGXApMDgEecNZm@mysql.railway.internal:3306/railway"
# DATABASE_URL = os.getenv('DATABASE_URL')
# if DATABASE_URL:
#     DATABASES['default'] = dj_database_url.config(default=DATABASE_URL, conn_max_age=600)
    
# Password validation
# https://docs.djangoproject.com/en/5.1/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]


# Internationalization
# https://docs.djangoproject.com/en/5.1/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/5.1/howto/static-files/


BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

STATIC_URL = "/static/"

STATICFILES_DIRS = [
    os.path.join(BASE_DIR,"accounts","static"),
]
STATIC_ROOT = os.path.join(BASE_DIR, "staticfiles")  # Ensure this directory exists
# Default primary key field type
# https://docs.djangoproject.com/en/5.1/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# settings.py

# EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'  # Shows email in the terminal (for testing)
EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = 'smtp.gmail.com'  
EMAIL_PORT = 587  
EMAIL_USE_TLS = True  
EMAIL_HOST_USER = 'vijaykumarputta08@gmail.com'  
EMAIL_HOST_PASSWORD = 'thos cyhn ncmy ayyc'  
DEFAULT_FROM_EMAIL = EMAIL_HOST_USER
print(EMAIL_BACKEND)