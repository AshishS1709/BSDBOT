import { MessageCircle } from "lucide-react";

const ChatHeader = () => {
  return (
    <div className="chat-header-bg px-6 py-4 rounded-t-lg flex items-center gap-3">
      <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
        <MessageCircle className="w-5 h-5 text-primary-foreground" />
      </div>
      <div>
        <h1 className="chat-header-text font-bold text-lg tracking-tight">
          BRANDSETU <span className="font-medium text-sm opacity-80">DIGITAL</span>
        </h1>
        <p className="text-xs text-white/60">Ask us anything!</p>
      </div>
      <div className="ml-auto flex items-center gap-1">
        <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
        <span className="text-xs text-white/60">Online</span>
      </div>
    </div>
  );
};

export default ChatHeader;
