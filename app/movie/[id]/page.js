'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Play, X, ChevronRight, CheckCircle } from 'lucide-react';
import { useAuth } from '@/components/AuthProvider';
import MovieCard from '@/components/MovieCard';

export default function MovieDetailsPage() {
  const params = useParams();
  const id = params?.id;

  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [recommendedMovies, setRecommendedMovies] = useState([]);
  const [isRecommendationsLoading, setIsRecommendationsLoading] = useState(false);
  const [rating, setRating] = useState(0);
  const [ratingSubmitted, setRatingSubmitted] = useState(false);
  const [showTrailer, setShowTrailer] = useState(false);

  const { user } = useAuth();

  useEffect(() => {
    if (!id) return;

    const fetchMovie = async () => {
      try {
        setLoading(true);
        setRecommendedMovies([]);
        setRatingSubmitted(false);
        const res = await fetch(`/api/movies/${id}`);
        if (!res.ok) throw new Error('Movie not found');
        const data = await res.json();
        setMovie(data);
      } catch (error) {
        console.error('Error loading movie:', error);
        setMovie(null);
      } finally {
        setLoading(false);
      }
    };

    fetchMovie();
  }, [id]);

  useEffect(() => {
    if (!movie?.title) return;

    const fetchRecommendations = async () => {
      try {
        setIsRecommendationsLoading(true);
        const res = await fetch(`/api/recommend/${encodeURIComponent(movie.title)}`);
        if (res.ok) {
          const data = await res.json();
          setRecommendedMovies(data);
        }
      } catch (error) {
        console.error('Error fetching recommendations:', error);
      } finally {
        setIsRecommendationsLoading(false);
      }
    };

    fetchRecommendations();
  }, [movie?.title]);

  const handleRate = async () => {
    if (!user || rating === 0 || !id) return;
    try {
      const res = await fetch(`/api/movies/${id}/rate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({ rating }),
      });
      if (res.ok) {
        setRatingSubmitted(true);
      }
    } catch (error) {
      console.error('Error rating movie:', error);
    }
  };

  if (loading) {
    return (
      <div className="w-full relative min-h-screen bg-foxBg pb-12">
        <div className="relative w-full h-[60vh] md:h-[80vh] overflow-hidden bg-foxPanel animate-pulse">
          <div className="absolute inset-0 bg-gradient-to-t from-foxBg to-transparent z-10" />
          <div className="absolute inset-0 bg-gradient-to-r from-foxBg via-foxBg/60 to-transparent z-10" />
          <div className="relative z-20 h-full flex flex-col justify-end px-8 md:px-16 pb-16 max-w-4xl">
            <div className="h-12 md:h-16 bg-slate-800/80 rounded-md w-3/4 mb-4" />
            <div className="flex gap-4 mb-6">
              <div className="h-6 w-20 bg-slate-800/80 rounded-sm" />
              <div className="h-6 w-16 bg-slate-800/80 rounded-sm" />
              <div className="h-6 w-16 bg-slate-800/80 rounded-sm" />
            </div>
            <div className="space-y-3 mb-8 max-w-2xl">
              <div className="h-4 bg-slate-800/80 rounded w-full" />
              <div className="h-4 bg-slate-800/80 rounded w-5/6" />
              <div className="h-4 bg-slate-800/80 rounded w-4/6" />
            </div>
            <div className="flex gap-4 mb-8">
              <div className="h-12 w-32 bg-slate-800/80 rounded-lg" />
            </div>
            <div className="h-4 w-48 bg-slate-800/80 rounded mb-4" />
          </div>
        </div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="p-24 text-center text-red-400">
        Movie not found in the database.
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full relative min-h-screen bg-foxBg pb-12"
    >
      <div className="relative w-full h-[60vh] md:h-[80vh] overflow-hidden bg-black">
        {movie.trailerUrl ? (
          <div className="absolute top-1/2 left-1/2 w-[150vw] md:w-[120vw] h-[150vh] md:h-[120vh] -translate-x-1/2 -translate-y-1/2 z-0 opacity-60 pointer-events-none">
            <iframe
              className="w-full h-full"
              src={`${movie.trailerUrl}?autoplay=1&mute=1&controls=0&loop=1&playlist=${movie.trailerUrl.split('/').pop()}&rel=0&showinfo=0&modestbranding=1`}
              title="Background Trailer"
              allow="autoplay; encrypted-media"
            />
          </div>
        ) : (
          <div
            className="absolute inset-0 z-0 bg-cover bg-top opacity-60"
            style={{ backgroundImage: `url(${movie.poster})` }}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-foxBg via-foxBg/80 to-transparent z-10" />
        <div className="absolute inset-0 bg-gradient-to-r from-foxBg via-foxBg/60 to-transparent z-10" />

        <div className="relative z-20 h-full flex flex-col justify-end px-8 md:px-16 pb-16 max-w-4xl">
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
            <h1 className="text-4xl md:text-6xl font-bold mb-4 text-white uppercase drop-shadow-xl">
              {movie.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 mb-6">
              <span className="text-foxAccent font-bold">
                {Math.round(movie.ratingAvg * 20)}% Match
              </span>
              <span className="text-slate-300 border border-slate-600 px-2 rounded-sm text-sm">
                {movie.releaseYear}
              </span>
              <span className="flex items-center text-foxAccent text-sm">
                <Star className="w-4 h-4 mr-1 fill-foxAccent" />
                {movie.ratingAvg ? movie.ratingAvg.toFixed(1) : '0.0'}
              </span>
            </div>

            <p className="text-slate-200 text-lg leading-relaxed mb-8 max-w-2xl drop-shadow-md">
              {movie.description}
            </p>

            <div className="flex gap-4 mb-8">
              <button
                onClick={() => setShowTrailer(true)}
                className="flex items-center gap-2 bg-white text-foxBg px-8 py-3 rounded-lg font-bold hover:bg-slate-200 transition-colors shadow-lg active:scale-95 cursor-pointer"
              >
                <Play className="w-5 h-5 fill-current" />
                Play
              </button>
            </div>

            <div className="text-gray-400 text-sm mb-4">
              <span className="text-gray-500">Genres:</span> {movie.genres?.join(', ') || 'N/A'}
            </div>

            {user ? (
              <div className="mt-8 border-t border-slate-800 pt-6 max-w-md">
                <h4 className="text-slate-400 font-medium mb-3">Rate this title</h4>
                <div className="flex items-center gap-4">
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((num) => (
                      <Star
                        key={num}
                        className={`w-8 h-8 cursor-pointer transition-all ${
                          num <= rating
                            ? 'text-foxAccent fill-foxAccent scale-110 drop-shadow-md'
                            : 'text-slate-600 hover:text-foxAccent/50'
                        }`}
                        onClick={() => {
                          setRating(num);
                          setRatingSubmitted(false);
                        }}
                      />
                    ))}
                  </div>
                  <button
                    onClick={handleRate}
                    disabled={rating === 0 || ratingSubmitted}
                    className="fox-panel border-transparent hover:border-foxAccent py-2 px-6 text-white text-sm disabled:opacity-50 transition-colors cursor-pointer"
                  >
                    {ratingSubmitted ? <CheckCircle className="w-4 h-4 text-green-500" /> : 'Submit'}
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-slate-500 text-sm mt-4">Sign in to rate this movie.</div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Recommendations Section */}
      {(isRecommendationsLoading || recommendedMovies?.length > 0) && (
        <section className="px-8 md:px-16 mt-8 relative">
          <div className="flex items-end justify-between mb-4">
            <h2 className="text-xl md:text-2xl font-bold text-white">More Like This</h2>
            <div className="flex items-center text-foxAccent/80 text-sm font-medium animate-pulse">
              Scroll for more <ChevronRight className="w-4 h-4 ml-1" />
            </div>
          </div>
          <div className="flex overflow-x-auto gap-3 pb-8 snap-x snap-mandatory hide-scrollbar relative">
            {isRecommendationsLoading
              ? [...Array(10)].map((_, i) => (
                  <div
                    key={i}
                    className="rounded-lg overflow-hidden shrink-0 w-[180px] md:w-[220px] snap-start fox-panel bg-foxPanel animate-pulse"
                  >
                    <div className="aspect-[2/3] w-full bg-slate-800/50"></div>
                  </div>
                ))
              : recommendedMovies
                  .filter((m) => m._id !== movie._id)
                  .map((recMovie, index) => (
                    <MovieCard key={recMovie._id} movie={recMovie} index={index} />
                  ))}
          </div>
        </section>
      )}

      {/* Trailer Modal */}
      <AnimatePresence>
        {showTrailer && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 md:p-12"
          >
            <div className="relative w-full aspect-video max-w-6xl">
              <button
                onClick={() => setShowTrailer(false)}
                className="absolute -top-12 right-0 text-white hover:text-gray-400 p-2 transition-colors z-50 cursor-pointer"
              >
                <X className="w-8 h-8" />
              </button>
              <iframe
                className="w-full h-full"
                src={`${movie.trailerUrl || 'https://www.youtube.com/embed/dQw4w9WgXcQ'}?autoplay=1`}
                title="Trailer"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
