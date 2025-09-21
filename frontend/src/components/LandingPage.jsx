import React from 'react';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-100 flex flex-col items-center justify-center text-center px-6 py-10 relative overflow-hidden">
      {/* Chatbot Icon or Emoji */}
      <div className="text-6xl mb-4 animate-bounce">♥</div>

      {/* Title */}
      <h1 className="text-5xl font-extrabold text-gray-800 mb-2">Zineb´s Ai-agent</h1>

      {/* Subtitle */}
      <p className="text-xl text-gray-600 mb-6 max-w-xl">
        The AI version of Zineb  — lovingly built by herself
      </p>

      {/* CTA Button */}
      <button
        className="bg-blue-600 text-white px-8 py-3 rounded-full text-lg font-medium shadow-lg hover:bg-blue-700 transform hover:scale-105 transition-all duration-200"
        onClick={() => navigate('/chat')}
      >
         Chat with Zineb
      </button>

      {/* Feature Highlights */}
      <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl w-full">
        <FeatureCard icon="📸" title="My Favorite Memory"  />
        <FeatureCard icon="🍵" title="How I Take My Tea" />
        <FeatureCard icon="📚" title="Ask Me About..." />

      </div>

      {/* Footer */}
      <footer className="mt-16 text-sm text-gray-500">
        Made entirely by Zineb (...and ChatGpt 🤫) — for the people who matter most ♥️
      </footer>
    </div>
  );
};

// Small Feature Card component
const FeatureCard = ({ icon, title }) => (
  <div className="bg-white rounded-xl shadow-md p-6 flex flex-col items-center hover:shadow-xl transition">
    <div className="text-4xl mb-2">{icon}</div>
    <h3 className="text-lg font-semibold text-gray-700">{title}</h3>
  </div>
);

export default LandingPage;

