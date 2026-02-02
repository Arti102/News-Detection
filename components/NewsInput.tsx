import React, { useState } from 'react';
import { ScanSearch, Eraser, FileText } from 'lucide-react';
import { NewsInputProps } from '../types';

export const NewsInput: React.FC<NewsInputProps> = ({ onAnalyze }) => {
  const [text, setText] = useState('');
 // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim().length >= 20) {
      onAnalyze(text);
    }
  };
 // Handle "Enter + Meta" (Cmd/Win) key shortcut for submission
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && e.metaKey) {
      if (text.trim().length >= 20) {
        onAnalyze(text);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-1 md:p-2 w-full">
      <div className="relative">
        <div className="flex justify-between items-center mb-3 px-1">
          <label htmlFor="news-input" className="flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider">
            <FileText size={16} className="text-blue-500" />
            Article Content
          </label>
          <span className={`text-xs font-mono ${text.length < 20 ? 'text-orange-500' : 'text-slate-400'}`}>
            {text.length} chars {text.length < 20 && '(min 20)'}
          </span>
        </div>
        
        <textarea
          id="news-input"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Paste the full article, headline, or claim here for strict verification..."
          className="w-full min-h-[220px] p-5 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-y text-base md:text-lg text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-600 transition-all shadow-inner font-normal leading-relaxed"
        />
        
        {text && (
          <button
            type="button"
            onClick={() => setText('')}
            className="absolute right-4 top-12 text-slate-400 hover:text-red-500 dark:hover:text-red-400 transition-colors p-2 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800"
            title="Clear text"
          >
            <Eraser size={18} />
          </button>
        )}
      </div>

      <div className="mt-6">
        <button
          type="submit"
          disabled={text.trim().length < 20}
          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-slate-300 disabled:to-slate-300 disabled:dark:from-slate-700 disabled:dark:to-slate-700 disabled:cursor-not-allowed text-white font-bold py-4 px-6 rounded-xl shadow-xl shadow-blue-900/10 transition-all duration-200 flex items-center justify-center gap-3 group transform active:scale-[0.98]"
        >
          <ScanSearch className="w-6 h-6 group-hover:scale-110 transition-transform" />
          <span className="text-lg">Analyze Now</span>
        </button>
        <p className="mt-4 text-xs text-center text-slate-400 dark:text-slate-500 max-w-lg mx-auto">
          Our system uses strict parameters. Satire and opinion pieces may be flagged if they contain misleading factual claims.
        </p>
      </div>
    </form>
  );
};