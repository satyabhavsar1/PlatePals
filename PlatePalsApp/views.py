from django.http import HttpResponse, JsonResponse
from .recommend_restaurant import find_cosine_similarity
import json
from django.shortcuts import render, redirect
from django.contrib.auth.models import User
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.shortcuts import render
import numpy as np
from .models import User

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
        # Parse request body JSON data
        data = json.loads(request.body)
        
        # Extract user data
        user_id = '11111'
        first_name = data.get('first_name')
        last_name = data.get('last_name')
        
        # Create user
        try:
            new_user = User.objects.create(
                user_id=user_id,
                first_name=first_name,
                last_name=last_name
                # Add more fields as needed
            )
            return JsonResponse({'message': 'User created successfully'}, status=201)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)
    else:
        return JsonResponse({'error': 'Only POST requests are allowed'}, status=405)
