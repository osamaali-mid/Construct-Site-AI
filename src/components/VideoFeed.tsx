import React, { useRef, useEffect, useState } from 'react';
import { Camera, Play, Pause, Settings, Zap } from 'lucide-react';
import { usePeopleCounter } from '../context/PeopleCounterContext';
import { usePeopleDetection } from '../hooks/usePeopleDetection';
import { ModelSelector } from './ModelSelector';
import { DetectionConfig } from '../services/DetectionService';

export const VideoFeed: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [showModelSelector, setShowModelSelector] = useState(false);
  const [detectionConfig, setDetectionConfig] = useState<DetectionConfig>({
    modelType: 'simulation',
    confidenceThreshold: 0.5,
    nmsThreshold: 0.4,
    inputSize: 300
  });
  
  const { config } = usePeopleCounter();
  
  const { 
    isModelLoaded, 
    lastDetection, 
    processingTime, 
    modelType 
  } = usePeopleDetection({
    videoRef,
    canvasRef,
    isActive: isPlaying,
    detectionConfig
  });

  useEffect(() => {
    if (isPlaying) {
      startCamera();
    } else {
      stopCamera();
    }

    return () => {
      stopCamera();
    };
  }, [isPlaying]);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480 }
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        setStream(mediaStream);
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  const togglePlayback = () => {
    setIsPlaying(!isPlaying);
  };

  const handleModelChange = (modelType: 'tensorflow' | 'opencv' | 'simulation') => {
    setDetectionConfig(prev => ({ ...prev, modelType }));
  };
  return (
    <div className="space-y-6">
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <h2 className="text-xl font-semibold text-gray-900">Live Video Feed</h2>
            <div className="flex items-center space-x-2">
              <Zap className={`w-4 h-4 ${isModelLoaded ? 'text-green-500' : 'text-gray-400'}`} />
              <span className="text-sm text-gray-600">{modelType}</span>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={togglePlayback}
              disabled={!isModelLoaded}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                isPlaying 
                  ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                  : 'bg-green-100 text-green-700 hover:bg-green-200'
              } ${!isModelLoaded ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              <span>{isPlaying ? 'Stop' : 'Start'}</span>
            </button>
            <button 
              onClick={() => setShowModelSelector(!showModelSelector)}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
            >
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="relative bg-gray-900 rounded-lg overflow-hidden aspect-video">
          {isPlaying ? (
            <>
              <video
                ref={videoRef}
                autoPlay
                muted
                className="w-full h-full object-cover"
              />
              <canvas
                ref={canvasRef}
                className="absolute inset-0 w-full h-full pointer-events-none"
              />
              
              {/* Live Indicator */}
              <div className="absolute top-4 left-4 flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                <span className="text-white text-sm font-medium">LIVE</span>
              </div>

              {/* Detection Stats */}
              {lastDetection && (
                <div className="absolute top-4 right-4 bg-black bg-opacity-70 text-white p-2 rounded">
                  <div className="text-sm">
                    <div>People: {lastDetection.count}</div>
                    <div>Processing: {processingTime.toFixed(1)}ms</div>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-gray-400">
              <Camera className="w-16 h-16 mb-4" />
              <p className="text-lg font-medium">
                {!isModelLoaded ? 'Loading Detection Model...' : 'Camera Feed Stopped'}
              </p>
              <p className="text-sm">
                {!isModelLoaded ? 'Please wait...' : 'Click Start to begin monitoring'}
              </p>
            </div>
          )}
        </div>

        {config.showDetectionInfo && (
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <strong className="text-blue-800">Detection Status:</strong>
                <span className="ml-2 text-blue-600">
                  {isPlaying ? 'Active' : 'Inactive'}
                </span>
              </div>
              <div>
                <strong className="text-blue-800">Model:</strong>
                <span className="ml-2 text-blue-600">{modelType}</span>
              </div>
              <div>
                <strong className="text-blue-800">Confidence:</strong>
                <span className="ml-2 text-blue-600">{(detectionConfig.confidenceThreshold * 100).toFixed(0)}%</span>
              </div>
              <div>
                <strong className="text-blue-800">Processing:</strong>
                <span className="ml-2 text-blue-600">{processingTime.toFixed(1)}ms</span>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {showModelSelector && (
        <ModelSelector
          selectedModel={detectionConfig.modelType}
          onModelChange={handleModelChange}
          isModelLoaded={isModelLoaded}
        />
      )}
    </div>
  );
};
        </div>
      )}
    </div>
  );
};