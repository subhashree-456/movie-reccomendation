import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import { getAuthUser } from '@/lib/auth';

export async function POST(request, { params }) {
  try {
    const authUser = await getAuthUser(request);
    if (!authUser) {
      return NextResponse.json(
        { message: 'Not authorized, token failed' },
        { status: 401 }
      );
    }

    const { rating } = await request.json();
    const { id } = params;

    await connectDB();
    const user = await User.findById(authUser._id);

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    const existingRatingIndex = user.ratings.findIndex(
      (r) => r.movie?.toString() === id.toString()
    );

    if (existingRatingIndex >= 0) {
      user.ratings[existingRatingIndex].rating = Number(rating);
    } else {
      user.ratings.push({ movie: id.toString(), rating: Number(rating) });
    }

    await user.save();
    return NextResponse.json({ message: 'Rating added successfully' });
  } catch (error) {
    console.error('Rate movie error:', error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
