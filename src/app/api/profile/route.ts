import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || !(session.user as { id?: string }).id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const client = await clientPromise;
    const db = client.db();
    
    const userId = (session.user as { id: string }).id;
    
    // Find user to get profile data
    let user = null;
    try {
      user = await db.collection('users').findOne({ _id: new ObjectId(userId) });
    } catch {
      user = await db.collection('users').findOne({ email: session.user.email });
    }

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({
      name: user.name || '',
      email: user.email || '',
      bio: user.bio || '',
      location: user.location || '',
      website: user.website || '',
      profileImage: user.profileImage || null
    });
  } catch (error) {
    console.error('Profile fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch profile' },
      { status: 500 }
    );
  }
}