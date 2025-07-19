export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 text-white">
      <div className="max-w-4xl mx-auto px-6 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-white mb-6">About This Project</h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            A comprehensive MERN Full-Stack application developed as a collaborative learning project
          </p>
        </div>

        {/* Project Overview */}
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-8 mb-8">
          <h2 className="text-3xl font-semibold text-white mb-6">🚀 Project Overview</h2>
          <p className="text-white/90 text-lg leading-relaxed mb-6">
            This is a project we used to learn and implement modern web development technologies. 
            We followed a comprehensive tutorial to build a full-stack MERN application using Next.js 15, 
            MongoDB Atlas, NextAuth.js, and Tailwind CSS.
          </p>
          <p className="text-white/90 text-lg leading-relaxed">
            The application demonstrates key concepts including user authentication, role-based access control, 
            database integration, responsive design, and modern UI/UX principles.
          </p>
        </div>

        {/* Team Members */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-8">
            <div className="text-center">
              <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-3xl">J</span>
              </div>
              <h3 className="text-2xl font-semibold text-white mb-2">Jaspal Singh</h3>
              <p className="text-white/70 mb-4">Frontend Developer & UI Designer</p>
              <p className="text-white/90 text-sm leading-relaxed">
                Designed the project style and handled the frontend development. 
                Focused on creating a modern, professional user interface with 
                responsive design and intuitive user experience.
              </p>
              <div className="mt-4 flex flex-wrap gap-2 justify-center">
                <span className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-xs">React</span>
                <span className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-xs">Next.js</span>
                <span className="px-3 py-1 bg-green-500/20 text-green-300 rounded-full text-xs">Tailwind CSS</span>
                <span className="px-3 py-1 bg-orange-500/20 text-orange-300 rounded-full text-xs">UI/UX</span>
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-8">
            <div className="text-center">
              <div className="w-24 h-24 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-3xl">P</span>
              </div>
              <h3 className="text-2xl font-semibold text-white mb-2">Paramjit Singh</h3>
              <p className="text-white/70 mb-4">Backend Developer & Database Specialist</p>
              <p className="text-white/90 text-sm leading-relaxed">
                Handled the database implementation and backend development. 
                Responsible for MongoDB integration, user authentication systems, 
                API development, and server-side functionality.
              </p>
              <div className="mt-4 flex flex-wrap gap-2 justify-center">
                <span className="px-3 py-1 bg-green-500/20 text-green-300 rounded-full text-xs">MongoDB</span>
                <span className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-xs">Node.js</span>
                <span className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-xs">NextAuth.js</span>
                <span className="px-3 py-1 bg-orange-500/20 text-orange-300 rounded-full text-xs">API Development</span>
              </div>
            </div>
          </div>
        </div>

        {/* Collaboration */}
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-8 mb-8">
          <h2 className="text-3xl font-semibold text-white mb-6">🤝 Collaboration Approach</h2>
          <p className="text-white/90 text-lg leading-relaxed mb-6">
            We worked on this assignment as a group, combining our individual strengths to create 
            a comprehensive full-stack application. Our collaborative approach ensured that both 
            frontend and backend components were seamlessly integrated.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white/5 rounded-lg p-4 border border-white/10">
              <h4 className="text-white font-semibold mb-2">🎨 Frontend Focus</h4>
              <p className="text-white/80 text-sm">
                Modern UI design, responsive layouts, user experience optimization, 
                and interactive components using React and Tailwind CSS.
              </p>
            </div>
            <div className="bg-white/5 rounded-lg p-4 border border-white/10">
              <h4 className="text-white font-semibold mb-2">🔧 Backend Focus</h4>
              <p className="text-white/80 text-sm">
                Database design, authentication systems, API endpoints, 
                data security, and server-side logic implementation.
              </p>
            </div>
          </div>
        </div>

        {/* Technologies Used */}
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-8 mb-8">
          <h2 className="text-3xl font-semibold text-white mb-6">⚙️ Technologies Used</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: 'Next.js 15', category: 'Frontend Framework' },
              { name: 'MongoDB Atlas', category: 'Database' },
              { name: 'NextAuth.js', category: 'Authentication' },
              { name: 'Tailwind CSS', category: 'Styling' },
              { name: 'TypeScript', category: 'Language' },
              { name: 'React', category: 'UI Library' },
              { name: 'Vercel', category: 'Deployment' },
              { name: 'bcrypt', category: 'Security' },
            ].map((tech, index) => (
              <div key={index} className="bg-white/5 rounded-lg p-4 text-center border border-white/10">
                <h4 className="text-white font-medium text-sm mb-1">{tech.name}</h4>
                <p className="text-white/60 text-xs">{tech.category}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Learning Outcomes */}
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-8">
          <h2 className="text-3xl font-semibold text-white mb-6">📚 Learning Outcomes</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-white font-semibold mb-3">Technical Skills Gained:</h4>
              <ul className="text-white/90 space-y-2">
                <li className="flex items-center"><span className="text-green-400 mr-2">✓</span> Full-stack web development</li>
                <li className="flex items-center"><span className="text-green-400 mr-2">✓</span> Modern React patterns</li>
                <li className="flex items-center"><span className="text-green-400 mr-2">✓</span> Database integration</li>
                <li className="flex items-center"><span className="text-green-400 mr-2">✓</span> Authentication systems</li>
                <li className="flex items-center"><span className="text-green-400 mr-2">✓</span> Responsive design</li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-3">Soft Skills Developed:</h4>
              <ul className="text-white/90 space-y-2">
                <li className="flex items-center"><span className="text-blue-400 mr-2">✓</span> Team collaboration</li>
                <li className="flex items-center"><span className="text-blue-400 mr-2">✓</span> Project management</li>
                <li className="flex items-center"><span className="text-blue-400 mr-2">✓</span> Problem-solving</li>
                <li className="flex items-center"><span className="text-blue-400 mr-2">✓</span> Code organization</li>
                <li className="flex items-center"><span className="text-blue-400 mr-2">✓</span> Documentation</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}