class ActivityLogMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        # Example: You can add logging before the view is called
        # print(f"User {request.user} made a request to {request.path}")
        
        response = self.get_response(request)

        # Example: Add some post-processing if needed
        
        return response
