from django.http import HttpResponse, JsonResponse
from .recommend_restaurant import find_cosine_similarity
import json
from django.shortcuts import render, redirect
from django.contrib.auth.models import User
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.shortcuts import render
import numpy as np
from .models import User, Room
from django.core.exceptions import ObjectDoesNotExist
import random
from django.shortcuts import get_object_or_404

def index(request):
    return HttpResponse("Hello, world! This is my first Django web app.")


def generate_unique_code():
    # Generate a random 6-digit number
    code = random.randint(100000, 999999)
    # Convert the number to a string
    code_str = str(code)
    return code_str

def cosine_sim(request):
    #data = request.GET  # Get input from the request
    result = find_cosine_similarity(request)  # Call your function with input
    result = np.int64(result)

    result_serializable = int(result)

    res = {"Result": result_serializable}
    json_data = json.dumps(res)

    return JsonResponse(json_data,  safe=False)  

# @api_view(['POST'])
# def create_user(request):
#     if request.method == 'POST':
#         # Parse request body JSON data
#         data = json.loads(request.body)
        
#         # Extract user data
#         user_id = data.get('user_id')
#         first_name = data.get('first_name')
#         last_name = data.get('last_name')
        
#         # Create user
#         try:
#             new_user = User.objects.create(
#                 user_id=user_id,
#                 first_name=first_name,
#                 last_name=last_name
#                 # Add more fields as needed
#             )
#             return JsonResponse({'message': 'User created successfully'}, status=201)
#         except Exception as e:
#             return JsonResponse({'error': str(e)}, status=400)
#     else:
#         return JsonResponse({'error': 'Only POST requests are allowed'}, status=405)

@api_view(['POST'])
def create_room(request):
    if request.method == 'POST':
        # Parse request body JSON data
        data = json.loads(request.body)
        
        # Extract user data
        first_name_query = data.get('first_name')
        last_name_query = data.get('last_name')
        # Create room
        try:
            try:
                admin_user = User.objects.get(first_name=first_name_query, last_name=last_name_query)
                print(admin_user)
                print(admin_user.first_name)
            except User.DoesNotExist:
                return JsonResponse({'error': 'Admin user does not exist'}, status=400)

            max_attempts = 10  # Maximum number of attempts to generate a unique code
            print(max_attempts)
            new_code = None
            for _ in range(max_attempts):
                new_code = generate_unique_code()
                print(new_code)
                try:
                    existing_room = Room.objects.get(code=new_code)
                except Room.DoesNotExist:
                    # If no room with the generated code exists, break the loop
                    break
            new_room = Room.objects.create(
                code = new_code,
                admin = admin_user
            )
        except ObjectDoesNotExist:
            return JsonResponse({'error': 'User does not exist'}, status=404)
        return JsonResponse({'code':new_code})
    else:
        return JsonResponse({'error': 'Only POST requests are allowed'}, status=405)

@api_view(['POST'])
def update_room(request):
    if request.method == 'POST':
        # Parse request body JSON data
        data = json.loads(request.body)
        
        # Extract user data
        code = data.get('code')
        isLocked = data.get('is_locked')
        try:
            room = Room.objects.get(code=code)
        except Room.DoesNotExist:
            return JsonResponse({'error': 'Room not found'}, status=404)

        # Update the isLocked field
        room.islocked = isLocked
        room.save()

        # Return a JSON response indicating success
        return JsonResponse({'message': 'Room updated successfully'})
    else:
        return JsonResponse({'error': 'Only POST requests are allowed'}, status=405)
