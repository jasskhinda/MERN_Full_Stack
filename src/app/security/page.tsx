"use client";

import { useSession } from "next-auth/react";
import { useState } from "react";

export default function SecurityPage() {
  const { data: session } = useSession();
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('New passwords do not match!');
      return;
    }
    alert('Password updated successfully!');
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
  };

  if (!session) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center">
        <div className="text-red-300 text-lg">Please log in to access security settings.</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 text-white">
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">🔒 Security Settings</h1>
          <p className="text-white/80 text-lg">Manage your account security and privacy settings.</p>
        </div>

        <div className="space-y-8">
          {/* Password Change */}
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6">
            <h2 className="text-xl font-semibold text-white mb-6">🔑 Change Password</h2>
            
            <form onSubmit={handlePasswordChange} className="space-y-6">
              <div>
                <label className="block text-white/70 text-sm font-medium mb-2">Current Password</label>
                <input
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter your current password"
                  required
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-white/70 text-sm font-medium mb-2">New Password</label>
                  <input
                    type="password"
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter new password"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-white/70 text-sm font-medium mb-2">Confirm New Password</label>
                  <input
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Confirm new password"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-105"
              >
                Update Password
              </button>
            </form>
          </div>

          {/* Two-Factor Authentication */}
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6">
            <h2 className="text-xl font-semibold text-white mb-6">📱 Two-Factor Authentication</h2>
            
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-white font-medium">Enable 2FA</h3>
                <p className="text-white/70 text-sm">Add an extra layer of security to your account</p>
              </div>
              <button
                onClick={() => setTwoFactorEnabled(!twoFactorEnabled)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                  twoFactorEnabled ? 'bg-green-600' : 'bg-gray-600'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    twoFactorEnabled ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {twoFactorEnabled && (
              <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                <p className="text-white/80 text-sm mb-3">
                  Two-factor authentication is enabled. You&apos;ll need to enter a code from your authenticator app when signing in.
                </p>
                <button className="bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200">
                  Disable 2FA
                </button>
              </div>
            )}
          </div>

          {/* Login Sessions */}
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6">
            <h2 className="text-xl font-semibold text-white mb-6">💻 Active Sessions</h2>
            
            <div className="space-y-4">
              {[
                { device: "Current Session", location: "Canada", lastActive: "Now", current: true },
                { device: "iPhone", location: "Canada", lastActive: "2 hours ago", current: false },
                { device: "Chrome Browser", location: "Canada", lastActive: "1 day ago", current: false },
              ].map((session, index) => (
                <div key={index} className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/10">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                      <span className="text-white font-bold text-sm">
                        {session.device === "Current Session" ? "💻" : session.device === "iPhone" ? "📱" : "🌐"}
                      </span>
                    </div>
                    <div>
                      <p className="text-white font-medium">{session.device}</p>
                      <p className="text-white/60 text-sm">{session.location} • {session.lastActive}</p>
                    </div>
                  </div>
                  {!session.current && (
                    <button className="text-red-400 hover:text-red-300 font-medium text-sm transition-colors">
                      Revoke
                    </button>
                  )}
                  {session.current && (
                    <span className="text-green-400 font-medium text-sm">Current</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Security Recommendations */}
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6">
            <h2 className="text-xl font-semibold text-white mb-6">⚡ Security Recommendations</h2>
            
            <div className="space-y-4">
              {[
                { title: "Strong Password", description: "Use a password with at least 12 characters", status: "completed" },
                { title: "Two-Factor Authentication", description: "Enable 2FA for extra security", status: twoFactorEnabled ? "completed" : "pending" },
                { title: "Regular Updates", description: "Keep your account information up to date", status: "completed" },
                { title: "Monitor Sessions", description: "Review active sessions regularly", status: "completed" },
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/10">
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      item.status === 'completed' ? 'bg-green-500/20 text-green-400' : 'bg-orange-500/20 text-orange-400'
                    }`}>
                      {item.status === 'completed' ? '✅' : '⚠️'}
                    </div>
                    <div>
                      <p className="text-white font-medium">{item.title}</p>
                      <p className="text-white/60 text-sm">{item.description}</p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    item.status === 'completed' 
                      ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                      : 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                  }`}>
                    {item.status === 'completed' ? 'Complete' : 'Pending'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}