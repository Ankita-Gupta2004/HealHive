import React from 'react';
import { Check, CheckCheck } from 'lucide-react';

const MessageBubble = ({ message, isPatient }) => {
  return (
    <div
      className={`flex gap-2 mb-4 animate-fadeInUp ${
        isPatient ? 'justify-end' : 'justify-start'
      }`}
    >
      {!isPatient && (
        <div className="flex-shrink-0">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center text-lg border border-emerald-200">
            {message.avatar}
          </div>
        </div>
      )}

      <div className={`flex flex-col max-w-xs ${isPatient ? 'items-end' : 'items-start'}`}>
        {!isPatient && (
          <span className="text-xs text-slate-600 mb-1 px-2 font-medium">{message.senderName}</span>
        )}

        <div
          className={`rounded-2xl px-4 py-2 break-words ${
            isPatient
              ? 'bg-gradient-to-br from-emerald-500 to-teal-500 text-white rounded-br-none shadow-md hover:shadow-lg transition-shadow'
              : 'bg-white text-slate-800 rounded-bl-none shadow-sm border border-emerald-100 hover:shadow-md transition-shadow'
          }`}
        >
          <p className="text-sm md:text-base">{message.message}</p>
        </div>

        <div
          className={`flex items-center gap-1 mt-1 text-xs text-slate-500 px-2 ${
            isPatient ? 'flex-row-reverse' : ''
          }`}
        >
          <span>{message.timestamp}</span>
          {isPatient && message.read && (
            <CheckCheck size={14} className="text-emerald-400" />
          )}
          {isPatient && !message.read && <Check size={14} className="text-slate-400" />}
        </div>
      </div>

      {isPatient && (
        <div className="flex-shrink-0">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-lg text-white shadow-sm">
            {message.avatar}
          </div>
        </div>
      )}
    </div>
  );
};

export default MessageBubble;
