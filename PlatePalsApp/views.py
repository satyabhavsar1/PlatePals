from django.http import HttpResponse

def index(request):
    return HttpResponse("Hello, world! This is my first Django web app.")
from django.shortcuts import render

# Create your views here.
