import { cn } from "@/lib/utils";

interface ChatMessageProps {
  message: string;
  isUser: boolean;
  timestamp?: string;
}

const ChatMessage = ({ message, isUser, timestamp }: ChatMessageProps) => {
  return (
    <div
      className={cn(
        "flex message-enter",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      <div
        className={cn(
          "max-w-[80%] px-4 py-3 rounded-2xl shadow-sm",
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
  );
};

export default ChatMessage;
