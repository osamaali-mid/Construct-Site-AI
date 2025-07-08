import React from 'react';
import { AlertTriangle, CheckCircle, Bell, X } from 'lucide-react';
import { usePeopleCounter } from '../context/PeopleCounterContext';

export const AlertsPanel: React.FC = () => {
  const { alerts, dismissAlert, config } = usePeopleCounter();

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'warning':
        return AlertTriangle;
      case 'success':
        return CheckCircle;
      default:
        return Bell;
    }
  };

  const getAlertStyles = (type: string) => {
    switch (type) {
      case 'warning':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'error':
        return 'bg-red-50 border-red-200 text-red-800';
      case 'success':
        return 'bg-green-50 border-green-200 text-green-800';
      default:
        return 'bg-blue-50 border-blue-200 text-blue-800';
    }
  };

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-900">Alerts & Notifications</h2>
        <div className="flex items-center space-x-2">
          <Bell className="w-5 h-5 text-gray-600" />
          {config.alertsEnabled && (
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          )}
        </div>
      </div>

      {alerts.length === 0 ? (
        <div className="text-center py-8">
          <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
          <p className="text-gray-600">No active alerts</p>
          <p className="text-sm text-gray-500">System is operating normally</p>
        </div>
      ) : (
        <div className="space-y-3">
          {alerts.map((alert) => {
            const Icon = getAlertIcon(alert.type);
            return (
              <div
                key={alert.id}
                className={`p-3 rounded-lg border ${getAlertStyles(alert.type)}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <Icon className="w-5 h-5 mt-0.5" />
                    <div>
                      <p className="font-medium">{alert.title}</p>
                      <p className="text-sm opacity-90">{alert.message}</p>
                      <p className="text-xs opacity-75 mt-1">{alert.timestamp}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => dismissAlert(alert.id)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Alert Threshold</span>
          <span className="font-medium text-gray-900">{config.threshold} people</span>
        </div>
        <div className="flex items-center justify-between text-sm mt-1">
          <span className="text-gray-600">Email Alerts</span>
          <span className={`font-medium ${config.emailAlerts ? 'text-green-600' : 'text-gray-400'}`}>
            {config.emailAlerts ? 'Enabled' : 'Disabled'}
          </span>
        </div>
      </div>
    </div>
  );
};