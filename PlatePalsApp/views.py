from django.http import HttpResponse
from .recommend_restaurant import cosine_sim
def index(request):
    return HttpResponse("Hello, world! This is my first Django web app.")
from django.shortcuts import render

def cosine_sim(request):
    if request.method == 'POST':
        data = request.POST  # Get input from the request
        result = cosine_sim(data)  # Call your function with input
        return JsonResponse(result)  # Serialize the output
    else:
        return JsonResponse({"error": "Only POST requests are allowed."}, status=405)

# Create your views here.
