"use client";

import { useEffect, useState } from "react";

interface AuditEntry {
  _id: string;
  actorId: string;
  targetUserId: string;
  action: string;
  timestamp: string;
  details: Record<string, unknown>;
}

export default function AuditLogPage() {
  const [logs, setLogs] = useState<AuditEntry[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/admin/audit")
      .then((res) => {
        if (!res.ok) throw new Error("Unauthorized");
        return res.json();
      })
      .then((data) => setLogs(data.logs))
      .catch(() => setError("Failed to load audit logs"));
  }, []);

  const getActionIcon = (action: string) => {
    const iconMap: { [key: string]: string } = {
      'role_change': '🛡️',
      'profile_update': '✏️',
      'login': '🔐',
      'logout': '🚪',
      'create': '➕',
      'delete': '🗑️',
      'update': '📝'
    };
    return iconMap[action] || '📋';
  };

  const getActionColor = (action: string) => {
    const colorMap: { [key: string]: string } = {
      'role_change': 'bg-purple-500/20 text-purple-300 border-purple-500/30',
      'profile_update': 'bg-blue-500/20 text-blue-300 border-blue-500/30',
      'login': 'bg-green-500/20 text-green-300 border-green-500/30',
      'logout': 'bg-orange-500/20 text-orange-300 border-orange-500/30',
      'create': 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
      'delete': 'bg-red-500/20 text-red-300 border-red-500/30'
    };
    return colorMap[action] || 'bg-gray-500/20 text-gray-300 border-gray-500/30';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 text-white">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">📋 Audit Logs</h1>
          <p className="text-white/80 text-lg">Track all administrative actions and system events.</p>
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-500/20 border border-red-500/30 text-red-300 p-4 rounded-lg mb-6">
            <div className="flex items-center gap-2">
              <span>❌</span>
              <span>{error}</span>
            </div>
          </div>
        )}

        {/* Audit Logs */}
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/5 border-b border-white/20">
                <tr>
                  <th className="text-left py-4 px-6 font-semibold text-white">
                    <div className="flex items-center gap-2">
                      <span>🕒</span>
                      <span>Timestamp</span>
                    </div>
                  </th>
                  <th className="text-left py-4 px-6 font-semibold text-white">
                    <div className="flex items-center gap-2">
                      <span>⚡</span>
                      <span>Action</span>
                    </div>
                  </th>
                  <th className="text-left py-4 px-6 font-semibold text-white">
                    <div className="flex items-center gap-2">
                      <span>👤</span>
                      <span>Actor</span>
                    </div>
                  </th>
                  <th className="text-left py-4 px-6 font-semibold text-white">
                    <div className="flex items-center gap-2">
                      <span>🎯</span>
                      <span>Target</span>
                    </div>
                  </th>
                  <th className="text-left py-4 px-6 font-semibold text-white">
                    <div className="flex items-center gap-2">
                      <span>📝</span>
                      <span>Details</span>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {logs.length > 0 ? (
                  logs.map((entry) => (
                    <tr key={entry._id} className="border-b border-white/10 hover:bg-white/5 transition-colors">
                      <td className="py-4 px-6">
                        <div className="text-white/90">
                          {new Date(entry.timestamp).toLocaleString()}
                        </div>
                        <div className="text-white/60 text-sm">
                          {new Date(entry.timestamp).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getActionColor(entry.action)}`}>
                          <span className="mr-2">{getActionIcon(entry.action)}</span>
                          {entry.action.replace('_', ' ').toUpperCase()}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                            <span className="text-white font-semibold text-xs">
                              {entry.actorId.slice(-2).toUpperCase()}
                            </span>
                          </div>
                          <span className="text-white/90 font-mono text-sm">
                            {entry.actorId.slice(-8)}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 bg-gradient-to-r from-green-500 to-blue-600 rounded-full flex items-center justify-center">
                            <span className="text-white font-semibold text-xs">
                              {entry.targetUserId.slice(-2).toUpperCase()}
                            </span>
                          </div>
                          <span className="text-white/90 font-mono text-sm">
                            {entry.targetUserId.slice(-8)}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="bg-black/20 rounded-lg p-3 max-w-xs">
                          <pre className="text-xs text-white/80 whitespace-pre-wrap overflow-hidden">
                            {JSON.stringify(entry.details, null, 2)}
                          </pre>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="py-8 px-6 text-center text-white/60">
                      <div className="flex flex-col items-center gap-2">
                        <span className="text-2xl">📋</span>
                        <span>No audit logs found</span>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/70 text-sm">Total Events</p>
                <p className="text-2xl font-bold text-white">{logs.length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <span className="text-2xl">📊</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/70 text-sm">Today</p>
                <p className="text-2xl font-bold text-white">
                  {logs.filter(log => {
                    const today = new Date().toDateString();
                    return new Date(log.timestamp).toDateString() === today;
                  }).length}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                <span className="text-2xl">📅</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/70 text-sm">Role Changes</p>
                <p className="text-2xl font-bold text-white">
                  {logs.filter(log => log.action === 'role_change').length}
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
                <span className="text-2xl">🛡️</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/70 text-sm">Profile Updates</p>
                <p className="text-2xl font-bold text-white">
                  {logs.filter(log => log.action === 'profile_update').length}
                </p>
              </div>
              <div className="w-12 h-12 bg-orange-500/20 rounded-lg flex items-center justify-center">
                <span className="text-2xl">✏️</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}