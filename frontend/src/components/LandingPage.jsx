// components/LandingPage.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white text-center px-4">
      <h1 className="text-4xl font-bold mb-4">👨‍👩‍👧‍👦 Family Chatbot</h1>
      <p className="text-lg text-gray-600 mb-8">
        Your helpful AI assistant for home, family, and fun conversations.
      </p>
      <button
        className="bg-blue-500 text-white px-6 py-3 rounded-md text-lg hover:bg-blue-600 transition"
        onClick={() => navigate('/chat')}
      >
        Start Chatting
      </button>
    </div>
  );
};

export default LandingPage;
