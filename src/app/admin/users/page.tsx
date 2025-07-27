"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

interface User {
  _id: string;
  email: string;
  name: string;
  role: string;
  createdAt?: string;
}

interface DeleteConfirmation {
  user: User | null;
  isOpen: boolean;
}

function RoleDisplay({ user, currentUserId }: { 
  user: User; 
  currentUserId: string;
}) {
  const isSelf = user._id === currentUserId;

  return (
    <div className="flex items-center gap-2">
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
        user.role === 'admin' 
          ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' 
          : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
      }`}>
        {user.role === 'admin' ? '👑 Admin' : '👤 User'}
      </span>
      {isSelf && user.role === "admin" && (
        <span className="text-xs text-purple-300">(You)</span>
      )}
    </div>
  );
}

function DeleteConfirmationModal({ 
  confirmation, 
  onConfirm, 
  onCancel 
}: {
  confirmation: DeleteConfirmation;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  if (!confirmation.isOpen || !confirmation.user) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-gray-800 border border-red-500/30 rounded-xl p-6 max-w-md w-full mx-4">
        <div className="text-center">
          <div className="text-4xl mb-4">⚠️</div>
          <h3 className="text-xl font-bold text-white mb-2">Delete User Account</h3>
          <p className="text-gray-300 mb-4">
            Are you sure you want to permanently delete the account for:
          </p>
          <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-3 mb-6">
            <p className="text-white font-semibold">{confirmation.user.name || confirmation.user.email}</p>
            <p className="text-red-300 text-sm">{confirmation.user.email}</p>
            <p className="text-red-400 text-xs mt-1">Role: {confirmation.user.role}</p>
          </div>
          <p className="text-red-300 text-sm mb-6">
            This action cannot be undone. All user data will be permanently deleted.
          </p>
          <div className="flex gap-3">
            <button
              onClick={onCancel}
              className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
            >
              Delete User
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdminUserPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [deleteConfirmation, setDeleteConfirmation] = useState<DeleteConfirmation>({
    user: null,
    isOpen: false
  });
  const [bulkLoading, setBulkLoading] = useState(false);
  const { data: session } = useSession();

  const fetchUsers = async () => {
    try {
      const response = await fetch("/api/admin/users");
      if (response.ok) {
        const data = await response.json();
        setUsers(data.users);
      } else {
        setError("Access denied or failed to load users.");
      }
    } catch {
      setError("Access denied or failed to load users.");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSelectUser = (userId: string, checked: boolean) => {
    if (checked) {
      setSelectedUsers([...selectedUsers, userId]);
    } else {
      setSelectedUsers(selectedUsers.filter(id => id !== userId));
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedUsers(users.map(user => user._id));
    } else {
      setSelectedUsers([]);
    }
  };

  const handleDeleteUser = async (user: User) => {
    setDeleteConfirmation({ user, isOpen: true });
  };

  const confirmDelete = async () => {
    if (!deleteConfirmation.user) return;

    try {
      const response = await fetch("/api/admin/users/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: deleteConfirmation.user._id }),
      });

      if (response.ok) {
        await fetchUsers(); // Refresh the list
        setDeleteConfirmation({ user: null, isOpen: false });
        alert("User deleted successfully");
      } else {
        const error = await response.json();
        alert(`Failed to delete user: ${error.error}`);
      }
    } catch {
      alert("Failed to delete user");
    }
  };

  const handleBulkAction = async (action: string) => {
    if (selectedUsers.length === 0) {
      alert("Please select users first");
      return;
    }

    const actionNames = {
      delete_multiple: "delete selected users"
    };

    if (!confirm(`Are you sure you want to ${actionNames[action as keyof typeof actionNames]}?`)) {
      return;
    }

    setBulkLoading(true);

    try {
      const response = await fetch("/api/admin/users/bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, userIds: selectedUsers }),
      });

      if (response.ok) {
        const result = await response.json();
        await fetchUsers(); // Refresh the list
        setSelectedUsers([]); // Clear selection
        alert(result.message);
      } else {
        const error = await response.json();
        alert(`Failed to perform action: ${error.error}`);
      }
    } catch {
      alert("Failed to perform bulk action");
    } finally {
      setBulkLoading(false);
    }
  };

  const currentUserId = (session?.user as { id?: string })?.id || "";

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 text-white">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">👥 User Management</h1>
          <p className="text-white/80 text-lg">Complete user administration and management controls.</p>
        </div>

        {/* Bulk Actions */}
        {selectedUsers.length > 0 && (
          <div className="mb-6 bg-blue-500/20 backdrop-blur-md border border-blue-500/30 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="text-blue-300 font-semibold">
                  {selectedUsers.length} user{selectedUsers.length !== 1 ? 's' : ''} selected
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleBulkAction('delete_multiple')}
                    disabled={bulkLoading}
                    className="bg-red-600 hover:bg-red-700 text-white text-sm font-semibold py-2 px-3 rounded-lg transition-colors disabled:opacity-50"
                  >
                    🗑️ Delete Selected
                  </button>
                </div>
              </div>
              <button
                onClick={() => setSelectedUsers([])}
                className="text-gray-400 hover:text-white transition-colors"
              >
                ✕ Clear Selection
              </button>
            </div>
          </div>
        )}

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
                      <input
                        type="checkbox"
                        checked={selectedUsers.length === users.length && users.length > 0}
                        onChange={(e) => handleSelectAll(e.target.checked)}
                        className="rounded border-gray-600 bg-gray-700 text-blue-600 focus:ring-blue-500"
                      />
                      <span>Select</span>
                    </div>
                  </th>
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
                        <input
                          type="checkbox"
                          checked={selectedUsers.includes(user._id)}
                          onChange={(e) => handleSelectUser(user._id, e.target.checked)}
                          className="rounded border-gray-600 bg-gray-700 text-blue-600 focus:ring-blue-500"
                        />
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                            <span className="text-white font-semibold text-sm">
                              {user.email?.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <span className="text-white">{user.email}</span>
                            {user.createdAt && (
                              <div className="text-gray-400 text-xs">
                                Joined {new Date(user.createdAt).toLocaleDateString()}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className="text-white">{user.name || 'Not set'}</span>
                      </td>
                      <td className="py-4 px-6">
                        <RoleDisplay 
                          user={user} 
                          currentUserId={currentUserId}
                        />
                      </td>
                      <td className="py-4 px-6">
                        {user._id !== currentUserId && user.role !== 'admin' && (
                          <button
                            onClick={() => handleDeleteUser(user)}
                            className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-lg transition-colors text-sm"
                            title="Delete User"
                          >
                            🗑️ Delete
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="py-8 px-6 text-center text-white/60">
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
        <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
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

          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/70 text-sm">Selected</p>
                <p className="text-2xl font-bold text-white">{selectedUsers.length}</p>
              </div>
              <div className="w-12 h-12 bg-orange-500/20 rounded-lg flex items-center justify-center">
                <span className="text-2xl">✓</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        confirmation={deleteConfirmation}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteConfirmation({ user: null, isOpen: false })}
      />
    </div>
  );
}