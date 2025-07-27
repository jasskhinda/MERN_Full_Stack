import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    // Check if user is authenticated and is admin
    if (!session?.user || (session.user as { role?: string }).role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { action, userIds } = await request.json();

    if (!action || !Array.isArray(userIds) || userIds.length === 0) {
      return NextResponse.json({ 
        error: 'Action and user IDs array are required' 
      }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db();
    const currentUserId = (session.user as { id?: string }).id;

    let result;
    const auditDetails: Record<string, unknown> = {};

    switch (action) {
      case 'delete_multiple':
        // Prevent admin from deleting themselves
        if (userIds.includes(currentUserId)) {
          return NextResponse.json({ 
            error: 'Cannot delete your own account' 
          }, { status: 400 });
        }

        // Get users before deletion for audit
        const usersToDelete = await db.collection('users').find({ 
          _id: { $in: userIds.map(id => new ObjectId(id)) }
        }).toArray();

        // Check if we're deleting all admins
        const adminUsersToDelete = usersToDelete.filter(user => user.role === 'admin');
        if (adminUsersToDelete.length > 0) {
          const totalAdmins = await db.collection('users').countDocuments({ role: 'admin' });
          if (totalAdmins - adminUsersToDelete.length < 1) {
            return NextResponse.json({ 
              error: 'Cannot delete all administrator accounts' 
            }, { status: 400 });
          }
        }

        result = await db.collection('users').deleteMany({ 
          _id: { $in: userIds.map(id => new ObjectId(id)) }
        });

        auditDetails.deletedUsers = usersToDelete.map(user => ({
          email: user.email,
          name: user.name,
          role: user.role
        }));
        break;

      // Admin promotion/demotion is disabled - only one admin allowed
      case 'promote_to_admin':
      case 'demote_to_user':
        return NextResponse.json({ 
          error: 'Role changes are not allowed. System maintains a single administrator.' 
        }, { status: 403 });

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    // Log the bulk operation
    try {
      await db.collection('audit_logs').insertOne({
        timestamp: new Date(),
        actorId: currentUserId,
        targetUserId: 'bulk_operation',
        action: `bulk_${action}`,
        details: {
          affectedUserIds: userIds,
          ...auditDetails
        }
      });
    } catch (auditError) {
      console.log('Audit logging failed:', auditError);
    }

    const affectedCount = 'modifiedCount' in result ? result.modifiedCount : 
                         'deletedCount' in result ? result.deletedCount : 0;

    return NextResponse.json({ 
      message: `Bulk ${action} completed successfully`,
      affected: affectedCount
    });

  } catch (error) {
    console.error('Bulk operation error:', error);
    return NextResponse.json(
      { error: 'Failed to perform bulk operation' },
      { status: 500 }
    );
  }
}