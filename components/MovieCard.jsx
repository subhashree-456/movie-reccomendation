'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Star } from 'lucide-react';

const MovieCard = ({ movie, index = 0 }) => {
  if (!movie) return null;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      whileHover={{ scale: 1.05, y: -5, zIndex: 50 }}
      transition={{ duration: 0.3, delay: (index % 10) * 0.04, ease: 'easeOut' }}
      className="group relative rounded-lg overflow-hidden shrink-0 w-[180px] md:w-[220px] snap-start transition-all cursor-pointer z-10 fox-panel bg-foxBg border-transparent hover:border-foxAccent/50"
    >
      <Link href={`/movie/${movie._id}`}>
        <div className="aspect-[2/3] w-full overflow-hidden relative">
          <img
            src={movie.poster || 'https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?w=500&q=80'}
            alt={movie.title || 'Movie Poster'}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          <div className="absolute bottom-0 left-0 p-3 w-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-2 group-hover:translate-y-0">
            <h3 className="text-sm font-bold text-white truncate drop-shadow-md">
              {movie.title}
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <span className="flex items-center text-foxAccent font-bold text-xs shadow-md">
                <Star className="w-3 h-3 mr-1 fill-foxAccent" />
                {movie.ratingAvg ? movie.ratingAvg.toFixed(1) : '0.0'}
              </span>
              <span className="text-slate-300 text-xs border border-slate-600 px-1 rounded bg-black/50 backdrop-blur-sm">
                {movie.releaseYear || 'N/A'}
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default MovieCard;
