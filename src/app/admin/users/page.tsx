"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

interface User {
  _id: string;
  email: string;
  name: string;
  role: string;
}

function RoleControl({ user, currentUserId }: { user: User; currentUserId: string }) {
  const [updating, setUpdating] = useState(false);
  const [role, setRole] = useState(user.role);

  const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newRole = e.target.value;
    setUpdating(true);
    
    const res = await fetch("/api/admin/users/role", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: user._id, newRole }),
    });

    if (res.ok) {
      setRole(newRole);
    } else {
      const error = await res.json();
      alert(error.error);
      // Reset to previous value
      e.target.value = role;
    }
    
    setUpdating(false);
  };

  const isSelf = user._id === currentUserId;

  return (
    <div className="flex items-center gap-2">
      <select
        value={role}
        onChange={handleChange}
        disabled={updating}
        className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
      >
        <option value="user" className="bg-gray-800 text-white">User</option>
        <option value="admin" className="bg-gray-800 text-white">Admin</option>
      </select>
      {isSelf && role === "admin" && (
        <span className="text-xs text-blue-300">(You)</span>
      )}
      {updating && (
        <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      )}
    </div>
  );
}

export default function AdminUserPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState("");
  const { data: session } = useSession();

  useEffect(() => {
    fetch("/api/admin/users")
      .then((res) => {
        if (!res.ok) throw new Error("Unauthorized");
        return res.json();
      })
      .then((data) => setUsers(data.users))
      .catch(() => setError("Access denied or failed to load users."));
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 text-white">
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">👥 User Management</h1>
          <p className="text-white/80 text-lg">Manage user roles and permissions across the platform.</p>
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

        {/* Users Table */}
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/5 border-b border-white/20">
                <tr>
                  <th className="text-left py-4 px-6 font-semibold text-white">
                    <div className="flex items-center gap-2">
                      <span>📧</span>
                      <span>Email</span>
                    </div>
                  </th>
                  <th className="text-left py-4 px-6 font-semibold text-white">
                    <div className="flex items-center gap-2">
                      <span>👤</span>
                      <span>Name</span>
                    </div>
                  </th>
                  <th className="text-left py-4 px-6 font-semibold text-white">
                    <div className="flex items-center gap-2">
                      <span>🛡️</span>
                      <span>Role</span>
                    </div>
                  </th>
                  <th className="text-left py-4 px-6 font-semibold text-white">
                    <div className="flex items-center gap-2">
                      <span>⚙️</span>
                      <span>Actions</span>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {users.length > 0 ? (
                  users.map((user) => (
                    <tr key={user._id} className="border-b border-white/10 hover:bg-white/5 transition-colors">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                            <span className="text-white font-semibold text-sm">
                              {user.email?.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <span className="text-white">{user.email}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className="text-white">{user.name || 'Not set'}</span>
                      </td>
                      <td className="py-4 px-6">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                          user.role === 'admin' 
                            ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' 
                            : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                        }`}>
                          {user.role === 'admin' ? '👑 Admin' : '👤 User'}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <RoleControl user={user} currentUserId={(session?.user as { id?: string })?.id || ""} />
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="py-8 px-6 text-center text-white/60">
                      <div className="flex flex-col items-center gap-2">
                        <span className="text-2xl">👥</span>
                        <span>No users found</span>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/70 text-sm">Total Users</p>
                <p className="text-2xl font-bold text-white">{users.length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <span className="text-2xl">👥</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/70 text-sm">Admins</p>
                <p className="text-2xl font-bold text-white">{users.filter(u => u.role === 'admin').length}</p>
              </div>
              <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
                <span className="text-2xl">👑</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/70 text-sm">Regular Users</p>
                <p className="text-2xl font-bold text-white">{users.filter(u => u.role === 'user').length}</p>
              </div>
              <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                <span className="text-2xl">👤</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}