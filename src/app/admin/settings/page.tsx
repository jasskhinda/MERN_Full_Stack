"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";

interface SystemSettings {
  siteName: string;
  maintenanceMode: boolean;
  registrationEnabled: boolean;
  emailNotifications: boolean;
  maxUsers: number;
  sessionTimeout: number;
}

export default function AdminSettings() {
  const { data: session } = useSession();
  const [settings, setSettings] = useState<SystemSettings>({
    siteName: "MERN Stack Pro",
    maintenanceMode: false,
    registrationEnabled: true,
    emailNotifications: true,
    maxUsers: 1000,
    sessionTimeout: 24
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    // Load settings from localStorage on mount
    const savedSettings = localStorage.getItem('adminSettings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  // Check admin access
  if (!session || (session.user as { role?: string })?.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-900 via-gray-900 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🚫</div>
          <h1 className="text-4xl font-bold text-red-400 mb-2">Access Denied</h1>
          <p className="text-red-300 text-lg">Administrator privileges required.</p>
        </div>
      </div>
    );
  }

  const handleSaveSettings = async () => {
    setLoading(true);
    setMessage("");

    try {
      // Simulate API call - in real app, this would save to database
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Store in localStorage for demo purposes
      localStorage.setItem('adminSettings', JSON.stringify(settings));
      
      setMessage("✅ Settings saved successfully!");
      
      setTimeout(() => setMessage(""), 3000);
    } catch {
      setMessage("❌ Failed to save settings");
    } finally {
      setLoading(false);
    }
  };

  const handleResetSettings = () => {
    if (confirm("Are you sure you want to reset all settings to defaults?")) {
      setSettings({
        siteName: "MERN Stack Pro",
        maintenanceMode: false,
        registrationEnabled: true,
        emailNotifications: true,
        maxUsers: 1000,
        sessionTimeout: 24
      });
      setMessage("🔄 Settings reset to defaults");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 text-white">
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">⚙️ System Settings</h1>
          <p className="text-white/80 text-lg">Configure system-wide settings and preferences.</p>
        </div>

        {/* Message */}
        {message && (
          <div className={`mb-6 p-4 rounded-lg ${
            message.includes('successfully') 
              ? 'bg-green-500/20 border border-green-500/30 text-green-300'
              : message.includes('Failed')
              ? 'bg-red-500/20 border border-red-500/30 text-red-300'
              : 'bg-blue-500/20 border border-blue-500/30 text-blue-300'
          }`}>
            {message}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* General Settings */}
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6">
            <h2 className="text-xl font-semibold text-white mb-6">🏠 General Settings</h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-white/70 text-sm font-medium mb-2">
                  Site Name
                </label>
                <input
                  type="text"
                  value={settings.siteName}
                  onChange={(e) => setSettings({...settings, siteName: e.target.value})}
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-white/70 text-sm font-medium mb-2">
                  Maximum Users
                </label>
                <input
                  type="number"
                  value={settings.maxUsers}
                  onChange={(e) => setSettings({...settings, maxUsers: parseInt(e.target.value)})}
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-white/70 text-sm font-medium mb-2">
                  Session Timeout (hours)
                </label>
                <input
                  type="number"
                  value={settings.sessionTimeout}
                  onChange={(e) => setSettings({...settings, sessionTimeout: parseInt(e.target.value)})}
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Security & Access */}
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6">
            <h2 className="text-xl font-semibold text-white mb-6">🔒 Security & Access</h2>
            
            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                <div>
                  <div className="text-white font-medium">Maintenance Mode</div>
                  <div className="text-white/60 text-sm">Disable site access for all users</div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.maintenanceMode}
                    onChange={(e) => setSettings({...settings, maintenanceMode: e.target.checked})}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                <div>
                  <div className="text-white font-medium">User Registration</div>
                  <div className="text-white/60 text-sm">Allow new users to register</div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.registrationEnabled}
                    onChange={(e) => setSettings({...settings, registrationEnabled: e.target.checked})}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                <div>
                  <div className="text-white font-medium">Email Notifications</div>
                  <div className="text-white/60 text-sm">Send system email notifications</div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.emailNotifications}
                    onChange={(e) => setSettings({...settings, emailNotifications: e.target.checked})}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Admin Tools */}
        <div className="mt-8 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6">
          <h2 className="text-xl font-semibold text-white mb-6">🛠️ Admin Tools</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-500/20 border border-blue-500/30 rounded-lg p-4 text-center">
              <div className="text-2xl mb-2">🔄</div>
              <div className="text-white font-semibold mb-2">Clear Cache</div>
              <button className="bg-blue-600 hover:bg-blue-700 text-white text-sm py-2 px-4 rounded-lg transition-colors">
                Clear All Cache
              </button>
            </div>

            <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-4 text-center">
              <div className="text-2xl mb-2">💾</div>
              <div className="text-white font-semibold mb-2">Database Backup</div>
              <button className="bg-green-600 hover:bg-green-700 text-white text-sm py-2 px-4 rounded-lg transition-colors">
                Create Backup
              </button>
            </div>

            <div className="bg-orange-500/20 border border-orange-500/30 rounded-lg p-4 text-center">
              <div className="text-2xl mb-2">📊</div>
              <div className="text-white font-semibold mb-2">Generate Report</div>
              <button className="bg-orange-600 hover:bg-orange-700 text-white text-sm py-2 px-4 rounded-lg transition-colors">
                Export Report
              </button>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex gap-4">
          <button
            onClick={handleSaveSettings}
            disabled={loading}
            className={`${
              loading 
                ? 'bg-gray-600 cursor-not-allowed' 
                : 'bg-green-600 hover:bg-green-700'
            } text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-105`}
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Saving...</span>
              </div>
            ) : (
              '💾 Save Settings'
            )}
          </button>

          <button
            onClick={handleResetSettings}
            className="bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200"
          >
            🔄 Reset to Defaults
          </button>
        </div>

        {/* Settings Summary */}
        <div className="mt-8 bg-gray-800/50 border border-gray-600 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">📋 Current Configuration</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-400">Site Name:</span>
              <span className="text-white ml-2 font-medium">{settings.siteName}</span>
            </div>
            <div>
              <span className="text-gray-400">Max Users:</span>
              <span className="text-white ml-2 font-medium">{settings.maxUsers}</span>
            </div>
            <div>
              <span className="text-gray-400">Session Timeout:</span>
              <span className="text-white ml-2 font-medium">{settings.sessionTimeout} hours</span>
            </div>
            <div>
              <span className="text-gray-400">Maintenance:</span>
              <span className={`ml-2 font-medium ${settings.maintenanceMode ? 'text-red-400' : 'text-green-400'}`}>
                {settings.maintenanceMode ? 'Enabled' : 'Disabled'}
              </span>
            </div>
            <div>
              <span className="text-gray-400">Registration:</span>
              <span className={`ml-2 font-medium ${settings.registrationEnabled ? 'text-green-400' : 'text-red-400'}`}>
                {settings.registrationEnabled ? 'Enabled' : 'Disabled'}
              </span>
            </div>
            <div>
              <span className="text-gray-400">Email Notifications:</span>
              <span className={`ml-2 font-medium ${settings.emailNotifications ? 'text-green-400' : 'text-red-400'}`}>
                {settings.emailNotifications ? 'Enabled' : 'Disabled'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}