import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Calendar, Download, TrendingUp } from 'lucide-react';
import { usePeopleCounter } from '../context/PeopleCounterContext';

export const AnalyticsPanel: React.FC = () => {
  const { analytics } = usePeopleCounter();
  const [activeTab, setActiveTab] = useState<'hourly' | 'daily'>('hourly');

  const tabs = [
    { id: 'hourly', label: 'Hourly', icon: TrendingUp },
    { id: 'daily', label: 'Daily', icon: Calendar },
  ];

  const exportData = () => {
    const data = activeTab === 'hourly' ? analytics.hourlyData : analytics.dailyData;
    const csv = [
      ['Time', 'Entries', 'Exits', 'Peak Count'],
      ...data.map(item => [item.time, item.entries, item.exits, item.peak])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `people-counter-${activeTab}-data.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Analytics Dashboard</h2>
        <button
          onClick={exportData}
          className="flex items-center space-x-2 btn-secondary"
        >
          <Download className="w-4 h-4" />
          <span>Export Data</span>
        </button>
      </div>

      <div className="flex space-x-1 mb-6 bg-gray-100 p-1 rounded-lg">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as 'hourly' | 'daily')}
            className={`flex-1 flex items-center justify-center space-x-2 py-2 px-4 rounded-md font-medium transition-colors ${
              activeTab === tab.id
                ? 'bg-white text-primary-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Traffic Flow</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={activeTab === 'hourly' ? analytics.hourlyData : analytics.dailyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="entries" 
                  stroke="#10b981" 
                  strokeWidth={2}
                  name="Entries"
                />
                <Line 
                  type="monotone" 
                  dataKey="exits" 
                  stroke="#ef4444" 
                  strokeWidth={2}
                  name="Exits"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Peak Occupancy</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={activeTab === 'hourly' ? analytics.hourlyData : analytics.dailyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="peak" fill="#3b82f6" name="Peak Count" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-800">Total Entries Today</p>
              <p className="text-2xl font-bold text-green-900">{analytics.todayStats.totalEntries}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-green-600" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-red-50 to-red-100 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-red-800">Total Exits Today</p>
              <p className="text-2xl font-bold text-red-900">{analytics.todayStats.totalExits}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-red-600 transform rotate-180" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-800">Peak Occupancy</p>
              <p className="text-2xl font-bold text-blue-900">{analytics.todayStats.peakOccupancy}</p>
            </div>
            <Calendar className="w-8 h-8 text-blue-600" />
          </div>
        </div>
      </div>
    </div>
  );
};