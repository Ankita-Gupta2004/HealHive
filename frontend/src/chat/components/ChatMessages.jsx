import React, { useEffect, useRef } from 'react';
import MessageBubble from './MessageBubble';

const ChatMessages = ({ messages }) => {
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto p-4 bg-gradient-to-b from-emerald-50 via-white to-teal-50">
      <div className="space-y-2">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center py-20">
            <div className="text-5xl mb-4">💬</div>
            <h3 className="text-gray-600 font-semibold">No messages yet</h3>
            <p className="text-gray-400 text-sm">Start a conversation with your doctor</p>
          </div>
        ) : (
          messages.map((message) => (
            <MessageBubble
              key={message.id}
              message={message}
              isPatient={message.sender === 'patient'}
            />
          ))
        )}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};

export default ChatMessages;
