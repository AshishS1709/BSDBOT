import { cn } from "@/lib/utils";
import { Bot } from "lucide-react";

interface ChatMessageProps {
  message: string;
  isUser: boolean;
  timestamp?: string;
}

const ChatMessage = ({ message, isUser, timestamp }: ChatMessageProps) => {
  return (
    <div
      className={cn(
        "flex message-enter gap-2",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      {/* Bot Avatar */}
      {!isUser && (
        <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center flex-shrink-0 mt-1">
          <Bot className="w-5 h-5 text-secondary-foreground" />
        </div>
      )}
      
      <div className="flex flex-col">
        {/* Bot Name */}
        {!isUser && (
          <span className="text-xs font-semibold text-muted-foreground mb-1">BSD Bot</span>
        )}
        
        <div
          className={cn(
            "max-w-[280px] px-4 py-3 rounded-2xl shadow-sm",
            isUser
              ? "chat-bubble-user rounded-br-md"
              : "chat-bubble-bot rounded-bl-md border border-border/50"
          )}
        >
          <p className="text-sm leading-relaxed whitespace-pre-wrap">{message}</p>
          {timestamp && (
            <p
              className={cn(
                "text-[10px] mt-1",
                isUser ? "text-white/50" : "text-muted-foreground"
              )}
            >
              {timestamp}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
