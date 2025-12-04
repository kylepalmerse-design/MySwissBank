import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx'; // Убедись, что App.tsx в src/

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
