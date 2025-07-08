import React, { useState } from 'react';
import { Settings, Save, RotateCcw } from 'lucide-react';
import { usePeopleCounter } from '../context/PeopleCounterContext';

export const ConfigPanel: React.FC = () => {
  const { config, updateConfig } = usePeopleCounter();
  const [localConfig, setLocalConfig] = useState(config);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSave = () => {
    updateConfig(localConfig);
  };

  const handleReset = () => {
    const defaultConfig = {
      threshold: 10,
      alertsEnabled: true,
      emailAlerts: false,
      showDetectionInfo: true,
      autoLog: true,
      sessionTimer: true,
    };
    setLocalConfig(defaultConfig);
    updateConfig(defaultConfig);
  };

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-900">Configuration</h2>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
        >
          <Settings className="w-5 h-5" />
        </button>
      </div>

      {isExpanded && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Alert Threshold
            </label>
            <input
              type="number"
              value={localConfig.threshold}
              onChange={(e) => setLocalConfig({
                ...localConfig,
                threshold: parseInt(e.target.value) || 0
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              min="1"
              max="100"
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">
                Enable Alerts
              </label>
              <input
                type="checkbox"
                checked={localConfig.alertsEnabled}
                onChange={(e) => setLocalConfig({
                  ...localConfig,
                  alertsEnabled: e.target.checked
                })}
                className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">
                Email Notifications
              </label>
              <input
                type="checkbox"
                checked={localConfig.emailAlerts}
                onChange={(e) => setLocalConfig({
                  ...localConfig,
                  emailAlerts: e.target.checked
                })}
                className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">
                Show Detection Info
              </label>
              <input
                type="checkbox"
                checked={localConfig.showDetectionInfo}
                onChange={(e) => setLocalConfig({
                  ...localConfig,
                  showDetectionInfo: e.target.checked
                })}
                className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">
                Auto Logging
              </label>
              <input
                type="checkbox"
                checked={localConfig.autoLog}
                onChange={(e) => setLocalConfig({
                  ...localConfig,
                  autoLog: e.target.checked
                })}
                className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">
                Session Timer
              </label>
              <input
                type="checkbox"
                checked={localConfig.sessionTimer}
                onChange={(e) => setLocalConfig({
                  ...localConfig,
                  sessionTimer: e.target.checked
                })}
                className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
              />
            </div>
          </div>

          <div className="flex space-x-2 pt-4 border-t border-gray-200">
            <button
              onClick={handleSave}
              className="flex-1 flex items-center justify-center space-x-2 btn-primary"
            >
              <Save className="w-4 h-4" />
              <span>Save</span>
            </button>
            <button
              onClick={handleReset}
              className="flex items-center justify-center space-x-2 btn-secondary"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset</span>
            </button>
          </div>
        </div>
      )}

      {!isExpanded && (
        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex justify-between">
            <span>Threshold:</span>
            <span className="font-medium">{config.threshold} people</span>
          </div>
          <div className="flex justify-between">
            <span>Alerts:</span>
            <span className={`font-medium ${config.alertsEnabled ? 'text-green-600' : 'text-gray-400'}`}>
              {config.alertsEnabled ? 'On' : 'Off'}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Auto Log:</span>
            <span className={`font-medium ${config.autoLog ? 'text-green-600' : 'text-gray-400'}`}>
              {config.autoLog ? 'On' : 'Off'}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};