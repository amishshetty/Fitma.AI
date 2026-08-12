import { createRoot } from 'react-dom/client';
import App from './app/App.tsx';
import './styles/index.css';
import React from 'react';
import { ThemeProvider } from './providers/ThemeProvider';

createRoot(document.getElementById('root')!).render(
  <ThemeProvider defaultTheme="system">
    <App />
  </ThemeProvider>
);
