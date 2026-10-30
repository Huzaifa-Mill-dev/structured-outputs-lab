import React, { useState } from 'react';
import { Check, X, Sparkles, Scale, CheckCircle2 } from 'lucide-react';

export const JsonModeComparison: React.FC = () => {
  const [activeScenario, setActiveScenario] = useState<'enum' | 'missing_keys' | 'types'>('enum');

  const comparisons = [
    {
      feature: 'Valid JSON Syntax Guarantee',
      jsonMode: 'Yes (Output is parseable by JSON.parse)',
      jsonModeStatus: true,
      structured: 'Yes (Guaranteed valid JSON)',
      structuredStatus: true,
      note: 'Both ensure no broken brackets or syntax errors.'
    },
    {
      feature: 'Enforces Required Fields',
      jsonMode: 'No (Prompt-dependent, can omit fields)',
      jsonModeStatus: false,
      structured: 'Yes (All required fields are guaranteed)',
      structuredStatus: true,
      note: 'JSON mode might skip "merchant" if it cannot detect it, while structured outputs forces a valid string or null.'
    },
    {
      feature: 'Strict Enum Values Restriction',
      jsonMode: 'No (May hallucinate "critical" instead of "high")',
      jsonModeStatus: false,
      structured: 'Yes (Mathematically limited to defined enums)',
      structuredStatus: true,
      note: 'Essential when storing statuses in databases or TypeScript enums.'
    },
    {
      feature: 'Prevents Unexpected Extra Keys',
      jsonMode: 'No (Model can add arbitrary metadata keys)',
      jsonModeStatus: false,
      structured: 'Yes (via additionalProperties: false)',
      structuredStatus: true,
      note: 'Stops prompt injection and hallucinated attributes from polluting payloads.'
    },
    {
      feature: 'Type Safety & Schema Conformance',
      jsonMode: 'Weak (Relies purely on prompt instructions)',
      jsonModeStatus: false,
      structured: 'Strict (Grammar-enforced at generation time)',
      structuredStatus: true,
      note: 'Recommended by OpenAI, Google Gemini, and Anthropic for software pipelines.'
    }
  ];

  const scenarios = {
    enum: {
      title: 'Enum Constraint Failure',
      prompt: 'Classify this ticket: "Server is completely on fire, all customers down!" Allowed priorities: ["low", "medium", "high"]',
      jsonModeOutput: `{\n  "ticket_id": "T-992",\n  "priority": "CRITICAL EMERGENCY",  // ❌ Hallucinated value not in enum!\n  "status": "investigating"\n}`,
      structuredOutput: `{\n  "priority": "high",  // ✅ Strictly selected highest permitted enum\n  "issue": "Server downtime affecting all customers"\n}`,
      explanation: 'In JSON Mode, the model\'s excitement causes it to generate "CRITICAL EMERGENCY" because the tokens are semantically relevant, even though your code only accepts "low" | "medium" | "high". Structured Outputs physically forbids any token other than the 3 in your enum.'
    },
    missing_keys: {
      title: 'Missing Required Fields',
      prompt: 'Extract candidate details: "We had a brief call with a candidate yesterday. Good vibes."',
      jsonModeOutput: `{\n  "notes": "Candidate had good vibes"  // ❌ Omitted "yearsOfExperience" & "skills"!\n}`,
      structuredOutput: `{\n  "candidateName": "Unknown",\n  "yearsOfExperience": 0,\n  "skills": [],\n  "knowsReact": false,\n  "experienceLevel": "Junior"  // ✅ Guaranteed all 5 required fields\n}`,
      explanation: 'In JSON Mode, if input text is sparse, the model simply forgets fields. In Structured Outputs, the generation cannot terminate until all required fields are instantiated.'
    },
    types: {
      title: 'Data Type Corruption',
      prompt: 'Analyze transaction: "I bought lunch for 12 dollars"',
      jsonModeOutput: `{\n  "amount": "$12.00 USD",  // ❌ Corrupted number into currency string!\n  "category": "Lunch"\n}`,
      structuredOutput: `{\n  "amount": 12,  // ✅ Enforced numeric type\n  "currency": "USD",\n  "category": "Food"\n}`,
      explanation: 'JSON mode often injects dollar signs, units, or text strings into numeric fields, causing math calculations to fail with NaN in JavaScript.'
    }
  };

  const currentScenario = scenarios[activeScenario];

  return (
    <div className="space-y-8 max-w-6xl mx-auto py-2">
      {/* Intro */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <div className="inline-flex items-center space-x-2 px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-3">
          Layer 5 • Crucial Distinction
        </div>
        <h2 className="text-2xl font-bold text-white tracking-tight">
          JSON Mode vs Structured Outputs
        </h2>
        <p className="mt-2 text-slate-300 text-sm leading-relaxed">
          These two features sound identical, but they operate at fundamentally different reliability tiers. 
          <strong> JSON Mode</strong> only checks for valid syntax brackets, whereas <strong>Structured Outputs</strong> enforces your schema contract via constrained decoding.
        </p>
      </div>

      {/* Comparison Matrix Table */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="p-5 border-b border-slate-800">
          <h3 className="font-bold text-white text-base flex items-center gap-2">
            <Scale className="w-5 h-5 text-indigo-400" />
            Head-to-Head Comparison Matrix
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/80 uppercase text-[11px] font-semibold text-slate-400 border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Feature / Capability</th>
                <th className="py-3 px-4 text-amber-400">JSON Mode</th>
                <th className="py-3 px-4 text-emerald-400">Structured Outputs</th>
                <th className="py-3 px-4 hidden md:table-cell text-slate-400">Developer Impact</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {comparisons.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-3.5 px-4 font-sans font-medium text-white">{row.feature}</td>
                  <td className="py-3.5 px-4">
                    <div className="flex items-center space-x-1.5">
                      {row.jsonModeStatus ? (
                        <Check className="w-4 h-4 text-amber-400 shrink-0" />
                      ) : (
                        <X className="w-4 h-4 text-rose-400 shrink-0" />
                      )}
                      <span className={row.jsonModeStatus ? 'text-amber-300' : 'text-slate-400'}>
                        {row.jsonMode}
                      </span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="flex items-center space-x-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span className="text-emerald-300 font-semibold">{row.structured}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 hidden md:table-cell font-sans text-slate-400 text-[11px]">
                    {row.note}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Interactive Battle Simulator */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              Live Battle Scenarios
            </h3>
            <p className="text-xs text-slate-400">
              See what actually happens when challenging edge cases hit both modes.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveScenario('enum')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeScenario === 'enum'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              1. Enum Failure
            </button>
            <button
              onClick={() => setActiveScenario('missing_keys')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeScenario === 'missing_keys'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              2. Missing Fields
            </button>
            <button
              onClick={() => setActiveScenario('types')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeScenario === 'types'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              3. Type Corruption
            </button>
          </div>
        </div>

        {/* The Prompt */}
        <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs">
          <span className="text-slate-500 font-semibold uppercase tracking-wider text-[10px]">Test Prompt</span>
          <p className="mt-1 font-mono text-slate-200">{currentScenario.prompt}</p>
        </div>

        {/* Side by Side Results */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* JSON Mode output */}
          <div className="bg-slate-950 rounded-xl p-4 border border-amber-500/30">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="text-xs font-bold text-amber-400">JSON Mode Result</span>
              <span className="text-[10px] bg-amber-500/10 text-amber-300 px-2 py-0.5 rounded border border-amber-500/20 font-mono">
                Valid JSON, Broken Contract
              </span>
            </div>
            <pre className="mt-3 text-xs font-mono text-amber-200/90 leading-relaxed whitespace-pre-wrap">
              {currentScenario.jsonModeOutput}
            </pre>
          </div>

          {/* Structured Output */}
          <div className="bg-slate-950 rounded-xl p-4 border border-emerald-500/30">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="text-xs font-bold text-emerald-400">Structured Output Result</span>
              <span className="text-[10px] bg-emerald-500/10 text-emerald-300 px-2 py-0.5 rounded border border-emerald-500/20 font-mono">
                Schema Guaranteed
              </span>
            </div>
            <pre className="mt-3 text-xs font-mono text-emerald-300 leading-relaxed whitespace-pre-wrap">
              {currentScenario.structuredOutput}
            </pre>
          </div>
        </div>

        {/* Explanation */}
        <div className="p-3.5 bg-slate-800/40 rounded-xl border border-slate-800 text-xs text-slate-300 leading-relaxed">
          <strong className="text-indigo-300">Why this happens: </strong>
          {currentScenario.explanation}
        </div>
      </div>
    </div>
  );
};
