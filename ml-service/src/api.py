from fastapi import FastAPI
from src.recommender import get_recommendations, search_movies

app = FastAPI()

@app.get("/recommend")
def recommend(movie_title: str):
    results = get_recommendations(movie_title)
    if not results:
        return {"error": "Movie not found"}
    return {"movie": movie_title, "recommendations": results}

@app.get("/search")
def search(query: str):
    results = search_movies(query)
    return {"results": results}