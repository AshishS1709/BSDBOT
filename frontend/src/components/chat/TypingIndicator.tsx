const TypingIndicator = () => {
  return (
    <div className="flex justify-start message-enter">
      <div className="chat-bubble-bot px-4 py-3 rounded-2xl rounded-bl-md border border-border/50 shadow-sm">
        <div className="flex gap-1">
          <span className="typing-dot w-2 h-2 rounded-full bg-muted-foreground/50"></span>
          <span className="typing-dot w-2 h-2 rounded-full bg-muted-foreground/50"></span>
          <span className="typing-dot w-2 h-2 rounded-full bg-muted-foreground/50"></span>
        </div>
      </div>
    </div>
  );
};

export default TypingIndicator;
