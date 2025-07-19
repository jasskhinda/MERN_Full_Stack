"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";

const stats = [
  { 
    name: 'Total Sessions', 
    value: '12', 
    change: '+12%', 
    icon: '📊',
    color: 'from-blue-500 to-cyan-500'
  },
  { 
    name: 'Active Time', 
    value: '2.4h', 
    change: '+8%', 
    icon: '⏱️',
    color: 'from-purple-500 to-pink-500'
  },
  { 
    name: 'Profile Views', 
    value: '48', 
    change: '+23%', 
    icon: '👁️',
    color: 'from-green-500 to-emerald-500'
  },
  { 
    name: 'Account Score', 
    value: '98%', 
    change: '+2%', 
    icon: '🎯',
    color: 'from-orange-500 to-red-500'
  },
];

const recentActivity = [
  { action: 'Profile updated', time: '2 hours ago', type: 'success' },
  { action: 'Password changed', time: '1 day ago', type: 'warning' },
  { action: 'New login from Chrome', time: '2 days ago', type: 'info' },
  { action: 'Account verified', time: '3 days ago', type: 'success' },
];

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-white/30 border-t-white"></div>
          <p className="text-white/90 mt-4 font-medium">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="glass rounded-2xl p-8 text-center">
          <div className="text-6xl mb-4">🔒</div>
          <h2 className="text-2xl font-bold text-white mb-2">Access Denied</h2>
          <p className="text-white/70">Please sign in to access your dashboard.</p>
        </div>
      </div>
    );
  }

  const userInitials = session.user?.name?.split(' ').map(n => n[0]).join('') || 
                      session.user?.email?.charAt(0).toUpperCase() || 'U';

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="glass rounded-2xl p-6 card-hover">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-xl">
                  <span className="text-white font-bold text-2xl">{userInitials}</span>
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-white text-shadow-lg">
                    Welcome back, {session.user?.name?.split(' ')[0] || session.user?.email?.split('@')[0]}! 👋
                  </h1>
                  <p className="text-white/70 mt-1">
                    {session.user?.email} • {(session.user as any)?.role || 'User'}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-white/70 text-sm">Current Time</p>
                <p className="text-white font-mono text-lg">
                  {currentTime.toLocaleTimeString()}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={stat.name} className="glass rounded-2xl p-6 card-hover">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/70 text-sm font-medium">{stat.name}</p>
                  <p className="text-3xl font-bold text-white mt-2">{stat.value}</p>
                  <div className="flex items-center mt-2">
                    <span className="text-green-400 text-sm font-medium">{stat.change}</span>
                    <span className="text-white/50 text-sm ml-1">vs last month</span>
                  </div>
                </div>
                <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-xl flex items-center justify-center text-2xl shadow-lg`}>
                  {stat.icon}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Activity */}
          <div className="glass rounded-2xl p-6 card-hover">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center">
              <span className="mr-2">📋</span>
              Recent Activity
            </h3>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center space-x-4 p-3 bg-white/5 rounded-xl">
                  <div className={`w-3 h-3 rounded-full ${
                    activity.type === 'success' ? 'bg-green-400' :
                    activity.type === 'warning' ? 'bg-yellow-400' :
                    'bg-blue-400'
                  }`}></div>
                  <div className="flex-1">
                    <p className="text-white font-medium">{activity.action}</p>
                    <p className="text-white/50 text-sm">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="glass rounded-2xl p-6 card-hover">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center">
              <span className="mr-2">⚡</span>
              Quick Actions
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <button className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 rounded-xl font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-200 btn-hover shadow-lg">
                <div className="text-2xl mb-2">👤</div>
                Edit Profile
              </button>
              <button className="bg-gradient-to-r from-green-500 to-emerald-600 text-white p-4 rounded-xl font-medium hover:from-green-600 hover:to-emerald-700 transition-all duration-200 btn-hover shadow-lg">
                <div className="text-2xl mb-2">🔒</div>
                Security
              </button>
              <button className="bg-gradient-to-r from-purple-500 to-pink-600 text-white p-4 rounded-xl font-medium hover:from-purple-600 hover:to-pink-700 transition-all duration-200 btn-hover shadow-lg">
                <div className="text-2xl mb-2">📊</div>
                Analytics
              </button>
              <button className="bg-gradient-to-r from-orange-500 to-red-600 text-white p-4 rounded-xl font-medium hover:from-orange-600 hover:to-red-700 transition-all duration-200 btn-hover shadow-lg">
                <div className="text-2xl mb-2">⚙️</div>
                Settings
              </button>
            </div>
          </div>
        </div>

        {/* Account Overview */}
        <div className="mt-8">
          <div className="glass rounded-2xl p-6 card-hover">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center">
              <span className="mr-2">🏠</span>
              Account Overview
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl">
                  <span className="text-white text-3xl">🎯</span>
                </div>
                <h4 className="text-white font-semibold">Account Status</h4>
                <p className="text-green-400 font-medium">Active & Verified</p>
              </div>
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl">
                  <span className="text-white text-3xl">🛡️</span>
                </div>
                <h4 className="text-white font-semibold">Security Level</h4>
                <p className="text-green-400 font-medium">High Security</p>
              </div>
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl">
                  <span className="text-white text-3xl">⭐</span>
                </div>
                <h4 className="text-white font-semibold">Member Since</h4>
                <p className="text-white/70">January 2025</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}