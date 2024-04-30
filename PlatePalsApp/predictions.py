import numpy as np 
import matplotlib.pyplot as plt
import pandas as pd
from sklearn.metrics.pairwise import cosine_similarity
import os
import subprocess

def download_file(filename, output_dir='PlatePalsApp/'):
    file_map = {
        'top_rated.pkl': '1UF6f7F0ePQTHUWs4TA-2rB26v5bvsF9y',
        'feature_df.pkl': '1K2XO94BYsT5uN_d6M_ASaOOlXxFEgGFG',
    }
    file_id = file_map.get(filename)
    if file_id:
        command = f"gdown --output {output_dir}/{filename} https://drive.google.com/uc?id={file_id}"
        subprocess.run(command, shell=True)
    else:
        print(f"File '{filename}' not found in file_map.")

def file_check_or_download(path,name):
  if os.path.exists(path):
    print("File exists - ",name)
    return True
#   else:
#     download_file(name)
#     return True

def predict_restaurant(user_preferences, top_rated, feature_df):
    
    preference_vector = np.zeros(46) 
    for prefs in user_preferences.values():
        for feature in prefs:
            preference_index = int(feature)
            preference_vector[preference_index] += 1

    original_indices = [1, 4, 5, 6, 7, 8, 12, 16, 20, 21, 25, 26, 29, 40, 43]        
    preference_vector = preference_vector[original_indices]
    # Normalize preference vector to weight preferences proportionally
    preference_vector /= max(preference_vector)
    all_top_businesses = set()
    for user_id in user_preferences.keys():
        if user_id in top_rated['user_id'].values:
            user_top_businesses = top_rated.loc[top_rated['user_id'] == user_id, 'top_businesses'].values[0]
        else:
            print(f"No data available for user_id {user_id}")
            user_top_businesses = top_rated[top_rated['user_id'] == 'new_user']
        all_top_businesses.update(user_top_businesses)
        
    valid_businesses = set()
    for user_id in user_preferences.keys():
        if user_id in top_rated['user_id'].values:
            user_top_businesses = top_rated.loc[top_rated['user_id'] == user_id, 'top_businesses'].values[0]
        else:
            print(f"No data available for user_id {user_id}")
            user_top_businesses = top_rated[top_rated['user_id'] == 'new_user']
        user_top_businesses = set(user_top_businesses)
        if not valid_businesses:
            valid_businesses = user_top_businesses
        else:
            valid_businesses = valid_businesses.intersection(user_top_businesses)
    
    filtered_restaurants = feature_df[feature_df['business_id'].isin(valid_businesses)]

    # Construct a feature matrix from these restaurants
    feature_columns = [f'{i}' for i in original_indices]  # Adjust if column names are different
    restaurant_features = filtered_restaurants[feature_columns].to_numpy()

    # Compute cosine similarity between aggregated user preference vector and each restaurant's features
    similarities = cosine_similarity([preference_vector], restaurant_features)[0]

    index = np.argmax(similarities)
    best_match = filtered_restaurants.iloc[index]
    similarity_score = similarities[index]
    
    return {'Name': best_match['name'], 
            'Business_id' : best_match['business_id'],
            'Address': best_match.get('address', '') + str(best_match.get('postal_code', '')),
            'Similarity_Score':  similarity_score}

def get_user_prefs(user_prefs):
    ans = {}
    original_indices = [1, 4, 5, 6, 7, 8, 12, 16, 20, 21, 25, 26, 29, 40, 43]    
    #[1, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 1, 1, 1, 0]    
    for user_id in user_prefs.keys():
        vector = user_prefs[user_id]
        ans_vector = []
        pos=0
        for i in range(len(vector)):
            if(vector[i]==1):
                ans_vector.append(original_indices[pos])
            pos+=1
        ans[user_id] = ans_vector
    return ans


        
def predict(user_prefs):
    directory_path = os.path.dirname(os.path.abspath(__file__))
    filename2 = 'top_rated.pkl'
    filename3 = 'feature_df.pkl'
    file_path2 = os.path.join(directory_path, filename2)
    file_path3 = os.path.join(directory_path, filename3)
    fc2=file_check_or_download(file_path2,filename2)
    fc3=file_check_or_download(file_path3,filename3)
        
    top_rated = pd.read_pickle(file_path2)
    feature_df = pd.read_pickle(file_path3)
    # user_preferences = {
    #     'DN7mB9u36QlCourhzbRq7A': [20, 29, 40, 8, 1, 7, 16, 27, 29, 40, 43],
    #     'I6M-7LxI1By6jd8H_OneeQ': [8, 20, 35, 1, 7, 16],
    #     'UkBI4VW3CwLvIgXaiiLdig': [25, 7, 26, 8, 43]
    #     }
    print("before", user_prefs)
    user_prefs = get_user_prefs(user_prefs)
    print("after", user_prefs)
    data=predict_restaurant(user_prefs, top_rated, feature_df)
    return data
    
    