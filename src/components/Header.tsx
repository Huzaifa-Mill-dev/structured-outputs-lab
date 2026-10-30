import React from 'react';
import { Sparkles, Key, CheckCircle2, AlertCircle, Code2, BookOpen } from 'lucide-react';

interface HeaderProps {
  apiKey: string;
  onOpenKeyModal: () => void;
  activeTab: string;
  onSelectTab: (tab: any) => void;
}

export const Header: React.FC<HeaderProps> = ({
  apiKey,
  onOpenKeyModal,
  activeTab,
  onSelectTab
}) => {
  return (
    <header className="border-b border-slate-800 bg-slate-900/90 backdrop-blur sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & title */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => onSelectTab('problem')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/25">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-lg text-white tracking-tight">StructuredOutputs<span className="text-indigo-400">.Lab</span></span>
                <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  Interactive
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">Master JSON Schemas & Constrained LLM Decoding by Building</p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center space-x-3">
            <button
              onClick={() => onSelectTab('playground')}
              className={`hidden md:inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'playground'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'bg-slate-800 text-slate-200 hover:bg-slate-700'
              }`}
            >
              <Code2 className="w-4 h-4" />
              <span>Live Playground</span>
            </button>

            {/* API Key Status Button */}
            <button
              onClick={onOpenKeyModal}
              className={`inline-flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                apiKey
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/20'
                  : 'bg-amber-500/10 border-amber-500/30 text-amber-300 hover:bg-amber-500/20'
              }`}
              title={apiKey ? 'Connected to Gemini API' : 'Using Simulation Mode. Click to add API Key'}
            >
              <Key className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">
                {apiKey ? 'Gemini API: Connected' : 'Mode: Simulator'}
              </span>
              <span className="sm:hidden">{apiKey ? 'API Live' : 'Simulated'}</span>
              {apiKey ? (
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
              )}
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 overflow-x-auto py-2 scrollbar-none border-t border-slate-800/80 text-sm">
          {[
            { id: 'problem', label: '1. The Problem', icon: AlertCircle },
            { id: 'json-basics', label: '2. JSON Basics', icon: Code2 },
            { id: 'json-schema', label: '3. JSON Schema', icon: BookOpen },
            { id: 'constrained-decoding', label: '4. Constrained Decoding', icon: Sparkles },
            { id: 'json-mode-vs-structured', label: '5. JSON Mode vs Structured', icon: CheckCircle2 },
            { id: 'rosetta-stone', label: '6. Rosetta Stone', icon: Code2 },
            { id: 'playground', label: '🧪 Live Lab', icon: Sparkles },
            { id: 'quiz', label: '7. Mini Quiz', icon: BookOpen },
            { id: 'roadmap', label: '8. Roadmap', icon: BookOpen },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onSelectTab(tab.id)}
                className={`whitespace-nowrap px-3 py-1.5 rounded-md font-medium text-xs sm:text-sm flex items-center space-x-1.5 transition-all ${
                  isActive
                    ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/40 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-indigo-400' : 'text-slate-500'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
