import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';

import configureStore from './hook-store/folders-store';

configureStore();

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
