// ThemeContext.js
import React, { createContext, useState } from 'react';

const ThemeContext = createContext();
const { Provider } = ThemeContext;

const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <Provider value={{ isDarkMode, toggleDarkMode }}>
      {children}
    </Provider>
  );
};

export { ThemeContext, ThemeProvider };
