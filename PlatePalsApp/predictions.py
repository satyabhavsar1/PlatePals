import numpy as np 
import matplotlib.pyplot as plt
import pandas as pd
from sklearn.metrics.pairwise import cosine_similarity
import os
import subprocess

def download_file(filename, output_dir='PlatePalsApp/'):
    file_map = {
        'df.pkl': '1guiGVN0x8Oc_olsC-8E6k5Jtnd3UJwBe',
        'top_rated.pkl': '1MNz1r-lFShjTHxL6aweP9bBq5MqioMiE',
        'feature_df.pkl': '1enK0oq7sKly0YZ4HDHZXCmJpLphijU8n',
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
  else:
    download_file(name)
    return True

def predict_restaurant(user_preferences, top_rated, df, feature_df):
    
    preference_vector = np.zeros(46) 
    for prefs in user_preferences.values():
        for feature in prefs:
            preference_index = int(feature)
            preference_vector[preference_index] += 1

    original_indices = [1, 4, 5, 6, 7, 8, 11, 12, 16, 20, 21, 25, 26, 29, 43]        
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
    for business in all_top_businesses:
        is_valid = True
        for user_id in user_preferences: 
            if user_id in df.index:
                if pd.notna(df.at[user_id, business]) and df.at[user_id, business] < 3.5:
                    is_valid = False
                    break
        if is_valid:
            valid_businesses.add(business)
    
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
    filename1 = 'df.pkl'
    filename2 = 'top_rated.pkl'
    filename3 = 'feature_df.pkl'
    file_path1 = os.path.join(directory_path, filename1)
    file_path2 = os.path.join(directory_path, filename2)
    file_path3 = os.path.join(directory_path, filename3)
    fc1=file_check_or_download(file_path1,filename1)
    fc2=file_check_or_download(file_path2,filename2)
    fc3=file_check_or_download(file_path3,filename3)
        
    df = pd.read_pickle(file_path1)              
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
    data=predict_restaurant(user_prefs, top_rated, df, feature_df)
    return data
    
    