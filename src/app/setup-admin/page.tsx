"use client";

import { useState } from "react";

export default function SetupAdminPage() {
  const [result, setResult] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const createAdmin = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/create-admin");
      const data = await response.json();
      setResult(JSON.stringify(data, null, 2));
    } catch (error) {
      setResult(`Error: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">🛡️ Admin Account Setup</h1>
        
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 mb-6">
          <p className="text-white/80 mb-4">
            Click the button below to create the admin account in the database.
          </p>
          
          <button
            onClick={createAdmin}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition-colors disabled:opacity-50"
          >
            {loading ? "Creating Admin..." : "Create Admin Account"}
          </button>
        </div>

        {result && (
          <div className="bg-gray-800/50 border border-gray-600 rounded-xl p-6">
            <h2 className="text-xl font-semibold mb-4">Result:</h2>
            <pre className="text-green-300 text-sm overflow-auto">{result}</pre>
          </div>
        )}

        <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-xl p-6 mt-6">
          <h3 className="text-yellow-300 font-semibold mb-2">Admin Credentials:</h3>
          <p className="text-yellow-200">📧 Email: admin@mernstack.com</p>
          <p className="text-yellow-200">🔑 Password: Admin@123!</p>
        </div>
      </div>
    </div>
  );
}