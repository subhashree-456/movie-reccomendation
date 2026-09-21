export const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
export const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p/w500';

export const formatTMDBMovie = (tmdbMovie) => {
  return {
    _id: tmdbMovie.id.toString(),
    title: tmdbMovie.title,
    description: tmdbMovie.overview,
    poster: tmdbMovie.poster_path
      ? `${TMDB_IMAGE_BASE}${tmdbMovie.poster_path}`
      : 'https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?w=500&q=80',
    ratingAvg: tmdbMovie.vote_average ? tmdbMovie.vote_average / 2 : 0,
    releaseYear: tmdbMovie.release_date ? tmdbMovie.release_date.substring(0, 4) : 'Unknown',
    genres: tmdbMovie.genres ? tmdbMovie.genres.map((g) => g.name) : [],
    trailerUrl: '',
  };
};
