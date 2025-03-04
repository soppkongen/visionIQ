import React from "react";
import { useNavigate } from "react-router-dom";
import { AuthProviderWrapper } from "../components/AuthProviderWrapper";
import { ProtectedRoute } from "../components/ProtectedRoute";
import { useAuth } from "../utils/AuthContext";

const DashboardContent = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  return (
    <div className="bg-gray-900 text-gray-100 min-h-screen">
      {/* Header */}
      <header className="container mx-auto px-4 py-6 flex justify-between items-center border-b border-gray-800">
        <div className="flex items-center space-x-2">
          <div className="w-10 h-10 bg-blue-500 rounded-md flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
            </svg>
          </div>
          <span className="text-xl font-bold font-mono tracking-tight">VisionIQ</span>
        </div>
        <nav className="flex space-x-6 items-center">
          <button 
            onClick={() => navigate("/")} 
            className="hover:text-blue-400 transition-colors duration-300"
          >
            Home
          </button>
          <button 
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md transition-colors duration-300"
            onClick={() => navigate("/camera")}
          >
            Open Camera
          </button>
        </nav>
      </header>

      <main className="container mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold mb-8">Your Dashboard</h1>
        
        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
          <div className="bg-gray-800 border border-gray-700 p-6 rounded-lg">
            <h3 className="text-lg font-mono text-gray-400 mb-2">Identifications</h3>
            <p className="text-3xl font-bold text-blue-400">0</p>
          </div>
          <div className="bg-gray-800 border border-gray-700 p-6 rounded-lg">
            <h3 className="text-lg font-mono text-gray-400 mb-2">Saved Results</h3>
            <p className="text-3xl font-bold text-blue-400">0</p>
          </div>
          <div className="bg-gray-800 border border-gray-700 p-6 rounded-lg">
            <h3 className="text-lg font-mono text-gray-400 mb-2">Avg. Accuracy</h3>
            <p className="text-3xl font-bold text-blue-400">0%</p>
          </div>
          <div className="bg-gray-800 border border-gray-700 p-6 rounded-lg">
            <h3 className="text-lg font-mono text-gray-400 mb-2">API Quota</h3>
            <p className="text-3xl font-bold text-green-400">100%</p>
          </div>
        </div>

        {/* Empty state */}
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-10 text-center">
          <div className="w-20 h-20 mx-auto mb-6 opacity-40">
            <div 
              className="w-full h-full bg-blue-500 opacity-50 flex items-center justify-center"
              style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }}
            ></div>
          </div>
          <h2 className="text-2xl font-bold mb-2">No Vision Data Yet</h2>
          <p className="text-gray-400 max-w-md mx-auto mb-6">
            You haven't identified any objects yet. Use the camera to start identifying objects in your environment.
          </p>
          <button 
            onClick={() => navigate("/camera")} 
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-md font-medium transition-colors duration-300 inline-flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
            </svg>
            Open Camera
          </button>
        </div>
      </main>
    </div>
  );
};

const Dashboard = () => {
  return (
    <AuthProviderWrapper>
      <ProtectedRoute>
        <DashboardContent />
      </ProtectedRoute>
    </AuthProviderWrapper>
  );
};

export default Dashboard;
