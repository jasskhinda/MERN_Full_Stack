"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const [stats] = useState({
    totalUsers: 1,
    activeProjects: 3,
    completedTasks: 12,
    pendingTasks: 5
  });

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center">
        <div className="text-white text-lg">Loading your dashboard...</div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center">
        <div className="text-red-300 text-lg">Access denied. Please log in.</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 text-white">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            Welcome back, {session.user?.name || session.user?.email?.split('@')[0]}! 👋
          </h1>
          <p className="text-white/80 text-lg">
            Here&apos;s what&apos;s happening with your account today.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            { label: "Total Users", value: stats.totalUsers, icon: "👥", color: "from-blue-500 to-cyan-500" },
            { label: "Active Projects", value: stats.activeProjects, icon: "🚀", color: "from-green-500 to-emerald-500" },
            { label: "Completed Tasks", value: stats.completedTasks, icon: "✅", color: "from-purple-500 to-pink-500" },
            { label: "Pending Tasks", value: stats.pendingTasks, icon: "⏳", color: "from-orange-500 to-red-500" },
          ].map((stat, index) => (
            <div key={index} className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 hover:bg-white/20 transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/70 text-sm font-medium">{stat.label}</p>
                  <p className="text-3xl font-bold text-white mt-1">{stat.value}</p>
                </div>
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${stat.color} flex items-center justify-center text-2xl`}>
                  {stat.icon}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <div className="lg:col-span-1">
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6">
              <h2 className="text-xl font-semibold text-white mb-4">⚡ Quick Actions</h2>
              <div className="space-y-3">
                {[
                  { icon: "👤", label: "Edit Profile", href: "/profile", description: "Update your personal information" },
                  { icon: "🔒", label: "Security", href: "/security", description: "Manage passwords and 2FA" },
                  { icon: "📊", label: "Analytics", href: "/analytics", description: "View your usage statistics" },
                  { icon: "⚙️", label: "Settings", href: "/settings", description: "Configure your preferences" },
                ].map((action, index) => (
                  <Link
                    key={index}
                    href={action.href}
                    className="flex items-center space-x-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-all duration-200 group border border-white/10"
                  >
                    <span className="text-2xl">{action.icon}</span>
                    <div>
                      <p className="text-white font-medium group-hover:text-blue-300 transition-colors">{action.label}</p>
                      <p className="text-white/60 text-xs">{action.description}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="lg:col-span-2">
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6">
              <h2 className="text-xl font-semibold text-white mb-4">📈 Recent Activity</h2>
              <div className="space-y-4">
                {[
                  { action: "Logged in", time: "2 minutes ago", icon: "🔐" },
                  { action: "Updated profile", time: "1 hour ago", icon: "👤" },
                  { action: "Completed project", time: "3 hours ago", icon: "✅" },
                  { action: "Created new task", time: "1 day ago", icon: "📝" },
                ].map((activity, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10">
                    <div className="flex items-center space-x-3">
                      <span className="text-xl">{activity.icon}</span>
                      <span className="text-white">{activity.action}</span>
                    </div>
                    <span className="text-white/60 text-sm">{activity.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* User Info Card */}
        <div className="mt-8">
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6">
            <h2 className="text-xl font-semibold text-white mb-4">👤 Account Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-white/70 text-sm font-medium mb-1">Email</label>
                <p className="text-white bg-white/5 rounded-lg px-3 py-2 border border-white/10">{session.user?.email}</p>
              </div>
              <div>
                <label className="block text-white/70 text-sm font-medium mb-1">Role</label>
                <p className="text-white bg-white/5 rounded-lg px-3 py-2 border border-white/10 capitalize">
                  {(session.user as { role?: string })?.role || 'user'}
                </p>
              </div>
              <div>
                <label className="block text-white/70 text-sm font-medium mb-1">Name</label>
                <p className="text-white bg-white/5 rounded-lg px-3 py-2 border border-white/10">
                  {session.user?.name || 'Not set'}
                </p>
              </div>
              <div>
                <label className="block text-white/70 text-sm font-medium mb-1">Account Status</label>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-500/20 text-green-300 border border-green-500/30">
                  ✅ Active
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Admin Panel Link */}
        {(session.user as { role?: string })?.role === 'admin' && (
          <div className="mt-8">
            <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-md border border-purple-300/30 rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">🔧 Administrator Panel</h3>
                  <p className="text-white/70">Manage users, view audit logs, and system settings.</p>
                </div>
                <div className="space-x-4">
                  <Link 
                    href="/admin/users"
                    className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200 transform hover:scale-105"
                  >
                    Manage Users
                  </Link>
                  <Link 
                    href="/admin/audit"
                    className="bg-white/10 hover:bg-white/20 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200 border border-white/20"
                  >
                    Audit Logs
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}