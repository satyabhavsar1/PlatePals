from django.http import HttpResponse, JsonResponse
from .recommend_restaurant import find_cosine_similarity
import json
from django.shortcuts import render, redirect
from django.contrib.auth.models import User
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.shortcuts import render
import numpy as np

def index(request):
    return HttpResponse("Hello, world! This is my first Django web app.")

def cosine_sim(request):
    #data = request.GET  # Get input from the request
    result = find_cosine_similarity(request)  # Call your function with input
    result = np.int64(result)

    result_serializable = int(result)

    res = {"Result": result_serializable}
    json_data = json.dumps(res)

    return JsonResponse(json_data,  safe=False)  

@api_view(['POST'])
def create_user(request):
    if request.method == 'POST':
        username = request.data.get('username')
        email = request.data.get('email')
        password = request.data.get('password')
        if username and email and password:
            user = User.objects.create_user(username=username, email=email, password=password)
            return Response({'message': 'User created successfully'})
        else:
            return Response({'error': 'Missing required data'}, status=400)
