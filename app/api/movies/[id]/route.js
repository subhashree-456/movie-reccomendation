import { NextResponse } from 'next/server';
import { TMDB_BASE_URL, formatTMDBMovie } from '@/lib/tmdb';

export async function GET(request, { params }) {
  try {
    const { id } = params;
    const apiKey = process.env.TMDB_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ message: 'TMDB API key not configured' }, { status: 500 });
    }

    const response = await fetch(
      `${TMDB_BASE_URL}/movie/${id}?api_key=${apiKey}&append_to_response=videos`,
      { next: { revalidate: 3600 } }
    );
    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json({ message: 'Movie not found' }, { status: 404 });
    }

    const formattedMovie = formatTMDBMovie(data);

    // Extract trailer
    const videos = data.videos?.results || [];
    const trailer = videos.find((v) => v.type === 'Trailer' && v.site === 'YouTube');
    if (trailer) {
      formattedMovie.trailerUrl = `https://www.youtube.com/embed/${trailer.key}`;
    }

    return NextResponse.json(formattedMovie);
  } catch (error) {
    console.error('Error fetching movie details:', error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
