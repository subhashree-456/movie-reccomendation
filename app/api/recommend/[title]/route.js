import { NextResponse } from 'next/server';
import { TMDB_BASE_URL, formatTMDBMovie } from '@/lib/tmdb';

const ML_SERVICE_URL = process.env.ML_SERVICE_URL || 'http://localhost:8000';

export const dynamic = 'force-dynamic';

export async function GET(request, { params }) {
  try {
    const { title } = params;
    const apiKey = process.env.TMDB_API_KEY;

    if (!title) {
      return NextResponse.json([]);
    }

    const decodedTitle = decodeURIComponent(title);

    // Call ML service
    let recommendedTitles = [];
    try {
      const mlResponse = await fetch(
        `${ML_SERVICE_URL}/recommend?movie_title=${encodeURIComponent(decodedTitle)}`,
        { cache: 'no-store' }
      );
      if (mlResponse.ok) {
        const mlData = await mlResponse.json();
        recommendedTitles = mlData.recommendations || [];
      } else {
        throw new Error('ML API returned error');
      }
    } catch (err) {
      console.error('ML Service unavailable:', err.message);
      return NextResponse.json(
        { message: 'Recommendation service temporarily offline.' },
        { status: 503 }
      );
    }

    if (!apiKey) {
      return NextResponse.json({ message: 'TMDB API key not configured' }, { status: 500 });
    }

    // Enrich recommendations with TMDB details
    const tmdbPromises = recommendedTitles.map(async (recTitle) => {
      try {
        const searchRes = await fetch(
          `${TMDB_BASE_URL}/search/movie?query=${encodeURIComponent(recTitle)}&api_key=${apiKey}`,
          { next: { revalidate: 3600 } }
        );
        if (!searchRes.ok) return null;
        const searchData = await searchRes.json();
        if (searchData.results && searchData.results.length > 0) {
          return formatTMDBMovie(searchData.results[0]);
        }
        return null;
      } catch (e) {
        return null;
      }
    });

    const recommendations = (await Promise.all(tmdbPromises)).filter((m) => m !== null);
    return NextResponse.json(recommendations);
  } catch (error) {
    console.error('Recommendations error:', error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
