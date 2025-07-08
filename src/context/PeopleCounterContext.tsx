import React, { createContext, useContext, useReducer, useEffect } from 'react';

interface Stats {
  currentCount: number;
  totalEntries: number;
  totalExits: number;
  sessionDuration: string;
}

interface Alert {
  id: string;
  type: 'info' | 'warning' | 'error' | 'success';
  title: string;
  message: string;
  timestamp: string;
}

interface Config {
  threshold: number;
  alertsEnabled: boolean;
  emailAlerts: boolean;
  showDetectionInfo: boolean;
  autoLog: boolean;
  sessionTimer: boolean;
}

interface AnalyticsData {
  time: string;
  entries: number;
  exits: number;
  peak: number;
}

interface Analytics {
  hourlyData: AnalyticsData[];
  dailyData: AnalyticsData[];
  todayStats: {
    totalEntries: number;
    totalExits: number;
    peakOccupancy: number;
  };
}

interface PeopleCounterState {
  stats: Stats;
  alerts: Alert[];
  config: Config;
  analytics: Analytics;
  sessionStartTime: Date;
}

type Action =
  | { type: 'UPDATE_COUNT'; payload: 'enter' | 'exit' }
  | { type: 'ADD_ALERT'; payload: Alert }
  | { type: 'DISMISS_ALERT'; payload: string }
  | { type: 'UPDATE_CONFIG'; payload: Partial<Config> }
  | { type: 'UPDATE_SESSION_DURATION' };

const initialState: PeopleCounterState = {
  stats: {
    currentCount: 0,
    totalEntries: 0,
    totalExits: 0,
    sessionDuration: '00:00:00',
  },
  alerts: [],
  config: {
    threshold: 10,
    alertsEnabled: true,
    emailAlerts: false,
    showDetectionInfo: true,
    autoLog: true,
    sessionTimer: true,
  },
  analytics: {
    hourlyData: [
      { time: '09:00', entries: 5, exits: 2, peak: 8 },
      { time: '10:00', entries: 8, exits: 3, peak: 12 },
      { time: '11:00', entries: 12, exits: 7, peak: 15 },
      { time: '12:00', entries: 15, exits: 10, peak: 18 },
      { time: '13:00', entries: 10, exits: 12, peak: 16 },
      { time: '14:00', entries: 7, exits: 8, peak: 14 },
      { time: '15:00', entries: 9, exits: 6, peak: 17 },
      { time: '16:00', entries: 11, exits: 9, peak: 19 },
    ],
    dailyData: [
      { time: 'Mon', entries: 45, exits: 42, peak: 25 },
      { time: 'Tue', entries: 52, exits: 48, peak: 28 },
      { time: 'Wed', entries: 38, exits: 35, peak: 22 },
      { time: 'Thu', entries: 61, exits: 58, peak: 32 },
      { time: 'Fri', entries: 55, exits: 52, peak: 30 },
      { time: 'Sat', entries: 72, exits: 68, peak: 38 },
      { time: 'Sun', entries: 41, exits: 39, peak: 24 },
    ],
    todayStats: {
      totalEntries: 77,
      totalExits: 57,
      peakOccupancy: 32,
    },
  },
  sessionStartTime: new Date(),
};

function peopleCounterReducer(state: PeopleCounterState, action: Action): PeopleCounterState {
  switch (action.type) {
    case 'UPDATE_COUNT':
      const isEntry = action.payload === 'enter';
      const newCurrentCount = Math.max(0, state.stats.currentCount + (isEntry ? 1 : -1));
      const newStats = {
        ...state.stats,
        currentCount: newCurrentCount,
        totalEntries: isEntry ? state.stats.totalEntries + 1 : state.stats.totalEntries,
        totalExits: !isEntry ? state.stats.totalExits + 1 : state.stats.totalExits,
      };

      // Check for threshold alert
      const alerts = [...state.alerts];
      if (state.config.alertsEnabled && newCurrentCount >= state.config.threshold) {
        const alertExists = alerts.some(alert => alert.type === 'warning' && alert.title.includes('Threshold'));
        if (!alertExists) {
          alerts.push({
            id: Date.now().toString(),
            type: 'warning',
            title: 'Threshold Exceeded',
            message: `Current occupancy (${newCurrentCount}) has exceeded the threshold of ${state.config.threshold} people.`,
            timestamp: new Date().toLocaleTimeString(),
          });
        }
      }

      return {
        ...state,
        stats: newStats,
        alerts,
      };

    case 'ADD_ALERT':
      return {
        ...state,
        alerts: [...state.alerts, action.payload],
      };

    case 'DISMISS_ALERT':
      return {
        ...state,
        alerts: state.alerts.filter(alert => alert.id !== action.payload),
      };

    case 'UPDATE_CONFIG':
      return {
        ...state,
        config: { ...state.config, ...action.payload },
      };

    case 'UPDATE_SESSION_DURATION':
      const duration = Date.now() - state.sessionStartTime.getTime();
      const hours = Math.floor(duration / (1000 * 60 * 60));
      const minutes = Math.floor((duration % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((duration % (1000 * 60)) / 1000);
      
      return {
        ...state,
        stats: {
          ...state.stats,
          sessionDuration: `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`,
        },
      };

    default:
      return state;
  }
}

const PeopleCounterContext = createContext<{
  state: PeopleCounterState;
  updateCount: (type: 'enter' | 'exit') => void;
  addAlert: (alert: Alert) => void;
  dismissAlert: (id: string) => void;
  updateConfig: (config: Partial<Config>) => void;
} | null>(null);

export const PeopleCounterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(peopleCounterReducer, initialState);

  useEffect(() => {
    if (state.config.sessionTimer) {
      const interval = setInterval(() => {
        dispatch({ type: 'UPDATE_SESSION_DURATION' });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [state.config.sessionTimer]);

  const updateCount = (type: 'enter' | 'exit') => {
    dispatch({ type: 'UPDATE_COUNT', payload: type });
  };

  const addAlert = (alert: Alert) => {
    dispatch({ type: 'ADD_ALERT', payload: alert });
  };

  const dismissAlert = (id: string) => {
    dispatch({ type: 'DISMISS_ALERT', payload: id });
  };

  const updateConfig = (config: Partial<Config>) => {
    dispatch({ type: 'UPDATE_CONFIG', payload: config });
  };

  return (
    <PeopleCounterContext.Provider
      value={{
        state,
        updateCount,
        addAlert,
        dismissAlert,
        updateConfig,
      }}
    >
      {children}
    </PeopleCounterContext.Provider>
  );
};

export const usePeopleCounter = () => {
  const context = useContext(PeopleCounterContext);
  if (!context) {
    throw new Error('usePeopleCounter must be used within a PeopleCounterProvider');
  }

  return {
    stats: context.state.stats,
    alerts: context.state.alerts,
    config: context.state.config,
    analytics: context.state.analytics,
    updateCount: context.updateCount,
    addAlert: context.addAlert,
    dismissAlert: context.dismissAlert,
    updateConfig: context.updateConfig,
  };
};