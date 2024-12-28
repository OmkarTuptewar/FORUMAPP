import React, { useState, useEffect, useRef } from 'react';

const ChatSection = () => {
  const [messages, setMessages] = useState([
    { user: 'Admin', message: 'Welcome to the group chat!' },
    { user: 'John Doe', message: 'Hello everyone!' },
    { user: 'John Doe', message: 'How are you all doing?' },
    { user: 'Admin', message: 'Please follow the chat rules.' },
  ]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);

  // Scroll to the bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      setMessages([...messages, { user: 'You', message: newMessage }]);
      setNewMessage('');
    }
  };

  return (
    <div className="max-w-sm flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-3xl">
    <div className="chat-section h-full flex flex-col bg-gray-100 dark:bg-gray-800 p-4 rounded-lg max-w-xs w-full">
      {/* Messages Container */}
      <div
        className="flex flex-col flex-grow overflow-y-auto h-[32vh]  space-y-2 mb-3 pr-1"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`message ${msg.user === 'You' ? 'text-right' : 'text-left'}`}
          >
            <div className="font-bold text-xs text-gray-700 dark:text-gray-300">{msg.user}</div>
            <div
              className={`p-2 rounded-md max-w-xs font-mono inline-block text-xs mt-1 ${
                msg.user === 'You'
                  ? 'bg-blue-500 text-white ml-auto rounded-l-lg'
                  : 'bg-gray-300 text-gray-800 mr-auto rounded-r-lg'
              }`}
            >
              {msg.message}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} /> {/* Scroll Target */}
      </div>
  
      {/* Input and Send Button */}
      <div className="flex items-center mt-3 space-x-2">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-grow p-2 rounded-md bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-500 text-sm"
        />
        <button
          onClick={handleSendMessage}
          className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-md transition-all duration-300 text-sm"
        >
          Send
        </button>
      </div>
    </div>
  </div>
  
  );
};

export default ChatSection;
