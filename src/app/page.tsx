"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";

export default function HomePage() {
  const { data: session } = useSession();

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 text-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center">
            {/* Badge */}
            <div className="inline-flex items-center bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-6 py-2 mb-8">
              <span className="text-white text-sm font-medium">✨ Modern Full-Stack Application</span>
            </div>
            
            {/* Main Heading */}
            <h1 className="text-6xl md:text-8xl font-bold text-white mb-6 leading-tight">
              MERN
              <span className="block bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Stack Pro
              </span>
            </h1>
            
            {/* Description */}
            <p className="text-xl text-white/90 mb-8 max-w-3xl mx-auto leading-relaxed">
              This is a collaborative student project where we learned and implemented modern full-stack web development. 
              Built using the MERN stack with Next.js, MongoDB, authentication systems, and professional UI design.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              {session ? (
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link 
                    href="/stock-predictor" 
                    className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-4 px-8 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg text-lg border-2 border-green-400"
                  >
                    🤖 AI Stock Predictor
                  </Link>
                  <Link 
                    href="/dashboard" 
                    className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg"
                  >
                    Dashboard →
                  </Link>
                  {(session.user as { role?: string })?.role === 'admin' && (
                    <Link 
                      href="/admin" 
                      className="bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white font-bold py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg border-2 border-red-400 animate-pulse"
                    >
                      🛡️ ADMIN PANEL
                    </Link>
                  )}
                </div>
              ) : (
                <>
                  <Link 
                    href="/register" 
                    className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg"
                  >
                    Get Started Free
                  </Link>
                  <Link 
                    href="/login" 
                    className="bg-white/10 hover:bg-white/20 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 border border-white/20"
                  >
                    Sign In
                  </Link>
                  <Link 
                    href="/admin/login" 
                    className="bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 text-white font-bold py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg border-2 border-red-500 animate-pulse"
                  >
                    🛡️ ADMIN LOGIN
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Powerful Features
            </h2>
            <p className="text-white/80 text-lg max-w-2xl mx-auto">
              Developed as a learning project following modern web development practices and industry standards
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: "🔐",
                title: "Secure Authentication",
                description: "JWT-based authentication with NextAuth.js, supporting email/password and OAuth providers"
              },
              {
                icon: "🛡️",
                title: "Role-Based Access",
                description: "Advanced RBAC system with admin controls and audit logging for enterprise security"
              },
              {
                icon: "📊",
                title: "Modern Dashboard",
                description: "Beautiful, responsive dashboard with real-time data and interactive components"
              },
              {
                icon: "🚀",
                title: "Production Ready",
                description: "Built with Next.js 15, TypeScript, and modern development practices"
              }
            ].map((feature, index) => (
              <div 
                key={index} 
                className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6 text-center transition-all duration-300 hover:transform hover:-translate-y-2 hover:bg-white/10"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                <p className="text-white/70 text-sm leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Stack Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Built With Modern Tech
            </h2>
            <p className="text-white/80 text-lg">
              Leveraging the latest and greatest technologies for optimal performance
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {[
              { name: "Next.js 15", color: "bg-black" },
              { name: "React 18", color: "bg-cyan-500" },
              { name: "TypeScript", color: "bg-blue-600" },
              { name: "MongoDB", color: "bg-green-600" },
              { name: "Tailwind CSS", color: "bg-sky-500" },
              { name: "NextAuth.js", color: "bg-purple-600" }
            ].map((tech, index) => (
              <div 
                key={index} 
                className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-4 text-center transition-all duration-300 hover:transform hover:-translate-y-2 hover:bg-white/10"
              >
                <div className={`w-12 h-12 rounded-lg mx-auto mb-3 flex items-center justify-center shadow-lg ${tech.color}`}>
                  <span className="text-white font-bold">
                    {tech.name.charAt(0)}
                  </span>
                </div>
                <p className="text-white font-medium text-sm">{tech.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      {!session && (
        <section className="py-20">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-12">
              <h2 className="text-4xl font-bold text-white mb-4">
                Ready to Get Started?
              </h2>
              <p className="text-white/80 text-lg mb-8">
                Explore our student project showcasing modern full-stack development with the MERN stack
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link 
                  href="/register" 
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg"
                >
                  Create Account
                </Link>
                <Link 
                  href="/about" 
                  className="bg-white/10 hover:bg-white/20 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 border border-white/20"
                >
                  Learn More
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="py-12 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            {/* Brand */}
            <div className="text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start space-x-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                  <span className="text-white font-bold">M</span>
                </div>
                <span className="text-white font-semibold">MERN Stack Pro</span>
              </div>
              <p className="text-white/70 text-sm">
                Modern full-stack application built with Next.js, MongoDB, and modern authentication.
              </p>
            </div>

            {/* Contact */}
            <div className="text-center">
              <h3 className="text-white font-semibold mb-4">Contact</h3>
              <div className="space-y-2 text-white/70 text-sm">
                <p>
                  <a href="mailto:info@jasskhinda.com" className="hover:text-blue-300 transition-colors">
                    info@jasskhinda.com
                  </a>
                </p>
                <p>
                  <a href="https://jasskhinda.com" target="_blank" rel="noopener noreferrer" className="hover:text-blue-300 transition-colors">
                    jasskhinda.com
                  </a>
                </p>
              </div>
            </div>

            {/* Contributors */}
            <div className="text-center md:text-right">
              <h3 className="text-white font-semibold mb-4">Contributors</h3>
              <div className="space-y-2 text-white/70 text-sm">
                <p>Jaspal Singh</p>
                <p>Paramjit Singh</p>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-white/10">
            <div className="text-white/60 text-sm mb-4 md:mb-0">
              © 2025 MERN Full-Stack Tutorial. Website built by jasskhinda.com
            </div>
            <div className="text-white/60 text-sm">
              Following MERN Full-Stack Application Development Tutorial by Aditya Saxena
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}