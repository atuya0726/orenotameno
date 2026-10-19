import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router';
import { LearningProvider } from './lib/store';
import App from './App';
import './styles.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode><BrowserRouter><LearningProvider><App /></LearningProvider></BrowserRouter></React.StrictMode>,
);
