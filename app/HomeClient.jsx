'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import MovieCard from '@/components/MovieCard';

export default function HomeClient({ initialMovies = [] }) {
  const heroMovie = initialMovies[0];

  return (
    <div className="pb-20">
      {/* Hero Section */}
      <section className="relative h-[85vh] min-h-[600px] flex items-center justify-start overflow-hidden">
        {/* Dynamic Background Image - using top trending movie */}
        <div className="absolute inset-0 z-0">
          <img
            src={heroMovie?.poster || 'https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?w=1600&q=80'}
            alt={heroMovie?.title || 'Hero Background'}
            className="w-full h-full object-cover"
            priority="true"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-foxBg via-foxBg/50 to-transparent z-10" />
          <div className="absolute inset-0 bg-gradient-to-r from-foxBg/90 via-foxBg/40 to-transparent z-10" />
        </div>

        <div className="relative z-20 flex flex-col items-start px-8 md:px-16 max-w-3xl mt-20">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-7xl font-bold mb-4 tracking-tight drop-shadow-xl uppercase text-white"
          >
            {heroMovie?.title || 'Discover Movies'}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="text-lg md:text-xl text-gray-200 mb-8 drop-shadow-md line-clamp-3"
          >
            {heroMovie?.description || 'Curated endless cinematic journeys tailored exclusively for your taste.'}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="flex flex-wrap gap-4"
          >
            {heroMovie ? (
              <Link
                href={`/movie/${heroMovie._id}`}
                className="flex items-center gap-2 bg-white text-foxBg px-6 md:px-8 py-2 md:py-3 rounded opacity-90 font-bold hover:opacity-100 transition-opacity"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
                Play
              </Link>
            ) : null}
            {heroMovie ? (
              <Link
                href={`/movie/${heroMovie._id}`}
                className="flex items-center gap-2 fox-panel px-6 md:px-8 py-2 md:py-3 font-bold hover:bg-foxBorder transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                More Info
              </Link>
            ) : null}
          </motion.div>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="px-8 md:px-12 mt-[-100px] relative z-30 space-y-12">
        {/* Global Catalog */}
        <section id="trending">
          <h2 className="text-xl md:text-2xl font-bold mb-4 text-white">
            Trending Now
          </h2>
          {initialMovies.length === 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2">
              {[...Array(12)].map((_, i) => (
                <div key={i} className="aspect-[2/3] w-full rounded-md fox-panel animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-2 gap-y-10">
              {initialMovies.map((movie, i) => (
                <MovieCard key={movie._id} movie={movie} index={i % 6} />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
