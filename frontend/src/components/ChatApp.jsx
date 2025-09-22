// Import React core functions and hooks used for state, lifecycle, and refs
import React, { useState, useEffect, useRef } from 'react';
// Import axios library for making HTTP requests to backend
import axios from 'axios';

// URL of the backend API endpoint that handles user questions and returns answers
const BACKEND_URL = 'https://nadak-s-ai-chatbot.onrender.com/ask';

// Component to display individual chat messages (either user or bot)
function ChatMessage({ message }) {
  // Check if the message is from the user by looking at the role property
  const isUser = message.role === 'user';

  // Define the avatar emoji shown only for the bot messages
  const avatar = isUser ? '' : '🙎🏽‍♀️';

  return (
    // Container div for the message
    // Flexbox aligns messages to the right if user, left if bot
    <div className={`flex items-end ${isUser ? 'justify-end' : 'justify-start'} px-4 py-2`}>

      {/* Show avatar on the left side only if it's a bot message */}
      {!isUser && (
        <div className="mr-2 text-2xl">
          {avatar} {/* Bot avatar emoji */}
        </div>
      )}

      {/* Message bubble styling */}
      <div
        className={`relative max-w-xs md:max-w-md px-4 py-3 rounded-2xl whitespace-pre-wrap text-sm shadow
          ${
            isUser
              ? 'bg-blue-600 text-white rounded-br-none' // Blue bubble for user, with one corner not rounded
              : 'bg-gray-200 text-gray-900 dark:bg-gray-700 dark:text-white rounded-bl-none' // Gray bubble for bot, with opposite corner not rounded
          }`}
      >
        {message.content} {/* The actual message text */}
      </div>

      {/* Show avatar on the right side only for user messages (empty here) */}
      {isUser && (
        <div className="ml-2 text-2xl">
          {avatar}
        </div>
      )}
    </div>
  );
}

// Component for toggling dark mode on/off
function DarkModeToggle({ darkMode, setDarkMode }) {
  return (
    // Button fixed to top-right corner, toggles dark mode state on click
    <button
      onClick={() => setDarkMode(!darkMode)} // Flip darkMode boolean value
      className="fixed top-4 right-4 bg-gray-300 dark:bg-gray-700 p-2 rounded-full focus:outline-none"
      aria-label="Toggle dark mode"
    >
      {darkMode ? 'Dark Mode' : 'Light mode'} {/* Show moon icon if dark mode, sun icon if light mode */}
    </button>
  );
}

// Main app component that contains entire chat UI and logic
export default function App() {

  // Run once when the app first mounts, clears previous chat messages stored in localStorage
  useEffect(() => {
    localStorage.removeItem('chat_messages');
  }, []);

  // State to hold all chat messages in order [{role: 'user'|'bot', content: string}, ...]
  const [messages, setMessages] = useState([]);

  // State to hold current value of the input textarea where user types their message
  const [input, setInput] = useState('');

  // State to track if the app is waiting for the bot's reply (used for showing "typing" indicator and disabling input)
  const [loading, setLoading] = useState(false);

  // State to track whether dark mode is on/off, initializing from localStorage or default to false
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('dark_mode'); // Try to load saved preference
    return saved ? JSON.parse(saved) : false; // Parse saved JSON string or default to false
  });

  // React ref to the last message div, used to scroll into view automatically
  const messagesEndRef = useRef(null);

  // Every time messages state changes, scroll chat view to bottom (latest message)
  useEffect(() => {
    // Scroll the element referenced by messagesEndRef into view smoothly
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]); // Only re-run when messages array changes

  // Persist messages in localStorage on every messages update (for refresh persistence)
  useEffect(() => {
    localStorage.setItem('chat_messages', JSON.stringify(messages));
  }, [messages]);

  // When dark mode changes:
  // 1. Save preference to localStorage
  // 2. Add or remove 'dark' class on document root element for TailwindCSS dark styling
  useEffect(() => {
    localStorage.setItem('dark_mode', JSON.stringify(darkMode));

    if (darkMode) {
      document.documentElement.classList.add('dark'); // Enable dark styles
    } else {
      document.documentElement.classList.remove('dark'); // Disable dark styles
    }
  }, [darkMode]);

  // Function to send a message to backend and handle the response
  async function sendMessage() {
    if (!input.trim()) return; // If input is empty or only whitespace, do nothing

    // Create a message object for user message
    const userMessage = { role: 'user', content: input.trim() };

    // Add user message to chat messages state to show it immediately
    setMessages((prev) => [...prev, userMessage]);

    setInput(''); // Clear the input textarea after sending
    setLoading(true); // Set loading flag to true to show typing indicator and disable input

    try {
      // POST request to backend API sending user question as {question: '...'}
      const response = await axios.post(BACKEND_URL, { question: userMessage.content });

      // Create bot message with answer from backend or default fallback text
      const botMessage = { role: 'bot', content: response.data.answer || 'No answer found.' };

      // Append bot's message to messages array
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      // If an error occurs during fetch, add an error message to chat
      const errorMessage = `⚠️ Error: ${error.message || 'Network error'}`;
      setMessages((prev) => [...prev, { role: 'bot', content: errorMessage }]);
    } finally {
      setLoading(false); // Remove loading indicator regardless of success/failure
    }
  }

  // Keyboard event handler for the input textarea
  // Sends message if user presses Enter without holding Shift (Shift+Enter allows new lines)
  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault(); // Prevent newline on Enter
      sendMessage(); // Call function to send the message
    }
  }

  // JSX return: the actual UI markup
  return (
    <div className="flex flex-col h-screen bg-gray-50 dark:bg-gray-900">
      {/* Dark mode toggle button component */}
      <DarkModeToggle darkMode={darkMode} setDarkMode={setDarkMode} />

      {/* Header with title */}
      <header className="py-4 shadow-md bg-white dark:bg-gray-800 text-center text-xl font-semibold text-gray-900 dark:text-gray-100">
        💬 Zineb´s personal Agent
      </header>

      {/* Main chat messages container */}
      <main className="flex-grow overflow-y-auto p-4 space-y-2">

        {/* Show placeholder text if there are no messages yet */}
        {messages.length === 0 && (
          <p className="text-center text-gray-500 dark:text-gray-400 mt-8">
            Ask me anything!
          </p>
        )}

        {/* Render all chat messages by mapping over the messages array */}
        {messages.map((msg, idx) => (
          <ChatMessage key={idx} message={msg} />
        ))}

        {/* Loading / typing indicator shown while waiting for bot reply */}
        {loading && (
          <div className="flex items-center gap-2 px-4 py-2 text-gray-500 dark:text-gray-400 animate-pulse">
            <span className="text-xl">🙎🏽‍♀️</span>
            <span>Bot is typing...</span>
          </div>
        )}

        {/* Dummy div at bottom to scroll into view */}
        <div ref={messagesEndRef} />
      </main>

      {/* Input form with textarea and send button */}
      <form
        onSubmit={(e) => {
          e.preventDefault(); // Prevent form default page reload
          sendMessage(); // Send the message on form submission
        }}
        className="bg-white dark:bg-gray-800 p-4 flex items-center gap-2 shadow-inner"
      >
        {/* Textarea where user types messages */}
        <textarea
          rows={1} // Show single row by default, expands as needed
          className="flex-grow resize-none rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Type your message here..."
          value={input} // Controlled component, value tied to input state
          onChange={(e) => setInput(e.target.value)} // Update state on typing
          onKeyDown={handleKeyDown} // Handle Enter key press
          disabled={loading} // Disable input while waiting for bot
        />

        {/* Send button, disabled if input is empty or loading */}
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className={`px-4 py-2 rounded-md text-white ${
            loading || !input.trim() ? 'bg-blue-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {loading ? 'Sending...' : 'Send'} {/* Button text changes when sending */}
        </button>
      </form>
    </div>
  );
}
