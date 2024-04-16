import subprocess
import pandas as pd
import csv
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np
import os

# cosine similarity
def find_cosine_similarity(request):
  request_headers = request.headers

  feature_cols = [5, 10, 39, 36, 40, 18, 35, 6, 27, 12, 4, 22, 44]
  num_vectors = 5
  num_features_selected = 10
  columns_to_extract = [i for i in range(3,60)]
  print("Request Headers:")
  for header, value in request_headers.items():
      print(f"{header}: {value}")


  vectors = np.zeros((num_vectors, len(columns_to_extract)))  # Match the number of columns in restaurant_preferences
  directory_path = os.path.dirname(os.path.abspath(__file__))
  filename = 'updated_sf.csv'
  file_path = os.path.join(directory_path, filename)

  updated_sf = pd.read_csv(file_path)
  # Iterate over each vector
  for i in range(num_vectors):
      # Randomly select 10 feature indices
      selected_indices = np.random.choice(feature_cols, size=num_features_selected, replace=False)
      # Set the selected feature indices to 1 in the current vector
      print(selected_indices)
      vectors[i, selected_indices-1] = 1

  print(vectors)
  group_vector = vectors.sum(axis=0)
  print(group_vector)

  # Convert similarity scores to DataFrame for better visualization
  restaurant_preferences = updated_sf.drop(columns=['ID', 'Restaurant'])
  #print(restaurant_preferences.iloc[0])
  similarity_scores = cosine_similarity([group_vector], restaurant_preferences)
  print(similarity_scores.shape)

  restaurant_similarity = pd.DataFrame(similarity_scores, columns=restaurant_preferences.index)
  print("Restaurant similarity shape", restaurant_similarity.shape)

  # Rank restaurants based on similarity scores
  ranked_restaurants = restaurant_similarity.mean(axis=0).sort_values(ascending=False)
  print(ranked_restaurants.shape)

  # Recommendation
  recommended_restaurant = ranked_restaurants.index[0]
  return recommended_restaurant
