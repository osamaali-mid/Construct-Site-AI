import React, { useRef, useEffect, useState } from 'react';
import { Camera, Play, Pause, Settings } from 'lucide-react';
import { usePeopleCounter } from '../context/PeopleCounterContext';

export const VideoFeed: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const { updateCount, config } = usePeopleCounter();

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
        
        // Simulate people detection (in real implementation, this would use computer vision)
        const interval = setInterval(() => {
          const randomEntry = Math.random() > 0.7;
          const randomExit = Math.random() > 0.8;
          
          if (randomEntry) {
            updateCount('enter');
          }
          if (randomExit) {
            updateCount('exit');
          }
        }, 3000);

        return () => clearInterval(interval);
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

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-900">Live Video Feed</h2>
        <div className="flex items-center space-x-2">
          <button
            onClick={togglePlayback}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              isPlaying 
                ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                : 'bg-green-100 text-green-700 hover:bg-green-200'
            }`}
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            <span>{isPlaying ? 'Stop' : 'Start'}</span>
          </button>
          <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg">
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
              className="absolute inset-0 w-full h-full"
            />
            
            {/* Detection Line */}
            <div className="absolute inset-x-0 top-1/2 h-0.5 bg-yellow-400 opacity-80">
              <div className="absolute -top-6 left-4 text-yellow-400 text-sm font-medium">
                Detection Line
              </div>
            </div>

            {/* Live Indicator */}
            <div className="absolute top-4 left-4 flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
              <span className="text-white text-sm font-medium">LIVE</span>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-gray-400">
            <Camera className="w-16 h-16 mb-4" />
            <p className="text-lg font-medium">Camera Feed Stopped</p>
            <p className="text-sm">Click Start to begin monitoring</p>
          </div>
        )}
      </div>

      {config.showDetectionInfo && (
        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>Detection Status:</strong> {isPlaying ? 'Active - Monitoring for people' : 'Inactive'}
          </p>
          <p className="text-xs text-blue-600 mt-1">
            People crossing the yellow line will be counted automatically
          </p>
        </div>
      )}
    </div>
  );
};