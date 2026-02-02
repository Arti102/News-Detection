import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { NewsInput } from './components/NewsInput';
import { AnalysisResult } from './components/AnalysisResult';
import { LoadingState } from './components/LoadingState';
import { analyzeNews } from './services/newsService';
import { AnalysisResponse, Theme } from './types';
import { AlertCircle } from 'lucide-react';

export default function App() {
  const [theme, setTheme] = useState<Theme>('light');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setTheme('dark');
    }
  }, []);

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const handleAnalyze = async (text: string) => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await analyzeNews(text);// Call API/service
      setResult(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred while analyzing the text.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setError(null);
  };

  return (
    <div className="min-h-screen flex flex-col transition-colors duration-200 bg-slate-50 dark:bg-slate-950 font-sans">
      <Header theme={theme} toggleTheme={toggleTheme} />
      
      <main className="flex-grow container mx-auto px-4 py-8 max-w-4xl">
        <div className="space-y-8">
          
          {!result && !loading && (
            <div className="text-center space-y-5 py-8 animate-fade-in">
              <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Truth Matters. <br />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
                  Verify Instantly.
                </span>
              </h1>
              <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
                Use our strict engine to detect fake news, satire, and propaganda with high-precision analysis.
              </p>
            </div>
          )}

          {!result && !loading && (
            <div className="bg-white dark:bg-slate-900/50 rounded-2xl shadow-xl shadow-slate-200/50 dark:shadow-none p-1 border border-slate-200 dark:border-slate-800 transition-all duration-300 hover:shadow-2xl">
              <NewsInput onAnalyze={handleAnalyze} />
            </div>
          )}

          {loading && <LoadingState />}

          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6 flex items-start gap-4 animate-fade-in">
              <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
              <div>
                <h3 className="text-lg font-bold text-red-800 dark:text-red-300 mb-1">Analysis Error</h3>
                <p className="text-red-600 dark:text-red-400">{error}</p>
                <button 
                  onClick={() => setError(null)}
                  className="mt-4 px-4 py-2 bg-red-100 hover:bg-red-200 dark:bg-red-900/40 dark:hover:bg-red-900/60 text-red-700 dark:text-red-200 rounded-lg text-sm font-medium transition-colors"
                >
                  Try Again
                </button>
              </div>
            </div>
          )}

          {result && (
            <AnalysisResult result={result} onReset={handleReset} />
          )}

        </div>
      </main>

      <footer className="py-8 text-center text-slate-500 dark:text-slate-400 text-sm border-t border-slate-200 dark:border-slate-800 mt-auto bg-white dark:bg-slate-900">
        <p>© {new Date().getFullYear()} AI FactGuard. Arti Kanwal.</p>
        <div className="flex justify-center gap-4 mt-2 opacity-60">
          <span>Strict Mode</span>
          <span>•</span>
          <span>Fact Verification</span>
          <span>•</span>
          <span>Stylistic Analysis</span>
        </div>
      </footer>
    </div>
  );
}