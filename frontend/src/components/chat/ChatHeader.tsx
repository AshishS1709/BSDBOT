import { MessageCircle, RotateCcw } from "lucide-react";

interface ChatHeaderProps {
  onClear?: () => void;
}

const ChatHeader = ({ onClear }: ChatHeaderProps) => {
  const brandText = "BRANDSETU";
  const digitalText = "DIGITAL";

  return (
    <div className="flex items-center justify-between px-4 py-3 bg-transparent rounded-t-[20px]">
      
      <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center overflow-hidden flex-shrink-0 shadow-md">
        <MessageCircle className="w-5 h-5 text-primary-foreground" />
      </div>
      
      <div className="flex flex-col leading-tight">
        <span className="text-black font-black text-lg tracking-tight flex">
          {brandText.split('').map((char, index) => (
            <span
              key={index}
              className="inline-block animate-float"
              style={{
                animationDelay: `${index * 0.1}s`
              }}
            >
              {char}
            </span>
          ))}
        </span>
        <span className="text-yellow-700 font-semibold text-xs tracking-wide -mt-0.5 flex">
          {digitalText.split('').map((char, index) => (
            <span
              key={index}
              className="inline-block animate-float"
              style={{
                animationDelay: `${index * 0.1}s`
              }}
            >
              {char}
            </span>
          ))}
        </span>
      </div>
      
      <div className="ml-auto flex items-center gap-3">
        {onClear && (
          <button
            onClick={onClear}
            className="p-1.5 rounded-full hover:bg-white/10 transition-colors"
            title="Clear chat"
          >
            <RotateCcw className="w-4 h-4 text-gray-600 hover:text-gray-800" />
          </button>
        )}
        <div className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
          <span className="text-xs text-gray-700">Online</span>
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;