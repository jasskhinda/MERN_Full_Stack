import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const client = await clientPromise;
    const db = client.db();
    
    // Check if user exists
    const userId = (session.user as { id?: string }).id;
    console.log('Session user ID:', userId);
    
    if (!userId) {
      return NextResponse.json({ 
        error: 'No user ID in session',
        session: session.user 
      });
    }

    // Try to find user by ObjectId
    let user = null;
    try {
      user = await db.collection('users').findOne({ _id: new ObjectId(userId) });
    } catch (error) {
      console.log('Error finding user by ObjectId:', error);
    }

    // If not found by ObjectId, try by email
    if (!user) {
      user = await db.collection('users').findOne({ email: session.user.email });
    }

    // Get all users count
    const totalUsers = await db.collection('users').countDocuments();
    
    return NextResponse.json({
      sessionUser: session.user,
      foundUser: user,
      totalUsers,
      userId,
      searchAttempts: {
        byObjectId: !!user,
        byEmail: !user ? 'attempted' : 'not needed'
      }
    });
  } catch (error) {
    console.error('Debug user error:', error);
    return NextResponse.json(
      { error: 'Failed to debug user', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}