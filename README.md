![Logo](Logo.png)

Welcome to PlatePals, a unique restaurant recommendation application designed to help groups of friends discover perfect dining spots based on their collective preferences. Whether you're craving specific cuisines, in the mood for a vibrant nightlife scene, or looking for places that serve alcohol, PlatePals makes it easy to satisfy everyone's tastes.

# Running the Application

- git clone git@github.com:satyabhavsar1/PlatePals.git
- Install latest Python version
- Install the latest Node version and React framework
- Open 2 terminal windows and enter `cd PlatePals`
- In one window 
    - activate virtual python env using
        - `python3 -m venv newenv`
        - `source newenv/bin/activate`
    -  `pip install -r requirements.txt`
    - python manage.py runserver
    - This starts our backend server on http://localhost:8000
- In another window
    - `cd platepals-frontend`
    - `npm i`
    - `npm run start`
    - This starts our frontend server at http://localhost:3000
    - Open this link to start using the app
- Currently our app has following set of users with first and last names as below:
    1. test test
    2. abc abc
    3. ab ab
    4. a a

You can use any of these names to try the app. Create the room using one user and join the room for other users.

- NOTE: When you start the application, it will automatically download some .pkl files. Please do not delete these files as they contain our dataset and required for the application to run.

# Problem Statement

Choosing a restaurant that fits the diverse preferences of a group can be challenging. PlatePals addresses this issue by providing tailored recommendations that consider various factors such as cuisine type, alcohol availability, and ambiance preferences like nightlife. It also takes into consideration the reviews and ratings that the individual user has given these restaurants over time. 

PlatePals streamlines the decision-making process through an innovative interface where users express their dining preferences via a simple Yes/No swiping mechanism. Each flashcard represents different restaurant features like cuisine, alcohol availability, and atmosphere. By aggregating these preferences from all group members, PlatePals utilizes sophisticated algorithms to recommend the restaurant that best aligns with the collective choices, ensuring an optimal dining experience for everyone involved.

# Objectives

- Segregating the restaurants, users, and reviews in the Yelp dataset based on city. In this project we have considered Philadelphia, as it had the most number of reviews.
- Predicting the ratings of restaurants listed in the Yelp dataset based on the reviews given by the users.
- A mobile-responsive web app featuring a unique interface where users can easily indicate their dining preferences through a straightforward Yes/No swiping mechanism.
- Recommending a restaurant to the group by utilizing the predicted ratings matrix and restaurant feature matrix.

# Data Description

The dataset that we have used in this project is the [Yelp Dataset Challenge 2018](https://www.yelp.com/dataset). The dataset consists of a collection of JSON files featuring details on businesses, reviews, user profiles, check-ins, and tips (brief reviews). The size of the total dataset is 9.29GB. The data is composed of six sub-datasets, each providing a concise description of the information they contain:
1. Businesses Dataset (119MB) - consisting of 150,346 businesses
2. Reviews Dataset (5.34GB) - consisting of 6,990,280 reviews
3. Users Dataset (3.36GB) - consisting of 1,987,897 users
4. Tips Dataset (180MB) - consisting of 908,915 tips
5. Check-ins Dataset (287MB) 

For the sake of this project we have used only the businesses, reviews, and users sub-datasets. 

# Data Preprocessing Summary
- The Businesses dataset originally includes multiple businesses. By applying a filter to the Categories column to select only restaurants, we have narrowed down the total from 150,346 businesses to 53,052.
- Our analysis revealed that Pennsylvania has the highest number of reviews, totaling 933,691. Within Pennsylvania, Philadelphia tops the list with 574,595 reviews. Moving forward, our focus will be on analyzing and predicting trends for restaurants specifically in Philadelphia. The number of restaurants in Philadelphia is 5078.
- We refined the Reviews dataset to include only those pertaining to restaurants in Philadelphia, decreasing its size from 6,990,280 to 592,565 reviews.
- Similarly, we narrowed down the Users dataset to include only those from Philadelphia, which reduced the total count from 1,987,897 to 199,676 users.
- By incorporating sentiment scores, ratings become more reflective of the actual content and tone of reviews, offering a more accurate representation of a user's feelings towards a restaurant. This method extends beyond the constraints of traditional numeric ratings. Sentiment analysis captures subtle emotional expressions that a numeric score might overlook. For instance, a review rated 4 out of 5 could contain a mix of positive, neutral, or even slightly negative sentiments, all of which influence the sentiment score and provide a more nuanced understanding. 
- To effectively integrate sentiment into our ratings, we utilized the Vader Lexicon Sentiment Intensity Analyzer. This tool adjusts the original ratings by adding sentiment scores, thus expanding the rating scale from 0 to 6. The inclusion of sentiment-enhanced ratings enhances the predictive power of models used in recommendation systems, allowing for more accurate and personalized recommendations based on the richer emotional context provided by the reviews.
- Next, we constructed a user-item matrix from these datasets. Given the large number of users, the matrix was highly sparse. To address this for our use case, we included only the top 10,000 users based on the number of reviews they provided. This adjustment reduced the dimensions of the user-item matrix from (199,676 x 5,078) to (10,000 x 5,078).

# Predicting Missing Ratings
We employed a variety of models to predict and fill in the missing ratings within the user-item matrix, effectively populating these gaps to enhance the accuracy and usefulness of our dataset for further analysis and recommendations. The models that we employed on this dataset are: 
1. Baseline Estimate Recommender 
2. User-User Collaborative Filtering with Pearson Similarity
3. User-User Collaborative Filtering with Baseline
4. Matrix Factorization 
5. Matrix Factorization With Tunable Bias
6. Matrix Factorization with ADAM Optimizer
7. Neural Collaborative Filtering
8. AutoRec

We assessed the performance of these models by measuring the Root Mean Square Error (RMSE) between the predicted ratings and the actual known ratings. The Matrix Factorization model outperformed the others, showing the best results in terms of accuracy. As a result, we are now using a ratings matrix that integrates the original ratings with the missing ratings filled in using the Matrix Factorization model. This approach ensures a more robust and reliable basis for our recommendations.

# Mobile-Responsive Web App

# Inference 
- The inference process takes two inputs: the completed ratings matrix and the restaurant dataset, which includes one row per restaurant along with various features for each restaurant.
- Using the web app, we collect preferences from each user and combine them into a unified group vector. To ensure proportional weighting of preferences, we normalize this group vector by dividing each element by the vector's maximum value.
- To conduct ranked retrieval from the processed restaurant dataset, we experimented with several methods, including:
    * Cosine Similarity
    * Pearson Correlation Coefficient
    * Binary BM25
    * Jaccard Similarity

Among the methods tested, Cosine Similarity provided the most relevant recommendations. Consequently, we have implemented Cosine Similarity in our final pipeline to determine and rank the best restaurant for a group, taking into account the individual preferences of its members.  

Link to the intermediate files generated by the code - https://drive.google.com/drive/folders/13vFq0E1187CuDNdQud00dFyAZPlMKJgG?usp=sharing

For any query, feel free to contact us at kirthan_prakash@tamu.edu, arshnoor@tamu.edu, satyabhavsar@tamu.edu, or ashutoshspunyani@tamu.edu.  




