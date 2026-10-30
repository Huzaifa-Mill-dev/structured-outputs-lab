import React, { useState } from 'react';
import { AlertTriangle, CheckCircle, RefreshCw, Sparkles, XCircle } from 'lucide-react';

export const ProblemDemo: React.FC = () => {
  const [freeformOutputIndex, setFreeformOutputIndex] = useState(0);
  const [isSimulatingFreeform, setIsSimulatingFreeform] = useState(false);

  const freeformResponses = [
    {
      type: 'paragraph',
      text: "You spent ₹450. The merchant was Domino's. The category is Food. The transaction happened yesterday.",
      parsed: null,
      errorReason: "Returned prose/sentences. JSON.parse() throws SyntaxError: Unexpected token 'Y'"
    },
    {
      type: 'markdown_bullets',
      text: "- Amount: Rs. 450\n- Store: Domino's Pizza\n- Category: Dining\n- Date: Oct 29, 2026",
      parsed: null,
      errorReason: "Returned markdown bullet points. Your React code cannot read .amount or .merchant"
    },
    {
      type: 'hallucinated_keys',
      text: '{\n  "total_spent": 450,\n  "vendor": "Domino\'s",\n  "type": "Dinner"\n}',
      parsed: { total_spent: 450, vendor: "Domino's", type: "Dinner" },
      errorReason: "Valid JSON, but invented different keys! Used 'total_spent' instead of 'amount' and 'vendor' instead of 'merchant'."
    },
    {
      type: 'inconsistent_numbers',
      text: '{\n  "amount": "₹450 INR",\n  "merchant": "Domino\'s",\n  "category": "Food"\n}',
      parsed: { amount: "₹450 INR", merchant: "Domino's", category: "Food" },
      errorReason: "amount is a string with symbols ('₹450 INR') instead of a number! Math operations like amount * 1.18 will output NaN!"
    }
  ];

  const currentFreeform = freeformResponses[freeformOutputIndex];

  const handleNextFreeform = () => {
    setIsSimulatingFreeform(true);
    setTimeout(() => {
      setFreeformOutputIndex((prev) => (prev + 1) % freeformResponses.length);
      setIsSimulatingFreeform(false);
    }, 400);
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto py-2">
      {/* Introduction banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-indigo-500/20 rounded-2xl p-6 shadow-xl">
        <div className="max-w-3xl">
          <div className="inline-flex items-center space-x-2 px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-3">
            Layer 1 • Foundation
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Why Freeform AI Breaks Production Apps
          </h2>
          <p className="mt-2 text-slate-300 text-sm sm:text-base leading-relaxed">
            When you build software with React, Vue, or Node.js, your frontend expects <strong>predictable data shapes</strong>. 
            Standard LLMs are probabilistic text generators—without schema constraints, their response format fluctuates on every single request.
          </p>
        </div>
      </div>

      {/* The Scenario Box */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">The User Prompt</span>
            <div className="mt-1 text-lg font-medium text-white font-mono bg-slate-950 px-4 py-2.5 rounded-lg border border-slate-800/80 inline-block">
              "Analyse this transaction: I spent ₹450 on dinner at Domino's yesterday."
            </div>
          </div>
          <div className="text-xs text-slate-400 sm:text-right">
            Expected by your React UI:
            <div className="font-mono text-indigo-400 mt-1 font-semibold">{`{ amount: number, merchant: string, category: string }`}</div>
          </div>
        </div>
      </div>

      {/* Side by side comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Freeform LLM */}
        <div className="bg-slate-900/90 border border-rose-500/30 rounded-2xl p-5 flex flex-col justify-between shadow-lg">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse"></span>
                <h3 className="font-semibold text-white text-base">Standard Freeform LLM (Prompt Only)</h3>
              </div>
              <button
                onClick={handleNextFreeform}
                disabled={isSimulatingFreeform}
                className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1.5 rounded-lg flex items-center space-x-1.5 transition-colors border border-slate-700"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isSimulatingFreeform ? 'animate-spin' : ''}`} />
                <span>Simulate Next Call ({freeformOutputIndex + 1}/4)</span>
              </button>
            </div>

            <div className="mt-4">
              <span className="text-xs font-medium text-slate-400">Raw Model Output:</span>
              <pre className="mt-1.5 p-3.5 bg-slate-950 rounded-xl font-mono text-xs text-rose-300 border border-slate-800 whitespace-pre-wrap min-h-[90px] leading-relaxed">
                {currentFreeform.text}
              </pre>
            </div>

            {/* Why this breaks React */}
            <div className="mt-4 p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-xs text-rose-200 flex items-start space-x-2">
              <XCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <div>
                <strong>Application Failure:</strong> {currentFreeform.errorReason}
              </div>
            </div>

            {/* What the React component does */}
            <div className="mt-4">
              <span className="text-xs font-medium text-slate-400">React Frontend Render Result:</span>
              <div className="mt-1.5 p-4 rounded-xl border border-rose-500/40 bg-slate-950 flex flex-col items-center justify-center min-h-[130px] text-center">
                {currentFreeform.type === 'paragraph' || currentFreeform.type === 'markdown_bullets' ? (
                  <div className="text-rose-400 text-xs font-mono space-y-1">
                    <div className="font-bold flex items-center justify-center gap-1 text-sm">
                      <AlertTriangle className="w-4 h-4" /> Uncaught SyntaxError
                    </div>
                    <div>Unexpected token in JSON at position 0</div>
                    <div className="text-slate-500 text-[11px] mt-1">Component failed to mount & screen goes blank</div>
                  </div>
                ) : currentFreeform.type === 'hallucinated_keys' ? (
                  <div className="text-slate-300 text-xs w-full">
                    <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg">
                      <div className="text-slate-500 text-[11px]">Merchant:</div>
                      <div className="text-amber-400 font-mono font-semibold">undefined</div>
                      <div className="text-slate-500 text-[11px] mt-2">Amount:</div>
                      <div className="text-amber-400 font-mono font-semibold">undefined</div>
                      <div className="text-xs text-rose-400 mt-2">⚠️ App broke because keys were named "vendor" and "total_spent"</div>
                    </div>
                  </div>
                ) : (
                  <div className="text-slate-300 text-xs w-full">
                    <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg">
                      <div className="text-slate-500 text-[11px]">Total with 18% Tax:</div>
                      <div className="text-rose-400 font-mono font-bold text-sm">₹NaN</div>
                      <div className="text-xs text-slate-400 mt-1">String calculation: <code>"₹450 INR" * 1.18 = NaN</code></div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="mt-5 text-xs text-slate-400 bg-slate-950/60 p-3 rounded-lg border border-slate-800">
            ❌ <strong>Result:</strong> Requires 50+ lines of fragile regex, string cleaning, fallback error handlers, and prayer.
          </div>
        </div>

        {/* Right: Structured Outputs */}
        <div className="bg-slate-900/90 border border-emerald-500/40 rounded-2xl p-5 flex flex-col justify-between shadow-lg">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
                <h3 className="font-semibold text-white text-base">Structured Output (JSON Schema Constrained)</h3>
              </div>
              <span className="text-xs px-2.5 py-1 bg-emerald-500/10 text-emerald-400 rounded-full font-medium border border-emerald-500/20">
                100% Reliable
              </span>
            </div>

            <div className="mt-4">
              <span className="text-xs font-medium text-slate-400">Raw Model Output (Schema Enforced):</span>
              <pre className="mt-1.5 p-3.5 bg-slate-950 rounded-xl font-mono text-xs text-emerald-300 border border-emerald-500/20 whitespace-pre-wrap min-h-[90px] leading-relaxed">
{`{
  "amount": 450,
  "currency": "INR",
  "merchant": "Domino's",
  "category": "Food",
  "isReimbursable": true
}`}
              </pre>
            </div>

            {/* Why this succeeds */}
            <div className="mt-4 p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-xs text-emerald-200 flex items-start space-x-2">
              <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <strong>Guaranteed Shape:</strong> The model was mathematically constrained at generation time. Types and property names are guaranteed!
              </div>
            </div>

            {/* What the React component does */}
            <div className="mt-4">
              <span className="text-xs font-medium text-slate-400">React Frontend Render Result:</span>
              <div className="mt-1.5 p-4 rounded-xl border border-emerald-500/30 bg-gradient-to-br from-slate-950 to-slate-900 flex items-center justify-between min-h-[130px]">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-base font-bold text-white">Domino's</span>
                    <span className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                      Food
                    </span>
                    <span className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      Reimbursable
                    </span>
                  </div>
                  <div className="text-xs text-slate-400">Parsed directly with zero parsing errors</div>
                </div>
                <div className="text-right">
                  <div className="text-xl font-extrabold text-emerald-400 font-mono">
                    ₹450.00
                  </div>
                  <div className="text-[11px] text-slate-400 font-mono">INR • Tax: ₹81.00</div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-5 text-xs text-emerald-300 bg-emerald-950/20 p-3 rounded-lg border border-emerald-500/30">
            ✅ <strong>Result:</strong> Clean React code: <code>const {`{ amount, merchant }`} = await res.json();</code> without any try/catch regex mess!
          </div>
        </div>
      </div>

      {/* Key Takeaway Formula */}
      <div className="p-5 rounded-2xl bg-indigo-950/30 border border-indigo-500/30 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-indigo-600 rounded-xl text-white">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-semibold text-white text-sm">The Core Equation for Software Engineering with AI</h4>
            <p className="text-xs text-slate-300">
              <span className="text-indigo-300 font-mono font-semibold">LLM Intelligence</span> + <span className="text-emerald-300 font-mono font-semibold">JSON Schema Contract</span> = <span className="text-white font-mono font-bold">Reliable Software Integration</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
