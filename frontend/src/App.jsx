import React from 'react';
// Import React to use JSX and React features

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// Import components from react-router-dom for client-side routing:
// Router - wraps your app and enables routing,
// Routes - container for all Route components,
// Route - defines a route mapping a path to a React component

import ChatApp from './components/ChatApp';
// Import the ChatApp component, which handles the chat interface

import LandingPage from './components/LandingPage';
// Import the LandingPage component, the initial welcome page

// Define the main App functional component
const App = () => {
  return (
    // Router component wraps the entire app enabling routing capabilities
    <Router>
      {/* Routes container to define the various routes in your app */}
      <Routes>
        {/* Route for the root path "/" renders the LandingPage component */}
        <Route path="/" element={<LandingPage />} />

        {/* Route for the "/chat" path renders the ChatApp component */}
        <Route path="/chat" element={<ChatApp />} />
      </Routes>
    </Router>
  );
};

export default App;
// Export the App component as the default export so it can be imported elsewhere

