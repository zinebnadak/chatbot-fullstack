import React from 'react';
// Import React library to use JSX and React features

import ReactDOM from 'react-dom/client';
// Import ReactDOM for rendering React components into the DOM (new API in React 18+)

import App from './App';
// Import the main App component which contains the entire React app

import './index.css';
// Import the global CSS styles (Tailwind + custom styles)

// Create a React root and render the app into the HTML element with id 'root'
ReactDOM.createRoot(document.getElementById('root')).render(
  // React.StrictMode enables additional checks and warnings for development
  <React.StrictMode>
    <App />  {/* Render the App component inside StrictMode */}
  </React.StrictMode>
);


