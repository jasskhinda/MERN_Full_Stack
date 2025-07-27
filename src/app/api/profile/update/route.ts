import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
// import { logAuditAction } from '@/lib/audit';

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || !(session.user as { id?: string }).id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { name, bio, location, website, profileImage } = await request.json();

    if (!name || name.trim().length === 0) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db();
    
    const userId = (session.user as { id: string }).id;
    
    // First try to find user by ObjectId, then by email
    let user = null;
    let updateQuery = {};
    
    try {
      user = await db.collection('users').findOne({ _id: new ObjectId(userId) });
      updateQuery = { _id: new ObjectId(userId) };
    } catch {
      // If ObjectId fails, try by email
      user = await db.collection('users').findOne({ email: session.user.email });
      if (user) {
        updateQuery = { email: session.user.email };
      }
    }

    if (!user) {
      return NextResponse.json({ error: 'User not found in database' }, { status: 404 });
    }

    // Update user profile
    const updateData: Record<string, string | Date> = {
      name: name.trim(),
      updatedAt: new Date()
    };

    // Only update fields that are provided and not empty
    if (bio !== undefined && bio.trim() !== '') {
      updateData.bio = bio.trim();
    }
    if (location !== undefined && location.trim() !== '') {
      updateData.location = location.trim();
    }
    if (website !== undefined && website.trim() !== '') {
      updateData.website = website.trim();
    }
    if (profileImage !== undefined && profileImage !== null) {
      updateData.profileImage = profileImage;
    }

    const result = await db.collection('users').updateOne(
      updateQuery,
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Failed to update user' }, { status: 404 });
    }

    // Log the profile update
    try {
      await db.collection('audit_logs').insertOne({
        timestamp: new Date(),
        actorId: user._id.toString(),
        targetUserId: user._id.toString(),
        action: 'profile_update',
        details: { fields: updateData }
      });
    } catch (auditError) {
      console.log('Audit logging failed:', auditError);
    }

    return NextResponse.json({ 
      message: 'Profile updated successfully',
      updatedFields: updateData,
      userId: user._id.toString()
    });
  } catch (error) {
    console.error('Profile update error:', error);
    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500 }
    );
  }
}