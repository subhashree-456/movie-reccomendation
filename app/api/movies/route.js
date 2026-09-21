import { NextResponse } from 'next/server';
import { TMDB_BASE_URL, formatTMDBMovie } from '@/lib/tmdb';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const apiKey = process.env.TMDB_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ message: 'TMDB API key not configured' }, { status: 500 });
    }

    const response = await fetch(`${TMDB_BASE_URL}/trending/movie/day?api_key=${apiKey}`, {
      next: { revalidate: 3600 },
    });
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.status_message || 'Failed to fetch TMDB movies');
    }

    const formattedMovies = data.results.map(formatTMDBMovie);
    return NextResponse.json(formattedMovies);
  } catch (error) {
    console.error('Error fetching trending movies:', error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
