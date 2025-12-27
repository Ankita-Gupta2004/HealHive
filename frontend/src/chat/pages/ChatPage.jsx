import React, { useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ChatHeader from '../components/ChatHeader';
import ChatMessages from '../components/ChatMessages';
import ChatInput from '../components/ChatInput';
import { dummyMessages } from '../data/dummyMessages';

// Doctor data - can be extended with more doctors
const doctorData = {
  doc1: {
    id: 'doc1',
    name: 'Dr. Sarah Mitchell',
    speciality: 'Cardiologist',
    avatar: '👨‍⚕️',
  },
  doc2: {
    id: 'doc2',
    name: 'Dr. John Smith',
    speciality: 'General Practitioner',
    avatar: '👨‍⚕️',
  },
  doc3: {
    id: 'doc3',
    name: 'Dr. Emily Johnson',
    speciality: 'Dermatologist',
    avatar: '👩‍⚕️',
  },
};

const generateTimestamp = () => {
  const now = new Date();
  return now.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
};

const generateDoctorResponse = (patientMessage) => {
  const responses = [
    'I understand. Can you tell me more about that?',
    'That\'s helpful information. How long have you been experiencing this?',
    'I see. Have you taken any medications for this?',
    'Thank you for sharing. Do you have any other symptoms?',
    'Let me know if the pain is constant or intermittent.',
    'That\'s important to know. We\'ll need to monitor this closely.',
    'I recommend keeping a symptom diary. How are you feeling now?',
    'This is valuable information. Let\'s discuss your treatment options.',
    'Have you experienced this before? When did it start?',
    'Good observation. Let\'s schedule some tests to get more clarity.',
  ];

  return responses[Math.floor(Math.random() * responses.length)];
};

const ChatPage = () => {
  const { consultationId } = useParams();
  const navigate = useNavigate();
  const [messages, setMessages] = useState(dummyMessages);
  const [isLoading, setIsLoading] = useState(false);

  // Get doctor data based on consultationId or use default
  const doctor = doctorData.doc1; // Can be extended to fetch from consultationId

  const handleSendMessage = useCallback(
    (messageText) => {
      // Add patient message
      const patientMessage = {
        id: messages.length + 1,
        sender: 'patient',
        senderName: 'You',
        avatar: '👤',
        message: messageText,
        timestamp: generateTimestamp(),
        read: true,
      };

      setMessages((prev) => [...prev, patientMessage]);
      setIsLoading(true);

      // Simulate doctor response after delay
      setTimeout(() => {
        const doctorMessage = {
          id: messages.length + 2,
          sender: 'doctor',
          senderName: doctor.name,
          senderRole: doctor.speciality,
          avatar: doctor.avatar,
          message: generateDoctorResponse(messageText),
          timestamp: generateTimestamp(),
          read: false,
        };

        setMessages((prev) => [...prev, doctorMessage]);
        setIsLoading(false);
      }, 1000 + Math.random() * 1500); // Random delay between 1-2.5 seconds
    },
    [messages, doctor]
  );

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-b from-emerald-50 via-white to-teal-50">
      {/* Header */}
      <ChatHeader doctor={doctor} onBack={handleBack} />

      {/* Messages */}
      <ChatMessages messages={messages} />

      {/* Input */}
      <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
    </div>
  );
};

export default ChatPage;
