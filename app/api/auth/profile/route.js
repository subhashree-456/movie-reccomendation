import { NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    const user = await getAuthUser(request);

    if (!user) {
      return NextResponse.json(
        { message: 'Not authorized, token failed' },
        { status: 401 }
      );
    }

    return NextResponse.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      favorites: user.favorites,
      watchHistory: user.watchHistory,
    });
  } catch (error) {
    console.error('Profile error:', error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
