"use client";

import { useSession } from "next-auth/react";
import { useState } from "react";

export default function SettingsPage() {
  const { data: session } = useSession();
  const [preferences, setPreferences] = useState({
    notifications: {
      email: true,
      push: false,
      sms: false,
      marketing: true
    },
    privacy: {
      profileVisibility: 'public',
      showEmail: false,
      showActivity: true
    },
    appearance: {
      theme: 'dark',
      language: 'en',
      timezone: 'America/Toronto'
    }
  });

  const handleSaveSettings = () => {
    alert('Settings saved successfully!');
  };

  if (!session) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center">
        <div className="text-red-300 text-lg">Please log in to access settings.</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 text-white">
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">⚙️ Settings</h1>
          <p className="text-white/80 text-lg">Configure your preferences and account settings.</p>
        </div>

        <div className="space-y-8">
          {/* Notification Settings */}
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6">
            <h2 className="text-xl font-semibold text-white mb-6">🔔 Notification Preferences</h2>
            
            <div className="space-y-6">
              {[
                { key: 'email', label: 'Email Notifications', description: 'Receive updates via email' },
                { key: 'push', label: 'Push Notifications', description: 'Browser push notifications' },
                { key: 'sms', label: 'SMS Notifications', description: 'Text message alerts' },
                { key: 'marketing', label: 'Marketing Communications', description: 'Product updates and news' },
              ].map((item) => (
                <div key={item.key} className="flex items-center justify-between">
                  <div>
                    <h3 className="text-white font-medium">{item.label}</h3>
                    <p className="text-white/70 text-sm">{item.description}</p>
                  </div>
                  <button
                    onClick={() => setPreferences({
                      ...preferences,
                      notifications: {
                        ...preferences.notifications,
                        [item.key]: !preferences.notifications[item.key as keyof typeof preferences.notifications]
                      }
                    })}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                      preferences.notifications[item.key as keyof typeof preferences.notifications] ? 'bg-green-600' : 'bg-gray-600'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        preferences.notifications[item.key as keyof typeof preferences.notifications] ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Privacy Settings */}
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6">
            <h2 className="text-xl font-semibold text-white mb-6">🔒 Privacy Settings</h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-white font-medium mb-2">Profile Visibility</label>
                <select 
                  value={preferences.privacy.profileVisibility}
                  onChange={(e) => setPreferences({
                    ...preferences,
                    privacy: { ...preferences.privacy, profileVisibility: e.target.value }
                  })}
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="public">Public</option>
                  <option value="friends">Friends Only</option>
                  <option value="private">Private</option>
                </select>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-white font-medium">Show Email Address</h3>
                  <p className="text-white/70 text-sm">Display your email on your public profile</p>
                </div>
                <button
                  onClick={() => setPreferences({
                    ...preferences,
                    privacy: { ...preferences.privacy, showEmail: !preferences.privacy.showEmail }
                  })}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                    preferences.privacy.showEmail ? 'bg-green-600' : 'bg-gray-600'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      preferences.privacy.showEmail ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-white font-medium">Show Activity Status</h3>
                  <p className="text-white/70 text-sm">Let others see when you&apos;re active</p>
                </div>
                <button
                  onClick={() => setPreferences({
                    ...preferences,
                    privacy: { ...preferences.privacy, showActivity: !preferences.privacy.showActivity }
                  })}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                    preferences.privacy.showActivity ? 'bg-green-600' : 'bg-gray-600'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      preferences.privacy.showActivity ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Appearance Settings */}
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6">
            <h2 className="text-xl font-semibold text-white mb-6">🎨 Appearance & Language</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-white font-medium mb-2">Theme</label>
                <select 
                  value={preferences.appearance.theme}
                  onChange={(e) => setPreferences({
                    ...preferences,
                    appearance: { ...preferences.appearance, theme: e.target.value }
                  })}
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                  <option value="auto">Auto</option>
                </select>
              </div>

              <div>
                <label className="block text-white font-medium mb-2">Language</label>
                <select 
                  value={preferences.appearance.language}
                  onChange={(e) => setPreferences({
                    ...preferences,
                    appearance: { ...preferences.appearance, language: e.target.value }
                  })}
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="en">English</option>
                  <option value="fr">Français</option>
                  <option value="es">Español</option>
                  <option value="de">Deutsch</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-white font-medium mb-2">Timezone</label>
                <select 
                  value={preferences.appearance.timezone}
                  onChange={(e) => setPreferences({
                    ...preferences,
                    appearance: { ...preferences.appearance, timezone: e.target.value }
                  })}
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="America/Toronto">Eastern Time (ET)</option>
                  <option value="America/Vancouver">Pacific Time (PT)</option>
                  <option value="America/Chicago">Central Time (CT)</option>
                  <option value="America/New_York">Eastern Time (ET)</option>
                  <option value="Europe/London">Greenwich Mean Time (GMT)</option>
                  <option value="Europe/Paris">Central European Time (CET)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Data Management */}
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6">
            <h2 className="text-xl font-semibold text-white mb-6">📁 Data Management</h2>
            
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 text-center">
                  Export Data
                </button>
                <button className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 text-center">
                  Backup Settings
                </button>
                <button className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 text-center">
                  Clear Cache
                </button>
              </div>

              <div className="border-t border-white/20 pt-6">
                <h3 className="text-white font-medium mb-4 text-red-300">⚠️ Danger Zone</h3>
                <div className="space-y-4">
                  <button className="w-full bg-red-600/20 hover:bg-red-600/30 border border-red-500/50 text-red-300 font-semibold py-3 px-4 rounded-xl transition-all duration-200">
                    Deactivate Account
                  </button>
                  <button className="w-full bg-red-800/20 hover:bg-red-800/30 border border-red-600/50 text-red-200 font-semibold py-3 px-4 rounded-xl transition-all duration-200">
                    Delete Account Permanently
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Account Information */}
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6">
            <h2 className="text-xl font-semibold text-white mb-6">ℹ️ Account Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-white/70 text-sm font-medium mb-1">Account Created</label>
                <p className="text-white bg-white/5 rounded-lg px-3 py-2 border border-white/10">
                  December 15, 2024
                </p>
              </div>
              <div>
                <label className="block text-white/70 text-sm font-medium mb-1">Last Login</label>
                <p className="text-white bg-white/5 rounded-lg px-3 py-2 border border-white/10">
                  2 hours ago
                </p>
              </div>
              <div>
                <label className="block text-white/70 text-sm font-medium mb-1">Data Usage</label>
                <p className="text-white bg-white/5 rounded-lg px-3 py-2 border border-white/10">
                  245 MB
                </p>
              </div>
              <div>
                <label className="block text-white/70 text-sm font-medium mb-1">Storage Used</label>
                <p className="text-white bg-white/5 rounded-lg px-3 py-2 border border-white/10">
                  1.2 GB of 5 GB
                </p>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end space-x-4">
            <button className="bg-white/10 hover:bg-white/20 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 border border-white/20">
              Reset to Defaults
            </button>
            <button 
              onClick={handleSaveSettings}
              className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-105"
            >
              Save Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}