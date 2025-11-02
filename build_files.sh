#!/bin/bash
# Install Python dependencies for the backend
pip install -r agribazaar/requirements.txt

# # Collect Django static files
# python agribazaar/manage.py collectstatic --noinput --clear