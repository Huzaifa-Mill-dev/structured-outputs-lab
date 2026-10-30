import React, { useState } from 'react';
import { Check, X, AlertCircle, Code, Sparkles } from 'lucide-react';

export const JsonFundamentals: React.FC = () => {
  const [testInput, setTestInput] = useState<string>(
`{
  // JavaScript objects allow comments, but JSON strictly forbids them!
  name: 'Alex',          // Error: single quotes & unquoted keys
  age: 25,
  isActive: true,
  skills: ["React", "TypeScript"],
  bio: undefined,        // Error: undefined does not exist in JSON
  login: function() {}   // Error: functions are forbidden in JSON
}`
  );

  const checkJsonValidity = (input: string) => {
    const issues: string[] = [];
    if (input.includes('//') || input.includes('/*')) {
      issues.push('Comments (// or /* */) are not permitted in JSON');
    }
    if (/'[^']*'/.test(input)) {
      issues.push("Single quotes (') are forbidden. JSON requires strict double quotes (\") for strings and keys");
    }
    if (/([a-zA-Z0-9_]+)\s*:/m.test(input) && !/"([a-zA-Z0-9_]+)"\s*:/m.test(input)) {
      issues.push('Unquoted object keys are forbidden. Every key must be enclosed in double quotes (e.g. "name")');
    }
    if (input.includes('undefined')) {
      issues.push('"undefined" is not a valid JSON type. Use "null" instead');
    }
    if (input.includes('function') || input.includes('=>')) {
      issues.push('Executable code/functions cannot be serialized to JSON');
    }
    if (/,\s*[}\]]/.test(input)) {
      issues.push('Trailing commas before closing brackets (e.g. [1, 2, ]) are invalid in standard JSON');
    }

    try {
      JSON.parse(input);
      return { isValid: true, error: null, issues: [] };
    } catch (e: any) {
      return { isValid: false, error: e.message, issues };
    }
  };

  const validation = checkJsonValidity(testInput);

  const formatValidJson = () => {
    const cleanObject = {
      name: "Alex",
      age: 25,
      isActive: true,
      skills: ["React", "TypeScript"],
      bio: null
    };
    setTestInput(JSON.stringify(cleanObject, null, 2));
  };

  const types = [
    { type: 'String', example: '"Alex"', desc: 'Text enclosed in strict double quotes (never single quotes).' },
    { type: 'Number', example: '25 or 99.95', desc: 'Integer or float. No NaN, Infinity, or hex notation.' },
    { type: 'Boolean', example: 'true / false', desc: 'Strictly lowercase true or false.' },
    { type: 'Object', example: '{"id": 1}', desc: 'Key-value pairs where every key is a double-quoted string.' },
    { type: 'Array', example: '["React", "Node"]', desc: 'Ordered list of items separated by commas.' },
    { type: 'Null', example: 'null', desc: 'Explicit empty or unassigned value. (undefined does not exist).' }
  ];

  return (
    <div className="space-y-8 max-w-6xl mx-auto py-2">
      {/* Intro */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <div className="inline-flex items-center space-x-2 px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-3">
          Layer 2 • Data Fundamentals
        </div>
        <h2 className="text-2xl font-bold text-white tracking-tight">
          JSON: The Lingua Franca of AI & Web APIs
        </h2>
        <p className="mt-2 text-slate-300 text-sm leading-relaxed">
          <strong>JSON (JavaScript Object Notation)</strong> is a standardized, language-agnostic data format. 
          While it was inspired by JavaScript object syntax, it is a strict <strong>data interchange format</strong>, not a programming language.
        </p>
      </div>

      {/* The 6 Data Types */}
      <div>
        <h3 className="text-base font-semibold text-white mb-3 flex items-center gap-2">
          <Code className="w-4 h-4 text-indigo-400" />
          The 6 Permitted JSON Data Types
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {types.map((t) => (
            <div key={t.type} className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 hover:border-slate-700 transition-colors">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-indigo-300 text-sm">{t.type}</span>
                <code className="bg-slate-950 px-2 py-0.5 rounded text-xs text-amber-300 font-mono border border-slate-800">
                  {t.example}
                </code>
              </div>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">{t.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* JavaScript Object vs JSON: Interactive Validator */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              Interactive Lab: JavaScript Object vs Strict JSON
            </h3>
            <p className="text-xs text-slate-400">
              Common beginner mistake: treating JavaScript object syntax as valid JSON. Test it below!
            </p>
          </div>
          <button
            onClick={formatValidJson}
            className="text-xs px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium transition-colors self-start sm:self-auto"
          >
            Load Valid JSON Example
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Editor */}
          <div>
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
              <span>Edit JSON text:</span>
              <span className="font-mono text-[11px] text-slate-500">Live JSON.parse() check</span>
            </div>
            <textarea
              value={testInput}
              onChange={(e) => setTestInput(e.target.value)}
              rows={11}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3.5 font-mono text-xs text-slate-200 focus:outline-none focus:border-indigo-500 leading-relaxed"
            />
          </div>

          {/* Real-time Diagnostics */}
          <div className="space-y-4 flex flex-col justify-between">
            <div>
              <div className="text-xs text-slate-400 mb-1.5 font-medium">Syntax Diagnostic:</div>
              <div
                className={`p-4 rounded-xl border flex items-start space-x-3 ${
                  validation.isValid
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                    : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
                }`}
              >
                {validation.isValid ? (
                  <Check className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                ) : (
                  <X className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                )}
                <div>
                  <div className="font-semibold text-sm">
                    {validation.isValid ? 'Valid Standard JSON' : 'Invalid JSON Syntax'}
                  </div>
                  <p className="text-xs mt-1 text-slate-300 leading-relaxed">
                    {validation.isValid
                      ? 'This document can be cleanly parsed by JSON.parse() and sent across APIs.'
                      : validation.error}
                  </p>
                </div>
              </div>

              {/* Detected issues list */}
              {validation.issues.length > 0 && (
                <div className="mt-3 bg-slate-950 border border-slate-800 rounded-xl p-3 space-y-1.5">
                  <div className="text-[11px] font-semibold text-amber-400 uppercase tracking-wider flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    Detected Violations ({validation.issues.length}):
                  </div>
                  <ul className="text-xs text-slate-300 space-y-1 pl-4 list-disc">
                    {validation.issues.map((issue, idx) => (
                      <li key={idx}>{issue}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Quick Summary Box */}
            <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800 text-xs text-slate-400">
              <strong className="text-slate-200">What JSON does NOT support:</strong>
              <div className="grid grid-cols-2 gap-2 mt-2 font-mono text-[11px] text-rose-300">
                <div>❌ No functions</div>
                <div>❌ No undefined</div>
                <div>❌ No comments</div>
                <div>❌ No trailing commas</div>
                <div>❌ No single quotes</div>
                <div>❌ No unquoted keys</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
