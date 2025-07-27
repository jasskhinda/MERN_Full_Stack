"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { useState, useEffect } from "react";

interface DashboardStats {
  totalUsers: number;
  totalAdmins: number;
  recentRegistrations: number;
  totalAuditLogs: number;
}

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalAdmins: 0,
    recentRegistrations: 0,
    totalAuditLogs: 0
  });
  const [recentActivity, setRecentActivity] = useState<Array<{
    action: string;
    time: string;
    user: string;
  }>>([]);

  useEffect(() => {
    const fetchAdminStats = async () => {
      try {
        // Fetch users data
        const usersResponse = await fetch('/api/admin/users');
        if (usersResponse.ok) {
          const usersData = await usersResponse.json();
          const users = usersData.users;
          
          // Fetch audit logs
          const auditResponse = await fetch('/api/admin/audit');
          let auditLogs = [];
          if (auditResponse.ok) {
            const auditData = await auditResponse.json();
            auditLogs = auditData.logs || [];
          }

          // Calculate stats
          const totalUsers = users.length;
          const totalAdmins = users.filter((u: {role: string}) => u.role === 'admin').length;
          const weekAgo = new Date();
          weekAgo.setDate(weekAgo.getDate() - 7);
          const recentRegistrations = users.filter((u: {createdAt?: string}) => 
            u.createdAt && new Date(u.createdAt) > weekAgo
          ).length;

          setStats({
            totalUsers,
            totalAdmins,
            recentRegistrations,
            totalAuditLogs: auditLogs.length
          });

          // Recent activity
          const recentAuditLogs = auditLogs.slice(0, 5).map((log: {
            action: string;
            timestamp: string;
            actorId: string;
          }) => ({
            action: log.action.replace('_', ' ').toUpperCase(),
            time: new Date(log.timestamp).toLocaleString(),
            user: log.actorId.slice(-6)
          }));

          setRecentActivity(recentAuditLogs);
        }
      } catch (error) {
        console.error('Failed to fetch admin stats:', error);
      }
    };

    if (session) {
      fetchAdminStats();
    }
  }, [session]);

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center">
        <div className="text-white text-lg">Loading admin dashboard...</div>
      </div>
    );
  }

  if (!session || (session.user as { role?: string })?.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-900 via-gray-900 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🚫</div>
          <h1 className="text-4xl font-bold text-red-400 mb-2">Access Denied</h1>
          <p className="text-red-300 text-lg mb-6">You must be an administrator to access this panel.</p>
          <Link 
            href="/"
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200"
          >
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent mb-2">
                🛡️ Admin Control Panel
              </h1>
              <p className="text-xl text-gray-300">
                Welcome back, Administrator {session.user?.name || session.user?.email?.split('@')[0]}
              </p>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-400">Last Login</div>
              <div className="text-white font-semibold">{new Date().toLocaleString()}</div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-blue-500/20 backdrop-blur-md border border-blue-500/30 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-300 text-sm font-medium">Total Users</p>
                <p className="text-3xl font-bold text-white">{stats.totalUsers}</p>
              </div>
              <div className="w-12 h-12 bg-blue-500/30 rounded-lg flex items-center justify-center">
                <span className="text-2xl">👥</span>
              </div>
            </div>
          </div>

          <div className="bg-purple-500/20 backdrop-blur-md border border-purple-500/30 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-300 text-sm font-medium">Administrators</p>
                <p className="text-3xl font-bold text-white">{stats.totalAdmins}</p>
              </div>
              <div className="w-12 h-12 bg-purple-500/30 rounded-lg flex items-center justify-center">
                <span className="text-2xl">👑</span>
              </div>
            </div>
          </div>

          <div className="bg-green-500/20 backdrop-blur-md border border-green-500/30 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-300 text-sm font-medium">New This Week</p>
                <p className="text-3xl font-bold text-white">{stats.recentRegistrations}</p>
              </div>
              <div className="w-12 h-12 bg-green-500/30 rounded-lg flex items-center justify-center">
                <span className="text-2xl">📈</span>
              </div>
            </div>
          </div>

          <div className="bg-orange-500/20 backdrop-blur-md border border-orange-500/30 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-300 text-sm font-medium">Audit Logs</p>
                <p className="text-3xl font-bold text-white">{stats.totalAuditLogs}</p>
              </div>
              <div className="w-12 h-12 bg-orange-500/30 rounded-lg flex items-center justify-center">
                <span className="text-2xl">📋</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Admin Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Admin Actions */}
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6">
            <h2 className="text-2xl font-bold text-white mb-6">🛠️ Admin Actions</h2>
            <div className="space-y-4">
              <Link
                href="/admin/users"
                className="flex items-center justify-between p-4 bg-blue-500/20 hover:bg-blue-500/30 rounded-lg border border-blue-500/30 transition-all duration-200 group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-500/30 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                    <span className="text-xl">👥</span>
                  </div>
                  <div>
                    <div className="text-white font-semibold">Manage Users</div>
                    <div className="text-blue-300 text-sm">View and edit user accounts</div>
                  </div>
                </div>
                <div className="text-blue-400">→</div>
              </Link>

              <Link
                href="/admin/audit"
                className="flex items-center justify-between p-4 bg-purple-500/20 hover:bg-purple-500/30 rounded-lg border border-purple-500/30 transition-all duration-200 group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-500/30 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                    <span className="text-xl">📋</span>
                  </div>
                  <div>
                    <div className="text-white font-semibold">Audit Logs</div>
                    <div className="text-purple-300 text-sm">Track administrative actions</div>
                  </div>
                </div>
                <div className="text-purple-400">→</div>
              </Link>

              <Link
                href="/admin/settings"
                className="flex items-center justify-between p-4 bg-yellow-500/20 hover:bg-yellow-500/30 rounded-lg border border-yellow-500/30 transition-all duration-200 group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-yellow-500/30 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                    <span className="text-xl">⚙️</span>
                  </div>
                  <div>
                    <div className="text-white font-semibold">System Settings</div>
                    <div className="text-yellow-300 text-sm">Configure system preferences</div>
                  </div>
                </div>
                <div className="text-yellow-400">→</div>
              </Link>

              <Link
                href="/dashboard"
                className="flex items-center justify-between p-4 bg-green-500/20 hover:bg-green-500/30 rounded-lg border border-green-500/30 transition-all duration-200 group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-500/30 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                    <span className="text-xl">📊</span>
                  </div>
                  <div>
                    <div className="text-white font-semibold">User Dashboard</div>
                    <div className="text-green-300 text-sm">Switch to user view</div>
                  </div>
                </div>
                <div className="text-green-400">→</div>
              </Link>

              <Link
                href="/stock-predictor"
                className="flex items-center justify-between p-4 bg-orange-500/20 hover:bg-orange-500/30 rounded-lg border border-orange-500/30 transition-all duration-200 group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-orange-500/30 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                    <span className="text-xl">🤖</span>
                  </div>
                  <div>
                    <div className="text-white font-semibold">AI Stock Predictor</div>
                    <div className="text-orange-300 text-sm">Neural network predictions</div>
                  </div>
                </div>
                <div className="text-orange-400">→</div>
              </Link>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6">
            <h2 className="text-2xl font-bold text-white mb-6">📈 Recent Activity</h2>
            <div className="space-y-4">
              {recentActivity.length > 0 ? (
                recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-500/30 rounded-full flex items-center justify-center">
                        <span className="text-xs">🔄</span>
                      </div>
                      <div>
                        <div className="text-white text-sm font-medium">{activity.action}</div>
                        <div className="text-gray-400 text-xs">User: {activity.user}</div>
                      </div>
                    </div>
                    <div className="text-gray-400 text-xs">{activity.time}</div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <div className="text-4xl mb-2">📝</div>
                  <div className="text-gray-400">No recent activity</div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* System Status */}
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6">
          <h2 className="text-2xl font-bold text-white mb-6">⚡ System Status</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center justify-between p-4 bg-green-500/20 rounded-lg">
              <div>
                <div className="text-green-300 text-sm">Database</div>
                <div className="text-white font-semibold">Connected</div>
              </div>
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-green-500/20 rounded-lg">
              <div>
                <div className="text-green-300 text-sm">Authentication</div>
                <div className="text-white font-semibold">Active</div>
              </div>
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-green-500/20 rounded-lg">
              <div>
                <div className="text-green-300 text-sm">AI Engine</div>
                <div className="text-white font-semibold">Ready</div>
              </div>
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}