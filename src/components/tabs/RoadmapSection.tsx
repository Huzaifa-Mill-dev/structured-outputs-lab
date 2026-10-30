import React from 'react';
import { CheckCircle, ExternalLink, BookOpen, Layers } from 'lucide-react';

export const RoadmapSection: React.FC = () => {
  const phases = [
    {
      phase: 'Phase 1',
      title: 'JSON Fundamentals',
      status: 'Foundational',
      color: 'border-blue-500/30 bg-blue-500/5',
      badge: 'bg-blue-500/10 text-blue-400',
      topics: [
        'JSON syntax rules (double quotes, commas)',
        'The 6 data types (string, number, boolean, object, array, null)',
        'Valid vs Invalid JSON parsing',
        'Why comments, functions, and undefined are forbidden'
      ]
    },
    {
      phase: 'Phase 2',
      title: 'JSON Schema Mastery',
      status: 'Core Skill',
      color: 'border-indigo-500/30 bg-indigo-500/5',
      badge: 'bg-indigo-500/10 text-indigo-400',
      topics: [
        'type, properties, and required keywords',
        'Restricting options with enum',
        'Array item definitions with items',
        'Disallowing hallucinations with additionalProperties: false',
        'Prompting models via description'
      ]
    },
    {
      phase: 'Phase 3',
      title: 'Structured Outputs Mechanics',
      status: 'AI Engineering',
      color: 'border-purple-500/30 bg-purple-500/5',
      badge: 'bg-purple-500/10 text-purple-400',
      topics: [
        'Why freeform prompting breaks in production',
        'JSON Mode vs Structured Outputs differences',
        'Constrained decoding and token logit masking',
        'Guarantee of structural conformity vs factual correctness'
      ]
    },
    {
      phase: 'Phase 4',
      title: 'SDK & Full-Stack Integration',
      status: 'Practical Dev',
      color: 'border-emerald-500/30 bg-emerald-500/5',
      badge: 'bg-emerald-500/10 text-emerald-400',
      topics: [
        'Google Gemini SDK: responseSchema & responseMimeType',
        'OpenAI SDK: response_format json_schema with strict: true',
        'Zod integration in React / Next.js',
        'Pydantic models in Python & FastAPI',
        'Safe error handling and client-side validation'
      ]
    },
    {
      phase: 'Phase 5',
      title: 'Advanced AI Integrations',
      status: 'Advanced',
      color: 'border-amber-500/30 bg-amber-500/5',
      badge: 'bg-amber-500/10 text-amber-400',
      topics: [
        'Structured Outputs vs Function Calling distinctions',
        'Constraining Tool Call arguments with schemas',
        'Multi-agent messaging contracts (e.g. A2A protocols)',
        'Model Context Protocol (MCP) integrations'
      ]
    }
  ];

  return (
    <div className="space-y-8 max-w-5xl mx-auto py-2">
      {/* Intro */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <div className="inline-flex items-center space-x-2 px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-3">
          Layer 8 • Learning Path
        </div>
        <h2 className="text-2xl font-bold text-white tracking-tight">
          Your Structured Outputs Learning Roadmap
        </h2>
        <p className="mt-2 text-slate-300 text-sm leading-relaxed">
          Follow this 5-stage roadmap to advance from basic JSON understanding to building production-ready AI applications with guaranteed contracts.
        </p>
      </div>

      {/* Roadmap Timeline */}
      <div className="space-y-4">
        {phases.map((p) => (
          <div
            key={p.phase}
            className={`p-5 rounded-2xl border ${p.color} transition-all hover:border-slate-700 flex flex-col md:flex-row md:items-center justify-between gap-4`}
          >
            <div className="space-y-2 max-w-xl">
              <div className="flex items-center space-x-2">
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${p.badge}`}>
                  {p.phase}
                </span>
                <h3 className="font-bold text-white text-base">{p.title}</h3>
              </div>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs text-slate-300 pt-1">
                {p.topics.map((t, i) => (
                  <li key={i} className="flex items-center gap-1.5">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="shrink-0 text-xs font-semibold text-slate-400 border-t md:border-t-0 md:border-l border-slate-800/80 pt-2 md:pt-0 md:pl-5">
              {p.status}
            </div>
          </div>
        ))}
      </div>

      {/* Structured Outputs vs Function Calling Explained */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Layers className="w-5 h-5 text-indigo-400" />
          Key Distinction: Structured Outputs vs Function Calling
        </h3>
        <p className="text-xs text-slate-300 leading-relaxed">
          Both use JSON Schema, but they serve different architectural purposes:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
          <div className="p-4 rounded-xl bg-slate-950 border border-indigo-500/30 space-y-2">
            <span className="text-xs font-bold text-indigo-400 uppercase tracking-wide">Structured Outputs</span>
            <p className="text-xs text-slate-300">
              <strong>"Give me information in this exact format."</strong>
            </p>
            <p className="text-xs text-slate-400 leading-relaxed">
              Use when the LLM is responding directly to your application and you need the final response text to conform to a predictable schema (e.g. classification, extraction, form generation).
            </p>
          </div>
          <div className="p-4 rounded-xl bg-slate-950 border border-purple-500/30 space-y-2">
            <span className="text-xs font-bold text-purple-400 uppercase tracking-wide">Function / Tool Calling</span>
            <p className="text-xs text-slate-300">
              <strong>"Request my app to execute an action with these arguments."</strong>
            </p>
            <p className="text-xs text-slate-400 leading-relaxed">
              Use when the LLM decides mid-conversation that it needs external data (e.g. querying a SQL database, fetching weather via API) and provides arguments for your app to execute.
            </p>
          </div>
        </div>
      </div>

      {/* Recommended Documentation Bookmarks */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-indigo-400" />
          Essential Bookmarks for Deepening Your Skills
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <a
            href="https://json-schema.org/learn/getting-started-step-by-step"
            target="_blank"
            rel="noreferrer"
            className="p-4 rounded-xl bg-slate-950 border border-slate-800 hover:border-indigo-500/50 transition-all group"
          >
            <div className="flex items-center justify-between">
              <span className="font-semibold text-xs text-white group-hover:text-indigo-300">
                JSON Schema Getting Started
              </span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-500 group-hover:text-indigo-400" />
            </div>
            <p className="text-[11px] text-slate-400 mt-2">
              The official step-by-step tutorial for building schemas manually.
            </p>
          </a>

          <a
            href="https://ai.google.dev/gemini-api/docs/structured-output"
            target="_blank"
            rel="noreferrer"
            className="p-4 rounded-xl bg-slate-950 border border-slate-800 hover:border-indigo-500/50 transition-all group"
          >
            <div className="flex items-center justify-between">
              <span className="font-semibold text-xs text-white group-hover:text-indigo-300">
                Google Gemini Structured Output
              </span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-500 group-hover:text-indigo-400" />
            </div>
            <p className="text-[11px] text-slate-400 mt-2">
              Official guide for using responseSchema with Gemini 2.5 and 1.5.
            </p>
          </a>

          <a
            href="https://platform.openai.com/docs/guides/structured-outputs"
            target="_blank"
            rel="noreferrer"
            className="p-4 rounded-xl bg-slate-950 border border-slate-800 hover:border-indigo-500/50 transition-all group"
          >
            <div className="flex items-center justify-between">
              <span className="font-semibold text-xs text-white group-hover:text-indigo-300">
                OpenAI Structured Outputs Guide
              </span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-500 group-hover:text-indigo-400" />
            </div>
            <p className="text-[11px] text-slate-400 mt-2">
              Deep dive into strict schema enforcement and constrained decoding.
            </p>
          </a>
        </div>
      </div>
    </div>
  );
};
