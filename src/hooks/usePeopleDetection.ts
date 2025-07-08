import { useEffect, useRef, useState, useCallback } from 'react';
import { DetectionService, DetectionResult, DetectionConfig } from '../services/DetectionService';
import { usePeopleCounter } from '../context/PeopleCounterContext';

interface UsePeopleDetectionProps {
  videoRef: React.RefObject<HTMLVideoElement>;
  canvasRef: React.RefObject<HTMLCanvasElement>;
  isActive: boolean;
  detectionConfig: DetectionConfig;
}

export const usePeopleDetection = ({
  videoRef,
  canvasRef,
  isActive,
  detectionConfig
}: UsePeopleDetectionProps) => {
  const [detectionService] = useState(() => new DetectionService(detectionConfig));
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const [lastDetection, setLastDetection] = useState<DetectionResult | null>(null);
  const [processingTime, setProcessingTime] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout>();
  const previousCountRef = useRef(0);
  
  const { updateCount } = usePeopleCounter();

  // Load the detection model
  useEffect(() => {
    const loadModel = async () => {
      const loaded = await detectionService.loadModel();
      setIsModelLoaded(loaded);
    };
    
    loadModel();
  }, [detectionService]);

  // Process video frame for detection
  const processFrame = useCallback(async () => {
    if (!videoRef.current || !canvasRef.current || !isModelLoaded) {
      return;
    }

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    if (!ctx || video.videoWidth === 0 || video.videoHeight === 0) {
      return;
    }

    // Set canvas size to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw video frame to canvas
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    try {
      const startTime = performance.now();
      
      // Get image data from canvas
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      
      // Run detection
      const detection = await detectionService.detectPeople(imageData);
      
      const endTime = performance.now();
      setProcessingTime(endTime - startTime);
      setLastDetection(detection);

      // Draw detection results
      drawDetections(ctx, detection, canvas.width, canvas.height);

      // Update people count based on detection
      updatePeopleCount(detection.count);

    } catch (error) {
      console.error('Detection processing error:', error);
    }
  }, [videoRef, canvasRef, isModelLoaded, detectionService, updateCount]);

  // Draw detection boxes and labels
  const drawDetections = (
    ctx: CanvasRenderingContext2D,
    detection: DetectionResult,
    canvasWidth: number,
    canvasHeight: number
  ) => {
    ctx.strokeStyle = '#00ff00';
    ctx.lineWidth = 2;
    ctx.fillStyle = '#00ff00';
    ctx.font = '16px Arial';

    detection.boxes.forEach((box, index) => {
      if (box.class === 'person' && box.confidence > detectionConfig.confidenceThreshold) {
        // Draw bounding box
        ctx.strokeRect(box.x, box.y, box.width, box.height);
        
        // Draw label
        const label = `Person ${index + 1} (${(box.confidence * 100).toFixed(1)}%)`;
        const textWidth = ctx.measureText(label).width;
        
        ctx.fillStyle = '#00ff00';
        ctx.fillRect(box.x, box.y - 25, textWidth + 10, 20);
        
        ctx.fillStyle = '#000000';
        ctx.fillText(label, box.x + 5, box.y - 8);
      }
    });

    // Draw detection line
    const lineY = canvasHeight / 2;
    ctx.strokeStyle = '#ffff00';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(0, lineY);
    ctx.lineTo(canvasWidth, lineY);
    ctx.stroke();

    // Draw detection info
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(10, 10, 200, 80);
    ctx.fillStyle = '#000000';
    ctx.font = '14px Arial';
    ctx.fillText(`People Detected: ${detection.count}`, 15, 30);
    ctx.fillText(`Processing: ${processingTime.toFixed(1)}ms`, 15, 50);
    ctx.fillText(`Model: ${detectionService.getModelType()}`, 15, 70);
  };

  // Update people count based on detection changes
  const updatePeopleCount = (currentCount: number) => {
    const previousCount = previousCountRef.current;
    
    if (currentCount > previousCount) {
      // People entered
      for (let i = 0; i < currentCount - previousCount; i++) {
        updateCount('enter');
      }
    } else if (currentCount < previousCount) {
      // People exited
      for (let i = 0; i < previousCount - currentCount; i++) {
        updateCount('exit');
      }
    }
    
    previousCountRef.current = currentCount;
  };

  // Start/stop detection processing
  useEffect(() => {
    if (isActive && isModelLoaded) {
      intervalRef.current = setInterval(processFrame, 1000); // Process every second
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isActive, isModelLoaded, processFrame]);

  return {
    isModelLoaded,
    lastDetection,
    processingTime,
    modelType: detectionService.getModelType()
  };
};