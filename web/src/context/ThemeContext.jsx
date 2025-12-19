import React, { createContext, useContext, useState, useEffect } from 'react';
import { getMe, updateUserTheme } from '../lib/api';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadTheme = async () => {
      try {
        const user = await getMe();
        const savedTheme = user?.theme || 'light';
        setTheme(savedTheme);
        applyTheme(savedTheme);
      } catch (error) {
        const localTheme = localStorage.getItem('theme') || 'light';
        setTheme(localTheme);
        applyTheme(localTheme);
      } finally {
        setIsLoading(false);
      }
    };
    loadTheme();
  }, []);

  const applyTheme = (newTheme) => {
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const toggleTheme = async () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    applyTheme(newTheme);
    localStorage.setItem('theme', newTheme);

    try {
      await updateUserTheme(newTheme);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde du thème:', error);
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, isLoading }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme doit être utilisé dans un ThemeProvider');
  }
  return context;
}