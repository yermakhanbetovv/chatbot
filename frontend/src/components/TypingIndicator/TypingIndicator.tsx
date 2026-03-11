const DOT_DELAYS = ["0ms", "200ms", "400ms"];

export const TypingIndicator = () => {
  return (
    <div className="flex justify-start animate-fade-in-up">
      <div className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 shadow-sm backdrop-blur-sm">
        {DOT_DELAYS.map((delay) => (
          <span
            key={delay}
            aria-hidden="true"
            className="h-2 w-2 rounded-full bg-slate-400 animate-dot"
            style={{ animationDelay: delay }}
          />
        ))}
        <span className="text-xs font-medium text-slate-500">Ассистент печатает...</span>
      </div>
    </div>
  );
};
