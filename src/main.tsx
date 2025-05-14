
import React from 'react'; // Make sure we explicitly import React
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Create root with React 18 syntax
const root = createRoot(document.getElementById("root")!);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
