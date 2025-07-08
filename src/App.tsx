import React from 'react';
import { Header } from './components/Header';
import { VideoFeed } from './components/VideoFeed';
import { StatsPanel } from './components/StatsPanel';
import { AlertsPanel } from './components/AlertsPanel';
import { ConfigPanel } from './components/ConfigPanel';
import { AnalyticsPanel } from './components/AnalyticsPanel';
import { PeopleCounterProvider } from './context/PeopleCounterContext';

function App() {
  return (
    <PeopleCounterProvider>
      <div className="min-h-screen bg-gray-50">
        <Header />
        
        <main className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Video Feed */}
            <div className="lg:col-span-2">
              <VideoFeed />
            </div>
            
            {/* Side Panel */}
            <div className="space-y-6">
              <StatsPanel />
              <AlertsPanel />
              <ConfigPanel />
            </div>
          </div>
          
          {/* Analytics Section */}
          <div className="mt-8">
            <AnalyticsPanel />
          </div>
        </main>
      </div>
    </PeopleCounterProvider>
  );
}

export default App;