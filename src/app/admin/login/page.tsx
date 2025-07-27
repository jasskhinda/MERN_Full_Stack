"use client";

import { useState, useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    // If already logged in as admin, redirect to admin panel
    if (session && (session.user as { role?: string })?.role === 'admin') {
      router.push('/admin');
    }
    // If logged in as regular user, show access denied
    else if (session && (session.user as { role?: string })?.role !== 'admin') {
      setError('Access denied. Administrator privileges required.');
    }
  }, [session, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid administrator credentials");
      } else {
        // Wait for session to update, then check role
        setTimeout(() => {
          window.location.reload(); // Force session refresh
        }, 1000);
      }
    } catch {
      setError("Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Show loading while checking session
  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-red-900 to-black flex items-center justify-center">
        <div className="text-white text-lg">Checking administrator access...</div>
      </div>
    );
  }

  // If already admin, show success
  if (session && (session.user as { role?: string })?.role === 'admin') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-red-900 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🛡️</div>
          <h1 className="text-4xl font-bold text-white mb-2">Welcome, Administrator</h1>
          <p className="text-gray-300 mb-6">Redirecting to admin panel...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-red-900 to-black flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Admin Badge */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center bg-red-500/20 backdrop-blur-md border border-red-500/30 rounded-full px-6 py-3 mb-6">
            <span className="text-red-300 text-sm font-bold">🛡️ ADMINISTRATOR ACCESS</span>
          </div>
          
          <h1 className="text-4xl font-bold text-white mb-2">Admin Login</h1>
          <p className="text-gray-400">
            Secure access for system administrators only
          </p>
        </div>

        {/* Demo Admin Credentials */}
        <div className="bg-yellow-500/20 backdrop-blur-md border border-yellow-500/30 rounded-2xl p-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="text-2xl">💡</div>
            <div className="text-yellow-200">
              <p className="font-semibold">Demo Admin Account:</p>
              <p className="text-sm">📧 Email: admin@mernstack.com</p>
              <p className="text-sm">🔑 Password: Admin@123!</p>
            </div>
          </div>
        </div>

        {/* Login Form */}
        <div className="bg-black/40 backdrop-blur-lg border border-red-500/30 rounded-2xl p-8 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Input */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                Administrator Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-400">👤</span>
                </div>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
                  placeholder="admin@example.com"
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                Administrator Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-400">🔐</span>
                </div>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-500/20 border border-red-500/30 text-red-300 p-4 rounded-lg text-center">
                <div className="flex items-center justify-center gap-2">
                  <span>❌</span>
                  <span>{error}</span>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 px-4 rounded-xl font-bold text-white transition-all duration-200 transform ${
                isLoading
                  ? "bg-gray-600 cursor-not-allowed"
                  : "bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 hover:scale-105 shadow-lg"
              }`}
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Authenticating...</span>
                </div>
              ) : (
                "🛡️ LOGIN AS ADMINISTRATOR"
              )}
            </button>
          </form>

          {/* Security Notice */}
          <div className="mt-6 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
            <div className="flex items-start gap-2">
              <span className="text-yellow-400 mt-0.5">⚠️</span>
              <div>
                <div className="text-yellow-300 font-semibold text-sm">Security Notice</div>
                <div className="text-yellow-400 text-xs mt-1">
                  This area is restricted to authorized administrators only. 
                  All access attempts are logged and monitored.
                </div>
              </div>
            </div>
          </div>

          {/* Alternative Access */}
          <div className="mt-6 text-center">
            <p className="text-gray-400 text-sm mb-3">Not an administrator?</p>
            <Link 
              href="/login"
              className="text-blue-400 hover:text-blue-300 transition-colors text-sm font-medium"
            >
              Regular User Login →
            </Link>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-gray-500 text-xs">
            Admin Panel Access • Secure Authentication • MERN Stack Pro
          </p>
        </div>
      </div>
    </div>
  );
}