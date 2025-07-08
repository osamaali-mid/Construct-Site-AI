import React from 'react';
import { Users, Activity, Shield } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-primary-100 rounded-lg">
              <Users className="w-8 h-8 text-primary-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">People Counter</h1>
              <p className="text-sm text-gray-600">Real-time monitoring & analytics</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-green-600">
              <Activity className="w-5 h-5" />
              <span className="text-sm font-medium">Live</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-600">
              <Shield className="w-5 h-5" />
              <span className="text-sm">Secure</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};