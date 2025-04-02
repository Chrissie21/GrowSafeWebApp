import React from 'react';
import { createRoot } from 'react-dom/client'; // Updated import
import App from './App';

const container = document.getElementById('root');
const root = createRoot(container!); // Type assertion for non-null container
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);