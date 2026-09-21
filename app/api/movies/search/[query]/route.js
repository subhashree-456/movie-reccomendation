import { NextResponse } from 'next/server';

const ML_SERVICE_URL = process.env.ML_SERVICE_URL || 'http://localhost:8000';

export const dynamic = 'force-dynamic';

export async function GET(request, { params }) {
  try {
    const { query } = params;
    if (!query) {
      return NextResponse.json([]);
    }

    const decodedQuery = decodeURIComponent(query);
    const mlResponse = await fetch(
      `${ML_SERVICE_URL}/search?query=${encodeURIComponent(decodedQuery)}`,
      { cache: 'no-store' }
    );

    if (mlResponse.ok) {
      const mlData = await mlResponse.json();
      return NextResponse.json(mlData.results || []);
    } else {
      return NextResponse.json(
        { message: 'Search service unavailable.' },
        { status: 503 }
      );
    }
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
