from django.http import HttpResponse, JsonResponse
from .recommend_restaurant import find_cosine_similarity
import json
from django.shortcuts import render
import numpy as np

def index(request):
    return HttpResponse("Hello, world! This is my first Django web app.")

def cosine_sim(request):
    #data = request.GET  # Get input from the request
    result = find_cosine_similarity(request)  # Call your function with input
    result = np.int64(result)

    # Convert the int64 object to a JSON serializable type (e.g., int)
    result_serializable = int(result)

    # Create a dictionary with a key "Result" and the value of `result_serializable`
    res = {"Result": result_serializable}
    json_data = json.dumps(res)

    return JsonResponse(json_data,  safe=False)  # Serialize the output

# Create your views here.
