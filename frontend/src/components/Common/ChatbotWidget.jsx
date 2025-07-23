import React, { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';

const ChatbotWidget = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="tooltip tooltip-top fixed bottom-6 right-6 bg-gradient-to-br from-indigo-600 to-purple-600 text-white p-3 rounded-full shadow-2xl hover:scale-110 transition-transform duration-300 z-[100] flex items-center gap-2 px-4 animate-bounce"
          title="Open AI Assistant"
          aria-label="Open AI Assistant"
          data-tip="Open AI Assistant"
        >
          {/* Text Label */}
          <span className="font-semibold select-none">Ask AI for Help</span>
        </button>
      )}

      {isOpen && (
        <div className="fixed bottom-6 right-6 w-96 h-[95vh] z-[9999] bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-2xl flex flex-col">
          <div className="flex items-center justify-between px-4 py-3 bg-secondary text-white font-semibold text-lg rounded-t-2xl">
            <span>DSA CodeLab AI Assistant</span>
            <button
              onClick={() => setIsOpen(false)}
              aria-label="Close AI Assistant"
              className="hover:text-red-400 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-800">
            Ask me anything about your coding problems! Give problem statements.
          </div>

          <iframe
            id="my-chat-bot"
            src={import.meta.env.VITE_CHATBASE_EMBED_URL}
            width="100%"
            height="100%"
            frameBorder="0"
            title="Chatbase AI Assistant"
            className="flex-1"
          />
        </div>
      )}
    </>
  );
};

export default ChatbotWidget;
