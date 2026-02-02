import React, { useState, useEffect } from 'react';
// LoadingState component shown while AI analysis is in progress
export const LoadingState: React.FC = () => {
  const [message, setMessage] = useState("Initializing analysis engine...");

  useEffect(() => {
       // List of messages shown during different analysis phases
    const messages = [
      "Parsing text structure...",
      "Analyzing linguistic patterns...",
      "Detecting emotional manipulation...",
      "Cross-referencing claims...",
      "Verifying logic consistency...",
      "Finalizing verdict..."
    ];
     // Update message every 800ms
    let index = 0;
    const interval = setInterval(() => {
      index = (index + 1) % messages.length;
      setMessage(messages[index]);
    }, 800);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center py-12 animate-fade-in bg-white/50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700 backdrop-blur-sm">
      <div className="relative w-20 h-20 mb-6">
        <div className="absolute inset-0 border-4 border-slate-200 dark:border-slate-700 rounded-full"></div>
        <div className="absolute inset-0 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xl">🔍</span>
        </div>
      </div>
      <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-2 font-mono">
        {message}
      </h3>
      <p className="text-slate-500 dark:text-slate-400 text-xs uppercase tracking-widest font-semibold">
        Processing
      </p>
    </div>
  );
};