import { MessageCircle, RotateCcw } from "lucide-react";

interface ChatHeaderProps {
  onClear?: () => void;
}

const ChatHeader = ({ onClear }: ChatHeaderProps) => {
  return (
    <div className="chat-header-bg px-6 py-4 rounded-t-lg flex items-center gap-3">
      <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
        <MessageCircle className="w-5 h-5 text-primary-foreground" />
      </div>
      <div className="flex flex-col leading-tight">
        <span className="text-white font-black text-lg tracking-tight">BRANDSETU</span>
        <span className="chat-header-text font-medium text-xs -mt-0.5">DIGITAL</span>
      </div>
      <div className="ml-auto flex items-center gap-3">
        {onClear && (
          <button
            onClick={onClear}
            className="p-1.5 rounded-full hover:bg-white/10 transition-colors"
            title="Clear chat"
          >
            <RotateCcw className="w-4 h-4 text-white/60 hover:text-white" />
          </button>
        )}
        <div className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
          <span className="text-xs text-white/60">Online</span>
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;
