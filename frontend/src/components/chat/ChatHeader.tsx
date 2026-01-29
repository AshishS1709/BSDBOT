import { RotateCcw } from "lucide-react";

interface ChatHeaderProps {
  onClear?: () => void;
}

const ChatHeader = ({ onClear }: ChatHeaderProps) => {
  const logoUrl = "/image.png";

  return (
    <div className="flex items-center justify-between px-4 py-3 bg-transparent">

      {/* Left: Logo + Brand */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full overflow-hidden shadow-md bg-yellow-400">
          <img
            src={logoUrl}
            alt="Brandsetu Logo"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex flex-col leading-tight animate-wave">
          <span className="text-black font-black text-lg tracking-tight">
            BRANDSETU
          </span>
          <span className="text-yellow-700 font-semibold text-xs tracking-wide -mt-0.5">
            DIGITAL
          </span>
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-3">
        {onClear && (
          <button
            onClick={onClear}
            className="p-1.5 rounded-full hover:bg-black/10 transition"
            title="Clear chat"
          >
            <RotateCcw className="w-4 h-4 text-gray-700" />
          </button>
        )}

        <div className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
          <span className="text-xs text-gray-700">Online</span>
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;
