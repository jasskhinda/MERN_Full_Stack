import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    // Check if user is authenticated and is admin
    if (!session?.user || (session.user as { role?: string }).role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { userId } = await request.json();

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db();
    
    // Prevent admin from deleting themselves
    const currentUserId = (session.user as { id?: string }).id;
    if (userId === currentUserId) {
      return NextResponse.json({ error: 'Cannot delete your own account' }, { status: 400 });
    }

    // Get user info before deletion for audit log
    const userToDelete = await db.collection('users').findOne({ 
      _id: new ObjectId(userId) 
    });

    if (!userToDelete) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Prevent deletion of the last admin
    if (userToDelete.role === 'admin') {
      const adminCount = await db.collection('users').countDocuments({ role: 'admin' });
      if (adminCount <= 1) {
        return NextResponse.json({ 
          error: 'Cannot delete the last administrator account' 
        }, { status: 400 });
      }
    }

    // Delete the user
    const deleteResult = await db.collection('users').deleteOne({ 
      _id: new ObjectId(userId) 
    });

    if (deleteResult.deletedCount === 0) {
      return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 });
    }

    // Log the deletion in audit trail
    try {
      await db.collection('audit_logs').insertOne({
        timestamp: new Date(),
        actorId: currentUserId,
        targetUserId: userId,
        action: 'user_delete',
        details: {
          deletedUser: {
            email: userToDelete.email,
            name: userToDelete.name,
            role: userToDelete.role
          }
        }
      });
    } catch (auditError) {
      console.log('Audit logging failed:', auditError);
    }

    return NextResponse.json({ 
      message: 'User deleted successfully',
      deletedUser: {
        email: userToDelete.email,
        name: userToDelete.name
      }
    });

  } catch (error) {
    console.error('Delete user error:', error);
    return NextResponse.json(
      { error: 'Failed to delete user' },
      { status: 500 }
    );
  }
}