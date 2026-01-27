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
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      text: "Hey there! 👋 Welcome to Brandsetu Digital!\n\nI'm here to help you with any questions about our services, pricing, or how we can help grow your brand.\n\nWhat would you like to know?",
      isUser: false,
      timestamp: formatTime(new Date()),
    },
  ]);
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

  return (
    <div className="w-full max-w-md mx-auto h-[600px] flex flex-col rounded-lg shadow-2xl overflow-hidden border border-border/30">
      <ChatHeader />
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-card chat-scrollbar">
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

      {showQuickQuestions && messages.length === 1 && (
        <QuickQuestions questions={quickQuestions} onSelect={handleSend} />
      )}

      <ChatInput onSend={handleSend} disabled={isTyping} />
    </div>
  );
};

export default ChatContainer;
