import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { ApiKeyModal } from './components/ApiKeyModal';
import { ProblemDemo } from './components/tabs/ProblemDemo';
import { JsonFundamentals } from './components/tabs/JsonFundamentals';
import { JsonSchemaExplorer } from './components/tabs/JsonSchemaExplorer';
import { ConstrainedDecodingExplainer } from './components/tabs/ConstrainedDecodingExplainer';
import { JsonModeComparison } from './components/tabs/JsonModeComparison';
import { RosettaStone } from './components/tabs/RosettaStone';
import { LivePlayground } from './components/tabs/LivePlayground';
import { QuizSection } from './components/tabs/QuizSection';
import { RoadmapSection } from './components/tabs/RoadmapSection';
import type { TabType } from './types';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('problem');
  const [apiKey, setApiKey] = useState<string>(() => {
    return localStorage.getItem('gemini_api_key') || '';
  });
  const [selectedModel, setSelectedModel] = useState<string>(() => {
    return localStorage.getItem('gemini_model') || 'gemini-2.5-flash';
  });
  const [isKeyModalOpen, setIsKeyModalOpen] = useState<boolean>(false);

  useEffect(() => {
    if (apiKey) {
      localStorage.setItem('gemini_api_key', apiKey);
    } else {
      localStorage.removeItem('gemini_api_key');
    }
  }, [apiKey]);

  useEffect(() => {
    localStorage.setItem('gemini_model', selectedModel);
  }, [selectedModel]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Header */}
      <Header
        apiKey={apiKey}
        onOpenKeyModal={() => setIsKeyModalOpen(true)}
        activeTab={activeTab}
        onSelectTab={setActiveTab}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'problem' && <ProblemDemo />}
        {activeTab === 'json-basics' && <JsonFundamentals />}
        {activeTab === 'json-schema' && <JsonSchemaExplorer />}
        {activeTab === 'constrained-decoding' && <ConstrainedDecodingExplainer />}
        {activeTab === 'json-mode-vs-structured' && <JsonModeComparison />}
        {activeTab === 'rosetta-stone' && <RosettaStone />}
        {activeTab === 'playground' && (
          <LivePlayground
            apiKey={apiKey}
            selectedModel={selectedModel}
            onOpenKeyModal={() => setIsKeyModalOpen(true)}
          />
        )}
        {activeTab === 'quiz' && <QuizSection />}
        {activeTab === 'roadmap' && <RoadmapSection />}
      </main>

      {/* API Key Modal */}
      <ApiKeyModal
        isOpen={isKeyModalOpen}
        onClose={() => setIsKeyModalOpen(false)}
        apiKey={apiKey}
        onSaveKey={setApiKey}
        selectedModel={selectedModel}
        onSelectModel={setSelectedModel}
      />

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/80 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>
            Structured Outputs Interactive Lab • Designed for developers mastering JSON Schemas & LLM contracts.
          </p>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setActiveTab('playground')}
              className="text-slate-400 hover:text-white transition-colors"
            >
              Live Lab
            </button>
            <button
              onClick={() => setActiveTab('quiz')}
              className="text-slate-400 hover:text-white transition-colors"
            >
              Mini Quiz
            </button>
            <button
              onClick={() => setIsKeyModalOpen(true)}
              className="text-indigo-400 hover:text-indigo-300 transition-colors"
            >
              API Key Setup
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
