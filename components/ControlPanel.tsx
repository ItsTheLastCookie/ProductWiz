import React, { useState } from 'react';
import { MARKETING_SCENARIOS, EDIT_SUGGESTIONS } from '../constants';
import { GenerationStatus } from '../types';

interface ControlPanelProps {
  onGenerateScenario: (scenarioId: string) => void;
  onGenerateCustom: (prompt: string, useHistorySource: boolean) => void;
  status: GenerationStatus;
  disabled: boolean;
  hasHistory: boolean;
}

const ControlPanel: React.FC<ControlPanelProps> = ({ 
  onGenerateScenario, 
  onGenerateCustom, 
  status,
  disabled,
  hasHistory
}) => {
  const [customPrompt, setCustomPrompt] = useState('');
  const [useHistorySource, setUseHistorySource] = useState(false);

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customPrompt.trim()) {
      onGenerateCustom(customPrompt, useHistorySource);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setCustomPrompt(suggestion);
  };

  const isLoading = status === 'loading';

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 transition-colors duration-300">
      
      {/* Marketing Scenarios */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-4 flex items-center gap-2">
          <span className="bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-300 p-1 rounded">✨</span> 
          Visualize in Mediums
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">
          Places your <b>original product</b> into these contexts.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 max-h-80 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-600 scrollbar-track-transparent">
          {MARKETING_SCENARIOS.map((scenario) => (
            <button
              key={scenario.id}
              onClick={() => onGenerateScenario(scenario.id)}
              disabled={disabled || isLoading}
              className={`
                flex flex-col items-center justify-center p-3 rounded-lg border transition-all duration-200 min-h-[100px]
                ${disabled 
                  ? 'opacity-50 cursor-not-allowed bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700' 
                  : 'hover:border-indigo-400 dark:hover:border-indigo-500 hover:shadow-md hover:-translate-y-1 bg-white dark:bg-slate-700/50 border-slate-200 dark:border-slate-600 cursor-pointer active:scale-95'
                }
              `}
            >
              <span className="text-2xl mb-2">{scenario.icon}</span>
              <span className="text-xs font-medium text-slate-700 dark:text-slate-300 text-center">{scenario.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Custom Edits */}
      <div>
        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-2 flex items-center gap-2">
          <span className="bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-300 p-1 rounded">✏️</span> 
          AI Edit with Text
        </h3>
        
        <form onSubmit={handleCustomSubmit} className="relative">
          {/* Source Toggle */}
          <div className="flex items-center justify-end mb-2">
            <label className={`
              flex items-center gap-2 text-xs font-medium cursor-pointer select-none transition-colors
              ${!hasHistory || disabled ? 'opacity-50 cursor-not-allowed text-slate-400' : 'text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400'}
            `}>
              <div className="relative">
                <input 
                  type="checkbox" 
                  className="sr-only peer"
                  checked={useHistorySource && hasHistory}
                  onChange={(e) => setUseHistorySource(e.target.checked)}
                  disabled={!hasHistory || disabled}
                />
                <div className="w-9 h-5 bg-slate-200 dark:bg-slate-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-indigo-300 dark:peer-focus:ring-indigo-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600"></div>
              </div>
              <span>Edit latest result</span>
            </label>
          </div>

          <input
            type="text"
            value={customPrompt}
            onChange={(e) => setCustomPrompt(e.target.value)}
            disabled={disabled || isLoading}
            placeholder={disabled ? "Upload an image first..." : "e.g., 'Add a retro filter', 'Remove background'"}
            className="w-full pl-4 pr-32 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-slate-50 dark:disabled:bg-slate-800/50 disabled:text-slate-400 dark:disabled:text-slate-500 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500"
          />
          <button
            type="submit"
            disabled={disabled || isLoading || !customPrompt.trim()}
            className={`
              absolute right-2 bottom-2 top-[38px] px-4 rounded-md font-medium text-sm transition-all
              ${disabled || !customPrompt.trim()
                ? 'bg-slate-200 dark:bg-slate-700 text-slate-400 dark:text-slate-500 cursor-not-allowed'
                : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm'
              }
            `}
          >
            {isLoading ? 'Generating...' : 'Generate'}
          </button>
        </form>

        {/* Suggestions */}
        {!disabled && (
          <div className="mt-4">
             <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-wide">AI Suggestions</p>
             <div className="flex flex-wrap gap-2">
               {EDIT_SUGGESTIONS.map((suggestion, idx) => (
                 <button
                   key={idx}
                   type="button"
                   onClick={() => handleSuggestionClick(suggestion)}
                   disabled={isLoading}
                   className="text-xs px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/40 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors border border-transparent hover:border-indigo-200 dark:hover:border-indigo-800"
                 >
                   {suggestion}
                 </button>
               ))}
             </div>
          </div>
        )}

        <p className="text-xs text-slate-400 dark:text-slate-600 mt-4 ml-1">
          Powered by Gemini 2.5 Flash Image ("Nano Banana")
        </p>
      </div>
    </div>
  );
};

export default ControlPanel;