import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './app/App';
import './styles/index.css';

// Ensure pathname routes gracefully redirect to hash routes on Vercel / static hosts
if (typeof window !== 'undefined' && window.location.pathname && window.location.pathname !== '/' && !window.location.hash) {
  const target = window.location.pathname + window.location.search;
  window.history.replaceState(null, '', '/#' + target);
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
