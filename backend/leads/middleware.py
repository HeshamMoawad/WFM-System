import time
from django.core.cache import cache
from django.http import HttpResponseForbidden

class RateLimitMiddleware:
    
    def __init__(self, get_response):
        self.get_response = get_response
        self.rate_limit = 100  # Max requests
        self.time_window = 60  # Time window in seconds

    def __call__(self, request):
        client_ip = self.get_client_ip(request)
        request_count = cache.get(client_ip, 0)

        if request_count >= self.rate_limit:
            return HttpResponseForbidden("Rate limit exceeded. Try again later.")

        # Increment the request count and set a timeout
        cache.set(client_ip, request_count + 1, timeout=self.time_window)

        response = self.get_response(request)
        return response

    def get_client_ip(self, request):
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            ip = x_forwarded_for.split(',')[0]
        else:
            ip = request.META.get('REMOTE_ADDR')
        return ip
