import React from 'react';
import { CheckCircle, XCircle, AlertTriangle, AlertOctagon, RefreshCw, BarChart2, Shield, Info, ExternalLink, Globe } from 'lucide-react';
import { AnalysisResponse } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';


// Define props interface for this component
interface AnalysisResultProps {
  result: AnalysisResponse;
  onReset: () => void;// Function to reset and analyze another article
}
// Main component to display analysis result

export const AnalysisResult: React.FC<AnalysisResultProps> = ({ result, onReset }) => {
  const { classification, confidence, summary, reasoning, redFlags, sources } = result;

  const isReal = classification === 'Real';
  const isFake = classification === 'Fake';
  const isSatire = classification === 'Satire';
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const isUnsure = classification === 'Unsure';

  let themeColor = '';
  let icon = null;
  let bgClass = '';
  let borderClass = '';

  if (isReal) {
    themeColor = 'text-green-600 dark:text-green-400';
    icon = <CheckCircle className="w-12 h-12 text-green-500" />;
    bgClass = 'bg-green-50 dark:bg-green-900/10';
    borderClass = 'border-green-200 dark:border-green-800';
  } else if (isFake) {
    themeColor = 'text-red-600 dark:text-red-400';
    icon = <XCircle className="w-12 h-12 text-red-600" />;
    bgClass = 'bg-red-50 dark:bg-red-900/10';
    borderClass = 'border-red-200 dark:border-red-800';
  } else if (isSatire) {
    themeColor = 'text-amber-600 dark:text-amber-400';
    icon = <AlertOctagon className="w-12 h-12 text-amber-500" />;
    bgClass = 'bg-amber-50 dark:bg-amber-900/10';
    borderClass = 'border-amber-200 dark:border-amber-800';
  } else {
    themeColor = 'text-slate-600 dark:text-slate-400';
    icon = <AlertTriangle className="w-12 h-12 text-slate-500" />;
    bgClass = 'bg-slate-50 dark:bg-slate-900/10';
    borderClass = 'border-slate-200 dark:border-slate-700';
  }

  const chartData = [
    { name: 'Confidence', value: confidence },
    { name: 'Uncertainty', value: 100 - confidence },
  ];
  
  const chartColors = isReal 
    ? ['#16a34a', '#dcfce7'] 
    : isFake 
      ? ['#dc2626', '#fee2e2'] 
      : isSatire
        ? ['#d97706', '#fef3c7']
        : ['#64748b', '#e2e8f0'];

  return (
    <div className="space-y-6 animate-fade-in-up">
      
      {/* Top Banner - Verdict */}
      <div className={`relative overflow-hidden rounded-3xl border-2 ${borderClass} ${bgClass} p-8 shadow-lg`}>
        <div className="relative z-10 flex flex-col md:flex-row gap-8 items-center justify-between">
          
          <div className="flex items-center gap-6">
            <div className={`p-4 rounded-2xl bg-white dark:bg-slate-900 shadow-sm`}>
              {icon}
            </div>
            <div>
              <div className="text-xs font-bold uppercase tracking-widest opacity-60 mb-1 dark:text-white">
                AI Verdict
              </div>
              <h2 className={`text-4xl md:text-5xl font-extrabold tracking-tight ${themeColor}`}>
                {classification.toUpperCase()}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-6">
             <div className="text-right hidden md:block">
                <div className="text-3xl font-bold text-slate-900 dark:text-white">{confidence}%</div>
                <div className="text-xs font-bold uppercase tracking-wider text-slate-500">Confidence</div>
             </div>
             <div className="w-20 h-20 relative">
               <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={30}
                      outerRadius={40}
                      startAngle={90}
                      endAngle={-270}
                      dataKey="value"
                      stroke="none"
                      isAnimationActive={true}
                    >
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={chartColors[index]} />
                      ))}
                    </Pie>
                  </PieChart>
               </ResponsiveContainer>
             </div>
          </div>
        </div>
      </div>

      {/* Summary Box */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-md border border-slate-100 dark:border-slate-700">
        <div className="flex items-start gap-4">
          <Info className="w-6 h-6 text-blue-500 shrink-0 mt-1" />
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg mb-2">Analysis Summary</h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-lg">
              {summary}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Left Col: Red Flags & Sources */}
        <div className="md:col-span-1 space-y-6">
          
          {/* Red Flags */}
          <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-6 border border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-2 mb-4 text-slate-900 dark:text-white font-bold">
              <Shield className="w-5 h-5" />
              <h3>Detected Signals</h3>
            </div>
            {redFlags.length > 0 ? (
              <ul className="space-y-3">
                {redFlags.map((flag, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-sm font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 p-3 rounded-lg border border-slate-100 dark:border-slate-800 shadow-sm">
                    <span className={`mt-1 w-2 h-2 rounded-full shrink-0 ${isReal ? 'bg-green-500' : 'bg-red-500'}`}></span>
                    {flag}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-slate-500 text-sm italic">No specific red flags detected.</p>
            )}
          </div>

          {/* Sources */}
          {sources && sources.length > 0 && (
            <div className="bg-blue-50 dark:bg-blue-900/10 rounded-2xl p-6 border border-blue-100 dark:border-blue-900/30">
              <div className="flex items-center gap-2 mb-4 text-blue-800 dark:text-blue-300 font-bold">
                <Globe className="w-5 h-5" />
                <h3>Verified Sources</h3>
              </div>
              <ul className="space-y-2">
                {sources.map((source, idx) => (
                  <li key={idx}>
                    <a 
                      href={source.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="group flex items-center justify-between p-3 rounded-lg bg-white/60 dark:bg-slate-900/60 hover:bg-white dark:hover:bg-slate-900 border border-blue-100 dark:border-blue-800 transition-all text-xs"
                    >
                      <span className="font-medium text-slate-700 dark:text-slate-300 truncate pr-2" title={source.title}>
                        {source.title}
                      </span>
                      <ExternalLink className="w-3 h-3 text-blue-500 opacity-50 group-hover:opacity-100" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Right Col: Technical Reasoning */}
        <div className="md:col-span-2 bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-100 dark:border-slate-700 shadow-sm h-full">
          <div className="flex items-center gap-2 mb-4 text-slate-900 dark:text-white font-bold">
            <BarChart2 className="w-5 h-5 text-indigo-500" />
            <h3>Detailed Technical Reasoning</h3>
          </div>
          <div className="prose dark:prose-invert max-w-none text-sm text-slate-600 dark:text-slate-300">
            <p className="whitespace-pre-line leading-7">{reasoning}</p>
          </div>
        </div>

      </div>

      <div className="flex justify-center pt-4">
        <button 
          onClick={onReset}
          className="flex items-center gap-2 px-6 py-3 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-medium transition-colors"
        >
          <RefreshCw size={18} />
          Check Another Article
        </button>
      </div>

      <div className="text-center text-xs text-slate-400 dark:text-slate-600 pt-8 pb-4">
        <p>Powered by Transformer AI + Google Search Grounding • Results are for informational purposes</p>
      </div>
    </div>
  );
};
