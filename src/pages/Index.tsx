import ChatContainer from "@/components/chat/ChatContainer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-secondary/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary/5 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
      
      {/* Header */}
      <div className="text-center mb-8 z-10">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/10 border border-secondary/20 mb-4">
          <span className="text-xs font-semibold text-foreground">⭐ Award-Winning Marketing Agency</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-black text-foreground mb-2 tracking-tight">
          BUILD <span className="text-secondary">YOUR</span> BRAND
        </h1>
        <p className="text-sm text-foreground/70 max-w-md mx-auto">
          We help businesses grow with result-driven digital marketing strategies
        </p>
      </div>

      {/* Chat Container */}
      <div className="relative z-10">
        <ChatContainer />
      </div>

      {/* Footer */}
      <div className="mt-8 text-center z-10">
        <p className="text-xs text-foreground/50">
          Powered by Brandsetu Digital • Fast Results ⚡
        </p>
      </div>
    </div>
  );
};

export default Index;
