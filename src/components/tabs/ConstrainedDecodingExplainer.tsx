import React, { useState } from 'react';
import { Cpu, Shield, Check, Ban } from 'lucide-react';

interface TokenItem {
  token: string;
  prob: string;
  valid: boolean;
  note?: string;
}

interface StepItem {
  currentText: string;
  nextExpected: string;
  validTokens: TokenItem[];
  maskedTokens: { token: string; reason: string }[];
}

export const ConstrainedDecodingExplainer: React.FC = () => {
  const [step, setStep] = useState(2);

  const steps: StepItem[] = [
    {
      currentText: '{',
      nextExpected: 'Field name or whitespace',
      validTokens: [
        { token: '"issue"', prob: '45%', valid: true },
        { token: '"priority"', prob: '30%', valid: true },
        { token: '"sentiment"', prob: '20%', valid: true }
      ],
      maskedTokens: [
        { token: 'Here is', reason: 'Invalid JSON start token' },
        { token: 'Sure,', reason: 'Conversational filler disallowed' },
        { token: '123', reason: 'Object must begin with key string' },
        { token: ']', reason: 'Mismatched closing bracket' }
      ]
    },
    {
      currentText: '{\n  "priority":',
      nextExpected: 'Whitespace or opening quote for enum string',
      validTokens: [
        { token: ' "', prob: '98%', valid: true },
        { token: '"', prob: '2%', valid: true }
      ],
      maskedTokens: [
        { token: ' true', reason: 'Expected string for priority, not boolean' },
        { token: ' 1', reason: 'Expected string for priority, not number' },
        { token: ' [', reason: 'Expected string for priority, not array' }
      ]
    },
    {
      currentText: '{\n  "priority": "',
      nextExpected: 'Enum value defined in schema: ["low", "medium", "high"]',
      validTokens: [
        { token: 'high', prob: '82%', valid: true, note: 'Matches customer complaint' },
        { token: 'medium', prob: '14%', valid: true, note: 'Valid enum candidate' },
        { token: 'low', prob: '4%', valid: true, note: 'Valid enum candidate' }
      ],
      maskedTokens: [
        { token: 'urgent', reason: 'MASKED (-∞): Not in enum ["low","medium","high"]' },
        { token: 'critical', reason: 'MASKED (-∞): Not in enum' },
        { token: 'P1', reason: 'MASKED (-∞): Not in enum' },
        { token: 'super urgent', reason: 'MASKED (-∞): Not in enum' }
      ]
    },
    {
      currentText: '{\n  "priority": "high",\n  "refundRequired":',
      nextExpected: 'Boolean value (true or false)',
      validTokens: [
        { token: ' true', prob: '96%', valid: true },
        { token: ' false', prob: '4%', valid: true }
      ],
      maskedTokens: [
        { token: ' "yes"', reason: 'String disallowed, must be boolean' },
        { token: ' 1', reason: 'Number disallowed, must be boolean' },
        { token: ' null', reason: 'Null disallowed for required boolean' }
      ]
    }
  ];

  const currentStepData = steps[step];

  return (
    <div className="space-y-8 max-w-6xl mx-auto py-2">
      {/* Intro */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <div className="inline-flex items-center space-x-2 px-2.5 py-1 rounded-full bg-purple-500/10 text-purple-400 text-xs font-semibold uppercase tracking-wider mb-3">
          Layer 4 • The Engine Under the Hood
        </div>
        <h2 className="text-2xl font-bold text-white tracking-tight">
          How Constrained Decoding Works Under the Hood
        </h2>
        <p className="mt-2 text-slate-300 text-sm leading-relaxed">
          Many developers assume the AI model is simply "trying its best" to follow your prompt instructions. 
          With <strong>Structured Outputs</strong>, the API actually applies a mathematical <strong>Grammar Mask (CFG/DFA)</strong> 
          during token generation. Any token that would violate your schema is filtered out before sampling.
        </p>
      </div>

      {/* Visual Token Step Interactive Simulator */}
      <div className="bg-slate-900/90 border border-purple-500/30 rounded-2xl p-6 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <Cpu className="w-5 h-5 text-purple-400" />
              <h3 className="font-bold text-white text-base">Interactive Token Logit Masking Simulator</h3>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Step through the generation process to see how illegal tokens are mathematically silenced.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {steps.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setStep(idx)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  step === idx
                    ? 'bg-purple-600 text-white font-bold shadow-md shadow-purple-600/30'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                Step {idx + 1}
              </button>
            ))}
          </div>
        </div>

        {/* Current Generated Text */}
        <div>
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
            <span className="font-semibold text-slate-300">Generated So Far:</span>
            <span className="text-purple-300 font-mono text-[11px] bg-purple-950/60 px-2.5 py-0.5 rounded border border-purple-500/20">
              Grammar State: {currentStepData.nextExpected}
            </span>
          </div>
          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 font-mono text-sm text-slate-100 flex items-center">
            <span className="text-emerald-400 whitespace-pre">{currentStepData.currentText}</span>
            <span className="w-2 h-4 bg-purple-500 ml-1 animate-pulse inline-block"></span>
          </div>
        </div>

        {/* Token Battle: Allowed vs Masked Out */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Allowed tokens */}
          <div className="bg-slate-950/80 border border-emerald-500/30 rounded-xl p-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5 uppercase tracking-wide">
                <Check className="w-4 h-4 text-emerald-400" />
                Permitted Tokens (Schema Valid)
              </span>
              <span className="text-[11px] text-slate-500 font-mono">Sampling Logits &gt; -∞</span>
            </div>
            <div className="space-y-2 mt-3">
              {currentStepData.validTokens.map((item, i) => (
                <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-emerald-500/5 border border-emerald-500/20 text-xs">
                  <div className="flex items-center gap-2">
                    <code className="text-emerald-300 font-bold bg-slate-900 px-2 py-0.5 rounded">
                      {item.token}
                    </code>
                    {item.note && <span className="text-slate-400 text-[11px]">{item.note}</span>}
                  </div>
                  <span className="font-mono text-emerald-400 font-semibold">{item.prob}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Masked out tokens */}
          <div className="bg-slate-950/80 border border-rose-500/30 rounded-xl p-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="text-xs font-bold text-rose-400 flex items-center gap-1.5 uppercase tracking-wide">
                <Ban className="w-4 h-4 text-rose-400" />
                Masked Tokens (Grammar Disallowed)
              </span>
              <span className="text-[11px] text-rose-400/80 font-mono">Logit = -∞ (Probability: 0%)</span>
            </div>
            <div className="space-y-2 mt-3">
              {currentStepData.maskedTokens.map((item, i) => (
                <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-rose-500/5 border border-rose-500/20 text-xs">
                  <code className="text-rose-300 line-through bg-slate-900 px-2 py-0.5 rounded">
                    {item.token}
                  </code>
                  <span className="text-rose-400/90 text-[11px] text-right">{item.reason}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Why this matters */}
        <div className="bg-purple-950/20 border border-purple-500/30 rounded-xl p-4 text-xs text-slate-300 leading-relaxed flex items-start gap-3">
          <Shield className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
          <div>
            <strong className="text-purple-300">Why does this guarantee 100% syntactic compliance?</strong>
            <p className="mt-1">
              Because token selection is restricted at the model's output layer before sampling, the model cannot physically pick a token like <code className="text-purple-200">"urgent"</code> if your enum is <code className="text-purple-200">["low", "medium", "high"]</code>. The model is forced to choose exclusively among grammatically permissible next tokens!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
