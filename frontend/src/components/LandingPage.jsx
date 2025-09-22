import React from 'react';  // Import React library to use JSX and React features
import { useNavigate } from 'react-router-dom';  // Import useNavigate hook to programmatically navigate between routes

// Define the main functional component LandingPage
const LandingPage = () => {
  // Initialize navigate function from useNavigate hook, used for route navigation
  const navigate = useNavigate();

  // Return the JSX that describes the UI of the landing page
  return (
    // Main container div with styling: full height screen, background gradient, flexbox center alignment, padding, relative positioning, and overflow hidden
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-100 flex flex-col items-center justify-center text-center px-6 py-10 relative overflow-hidden">

      {/* Chatbot Icon or Emoji */}
      {/* Large heart emoji with bottom margin and bounce animation */}
      <div className="text-6xl mb-4 animate-bounce">♥</div>

      {/* Title */}
      {/* Big, bold header text with bottom margin */}
      <h1 className="text-5xl font-extrabold text-gray-800 mb-2">Zineb´s Ai-agent</h1>

      {/* Subtitle */}
      {/* Medium sized, gray subtitle text with bottom margin and max width for better readability */}
      <p className="text-xl text-gray-600 mb-6 max-w-xl">
        The AI version of Zineb  — lovingly built by herself
      </p>

      {/* CTA Button */}
      {/* A blue rounded button with padding, shadow, and hover effects for interaction */}
      {/* On click, navigates the user to the '/chat' route */}
      <button
        className="bg-blue-600 text-white px-8 py-3 rounded-full text-lg font-medium shadow-lg hover:bg-blue-700 transform hover:scale-105 transition-all duration-200"
        onClick={() => navigate('/chat')}
      >
         Chat with Zineb
      </button>

      {/* Feature Highlights Section */}
      {/* A grid container that holds 3 feature cards; responsive with 1 column on small screens and 3 columns on larger screens */}
      <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl w-full">
        {/* Each FeatureCard shows an icon and a title */}
        <FeatureCard icon="♥️" title=""  />
        <FeatureCard icon="♥️" title="Ask Me About..." />
        <FeatureCard icon="♥️" title="" />
      </div>

      {/* Footer */}
      {/* Small gray text footer with margin top */}
      <footer className="mt-16 text-sm text-gray-500">
        Made entirely by Zineb (...and ChatGpt 🤫) — for the people who matter most ♥️
      </footer>
    </div>
  );
};

// Small reusable component to display a feature card with an icon and title
const FeatureCard = ({ icon, title }) => (
  // Card container with white background, rounded corners, shadow, padding, flex column alignment, hover shadow effect, and smooth transition
  <div className="bg-white rounded-xl shadow-md p-6 flex flex-col items-center hover:shadow-xl transition">
    {/* Icon displayed large with bottom margin */}
    <div className="text-4xl mb-2">{icon}</div>
    {/* Title text styled with medium size, semi-bold weight, and gray color */}
    <h3 className="text-lg font-semibold text-gray-700">{title}</h3>
  </div>
);

export default LandingPage;  // Export LandingPage component as default export

