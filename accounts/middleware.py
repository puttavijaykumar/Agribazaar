# accounts/middleware.py

from django.urls import resolve, Resolver404
from .models import LogActivity

class ActivityLogMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response
        self.EXCLUDED_URL_NAMES = ['admin', 'api'] # URLs starting with these names won't be logged

    def __call__(self, request):
        response = self.get_response(request)

        # Only log activity for authenticated users and GET requests
        if request.user.is_authenticated and request.method == 'GET':
            try:
                # Resolve the URL to get its name
                url_name = resolve(request.path_info).url_name
                
                # Check if the URL name is in the list of excluded names
                if url_name and not any(url_name.startswith(name) for name in self.EXCLUDED_URL_NAMES):
                    LogActivity.objects.create(
                        user=request.user,
                        activity_type='Page View',
                        description=f"Visited page: {request.path}"
                    )
            except Resolver404:
                # Do nothing if the URL cannot be resolved (e.g., 404 page)
                pass 
            except Exception as e:
                # Catch any other unexpected errors without crashing the server
                # You can log this error for debugging in a real application
                pass

        return response