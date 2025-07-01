import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const DarkModeFloatButton = () => {
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') === 'dark' ||
        (localStorage.getItem('theme') === null && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    return false;
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  return (
    <motion.button
      onClick={() => setDarkMode((prev) => !prev)}
      className="fixed bottom-5 right-5 z-50 p-2 rounded-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-yellow-300 shadow-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300 ease-in-out flex items-center justify-center"
      aria-label="Alternar modo escuro"
      style={{ width: 44, height: 44 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <AnimatePresence mode="wait">
        {darkMode ? (
          <motion.svg
            key="sun"
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            initial={{ rotate: -180, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: 180, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="2" fill="none" />
            <g stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="12" y1="1.5" x2="12" y2="4" />
              <line x1="12" y1="20" x2="12" y2="22.5" />
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
              <line x1="1.5" y1="12" x2="4" y2="12" />
              <line x1="20" y1="12" x2="22.5" y2="12" />
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
            </g>
          </motion.svg>
        ) : (
          <motion.svg
            key="moon"
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            initial={{ rotate: 180, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: -180, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12.79A9 9 0 1111.21 3a7 7 0 109.79 9.79z" />
          </motion.svg>
        )}
      </AnimatePresence>
    </motion.button>
  );
};

export default DarkModeFloatButton; 