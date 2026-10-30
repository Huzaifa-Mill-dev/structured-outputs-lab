import React, { useState } from 'react';
import { X, Key, ShieldCheck, Check, Sparkles, ExternalLink, RefreshCw } from 'lucide-react';
import { callGemini } from '../services/gemini';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  apiKey: string;
  onSaveKey: (key: string) => void;
  selectedModel: string;
  onSelectModel: (model: string) => void;
}

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({
  isOpen,
  onClose,
  apiKey,
  onSaveKey,
  selectedModel,
  onSelectModel
}) => {
  const [inputKey, setInputKey] = useState(apiKey);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  if (!isOpen) return null;

  const handleTestKey = async () => {
    if (!inputKey.trim()) {
      setTestResult({ success: false, message: 'Please enter an API key to test' });
      return;
    }
    setTesting(true);
    setTestResult(null);

    const res = await callGemini({
      apiKey: inputKey.trim(),
      model: selectedModel,
      prompt: 'Respond with a simple JSON object: {"status": "ok"}',
      isStructured: true,
      schema: {
        type: 'object',
        properties: { status: { type: 'string' } },
        required: ['status']
      }
    });

    setTesting(false);
    if (res.error) {
      setTestResult({ success: false, message: res.error });
    } else {
      setTestResult({ success: true, message: 'API connection verified successfully!' });
    }
  };

  const handleSave = () => {
    onSaveKey(inputKey.trim());
    onClose();
  };

  const handleClear = () => {
    setInputKey('');
    onSaveKey('');
    setTestResult(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-400">
              <Key className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-white">Gemini API Settings</h3>
              <p className="text-xs text-slate-400">Configure real-time model requests or use simulation</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Google Gemini API Key (Optional)
            </label>
            <div className="relative">
              <input
                type="password"
                value={inputKey}
                onChange={(e) => setInputKey(e.target.value)}
                placeholder="AIzaSy..."
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 font-mono"
              />
            </div>
            <p className="mt-1.5 text-xs text-slate-400 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              Stored strictly in your local browser storage. Sent directly to Google.
            </p>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">Model</label>
            <select
              value={selectedModel}
              onChange={(e) => onSelectModel(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
            >
              <option value="gemini-2.5-flash">Gemini 2.5 Flash (Fast & Full Structured Output support)</option>
              <option value="gemini-1.5-flash">Gemini 1.5 Flash</option>
              <option value="gemini-1.5-pro">Gemini 1.5 Pro</option>
            </select>
          </div>

          <div className="bg-slate-800/40 rounded-xl p-3.5 border border-slate-800 text-xs space-y-2">
            <div className="flex items-start justify-between gap-2">
              <span className="font-medium text-slate-200">Don't have an API key yet?</span>
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noreferrer"
                className="text-indigo-400 hover:text-indigo-300 flex items-center gap-1 shrink-0 font-medium"
              >
                Get one free from Google AI Studio
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <p className="text-slate-400 leading-relaxed">
              No key? No problem! The lab includes a built-in <strong>high-fidelity simulator</strong> that generates realistic structured responses and demonstrations so you can learn right away.
            </p>
          </div>

          {testResult && (
            <div
              className={`p-3 rounded-lg text-xs flex items-start space-x-2 border ${
                testResult.success
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                  : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
              }`}
            >
              {testResult.success ? (
                <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              ) : (
                <X className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              )}
              <span className="break-all">{testResult.message}</span>
            </div>
          )}
        </div>

        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
          <div className="flex space-x-2">
            <button
              onClick={handleClear}
              className="text-xs text-slate-400 hover:text-slate-200 px-2.5 py-1.5 rounded"
            >
              Reset to Simulator
            </button>
            <button
              onClick={handleTestKey}
              disabled={testing || !inputKey.trim()}
              className="text-xs bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-slate-200 px-3 py-1.5 rounded-lg flex items-center gap-1.5"
            >
              {testing ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3 text-indigo-400" />}
              Test Connection
            </button>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={onClose}
              className="px-3.5 py-1.5 text-xs text-slate-300 hover:bg-slate-800 rounded-lg"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-1.5 text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg shadow-md shadow-indigo-600/30"
            >
              Save Configuration
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
