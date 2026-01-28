import { useState, useRef, useEffect } from "react";
import ChatHeader from "./ChatHeader";
import ChatMessage from "./ChatMessage";
import ChatInput from "./ChatInput";
import TypingIndicator from "./TypingIndicator";
import QuickQuestions from "./QuickQuestions";
import { findAnswer, quickQuestions } from "@/data/qaData";

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: string;
}

const ChatContainer = () => {
  const getWelcomeMessage = (): Message => ({
    id: "welcome",
    text: "Hey there! 👋 Welcome to Brandsetu Digital!\n\nI'm here to help you with any questions about our services, pricing, or how we can help grow your brand.\n\nWhat would you like to know?",
    isUser: false,
    timestamp: formatTime(new Date()),
  });

  const [messages, setMessages] = useState<Message[]>([getWelcomeMessage()]);
  const [isTyping, setIsTyping] = useState(false);
  const [showQuickQuestions, setShowQuickQuestions] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  function formatTime(date: Date): string {
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  }

  const handleSend = async (text: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      text,
      isUser: true,
      timestamp: formatTime(new Date()),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsTyping(true);
    setShowQuickQuestions(false);

    // Simulate typing delay
    await new Promise((resolve) => setTimeout(resolve, 1000 + Math.random() * 1000));

    const answer = findAnswer(text);
    const botMessage: Message = {
      id: (Date.now() + 1).toString(),
      text: answer,
      isUser: false,
      timestamp: formatTime(new Date()),
    };

    setIsTyping(false);
    setMessages((prev) => [...prev, botMessage]);
  };

  const handleClear = () => {
    setMessages([getWelcomeMessage()]);
    setShowQuickQuestions(true);
  };

  return (
    <div className="w-full max-w-md mx-auto h-[600px] flex flex-col rounded-lg shadow-2xl overflow-hidden border border-border/30">
      <ChatHeader onClear={handleClear} />
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 relative chat-scrollbar">
        {/* Floating animated circles - yellowish and blackish balls */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="floating-circle w-32 h-32 bg-yellow-200/50 rounded-full absolute -top-8 -right-8"></div>
          <div className="floating-circle-slow w-24 h-24 bg-gray-300/40 rounded-full absolute top-1/3 -left-6"></div>
          <div className="floating-circle-fast w-20 h-20 bg-yellow-100/60 rounded-full absolute bottom-1/4 right-4"></div>
          <div className="floating-circle w-16 h-16 bg-gray-400/30 rounded-full absolute bottom-8 left-1/4"></div>
          <div className="floating-circle-slow w-14 h-14 bg-amber-200/40 rounded-full absolute top-1/2 right-1/3"></div>
          <div className="floating-circle-fast w-18 h-18 bg-gray-500/25 rounded-full absolute top-1/4 left-1/3"></div>
        </div>
        
        {/* Messages */}
        <div className="relative z-10 space-y-4">
          {messages.map((message) => (
            <ChatMessage
              key={message.id}
              message={message.text}
              isUser={message.isUser}
              timestamp={message.timestamp}
            />
          ))}
          {isTyping && <TypingIndicator />}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {showQuickQuestions && messages.length === 1 && (
        <QuickQuestions questions={quickQuestions} onSelect={handleSend} />
      )}

      <ChatInput onSend={handleSend} disabled={isTyping} />
    </div>
  );
};

export default ChatContainer;
