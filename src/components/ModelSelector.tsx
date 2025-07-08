import React from 'react';
import { Brain, Cpu, Play } from 'lucide-react';

interface ModelSelectorProps {
  selectedModel: 'tensorflow' | 'opencv' | 'simulation';
  onModelChange: (model: 'tensorflow' | 'opencv' | 'simulation') => void;
  isModelLoaded: boolean;
}

export const ModelSelector: React.FC<ModelSelectorProps> = ({
  selectedModel,
  onModelChange,
  isModelLoaded
}) => {
  const models = [
    {
      id: 'simulation' as const,
      name: 'Simulation',
      description: 'Demo mode with simulated detection',
      icon: Play,
      available: true,
      performance: 'Fast',
      accuracy: 'Demo'
    },
    {
      id: 'tensorflow' as const,
      name: 'TensorFlow.js',
      description: 'Browser-based ML inference',
      icon: Brain,
      available: true,
      performance: 'Medium',
      accuracy: 'Good'
    },
    {
      id: 'opencv' as const,
      name: 'OpenCV.js',
      description: 'Computer vision in browser',
      icon: Cpu,
      available: true,
      performance: 'Fast',
      accuracy: 'High'
    }
  ];

  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Detection Model</h3>
      
      <div className="space-y-3">
        {models.map((model) => (
          <div
            key={model.id}
            className={`p-3 border rounded-lg cursor-pointer transition-colors ${
              selectedModel === model.id
                ? 'border-primary-500 bg-primary-50'
                : 'border-gray-200 hover:border-gray-300'
            } ${!model.available ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={() => model.available && onModelChange(model.id)}
          >
            <div className="flex items-start space-x-3">
              <div className={`p-2 rounded-lg ${
                selectedModel === model.id ? 'bg-primary-100' : 'bg-gray-100'
              }`}>
                <model.icon className={`w-5 h-5 ${
                  selectedModel === model.id ? 'text-primary-600' : 'text-gray-600'
                }`} />
              </div>
              
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-gray-900">{model.name}</h4>
                  {selectedModel === model.id && (
                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                      isModelLoaded 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {isModelLoaded ? 'Loaded' : 'Loading...'}
                    </div>
                  )}
                </div>
                
                <p className="text-sm text-gray-600 mt-1">{model.description}</p>
                
                <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                  <span>Performance: {model.performance}</span>
                  <span>Accuracy: {model.accuracy}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedModel === 'tensorflow' && (
        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>Note:</strong> TensorFlow.js models need to be hosted and loaded. 
            For production, upload your converted model files to the public/models directory.
          </p>
        </div>
      )}

      {selectedModel === 'opencv' && (
        <div className="mt-4 p-3 bg-purple-50 rounded-lg">
          <p className="text-sm text-purple-800">
            <strong>Note:</strong> OpenCV.js provides the closest functionality to the original Python implementation.
            Model files (.prototxt and .caffemodel) need to be converted for web use.
          </p>
        </div>
      )}
    </div>
  );
};