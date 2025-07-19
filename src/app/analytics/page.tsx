"use client";

import { useSession } from "next-auth/react";
import { useState } from "react";

export default function AnalyticsPage() {
  const { data: session } = useSession();
  const [timeRange, setTimeRange] = useState('7d');

  const stats = {
    totalVisits: 1247,
    uniqueUsers: 523,
    pageViews: 3412,
    avgSessionTime: '4m 32s',
    bounceRate: '34.2%',
    topPages: [
      { page: '/dashboard', views: 892, percentage: 26.1 },
      { page: '/profile', views: 634, percentage: 18.6 },
      { page: '/settings', views: 445, percentage: 13.0 },
      { page: '/analytics', views: 312, percentage: 9.1 },
    ],
    dailyStats: [
      { date: 'Mon', visits: 145 },
      { date: 'Tue', visits: 189 },
      { date: 'Wed', visits: 167 },
      { date: 'Thu', visits: 203 },
      { date: 'Fri', visits: 178 },
      { date: 'Sat', visits: 156 },
      { date: 'Sun', visits: 209 },
    ]
  };

  if (!session) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center">
        <div className="text-red-300 text-lg">Please log in to view analytics.</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 text-white">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">📊 Analytics Dashboard</h1>
              <p className="text-white/80 text-lg">Track your usage statistics and performance metrics.</p>
            </div>
            <div className="flex items-center space-x-2">
              <select 
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="bg-white/10 border border-white/20 rounded-xl px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="24h">Last 24 hours</option>
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 3 months</option>
              </select>
            </div>
          </div>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          {[
            { label: "Total Visits", value: stats.totalVisits.toLocaleString(), icon: "👥", color: "from-blue-500 to-cyan-500", change: "+12.5%" },
            { label: "Unique Users", value: stats.uniqueUsers.toLocaleString(), icon: "👤", color: "from-green-500 to-emerald-500", change: "+8.3%" },
            { label: "Page Views", value: stats.pageViews.toLocaleString(), icon: "📄", color: "from-purple-500 to-pink-500", change: "+15.7%" },
            { label: "Avg Session", value: stats.avgSessionTime, icon: "⏱️", color: "from-orange-500 to-red-500", change: "+2.1%" },
            { label: "Bounce Rate", value: stats.bounceRate, icon: "📈", color: "from-indigo-500 to-purple-500", change: "-3.2%" },
          ].map((stat, index) => (
            <div key={index} className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 hover:bg-white/20 transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${stat.color} flex items-center justify-center text-2xl`}>
                  {stat.icon}
                </div>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  stat.change.startsWith('+') ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                }`}>
                  {stat.change}
                </span>
              </div>
              <p className="text-white/70 text-sm font-medium">{stat.label}</p>
              <p className="text-2xl font-bold text-white">{stat.value}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Daily Visits Chart */}
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6">
            <h2 className="text-xl font-semibold text-white mb-6">📈 Daily Visits</h2>
            <div className="relative">
              <div className="flex items-end space-x-2 h-48">
                {stats.dailyStats.map((day, index) => {
                  const maxVisits = Math.max(...stats.dailyStats.map(d => d.visits));
                  const height = (day.visits / maxVisits) * 100;
                  return (
                    <div key={index} className="flex-1 flex flex-col items-center">
                      <div 
                        className="w-full bg-gradient-to-t from-blue-500 to-purple-600 rounded-t-lg relative group cursor-pointer transition-all duration-200 hover:from-blue-400 hover:to-purple-500"
                        style={{ height: `${height}%` }}
                      >
                        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black/80 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                          {day.visits}
                        </div>
                      </div>
                      <span className="text-white/70 text-sm mt-2">{day.date}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Top Pages */}
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6">
            <h2 className="text-xl font-semibold text-white mb-6">🔥 Top Pages</h2>
            <div className="space-y-4">
              {stats.topPages.map((page, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                      {index + 1}
                    </div>
                    <div>
                      <p className="text-white font-medium">{page.page}</p>
                      <p className="text-white/60 text-sm">{page.views.toLocaleString()} views</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="w-16 h-2 bg-white/20 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-blue-500 to-purple-600"
                        style={{ width: `${page.percentage}%` }}
                      ></div>
                    </div>
                    <p className="text-white/70 text-xs mt-1">{page.percentage}%</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Detailed Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Device Stats */}
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6">
            <h2 className="text-xl font-semibold text-white mb-6">📱 Device Types</h2>
            <div className="space-y-4">
              {[
                { device: "Desktop", percentage: 64.2, users: 336 },
                { device: "Mobile", percentage: 28.7, users: 150 },
                { device: "Tablet", percentage: 7.1, users: 37 },
              ].map((device, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-white font-medium">{device.device}</span>
                    <span className="text-white/70 text-sm">{device.users} users</span>
                  </div>
                  <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-green-500 to-emerald-600"
                      style={{ width: `${device.percentage}%` }}
                    ></div>
                  </div>
                  <div className="text-white/60 text-xs">{device.percentage}%</div>
                </div>
              ))}
            </div>
          </div>

          {/* Browser Stats */}
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6">
            <h2 className="text-xl font-semibold text-white mb-6">🌐 Browsers</h2>
            <div className="space-y-4">
              {[
                { browser: "Chrome", percentage: 68.5, users: 358 },
                { browser: "Safari", percentage: 18.3, users: 96 },
                { browser: "Firefox", percentage: 8.7, users: 45 },
                { browser: "Edge", percentage: 4.5, users: 24 },
              ].map((browser, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-white font-medium">{browser.browser}</span>
                    <span className="text-white/70 text-sm">{browser.users} users</span>
                  </div>
                  <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-purple-500 to-pink-600"
                      style={{ width: `${browser.percentage}%` }}
                    ></div>
                  </div>
                  <div className="text-white/60 text-xs">{browser.percentage}%</div>
                </div>
              ))}
            </div>
          </div>

          {/* Geographic Stats */}
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6">
            <h2 className="text-xl font-semibold text-white mb-6">🌍 Locations</h2>
            <div className="space-y-4">
              {[
                { country: "Canada", percentage: 45.2, users: 236 },
                { country: "United States", percentage: 28.7, users: 150 },
                { country: "United Kingdom", percentage: 12.1, users: 63 },
                { country: "Germany", percentage: 8.3, users: 43 },
                { country: "Others", percentage: 5.7, users: 31 },
              ].map((location, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-white font-medium">{location.country}</span>
                    <span className="text-white/70 text-sm">{location.users} users</span>
                  </div>
                  <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-orange-500 to-red-600"
                      style={{ width: `${location.percentage}%` }}
                    ></div>
                  </div>
                  <div className="text-white/60 text-xs">{location.percentage}%</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Export Options */}
        <div className="mt-8">
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6">
            <h2 className="text-xl font-semibold text-white mb-4">📥 Export Data</h2>
            <p className="text-white/70 mb-6">Download your analytics data in various formats for further analysis.</p>
            <div className="flex flex-wrap gap-4">
              <button className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200">
                Export as CSV
              </button>
              <button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200">
                Export as PDF
              </button>
              <button className="bg-white/10 hover:bg-white/20 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200 border border-white/20">
                Export as JSON
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}