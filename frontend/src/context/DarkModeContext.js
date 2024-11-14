import React, { createContext, useContext, useState, useEffect } from 'react';

const DarkModeContext = createContext();

export const useDarkMode = () => useContext(DarkModeContext);

export const DarkModeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Load saved preference from local storage or default to system preference
    const savedPreference = localStorage.getItem('isDarkMode');
    if (savedPreference !== null) return JSON.parse(savedPreference);
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    localStorage.setItem('isDarkMode', JSON.stringify(isDarkMode));
    // Toggle dark mode class and set background color
    document.documentElement.classList.toggle('dark', isDarkMode);
    document.body.className = isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800';
  }, [isDarkMode]);

  const toggleDarkMode = () => setIsDarkMode((prev) => !prev);

  return (
    <DarkModeContext.Provider value={{ isDarkMode, toggleDarkMode }}>
      {children}
    </DarkModeContext.Provider>
  );
};
