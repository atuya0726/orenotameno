import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router';
import { LearningProvider } from './lib/store';
import App from './App';
import { AppRenderBoundary } from './components/render-boundary';
import './styles.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode><BrowserRouter><LearningProvider><AppRenderBoundary><App /></AppRenderBoundary></LearningProvider></BrowserRouter></React.StrictMode>,
);
