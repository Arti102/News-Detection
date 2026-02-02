import React from 'react';
import { ShieldAlert, Moon, Sun } from 'lucide-react';
import { HeaderProps } from '../types'; // Import props type definition

export const Header: React.FC<HeaderProps> = ({ theme, toggleTheme }) => {
  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-white/80 dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-800 transition-colors duration-200">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between max-w-6xl">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 p-2 rounded-lg text-white shadow-lg shadow-blue-600/20">
            <ShieldAlert size={24} strokeWidth={2.5} />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white leading-none">
              AI FactGuard
            </h1>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">
              Strict Detection
            </span>
          </div>
        </div>
        
        <button
          onClick={toggleTheme}
          className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Toggle dark mode"
        >
          {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
        </button>
      </div>
    </header>
  );
};