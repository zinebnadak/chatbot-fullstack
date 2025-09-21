import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const BACKEND_URL = 'https://nadak-s-ai-chatbot.onrender.com/ask';

function ChatMessage({ message }) {
  const isUser = message.role === 'user';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} px-4 py-1`}>
      <div
        className={`
          max-w-xs md:max-w-lg px-4 py-3
          rounded-xl
          whitespace-pre-wrap
          ${isUser
            ? 'bg-blue-100 text-gray-900 dark:bg-blue-600 dark:text-white'
            : 'bg-gray-200 text-gray-900 dark:bg-gray-700 dark:text-gray-100'}
        `}
      >
        {message.content}
      </div>
    </div>
  );
}

function TypingBubble() {
  return (
    <div className="flex justify-start px-4 py-1">
      <div className="px-4 py-3 rounded-xl bg-gray-300 dark:bg-gray-700 text-gray-900 dark:text-gray-100 max-w-xs">
        <span className="animate-pulse">Typing...</span>
      </div>
    </div>
  );
}

function DarkModeToggle({ darkMode, setDarkMode }) {
  return (
    <button
      onClick={() => setDarkMode(!darkMode)}
      className="fixed top-4 right-4 bg-gray-300 dark:bg-gray-700 p-2 rounded-full focus:outline-none"
      aria-label="Toggle dark mode"
    >
      {darkMode ? '🌙' : '☀️'}
    </button>
  );
}

export default function ChatApp() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('dark_mode');
    return saved ? JSON.parse(saved) : false;
  });

  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    localStorage.setItem('dark_mode', JSON.stringify(darkMode));
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input.trim() };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await axios.post(BACKEND_URL, {
        question: userMessage.content,
      });

      const fullText = response.data.answer || 'No answer found.';
      const botMessage = { role: 'bot', content: '' };

      setMessages((prev) => [...prev, botMessage]);

      // Typing effect
      let index = 0;
      const typingInterval = setInterval(() => {
        setMessages((prev) => {
          const updated = [...prev];
          const last = updated[updated.length - 1];

          if (index < fullText.length) {
            updated[updated.length - 1] = {
              ...last,
              content: last.content + fullText.charAt(index),
            };
            index++;
          } else {
            clearInterval(typingInterval);
            setLoading(false);
          }

          return updated;
        });
      }, 20);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'bot',
          content: `⚠️ Error: ${error.message || 'Network error'}`,
        },
      ]);
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const isEmpty = messages.length === 0;

  return (
    <div className="flex flex-col h-screen bg-gray-50 dark:bg-gray-900 relative">
      <DarkModeToggle darkMode={darkMode} setDarkMode={setDarkMode} />

      <header className="py-4 shadow-md bg-white dark:bg-gray-800 text-center text-xl font-semibold text-gray-900 dark:text-gray-100">
        💬 Family Chatbot
      </header>

      <main
        className={`flex-grow overflow-y-auto transition-all duration-300 ${
          isEmpty ? 'flex items-center justify-center' : 'px-4 py-6'
        }`}
      >
        <div className="w-full max-w-2xl mx-auto space-y-2">
          {isEmpty ? (
            <p className="text-center text-gray-500 dark:text-gray-400">
              Start the conversation below.
            </p>
          ) : (
            <>
              {messages.map((msg, idx) => (
                <ChatMessage key={idx} message={msg} />
              ))}
              {loading && <TypingBubble />}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>
      </main>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          sendMessage();
        }}
        className={`bg-white dark:bg-gray-800 p-4 flex items-center gap-2 shadow-inner transition-all duration-300 ${
          isEmpty
            ? 'absolute bottom-1/2 translate-y-1/2 left-1/2 -translate-x-1/2 w-full max-w-xl'
            : ''
        }`}
      >
        <textarea
          rows={1}
          className="flex-grow resize-none rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Type your message here..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className={`px-4 py-2 rounded-md text-white ${
            loading || !input.trim()
              ? 'bg-blue-300 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {loading ? 'Sending...' : 'Send'}
        </button>
      </form>
    </div>
  );
}
