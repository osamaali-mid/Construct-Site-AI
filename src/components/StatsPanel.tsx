import React from 'react';
import { TrendingUp, TrendingDown, Users, Clock } from 'lucide-react';
import { usePeopleCounter } from '../context/PeopleCounterContext';

export const StatsPanel: React.FC = () => {
  const { stats } = usePeopleCounter();

  const statItems = [
    {
      label: 'People Inside',
      value: stats.currentCount,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      label: 'Total Entries',
      value: stats.totalEntries,
      icon: TrendingUp,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      label: 'Total Exits',
      value: stats.totalExits,
      icon: TrendingDown,
      color: 'text-red-600',
      bgColor: 'bg-red-100',
    },
    {
      label: 'Session Time',
      value: stats.sessionDuration,
      icon: Clock,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
  ];

  return (
    <div className="card">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Live Statistics</h2>
      
      <div className="space-y-4">
        {statItems.map((item, index) => (
          <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-lg ${item.bgColor}`}>
                <item.icon className={`w-5 h-5 ${item.color}`} />
              </div>
              <span className="text-sm font-medium text-gray-700">{item.label}</span>
            </div>
            <span className="text-lg font-bold text-gray-900">{item.value}</span>
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-700">Occupancy Rate</p>
            <p className="text-2xl font-bold text-blue-600">
              {stats.currentCount > 0 ? Math.round((stats.currentCount / 50) * 100) : 0}%
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500">Max Capacity</p>
            <p className="text-sm font-medium text-gray-700">50 people</p>
          </div>
        </div>
        
        <div className="mt-3 w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${Math.min((stats.currentCount / 50) * 100, 100)}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};