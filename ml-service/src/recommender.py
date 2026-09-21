import pickle
import difflib
import pandas as pd
from sklearn.metrics.pairwise import cosine_similarity

# Load your artifacts
movies = pickle.load(open('models/movies.pkl', 'rb'))
tfidf_matrix = pickle.load(open('models/tfidf_matrix.pkl', 'rb'))
indices = pickle.load(open('models/indices.pkl', 'rb'))

def get_recommendations(title):
    # Find index of the movie
    if title not in indices:
        matches = difflib.get_close_matches(title, indices.keys(), n=1, cutoff=0.1)
        if not matches:
            # Fallback to the top 5 general movies if absolutely no match
            return movies['title'].iloc[:10].tolist()
        title = matches[0]
        
    idx = indices[title]
    
    # Calculate cosine similarity for this specific movie against all others
    sim_scores = list(enumerate(cosine_similarity(tfidf_matrix[idx], tfidf_matrix)[0]))
    
    # Sort by similarity
    sim_scores = sorted(sim_scores, key=lambda x: x[1], reverse=True)
    
    # Get top 5 (excluding the movie itself)
    movie_indices = [i[0] for i in sim_scores[1:11]]
    
    return movies['title'].iloc[movie_indices].tolist()

def search_movies(query, limit=10):
    if not query:
        return []
    
    # Filter matching movies (case insensitive)
    matches = movies[movies['title'].str.contains(query, case=False, na=False)]
    
    # Return formatted list of dicts with id and title
    results = matches.head(limit)[['id', 'title']].to_dict('records')
    return results