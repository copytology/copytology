
import React from 'react'; 
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Create root with React 18 syntax
const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Root element not found in document");
}

const root = createRoot(rootElement);
root.render(<App />);
