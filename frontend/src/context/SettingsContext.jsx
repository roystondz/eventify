import React, { createContext, useContext, useEffect, useState } from 'react';
import { api } from '../services/api';
import { DEFAULT_SETTINGS } from '../services/defaults';

const SettingsContext = createContext(DEFAULT_SETTINGS);

// Loads the admin-editable site settings once for the whole public site.
export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);

  useEffect(() => {
    let isMounted = true;
    api.getSettings().then((data) => {
      if (isMounted) setSettings(data);
    });
    return () => {
      isMounted = false;
    };
  }, []);

  return <SettingsContext.Provider value={settings}>{children}</SettingsContext.Provider>;
};

export const useSettings = () => useContext(SettingsContext);
