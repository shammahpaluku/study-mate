import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface UserSettings {
  notifications: {
    studyReminders: boolean;
    achievementAlerts: boolean;
    dailySummary: boolean;
  };
  appearance: {
    darkMode: boolean;
    theme: 'blue' | 'green' | 'purple';
    language: 'en' | 'es' | 'fr';
  };
  data: {
    autoSave: boolean;
    exportData: boolean;
    clearData: boolean;
  };
}

interface SettingsContextType {
  settings: UserSettings;
  updateSetting: (category: keyof UserSettings, key: string, value: any) => void;
  saveSettings: () => void;
  resetSettings: () => void;
}

const defaultSettings: UserSettings = {
  notifications: {
    studyReminders: true,
    achievementAlerts: true,
    dailySummary: false
  },
  appearance: {
    darkMode: false,
    theme: 'blue',
    language: 'en'
  },
  data: {
    autoSave: true,
    exportData: false,
    clearData: false
  }
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

interface SettingsProviderProps {
  children: ReactNode;
}

export const SettingsProvider: React.FC<SettingsProviderProps> = ({ children }) => {
  const [settings, setSettings] = useState<UserSettings>(defaultSettings);

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('userSettings');
    if (savedSettings) {
      try {
        const parsedSettings = JSON.parse(savedSettings);
        setSettings(parsedSettings);
        
        // Apply dark mode setting immediately
        if (parsedSettings.appearance?.darkMode !== undefined) {
          document.documentElement.classList.toggle('chakra-ui-dark', parsedSettings.appearance.darkMode);
        }
      } catch (error) {
        console.error('Error loading settings:', error);
      }
    }
  }, []);

  const updateSetting = (category: keyof UserSettings, key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value
      }
    }));

    // Apply dark mode immediately when changed
    if (category === 'appearance' && key === 'darkMode') {
      document.documentElement.classList.toggle('chakra-ui-dark', value);
    }

    // Auto-save if enabled
    if (settings.data.autoSave) {
      setTimeout(() => {
        saveSettings();
      }, 500);
    }
  };

  const saveSettings = () => {
    localStorage.setItem('userSettings', JSON.stringify(settings));
  };

  const resetSettings = () => {
    setSettings(defaultSettings);
    document.documentElement.classList.remove('chakra-ui-dark');
    localStorage.removeItem('userSettings');
  };

  return (
    <SettingsContext.Provider value={{
      settings,
      updateSetting,
      saveSettings,
      resetSettings
    }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = (): SettingsContextType => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};
