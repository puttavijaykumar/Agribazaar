# accounts/middleware.py

from .models import LogActivity
from django.urls import resolve

class ActivityLogMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        response = self.get_response(request)

        # Log activity only for authenticated users and specific page visits
        if request.user.is_authenticated:
            # Check if the URL name exists and is not an API or static file
            try:
                url_name = resolve(request.path_info).url_name
                # Avoid logging internal Django URLs, API calls, etc.
                if url_name and not url_name.startswith('admin') and not url_name.endswith('api'):
                    LogActivity.objects.create(
                        user=request.user,
                        activity_type='Page View',
                        description=f"Visited page: {request.path}"
                    )
            except Exception:
                pass # Do nothing if URL cannot be resolved
        return response