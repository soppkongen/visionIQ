import React, { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { AuthProviderWrapper } from "../components/AuthProviderWrapper";
import { ProtectedRoute } from "../components/ProtectedRoute";
import { useAuth } from "../utils/AuthContext";

const CameraContent = () => {
  const navigate = useNavigate();
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Camera state
  const [cameraMode, setCameraMode] = useState<'upload' | 'live'>('upload');
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [availableCameras, setAvailableCameras] = useState<MediaDeviceInfo[]>([]);
  const [selectedCamera, setSelectedCamera] = useState<string>('');
  const [permissionState, setPermissionState] = useState<'prompt' | 'granted' | 'denied' | 'unavailable'>('prompt');

  const handleCapture = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Create image preview
    const reader = new FileReader();
    reader.onload = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Simulate analysis
    setAnalyzing(true);
    setResult(null);

    // Mock API response after a delay
    setTimeout(() => {
      setAnalyzing(false);
      setResult({
        objectName: "Coffee Mug",
        confidence: 0.972,
        attributes: [
          { name: "Material", value: "Ceramic" },
          { name: "Color", value: "White" },
          { name: "State", value: "Contains liquid" },
        ],
        boundingBox: { x: 128, y: 95, width: 256, height: 320 }
      });
    }, 2000);
  };

  const handleReset = () => {
    setImagePreview(null);
    setResult(null);
    setAnalyzing(false);
  };

  // Camera functionality
  const getAvailableCameras = async () => {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
        setPermissionState('unavailable');
        setCameraError('Camera access is not supported in this browser');
        return;
      }
      
      const devices = await navigator.mediaDevices.enumerateDevices();
      const cameras = devices.filter(device => device.kind === 'videoinput');
      setAvailableCameras(cameras);

      if (cameras.length === 0) {
        setCameraError('No camera devices detected');
        setPermissionState('unavailable');
      } else if (selectedCamera === '' && cameras.length > 0) {
        // Default to the last camera (usually the back camera on mobile)
        setSelectedCamera(cameras[cameras.length - 1].deviceId);
      }
    } catch (error) {
      console.error('Error accessing camera devices:', error);
      setCameraError('Failed to access camera devices');
      setPermissionState('unavailable');
    }
  };

  const startCamera = async () => {
    try {
      // Stop any existing stream
      if (cameraStream) {
        stopCamera();
      }
      
      // Clear any previous errors
      setCameraError(null);

      // Check if user media is supported
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setCameraError('Camera access is not supported in this browser');
        setPermissionState('unavailable');
        return;
      }

      // Set up constraints
      const constraints: MediaStreamConstraints = {
        video: selectedCamera 
          ? { deviceId: { exact: selectedCamera } }
          : true,
        audio: false
      };

      // Request permission and get stream
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      
      // Set the stream to the video element
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      
      setCameraStream(stream);
      setIsCameraActive(true);
      setPermissionState('granted');
      
      // Update available cameras now that we have permission
      getAvailableCameras();
    } catch (error: any) {
      console.error('Error starting camera:', error);
      
      if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
        setCameraError('Camera permission was denied');
        setPermissionState('denied');
      } else if (error.name === 'NotFoundError' || error.name === 'DevicesNotFoundError') {
        setCameraError('No camera device was found');
        setPermissionState('unavailable');
      } else if (error.name === 'NotReadableError' || error.name === 'TrackStartError') {
        setCameraError('Camera is already in use by another application');
        setPermissionState('unavailable');
      } else {
        setCameraError(`Error accessing camera: ${error.message || 'Unknown error'}`);
        setPermissionState('unavailable');
      }
    }
  };

  const stopCamera = () => {
    if (cameraStream) {
      // Explicitly log and stop each track
      cameraStream.getTracks().forEach(track => {
        console.log("Stopping camera track:", track.kind, track.readyState);
        track.stop();
      });
      
      setCameraStream(null);
      setIsCameraActive(false);
      
      // Reset video element
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    }
  };

  const switchCamera = (deviceId: string) => {
    setSelectedCamera(deviceId);
    // Restart camera with new device
    if (isCameraActive) {
      startCamera();
    }
  };

  const captureImage = () => {
    if (!videoRef.current || !canvasRef.current || !cameraStream) {
      setCameraError('Camera is not active');
      return;
    }

    const video = videoRef.current;
    const canvas = canvasRef.current;
    
    // Set canvas dimensions to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    // Draw video frame to canvas
    const context = canvas.getContext('2d');
    if (context) {
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      // Convert to data URL and set as image preview
      const imageDataUrl = canvas.toDataURL('image/png');
      setImagePreview(imageDataUrl);
      
      // Simulate analysis as in the file upload method
      setAnalyzing(true);
      setResult(null);
      
      // Mock API response after a delay
      setTimeout(() => {
        setAnalyzing(false);
        setResult({
          objectName: "Coffee Mug",
          confidence: 0.972,
          attributes: [
            { name: "Material", value: "Ceramic" },
            { name: "Color", value: "White" },
            { name: "State", value: "Contains liquid" },
          ],
          boundingBox: { x: 128, y: 95, width: 256, height: 320 }
        });
      }, 2000);
    }
  };

  // Initialize and clean up camera
  useEffect(() => {
    // Check if we can access camera permission status
    if (navigator.permissions && navigator.permissions.query) {
      navigator.permissions.query({ name: 'camera' as PermissionName })
        .then(permissionStatus => {
          setPermissionState(permissionStatus.state as 'prompt' | 'granted' | 'denied');
          
          // Listen for permission changes
          permissionStatus.onchange = () => {
            setPermissionState(permissionStatus.state as 'prompt' | 'granted' | 'denied');
          };
        })
        .catch(error => {
          console.error('Error checking camera permission:', error);
        });
    }
    
    // Get available cameras if possible without permission
    getAvailableCameras();
    
    // Cleanup on unmount
    return () => {
      // Ensure all camera tracks are properly stopped
      if (cameraStream) {
        cameraStream.getTracks().forEach(track => {
          console.log("Stopping track on unmount:", track.kind, track.readyState);
          track.stop();
        });
      }
      
      setCameraStream(null);
      setIsCameraActive(false);
    };
  }, [cameraStream]);
  
  // Toggle between upload and live camera modes
  const toggleCameraMode = useCallback(() => {
    if (cameraMode === 'upload') {
      setCameraMode('live');
      // Start camera after state update
      setTimeout(() => startCamera(), 0);
    } else {
      // Explicitly stop all tracks before changing mode
      if (cameraStream) {
        cameraStream.getTracks().forEach(track => {
          track.stop();
          console.log("Track stopped:", track.kind, track.readyState);
        });
      }
      setCameraMode('upload');
      setCameraStream(null);
      setIsCameraActive(false);
      
      // Reset video element
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    }
    
    // Reset any image preview and results
    setImagePreview(null);
    setResult(null);
    setAnalyzing(false);
  }, [cameraMode, cameraStream]);

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
            onClick={() => navigate("/dashboard")} 
            className="hover:text-blue-400 transition-colors duration-300"
          >
            Dashboard
          </button>
          <button 
            onClick={() => navigate("/")} 
            className="hover:text-blue-400 transition-colors duration-300"
          >
            Home
          </button>
        </nav>
      </header>

      <main className="container mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold mb-8">Object Identification</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Camera/Preview Section */}
          <div className="lg:col-span-3 bg-gray-800 border border-gray-700 rounded-lg p-6">
            <div className="aspect-video bg-gray-900 rounded-lg mb-6 flex items-center justify-center overflow-hidden relative">
              {/* Live Camera Feed */}
              {cameraMode === 'live' && (
                <>
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    className={`w-full h-full object-cover ${imagePreview ? 'hidden' : ''}`}
                    onPlay={() => console.log("Video stream started")}
                  />
                  <canvas ref={canvasRef} className="hidden" />
                  
                  {!isCameraActive && permissionState !== 'granted' && (
                    <div className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center z-10">
                      <div className="text-center max-w-md p-6 bg-gray-800 rounded-lg border border-gray-700">
                        {permissionState === 'prompt' && (
                          <>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto mb-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                            </svg>
                            <h3 className="text-xl font-bold mb-2">Camera Permission Required</h3>
                            <p className="text-gray-400 mb-4">VisionIQ needs access to your camera to identify objects in real-time.</p>
                            <button
                              onClick={startCamera}
                              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md font-medium transition-colors duration-300"
                            >
                              Allow Camera Access
                            </button>
                          </>
                        )}
                        
                        {permissionState === 'denied' && (
                          <>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto mb-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                            <h3 className="text-xl font-bold mb-2">Camera Access Denied</h3>
                            <p className="text-gray-400 mb-4">You've denied camera access. Please enable camera permissions in your browser settings.</p>
                          </>
                        )}
                        
                        {permissionState === 'unavailable' && (
                          <>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto mb-4 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                            <h3 className="text-xl font-bold mb-2">Camera Unavailable</h3>
                            <p className="text-gray-400 mb-4">{cameraError || 'Camera is not available on this device or browser.'}</p>
                          </>
                        )}
                      </div>
                    </div>
                  )}
                  
                  {/* Camera active indicator */}
                  {isCameraActive && !imagePreview && (
                    <div className="absolute top-4 right-4 flex items-center bg-black bg-opacity-50 px-2 py-1 rounded-md">
                      <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse mr-2"></div>
                      <span className="text-xs font-mono">LIVE</span>
                    </div>
                  )}
                </>
              )}
              
              {/* Image Preview Area (shown for both modes) */}
              {!imagePreview && cameraMode === 'upload' ? (
                <div className="text-center p-8">
                  <div className="w-20 h-20 mx-auto mb-4 opacity-40">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-full w-full" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    </svg>
                  </div>
                  <p className="text-gray-400">Upload an image to identify objects</p>
                </div>
              ) : (
                <>
                  <img 
                    src={imagePreview} 
                    alt="Preview" 
                    className="w-full h-full object-contain" 
                  />
                  {result && (
                    <div 
                      className="absolute border-2 border-blue-500 flex items-center justify-center"
                      style={{
                        left: `${result.boundingBox.x}px`,
                        top: `${result.boundingBox.y}px`,
                        width: `${result.boundingBox.width}px`,
                        height: `${result.boundingBox.height}px`,
                      }}
                    >
                      <div 
                        className="absolute -top-7 left-0 bg-blue-600 text-white text-xs font-mono px-2 py-1 rounded-md"
                      >
                        {result.objectName} ({Math.round(result.confidence * 100)}%)
                      </div>
                    </div>
                  )}
                </>
              )}
              {analyzing && (
                <div className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center">
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 border-t-4 border-blue-500 border-solid rounded-full animate-spin mb-4"></div>
                    <p className="text-blue-400 font-mono">analyzing image...</p>
                  </div>
                </div>
              )}
            </div>

            <div className="flex flex-wrap gap-4">
              {/* Mode toggle button */}
              <button
                onClick={toggleCameraMode}
                disabled={analyzing}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-md font-medium transition-colors duration-300 flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {cameraMode === 'upload' ? (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    <span>Use Camera</span>
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>Upload Image</span>
                  </>
                )}
              </button>

              {/* Upload Mode Controls */}
              {cameraMode === 'upload' && (
                <>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                  />
                  <button
                    onClick={handleCapture}
                    disabled={analyzing}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md font-medium transition-colors duration-300 flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    </svg>
                    <span>Upload Image</span>
                  </button>
                </>
              )}

              {/* Live Camera Mode Controls */}
              {cameraMode === 'live' && isCameraActive && !imagePreview && (
                <>
                  <button
                    onClick={captureImage}
                    disabled={analyzing || !isCameraActive}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md font-medium transition-colors duration-300 flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    </svg>
                    <span>Capture Image</span>
                  </button>

                  {/* Camera switching */}
                  {availableCameras.length > 1 && (
                    <div className="relative group">
                      <button
                        className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-md font-medium transition-colors duration-300 flex items-center space-x-2"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                        </svg>
                        <span>Switch Camera</span>
                      </button>
                      <div className="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-gray-800 border border-gray-700 invisible group-hover:visible">
                        <div className="py-1">
                          {availableCameras.map(camera => (
                            <button
                              key={camera.deviceId}
                              onClick={() => switchCamera(camera.deviceId)}
                              className={`block w-full text-left px-4 py-2 text-sm ${selectedCamera === camera.deviceId ? 'bg-gray-700 text-blue-400' : 'text-gray-300 hover:bg-gray-700'}`}
                            >
                              {camera.label || `Camera ${availableCameras.indexOf(camera) + 1}`}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* Reset button (shown when an image is captured) */}
              {imagePreview && (
                <button
                  onClick={handleReset}
                  className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-md font-medium transition-colors duration-300 flex items-center space-x-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  <span>Reset</span>
                </button>
              )}
            </div>
          </div>

          {/* Results Section */}
          <div className="lg:col-span-2">
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 mb-6">
              <h2 className="text-xl font-bold mb-4 font-mono">Results</h2>
              
              {!result && !analyzing ? (
                <div className="text-gray-400 text-center py-8">
                  <p>Upload an image to see identification results</p>
                </div>
              ) : analyzing ? (
                <div className="text-gray-400 text-center py-8">
                  <p>Analyzing image...</p>
                </div>
              ) : (
                <div>
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg text-blue-400 font-mono">{result.objectName}</h3>
                      <span className="bg-blue-900/50 text-blue-300 text-xs px-2 py-1 rounded font-mono">
                        {(result.confidence * 100).toFixed(1)}% confidence
                      </span>
                    </div>
                    <div className="w-full bg-gray-700 h-2 rounded-full overflow-hidden">
                      <div 
                        className="bg-gradient-to-r from-blue-400 to-blue-600 h-full rounded-full" 
                        style={{ width: `${result.confidence * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="border-t border-gray-700 pt-4">
                    <h4 className="text-sm uppercase tracking-wider text-gray-400 mb-3">Attributes</h4>
                    <div className="space-y-2">
                      {result.attributes.map((attr: any, index: number) => (
                        <div key={index} className="flex justify-between items-center">
                          <span className="text-sm text-gray-300">{attr.name}:</span>
                          <span className="text-sm font-mono text-blue-300">{attr.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {result && (
              <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
                <h2 className="text-xl font-bold mb-4 font-mono">Actions</h2>
                <div className="space-y-2">
                  <button className="w-full text-left px-4 py-3 bg-gray-700 hover:bg-gray-600 rounded-md font-medium transition-colors duration-300 flex items-center space-x-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                    </svg>
                    <span>Save Result</span>
                  </button>
                  <button className="w-full text-left px-4 py-3 bg-gray-700 hover:bg-gray-600 rounded-md font-medium transition-colors duration-300 flex items-center space-x-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                    </svg>
                    <span>Export Data</span>
                  </button>
                  <button className="w-full text-left px-4 py-3 bg-gray-700 hover:bg-gray-600 rounded-md font-medium transition-colors duration-300 flex items-center space-x-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 21h7a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v11m0 5l4.879-4.879m0 0a3 3 0 104.243-4.242 3 3 0 00-4.243 4.242z" />
                    </svg>
                    <span>View Similar Objects</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

const Camera = () => {
  return (
    <AuthProviderWrapper>
      <ProtectedRoute>
        <CameraContent />
      </ProtectedRoute>
    </AuthProviderWrapper>
  );
};

export default Camera;
