import React from "react";
import { useNavigate } from "react-router-dom";
import { AuthProviderWrapper } from "../components/AuthProviderWrapper";
import { useAuth } from "../utils/AuthContext";

function AppContent() {
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();
  
  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Failed to log out", error);
    }
  };

  return (
    <div className="bg-gray-900 text-gray-100 min-h-screen">
      {/* Header */}
      <header className="container mx-auto px-4 py-6 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <div className="w-10 h-10 bg-blue-500 rounded-md flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
            </svg>
          </div>
          <span className="text-xl font-bold font-mono tracking-tight">VisionIQ</span>
        </div>
        <nav className="hidden md:flex space-x-6">
          {currentUser ? (
            <>
              <button 
                onClick={() => navigate("/dashboard")} 
                className="hover:text-blue-400 transition-colors duration-300"
              >
                Dashboard
              </button>
              <button 
                onClick={() => navigate("/camera")} 
                className="hover:text-blue-400 transition-colors duration-300"
              >
                Camera
              </button>
              <button 
                onClick={handleLogout} 
                className="px-4 py-1 rounded-md bg-blue-600 hover:bg-blue-700 transition-colors duration-300"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <a href="#features" className="hover:text-blue-400 transition-colors duration-300">Features</a>
              <a href="#about" className="hover:text-blue-400 transition-colors duration-300">About</a>
              <button 
                onClick={() => navigate("/login")} 
                className="px-4 py-1 rounded-md bg-blue-600 hover:bg-blue-700 transition-colors duration-300"
              >
                Login
              </button>
            </>
          )}
        </nav>
        <button className="md:hidden">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </header>

      <main className="container mx-auto px-4">
        {/* Hero Section */}
        <section className="py-20 flex flex-col items-center justify-center text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
            Advanced <span className="text-blue-500">AI Vision</span> Technology
          </h1>
          <p className="text-xl md:text-2xl max-w-3xl mb-10 text-gray-300 font-light">
            Identify objects with precision and accuracy using your device's camera and our state-of-the-art AI vision technology.
          </p>
          
          {/* Technical UI Element */}
          <div className="relative w-full max-w-3xl mx-auto mb-16">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-20 rounded-md blur-xl"></div>
            <div className="relative bg-gray-800 border border-gray-700 p-1 rounded-md overflow-hidden">
              <div className="grid grid-cols-3 gap-1">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="aspect-video bg-gray-900 rounded flex items-center justify-center overflow-hidden">
                    <div style={{ width: '60px', height: '60px', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-purple-500 opacity-80 flex items-center justify-center"
                        style={{ 
                          width: '100%', 
                          height: '60px', 
                          position: 'relative',
                          clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          transform: 'rotate(0deg)'
                        }}
                      >
                        <span className="font-mono text-xs opacity-80">{`ID:${(i + 101).toString(16).toUpperCase()}`}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex justify-between items-center mt-1 px-2 py-1 border-t border-gray-700">
                <div className="text-xs font-mono text-gray-400">processing frames: <span className="text-green-400">active</span></div>
                <div className="text-xs font-mono text-blue-400">confidence: 97.2%</div>
              </div>
            </div>
          </div>

          <button 
            onClick={() => currentUser ? navigate("/camera") : navigate("/login")} 
            className="px-8 py-4 bg-blue-600 hover:bg-blue-700 rounded-md font-medium text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            {currentUser ? "Launch Camera" : "Try VisionIQ Now"}
          </button>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20">
          <h2 className="text-3xl md:text-4xl font-bold mb-16 text-center">Advanced Capabilities</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[      {        title: "Precision Identification",        description: "Our advanced AI algorithms can identify thousands of objects with high accuracy and confidence scores.",        icon: (                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />                  </svg>                )              },              {                title: "Real-time Analysis",                description: "Get instant feedback as our system processes images in real-time with detailed technical information.",                icon: (                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />                  </svg>                )              },              {                title: "Cross-device Compatibility",                description: "Access VisionIQ from any device with a camera, with a consistent and optimized experience.",                icon: (                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />                  </svg>                )              }            ].map((feature, index) => (              <div key={index} className="bg-gray-800 border border-gray-700 rounded-lg p-6 hover:border-blue-500 transition-colors duration-300">                <div className="text-blue-500 mb-4">{feature.icon}</div>                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>                <p className="text-gray-400">{feature.description}</p>              </div>            ))}          </div>        </section>

        {/* Waitlist and Pre-purchase Section */}
        <section className="py-20 border-t border-gray-800">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">Early Access <span className="text-blue-500">Programs</span></h2>
            <p className="text-xl text-center text-gray-300 mb-12 max-w-2xl mx-auto">
              Join our waitlist or secure early access with exclusive pre-purchase packages.
            </p>
            
            {/* Waitlist Signup */}
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-8 mb-12">
              <h3 className="text-2xl font-bold mb-4">Join the Waitlist</h3>
              <p className="text-gray-400 mb-6">Be the first to know when VisionIQ launches. No spam, just important updates.</p>
              
              <div className="flex flex-col md:flex-row gap-4">
                <input 
                  type="email" 
                  placeholder="Enter your email" 
                  className="flex-grow px-4 py-3 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                />
                <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-md font-medium transition-colors duration-300">
                  Join Waitlist
                </button>
              </div>
            </div>
            
            {/* Pre-purchase Options */}
            <h3 className="text-2xl font-bold mb-8 text-center">Pre-Purchase Packages</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Basic Package */}
              <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 hover:border-blue-500 transition-all duration-300 flex flex-col">
                <div className="mb-4">
                  <div 
                    className="w-16 h-16 mb-4 bg-gradient-to-r from-blue-400 to-blue-600 opacity-80 flex items-center justify-center mx-auto"
                    style={{ 
                      clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
                    }}
                  >
                    <span className="font-mono font-bold">BASIC</span>
                  </div>
                  <h4 className="text-xl font-bold text-center mb-2">Starter</h4>
                  <div className="text-center mb-4">
                    <span className="text-3xl font-bold">$49</span>
                    <span className="text-gray-400"> / year</span>
                  </div>
                </div>
                <ul className="space-y-3 mb-8 flex-grow">
                  <li className="flex items-center">
                    <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Basic object identification</span>
                  </li>
                  <li className="flex items-center">
                    <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>100 identifications/month</span>
                  </li>
                  <li className="flex items-center">
                    <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Standard accuracy</span>
                  </li>
                </ul>
                <button className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-md font-medium transition-colors duration-300 mt-auto">
                  Pre-order Now
                </button>
              </div>
              
              {/* Pro Package */}
              <div className="bg-gray-800 border-2 border-blue-500 rounded-lg p-6 transition-all duration-300 flex flex-col transform scale-105 shadow-lg shadow-blue-900/20">
                <div className="absolute -top-3 left-0 right-0 flex justify-center">
                  <span className="bg-blue-600 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">Most Popular</span>
                </div>
                <div className="mb-4 pt-2">
                  <div 
                    className="w-16 h-16 mb-4 bg-gradient-to-r from-purple-400 to-purple-600 opacity-80 flex items-center justify-center mx-auto"
                    style={{ 
                      clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
                    }}
                  >
                    <span className="font-mono font-bold">PRO</span>
                  </div>
                  <h4 className="text-xl font-bold text-center mb-2">Professional</h4>
                  <div className="text-center mb-4">
                    <span className="text-3xl font-bold">$99</span>
                    <span className="text-gray-400"> / year</span>
                  </div>
                </div>
                <ul className="space-y-3 mb-8 flex-grow">
                  <li className="flex items-center">
                    <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Advanced object identification</span>
                  </li>
                  <li className="flex items-center">
                    <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>500 identifications/month</span>
                  </li>
                  <li className="flex items-center">
                    <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>High accuracy models</span>
                  </li>
                  <li className="flex items-center">
                    <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Export & history features</span>
                  </li>
                </ul>
                <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md font-medium transition-colors duration-300 mt-auto">
                  Pre-order Now
                </button>
              </div>
              
              {/* Enterprise Package */}
              <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 hover:border-blue-500 transition-all duration-300 flex flex-col">
                <div className="mb-4">
                  <div 
                    className="w-16 h-16 mb-4 bg-gradient-to-r from-indigo-400 to-indigo-600 opacity-80 flex items-center justify-center mx-auto"
                    style={{ 
                      clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
                    }}
                  >
                    <span className="font-mono font-bold">ENT</span>
                  </div>
                  <h4 className="text-xl font-bold text-center mb-2">Enterprise</h4>
                  <div className="text-center mb-4">
                    <span className="text-3xl font-bold">$199</span>
                    <span className="text-gray-400"> / year</span>
                  </div>
                </div>
                <ul className="space-y-3 mb-8 flex-grow">
                  <li className="flex items-center">
                    <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Premium object identification</span>
                  </li>
                  <li className="flex items-center">
                    <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Unlimited identifications</span>
                  </li>
                  <li className="flex items-center">
                    <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Highest accuracy models</span>
                  </li>
                  <li className="flex items-center">
                    <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Advanced analytics & API access</span>
                  </li>
                  <li className="flex items-center">
                    <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Priority support</span>
                  </li>
                </ul>
                <button className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-md font-medium transition-colors duration-300 mt-auto">
                  Contact Sales
                </button>
              </div>
            </div>
          </div>
        </section>
        
        {/* Technical Specs Section */}
        <section id="about" className="py-20 border-t border-gray-800">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">Technical Specifications</h2>
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 font-mono">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border-b border-gray-700 pb-3">
                  <span className="text-gray-400 text-sm">Model Architecture</span>
                  <div className="text-blue-400">Advanced CNN + Transformer</div>
                </div>
                <div className="border-b border-gray-700 pb-3">
                  <span className="text-gray-400 text-sm">Response Time</span>
                  <div className="text-blue-400">~450ms</div>
                </div>
                <div className="border-b border-gray-700 pb-3">
                  <span className="text-gray-400 text-sm">Object Classes</span>
                  <div className="text-blue-400">10,000+</div>
                </div>
                <div className="border-b border-gray-700 pb-3">
                  <span className="text-gray-400 text-sm">Average Confidence</span>
                  <div className="text-blue-400">94.7%</div>
                </div>
                <div className="border-b border-gray-700 pb-3">
                  <span className="text-gray-400 text-sm">Frameworks</span>
                  <div className="text-blue-400">TensorFlow, PyTorch, OpenCV</div>
                </div>
                <div className="border-b border-gray-700 pb-3">
                  <span className="text-gray-400 text-sm">API Latency</span>
                  <div className="text-blue-400">~200ms</div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 py-10 border-t border-gray-700">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                </svg>
              </div>
              <span className="font-bold font-mono">VisionIQ</span>
            </div>
            <div className="text-gray-400 text-sm">
              © {new Date().getFullYear()} VisionIQ. All rights reserved.
            </div>
          </div>
        </div>
      </footer>

      {/* Using inline styles for hexagon shapes */}
    </div>
  );
}

export default function App() {
  return (
    <AuthProviderWrapper>
      <AppContent />
    </AuthProviderWrapper>
  );
}
