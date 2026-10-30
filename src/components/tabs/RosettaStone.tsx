import React, { useState } from 'react';
import { Copy, Check, Sparkles } from 'lucide-react';
import { PRESETS } from '../../data/presets';

export const RosettaStone: React.FC = () => {
  const [selectedPresetId, setSelectedPresetId] = useState<string>('expense-tracker');
  const [activeFormat, setActiveFormat] = useState<'schema' | 'ts' | 'zod' | 'pydantic' | 'gemini_sdk' | 'openai_sdk'>('ts');
  const [copied, setCopied] = useState(false);

  const preset = PRESETS.find((p) => p.id === selectedPresetId) || PRESETS[0];

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const getCodeSnippet = () => {
    if (preset.id === 'expense-tracker') {
      switch (activeFormat) {
        case 'schema':
          return JSON.stringify(preset.schema, null, 2);
        case 'ts':
          return `// TypeScript Interface
export type Currency = 'INR' | 'USD' | 'EUR' | 'GBP';
export type ExpenseCategory = 'Food' | 'Transportation' | 'Entertainment' | 'Utilities' | 'Shopping';

export interface ExpenseRecord {
  /** The numeric transaction amount spent */
  amount: number;
  /** Standard 3-letter currency code */
  currency: Currency;
  /** The store, merchant, or restaurant name */
  merchant: string;
  /** Categorization for personal budgeting */
  category: ExpenseCategory;
  /** Whether this looks like a business or group expense */
  isReimbursable: boolean;
}`;
        case 'zod':
          return `// Zod Schema (TypeScript / Node.js)
import { z } from 'zod';

export const ExpenseSchema = z.object({
  amount: z.number().describe('The numeric transaction amount spent'),
  currency: z.enum(['INR', 'USD', 'EUR', 'GBP']),
  merchant: z.string().describe('The store, merchant, or restaurant name'),
  category: z.enum(['Food', 'Transportation', 'Entertainment', 'Utilities', 'Shopping']),
  isReimbursable: z.boolean().describe('Whether this looks like a business or group expense')
}).strict(); // strict() prevents additional properties

export type ExpenseRecord = z.infer<typeof ExpenseSchema>;`;
        case 'pydantic':
          return `# Pydantic Model (Python / FastAPI / LangChain)
from typing import Literal
from pydantic import BaseModel, Field

class ExpenseRecord(BaseModel):
    amount: float = Field(..., description="The numeric transaction amount spent")
    currency: Literal['INR', 'USD', 'EUR', 'GBP']
    merchant: str = Field(..., description="The store, merchant, or restaurant name")
    category: Literal['Food', 'Transportation', 'Entertainment', 'Utilities', 'Shopping']
    is_reimbursable: bool = Field(..., description="Whether this looks like a business or group expense")`;
        case 'gemini_sdk':
          return `// Google Gemini API / SDK Call
import { GoogleGenAI, Type } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const response = await ai.models.generateContent({
  model: 'gemini-2.5-flash',
  contents: "I spent ₹450 on dinner at Domino's yesterday.",
  config: {
    responseMimeType: 'application/json',
    responseSchema: ${JSON.stringify(preset.schema, null, 4)}
  }
});

const data = JSON.parse(response.text);
console.log(data.merchant); // "Domino's"
console.log(data.amount);   // 450`;
        case 'openai_sdk':
          return `// OpenAI SDK Call
import OpenAI from 'openai';

const client = new OpenAI();

const response = await client.chat.completions.create({
  model: 'gpt-4o-mini',
  messages: [
    { role: 'user', content: "I spent ₹450 on dinner at Domino's yesterday." }
  ],
  response_format: {
    type: 'json_schema',
    json_schema: {
      name: 'expense_record',
      strict: true,
      schema: ${JSON.stringify(preset.schema, null, 6)}
    }
  }
});

const data = JSON.parse(response.choices[0].message.content);
console.log(data.merchant); // "Domino's"`;
      }
    }

    if (preset.id === 'support-ticket') {
      switch (activeFormat) {
        case 'schema':
          return JSON.stringify(preset.schema, null, 2);
        case 'ts':
          return `// TypeScript Interface
export type PriorityLevel = 'low' | 'medium' | 'high';
export type Sentiment = 'positive' | 'neutral' | 'frustrated';

export interface SupportTicketAnalysis {
  issue: string;
  priority: PriorityLevel;
  sentiment: Sentiment;
  refundRequired: boolean;
  suggestedAction: string;
}`;
        case 'zod':
          return `import { z } from 'zod';

export const SupportTicketSchema = z.object({
  issue: z.string(),
  priority: z.enum(['low', 'medium', 'high']),
  sentiment: z.enum(['positive', 'neutral', 'frustrated']),
  refundRequired: z.boolean(),
  suggestedAction: z.string()
}).strict();`;
        case 'pydantic':
          return `from typing import Literal
from pydantic import BaseModel, Field

class SupportTicket(BaseModel):
    issue: str
    priority: Literal['low', 'medium', 'high']
    sentiment: Literal['positive', 'neutral', 'frustrated']
    refund_required: bool
    suggested_action: str`;
        default:
          return JSON.stringify(preset.schema, null, 2);
      }
    }

    return JSON.stringify(preset.schema, null, 2);
  };

  const code = getCodeSnippet();

  return (
    <div className="space-y-8 max-w-6xl mx-auto py-2">
      {/* Intro */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <div className="inline-flex items-center space-x-2 px-2.5 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-3">
          Layer 6 • Developer Rosetta Stone
        </div>
        <h2 className="text-2xl font-bold text-white tracking-tight">
          One Schema, Multiple Languages
        </h2>
        <p className="mt-2 text-slate-300 text-sm leading-relaxed">
          Whether you're developing in React with <strong>TypeScript & Zod</strong>, or writing backend services in Python with <strong>Pydantic</strong>, 
          the underlying contract resolves to the exact same JSON Schema standard.
        </p>
      </div>

      {/* Preset and Format Selector */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <label className="text-xs font-medium text-slate-400 block mb-1">Select Domain Preset:</label>
            <div className="flex flex-wrap gap-2">
              {PRESETS.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setSelectedPresetId(p.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    selectedPresetId === p.id
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {p.name}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={() => handleCopy(code)}
            className="self-start sm:self-end flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied to Clipboard!' : 'Copy Code'}</span>
          </button>
        </div>

        {/* Format tabs */}
        <div className="flex space-x-2 overflow-x-auto pb-1 text-xs">
          {[
            { id: 'ts', label: 'TypeScript Type' },
            { id: 'zod', label: 'Zod (React/Node)' },
            { id: 'pydantic', label: 'Pydantic (Python)' },
            { id: 'schema', label: 'Raw JSON Schema' },
            { id: 'gemini_sdk', label: 'Gemini SDK (JS)' },
            { id: 'openai_sdk', label: 'OpenAI SDK (JS)' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveFormat(tab.id as any)}
              className={`px-3.5 py-2 rounded-xl font-medium whitespace-nowrap transition-all ${
                activeFormat === tab.id
                  ? 'bg-indigo-600/30 text-indigo-300 border border-indigo-500/50 shadow-sm'
                  : 'bg-slate-950 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Code View */}
        <div className="relative">
          <pre className="p-4 bg-slate-950 rounded-xl font-mono text-xs text-indigo-200/90 border border-slate-800 overflow-x-auto leading-relaxed max-h-[460px]">
            {code}
          </pre>
        </div>

        {/* Contextual tip */}
        <div className="p-3 bg-slate-800/40 rounded-xl border border-slate-800 text-xs text-slate-400 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-indigo-400 shrink-0" />
          <span>
            {activeFormat === 'zod' && 'Tip: Libraries like `zod-to-json-schema` can automatically convert your Zod schemas into JSON Schema for LLM calls!'}
            {activeFormat === 'pydantic' && 'Tip: In Python, `MyModel.model_json_schema()` produces the exact JSON Schema for Gemini & OpenAI!'}
            {activeFormat === 'ts' && 'Tip: TypeScript types provide compile-time safety, while JSON Schema provides runtime LLM generation safety.'}
            {activeFormat === 'gemini_sdk' && 'Tip: In Gemini, pass the schema directly to config.responseSchema with responseMimeType="application/json".'}
            {activeFormat === 'openai_sdk' && 'Tip: In OpenAI, pass strict: true inside response_format.json_schema.'}
            {activeFormat === 'schema' && 'Tip: JSON Schema is the universal standard recognized by every major AI model provider.'}
          </span>
        </div>
      </div>
    </div>
  );
};
