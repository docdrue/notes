import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';

import configureStore from "./hook-store/folders-store";

configureStore();

const app = (
    <App />
);

ReactDOM.render(
  app,
  document.getElementById('root')
);
