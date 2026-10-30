import React, { useState } from 'react';
import { Play, Sparkles, AlertCircle, CheckCircle, Clock, RefreshCw, Code, FileJson, Layout } from 'lucide-react';
import { PRESETS } from '../../data/presets';
import { callGemini, type GeminiResponseResult } from '../../services/gemini';

interface LivePlaygroundProps {
  apiKey: string;
  selectedModel: string;
  onOpenKeyModal: () => void;
}

export const LivePlayground: React.FC<LivePlaygroundProps> = ({
  apiKey,
  selectedModel,
  onOpenKeyModal
}) => {
  const [selectedPresetId, setSelectedPresetId] = useState<string>('expense-tracker');
  const [prompt, setPrompt] = useState<string>(PRESETS[0].userPrompt);
  const [systemInstruction, setSystemInstruction] = useState<string>(PRESETS[0].systemInstruction || '');
  const [schemaText, setSchemaText] = useState<string>(JSON.stringify(PRESETS[0].schema, null, 2));
  const [isStructured, setIsStructured] = useState<boolean>(true);
  
  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<GeminiResponseResult | null>(null);
  const [activeOutputTab, setActiveOutputTab] = useState<'ui' | 'json' | 'raw'>('ui');

  const handleSelectPreset = (presetId: string) => {
    setSelectedPresetId(presetId);
    const p = PRESETS.find((x) => x.id === presetId);
    if (p) {
      setPrompt(p.userPrompt);
      setSystemInstruction(p.systemInstruction || '');
      setSchemaText(JSON.stringify(p.schema, null, 2));
      setResult(null);
    }
  };

  const handleExecute = async () => {
    setLoading(true);
    setResult(null);

    let parsedSchema: Record<string, any> | undefined;
    if (isStructured) {
      try {
        parsedSchema = JSON.parse(schemaText);
      } catch (err: any) {
        setResult({
          text: '',
          parsedJson: null,
          isValidJson: false,
          matchesSchema: false,
          executionTimeMs: 0,
          isSimulated: false,
          error: 'Invalid JSON Schema syntax: ' + err.message
        });
        setLoading(false);
        return;
      }
    }

    const res = await callGemini({
      apiKey,
      model: selectedModel,
      prompt,
      systemInstruction: systemInstruction || undefined,
      schema: parsedSchema,
      isStructured
    });

    setResult(res);
    setLoading(false);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto py-2">
      {/* Top Banner / API Key status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-slate-900 border border-slate-800 rounded-2xl">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-indigo-600/20 text-indigo-400 rounded-xl border border-indigo-500/30">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-bold text-white text-base">Interactive Laboratory & API Studio</h2>
            <p className="text-xs text-slate-400">
              {apiKey
                ? `Running live against Google Gemini (${selectedModel})`
                : 'Running in built-in simulator mode. Enter an API key anytime for live Google requests.'}
            </p>
          </div>
        </div>

        <button
          onClick={onOpenKeyModal}
          className="text-xs self-start sm:self-auto bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-3 py-1.5 rounded-lg transition-colors"
        >
          {apiKey ? 'Change API Key / Model' : 'Connect Real Gemini Key'}
        </button>
      </div>

      {/* Preset Pickers */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        <span className="text-slate-400 font-medium shrink-0">Presets:</span>
        {PRESETS.map((p) => (
          <button
            key={p.id}
            onClick={() => handleSelectPreset(p.id)}
            className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors ${
              selectedPresetId === p.id
                ? 'bg-indigo-600 text-white'
                : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
            }`}
          >
            {p.name}
          </button>
        ))}
      </div>

      {/* Main Studio Grid: Inputs on Left, Output on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Input and Schema Configuration */}
        <div className="space-y-4">
          {/* Mode Switcher */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-300">Constrained Output Mode:</span>
            <div className="flex bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
              <button
                onClick={() => setIsStructured(false)}
                className={`px-3 py-1 rounded-md transition-all ${
                  !isStructured
                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30 font-semibold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Freeform (No Schema)
              </button>
              <button
                onClick={() => setIsStructured(true)}
                className={`px-3 py-1 rounded-md transition-all ${
                  isStructured
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-semibold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Structured (JSON Schema)
              </button>
            </div>
          </div>

          {/* User Prompt */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-2">
            <label className="block text-xs font-semibold text-slate-300">
              User Input / Prompt:
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={3}
              placeholder="e.g. I spent ₹450 on dinner at Domino's yesterday..."
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs text-white font-mono focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* JSON Schema (Visible when isStructured is true) */}
          {isStructured && (
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <FileJson className="w-3.5 h-3.5 text-indigo-400" />
                  responseSchema (JSON Schema definition):
                </label>
                <button
                  onClick={() => {
                    try {
                      const formatted = JSON.stringify(JSON.parse(schemaText), null, 2);
                      setSchemaText(formatted);
                    } catch {}
                  }}
                  className="text-[11px] text-indigo-400 hover:text-indigo-300"
                >
                  Format JSON
                </button>
              </div>
              <textarea
                value={schemaText}
                onChange={(e) => setSchemaText(e.target.value)}
                rows={11}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs text-indigo-300 font-mono focus:outline-none focus:border-indigo-500 leading-relaxed"
              />
            </div>
          )}

          {/* Run Button */}
          <button
            onClick={handleExecute}
            disabled={loading}
            className={`w-full py-3 px-4 rounded-xl font-bold text-sm text-white flex items-center justify-center space-x-2 shadow-lg transition-all ${
              loading
                ? 'bg-indigo-700/50 cursor-not-allowed'
                : 'bg-indigo-600 hover:bg-indigo-500 shadow-indigo-600/30'
            }`}
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Generating Model Output...</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" />
                <span>Run {isStructured ? 'Structured Output' : 'Freeform Output'}</span>
              </>
            )}
          </button>
        </div>

        {/* Right Column: Output Viewer */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between shadow-xl min-h-[500px]">
          <div>
            {/* Header with tabs */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <span className="font-semibold text-white text-sm">Model Response</span>
                {result && (
                  <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 font-mono flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {result.executionTimeMs}ms
                  </span>
                )}
                {result?.isSimulated && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20 font-medium">
                    Simulated
                  </span>
                )}
              </div>

              {/* View switch */}
              <div className="flex bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
                <button
                  onClick={() => setActiveOutputTab('ui')}
                  className={`px-2.5 py-1 rounded flex items-center gap-1 ${
                    activeOutputTab === 'ui' ? 'bg-indigo-600 text-white font-medium' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Layout className="w-3 h-3" />
                  <span>React UI</span>
                </button>
                <button
                  onClick={() => setActiveOutputTab('json')}
                  className={`px-2.5 py-1 rounded flex items-center gap-1 ${
                    activeOutputTab === 'json' ? 'bg-indigo-600 text-white font-medium' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <FileJson className="w-3 h-3" />
                  <span>Parsed Tree</span>
                </button>
                <button
                  onClick={() => setActiveOutputTab('raw')}
                  className={`px-2.5 py-1 rounded flex items-center gap-1 ${
                    activeOutputTab === 'raw' ? 'bg-indigo-600 text-white font-medium' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Code className="w-3 h-3" />
                  <span>Raw Text</span>
                </button>
              </div>
            </div>

            {/* Error Banner */}
            {result?.error && (
              <div className="mt-4 p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-xs text-rose-300 flex items-start space-x-2">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <span className="break-all">{result.error}</span>
              </div>
            )}

            {/* Content view */}
            <div className="mt-4">
              {!result && !loading && (
                <div className="text-center py-16 text-slate-500 text-xs space-y-2">
                  <Play className="w-8 h-8 mx-auto text-slate-600 stroke-[1.5]" />
                  <p>Click "Run Output" to inspect the model's generation.</p>
                </div>
              )}

              {loading && (
                <div className="text-center py-16 space-y-3">
                  <RefreshCw className="w-8 h-8 mx-auto text-indigo-400 animate-spin" />
                  <p className="text-xs text-slate-400">Enforcing schema and evaluating constraints...</p>
                </div>
              )}

              {result && !loading && (
                <>
                  {/* React UI Tab */}
                  {activeOutputTab === 'ui' && (
                    <div className="space-y-4">
                      {result.parsedJson ? (
                        <div className="p-5 rounded-xl border border-indigo-500/30 bg-gradient-to-br from-slate-950 to-slate-900 space-y-4">
                          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                            <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5">
                              <CheckCircle className="w-4 h-4" />
                              Component Rendered Seamlessly
                            </span>
                            <span className="text-[11px] text-slate-400">Zero Parsing Hacks Required</span>
                          </div>

                          {/* Dynamic Card rendering */}
                          {result.parsedJson.merchant ? (
                            // Expense card
                            <div className="flex items-center justify-between">
                              <div>
                                <h3 className="text-lg font-bold text-white">{result.parsedJson.merchant}</h3>
                                <div className="flex gap-2 mt-1">
                                  <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                                    {result.parsedJson.category || 'General'}
                                  </span>
                                  {result.parsedJson.isReimbursable && (
                                    <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                                      Reimbursable
                                    </span>
                                  )}
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="text-2xl font-black text-emerald-400 font-mono">
                                  ₹{result.parsedJson.amount}
                                </div>
                                <div className="text-xs text-slate-500 font-mono">{result.parsedJson.currency || 'INR'}</div>
                              </div>
                            </div>
                          ) : result.parsedJson.issue ? (
                            // Support ticket card
                            <div className="space-y-3">
                              <div className="flex items-center justify-between">
                                <span className="font-bold text-white text-sm">{result.parsedJson.issue}</span>
                                <span
                                  className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase ${
                                    result.parsedJson.priority === 'high'
                                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                                      : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                                  }`}
                                >
                                  {result.parsedJson.priority} priority
                                </span>
                              </div>
                              <div className="p-3 bg-slate-900 rounded-lg text-xs text-slate-300 border border-slate-800">
                                <div className="text-slate-400 text-[10px] uppercase font-semibold">Suggested Action</div>
                                <div className="mt-0.5 font-medium">{result.parsedJson.suggestedAction}</div>
                              </div>
                              <div className="flex gap-3 text-xs text-slate-400">
                                <div>Sentiment: <strong className="text-slate-200 capitalize">{result.parsedJson.sentiment}</strong></div>
                                <div>Refund Needed: <strong className={result.parsedJson.refundRequired ? 'text-emerald-400' : 'text-slate-400'}>{result.parsedJson.refundRequired ? 'Yes' : 'No'}</strong></div>
                              </div>
                            </div>
                          ) : result.parsedJson.candidateName ? (
                            // Resume analyzer card
                            <div className="space-y-3">
                              <div className="flex items-center justify-between">
                                <span className="font-bold text-white text-base">{result.parsedJson.candidateName}</span>
                                <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30 text-xs font-semibold">
                                  {result.parsedJson.experienceLevel} ({result.parsedJson.yearsOfExperience} yrs)
                                </span>
                              </div>
                              <div className="flex flex-wrap gap-1.5">
                                {Array.isArray(result.parsedJson.skills) &&
                                  result.parsedJson.skills.map((s: string, idx: number) => (
                                    <span key={idx} className="bg-slate-900 border border-slate-800 text-slate-200 text-xs px-2 py-0.5 rounded">
                                      {s}
                                    </span>
                                  ))}
                              </div>
                            </div>
                          ) : (
                            // Generic JSON viewer card
                            <div className="space-y-2">
                              {Object.entries(result.parsedJson).map(([k, v]) => (
                                <div key={k} className="flex justify-between p-2 rounded bg-slate-900 border border-slate-800 text-xs">
                                  <span className="font-mono text-indigo-300">{k}</span>
                                  <span className="font-mono text-emerald-300 font-semibold">{String(v)}</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="p-5 rounded-xl border border-rose-500/30 bg-slate-950 text-center space-y-2">
                          <AlertCircle className="w-6 h-6 text-rose-400 mx-auto" />
                          <div className="text-rose-300 font-bold text-sm">Cannot Render UI Component</div>
                          <p className="text-xs text-slate-400 max-w-sm mx-auto">
                            The model returned unstructured freeform text instead of schema JSON. Inspect the "Raw Text" tab to see the output.
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Parsed JSON Tab */}
                  {activeOutputTab === 'json' && (
                    <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 max-h-[360px] overflow-auto">
                      <pre className="font-mono text-xs text-emerald-300 whitespace-pre-wrap leading-relaxed">
                        {result.parsedJson
                          ? JSON.stringify(result.parsedJson, null, 2)
                          : '// Output could not be parsed as valid JSON'}
                      </pre>
                    </div>
                  )}

                  {/* Raw Text Tab */}
                  {activeOutputTab === 'raw' && (
                    <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 max-h-[360px] overflow-auto">
                      <pre className="font-mono text-xs text-slate-300 whitespace-pre-wrap leading-relaxed">
                        {result.text || '// Empty response'}
                      </pre>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Bottom explanation */}
          <div className="pt-4 border-t border-slate-800 text-[11px] text-slate-500">
            {isStructured
              ? '✅ Constrained decoding active: The model output is strictly bounded by the JSON Schema.'
              : '⚠️ Freeform mode active: The model is unconstrained and free to format however it chooses.'}
          </div>
        </div>
      </div>
    </div>
  );
};
