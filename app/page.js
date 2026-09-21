import { TMDB_BASE_URL, formatTMDBMovie } from '@/lib/tmdb';
import HomeClient from './HomeClient';

export const revalidate = 3600; // revalidate at most every hour

async function getTrendingMovies() {
  try {
    const apiKey = process.env.TMDB_API_KEY;
    if (!apiKey) return [];

    const res = await fetch(`${TMDB_BASE_URL}/trending/movie/day?api_key=${apiKey}`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return [];

    const data = await res.json();
    return (data.results || []).map(formatTMDBMovie);
  } catch (e) {
    console.error('Failed to load trending movies:', e);
    return [];
  }
}

export default async function HomePage() {
  const movies = await getTrendingMovies();
  return <HomeClient initialMovies={movies} />;
}
