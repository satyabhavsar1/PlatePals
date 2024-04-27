from django.http import HttpResponse, JsonResponse
import json
from django.shortcuts import render, redirect
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.shortcuts import render
from djongo.models.fields import ObjectIdField
import numpy as np
from .models import User, Room, Answer
from django.core.exceptions import ObjectDoesNotExist
import random
from .predictions import predict

def index(request):
    return HttpResponse("Hello, world! This is my first Django web app.")


def generate_unique_code():
    # Generate a random 6-digit number
    code = random.randint(100000, 999999)
    # Convert the number to a string
    code_str = str(code)
    return code_str

def predict_result(request):
    data = request.GET  
    user_prefs = data.get('user_prefs')
    result = predict(user_prefs)  
    res = {"Result": result}
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
                return JsonResponse({'success':False,'error': 'Admin user does not exist'}, status=400)

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
            return JsonResponse({'success':False,'error': 'User does not exist'}, status=404)
        return JsonResponse({'success':True,'code':new_code})
    else:
        return JsonResponse({'success':False,'error': 'Only POST requests are allowed'}, status=405)

@api_view(['POST'])
def join_room_check_user(request):
    if request.method == 'POST':
        # Parse request body JSON data
        data = json.loads(request.body)
        
        # Extract user data
        first_name_query = data.get('first_name')
        last_name_query = data.get('last_name')
        # Create room
        # try:
        try:
            admin_user = User.objects.get(first_name=first_name_query, last_name=last_name_query)
            print(admin_user)
            print(admin_user.first_name)
        except User.DoesNotExist:
            return JsonResponse({'success':False,'error': 'User does not exist'}, status=400)

        return JsonResponse({'success':True})
    else:
        return JsonResponse({'success':False,'error': 'Only POST requests are allowed'}, status=405)
    

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
            return JsonResponse({'success':False,'error': 'Room not found'}, status=404)

        # Update the isLocked field
        room.islocked = isLocked
        room.save()

        # Return a JSON response indicating success
        return JsonResponse({'success':True,'message': 'Room updated successfully'})
    else:
        return JsonResponse({'sucess':False,'error': 'Only POST requests are allowed'}, status=405)

@api_view(['POST'])
def add_member_to_room(request):
    if request.method == 'POST':
        # Parse request body JSON data
        data = json.loads(request.body)
        
        # Extract user and room
        first_name_query = data.get('first_name')
        last_name_query = data.get('last_name')
        code = data.get('code')
        print(first_name_query)
        print(last_name_query)
        print(code)
        try:
            room = Room.objects.get(code=code)
            print(room)
            print(room.islocked)
            if(room.islocked == True):
                print(room.islocked)
                return JsonResponse({'success':False,'error': 'Room is already locked'}, status=400)

        except Room.DoesNotExist:
            return JsonResponse({'success':False,'error': 'Room not found'}, status=404)

        # Fetch the user
        try:
            print(first_name_query)
            print(last_name_query)
            user = User.objects.get(first_name=first_name_query, last_name=last_name_query)
            print(user)
        except User.DoesNotExist:
            return JsonResponse({'success':False,'error': 'User does not exist'}, status=400)

        room.members.add(user)
        print(user)
        room.save()

        # Return a JSON response indicating success
        return JsonResponse({'success':True,'message': 'Member added successfully'})
    else:
        return JsonResponse({'success':False,'error': 'Only POST requests are allowed'}, status=405)


@api_view(['GET'])
def fetch_members(request):
    if request.method == 'GET':
        rcode = request.GET.get('code')
        print(rcode)
        try:
            room = Room.objects.get(code=rcode)
            print(room)
            # Access the members of the room through the 'members' attribute
            members = room.members.all()
            print(members)
            names = [(user.first_name, user.last_name) for user in members]
            print(names)

        except Room.DoesNotExist:
            return JsonResponse({'success':False,'error': 'Room not found'}, status=404)


        # Return a JSON response including names
        return JsonResponse({'success':True,'names': names})

    else:
        return JsonResponse({'success':False,'error': 'Only POST requests are allowed'}, status=405)

@api_view(['POST'])
def add_ans(request):
    print("Add answer API")
    if request.method == 'POST':
        # Parse request body JSON data
        data = json.loads(request.body)
        
        # Extract user and room
        first_name_query = data.get('first_name')
        last_name_query = data.get('last_name')
        code = data.get('code')
        ans = data.get('ans')
        print(first_name_query)
        print(last_name_query)
        print(code)
        try:
            room = Room.objects.get(code=code)
            user = User.objects.get(first_name=first_name_query, last_name=last_name_query)
        except Room.DoesNotExist:
            return JsonResponse({'success':False,'error': 'Room not found'}, status=404)

        # Fetch the user
        try:
            print(first_name_query)
            print(last_name_query)
            user = User.objects.get(first_name=first_name_query, last_name=last_name_query)
        except User.DoesNotExist:
            return JsonResponse({'success':False,'error': 'User does not exist'}, status=400)
        
        print("creating ans")
        print("user",user)
        print("room",room)
        ans = Answer.objects.create(room = room, user = user, answer_data=ans)

        # Return a JSON response indicating success
        return JsonResponse({'success':True,'message': 'Answer added successfully'})
    else:
        return JsonResponse({'success':False,'error': 'Only POST requests are allowed'}, status=405)


@api_view(['GET'])
def fetch_result(request):
    if request.method == 'GET':
        rcode = request.GET.get('code')
        print(rcode)
        try:
            room = Room.objects.get(code=rcode)
            print(room)
            result = room.result
            if result:
                print(result)
                return JsonResponse({'success':True,'result': result})
            ans_data = Answer.objects.filter(room = room)
            members = room.members.all()
            print("ans_data", ans_data)
            print("members", members)
            if(len(ans_data)< len(members)+1):
                return JsonResponse({'success':False,'error': 'All members have not finished answering.'}, status=400)
            user_prefs = {}
            print(members)
            for member in members:
                # Find the Answer object for the current member, if it exists
                member_answer = ans_data.filter(user=member).first()
                if member_answer:
                    user_prefs[member.user_id]=json.loads(member_answer.answer_data)
                else:
                    print("No answer found for member:", member)
            admin = room.admin
            print("admin", admin)
            admin_answer = ans_data.filter(user=admin).first()
            user_prefs[admin.user_id]=json.loads(admin_answer.answer_data)
            print(user_prefs)
            result = predict(user_prefs)
            print(result)
        except Room.DoesNotExist:
            return JsonResponse({'success':False,'error': 'Room not found'}, status=404)

        # Return a JSON response including names
        return JsonResponse({'success':True,'result': result})

    else:
        return JsonResponse({'success':False,'error': 'Only POST requests are allowed'}, status=405)

