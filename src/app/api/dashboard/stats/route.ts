import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import clientPromise from '@/lib/mongodb';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const client = await clientPromise;
    const db = client.db('fullstack_app');
    
    // Get real stats
    const totalUsers = await db.collection('users').countDocuments();
    const auditLogs = await db.collection('audit_logs')
      .find({ actorId: session.user.id })
      .sort({ timestamp: -1 })
      .limit(10)
      .toArray();
    
    // Get user's recent activity
    const recentActivity = await db.collection('audit_logs')
      .find({ actorId: session.user.id })
      .sort({ timestamp: -1 })
      .limit(4)
      .toArray();

    // Format activity for display
    const formattedActivity = recentActivity.map(log => ({
      action: log.action,
      timestamp: log.timestamp,
      details: log.details
    }));

    return NextResponse.json({
      stats: {
        totalUsers,
        activeProjects: 3, // You can create a projects collection later
        completedTasks: 12, // You can create a tasks collection later
        pendingTasks: 5 // You can create a tasks collection later
      },
      recentActivity: formattedActivity
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard stats' },
      { status: 500 }
    );
  }
}