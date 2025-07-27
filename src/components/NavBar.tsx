"use client";

import Link from "next/link";
import Image from "next/image";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";

export default function NavBar() {
  const { data: session, status } = useSession();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-black/30 backdrop-blur-md border-b border-white/20 shadow-lg">
      <nav className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
            <div className="w-10 h-10 rounded-xl overflow-hidden shadow-lg">
              <Image 
                src="/logo.png" 
                alt="MERN Stack Logo" 
                width={40}
                height={40}
                className="w-full h-full object-cover"
              />
            </div>
            <span className="text-white font-bold text-xl hidden sm:block drop-shadow-lg">MERN Stack</span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-white font-semibold hover:text-blue-300 transition-colors drop-shadow-lg">
              Home
            </Link>
            <Link href="/about" className="text-white font-semibold hover:text-blue-300 transition-colors drop-shadow-lg">
              About
            </Link>
            {session && (
              <>
                <Link href="/dashboard" className="text-white font-semibold hover:text-blue-300 transition-colors drop-shadow-lg">
                  Dashboard
                </Link>
                <Link href="/stock-predictor" className="text-white font-semibold hover:text-blue-300 transition-colors drop-shadow-lg">
                  Stock Predictor
                </Link>
              </>
            )}
            {session && (session.user as { role?: string })?.role === "admin" && (
              <Link 
                href="/admin" 
                className="bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white font-bold py-2 px-4 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg border border-red-400"
              >
                🛡️ ADMIN PANEL
              </Link>
            )}
          </div>

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            {status === "loading" ? (
              <div className="animate-pulse">
                <div className="h-8 w-20 bg-white/20 rounded"></div>
              </div>
            ) : session ? (
              <div className="relative">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center space-x-3 px-4 py-2 rounded-full text-white bg-white/10 border border-white/20 hover:bg-white/20 transition-all"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center">
                    <span className="text-white font-medium text-sm">
                      {session.user?.email?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="text-white font-medium hidden sm:block">
                    {session.user?.email?.split('@')[0]}
                  </span>
                  <svg className={`w-4 h-4 text-white transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Dropdown */}
                {isDropdownOpen && (
                  <>
                    <div 
                      className="fixed inset-0 z-10" 
                      onClick={() => setIsDropdownOpen(false)}
                    ></div>
                    <div className="absolute right-0 mt-2 w-56 bg-white/10 backdrop-blur-lg border border-white/10 rounded-xl shadow-2xl py-2 z-20">
                      <div className="px-4 py-3 border-b border-white/10">
                        <p className="text-white font-medium">{session.user?.name || 'User'}</p>
                        <p className="text-white/70 text-sm">{session.user?.email}</p>
                        {(session.user as { role?: string })?.role && (
                          <span className="inline-block mt-1 px-2 py-1 text-white text-xs rounded-full bg-gradient-to-r from-blue-500 to-purple-600">
                            {(session.user as { role?: string }).role}
                          </span>
                        )}
                      </div>
                      <Link
                        href="/profile"
                        onClick={() => setIsDropdownOpen(false)}
                        className="block w-full text-left px-4 py-3 text-white hover:bg-white/10 transition-colors"
                      >
                        <div className="flex items-center space-x-2">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          <span>Edit Profile</span>
                        </div>
                      </Link>
                      <button
                        onClick={() => {
                          setIsDropdownOpen(false);
                          signOut({ callbackUrl: "/" });
                        }}
                        className="w-full text-left px-4 py-3 text-white hover:bg-white/10 transition-colors"
                      >
                        <div className="flex items-center space-x-2">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                          </svg>
                          <span>Sign Out</span>
                        </div>
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link href="/login" className="text-white font-semibold hover:text-blue-300 transition-colors drop-shadow-lg">
                  Sign In
                </Link>
                <Link 
                  href="/admin/login" 
                  className="bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 text-white font-bold py-2 px-4 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg border border-red-500"
                >
                  🛡️ ADMIN
                </Link>
                <Link 
                  href="/register" 
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}