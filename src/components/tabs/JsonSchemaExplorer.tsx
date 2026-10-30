import React, { useState } from 'react';
import { BookOpen, Layers, CheckCircle2, XCircle } from 'lucide-react';

export const JsonSchemaExplorer: React.FC = () => {
  const [selectedKeyword, setSelectedKeyword] = useState<string>('enum');

  const [schemaText, setSchemaText] = useState<string>(
`{
  "type": "object",
  "properties": {
    "name": {
      "type": "string",
      "description": "Full name of the user"
    },
    "age": {
      "type": "number",
      "minimum": 18
    },
    "role": {
      "type": "string",
      "enum": ["admin", "editor", "viewer"]
    },
    "skills": {
      "type": "array",
      "items": { "type": "string" }
    }
  },
  "required": ["name", "age", "role"],
  "additionalProperties": false
}`
  );

  const [sampleDataText, setSampleDataText] = useState<string>(
`{
  "name": "Alex",
  "age": 25,
  "role": "editor",
  "skills": ["React", "TypeScript"]
}`
  );

  const keywords = [
    {
      name: 'type',
      meaning: 'Expected data type',
      syntax: '{"type": "string" | "number" | "boolean" | "object" | "array" | "null"}',
      example: 'Restricts the value to the specified JSON primitive or compound data type.'
    },
    {
      name: 'properties',
      meaning: 'Fields inside an object',
      syntax: '{"properties": { "name": {...}, "age": {...} }}',
      example: 'Defines the schema for each specific key inside an object.'
    },
    {
      name: 'required',
      meaning: 'Mandatory fields',
      syntax: '{"required": ["name", "role"]}',
      example: 'Array of property names that MUST be present in the JSON output.'
    },
    {
      name: 'additionalProperties',
      meaning: 'Disallow unexpected fields',
      syntax: '{"additionalProperties": false}',
      example: 'Prevents the LLM from adding hallucinated extra keys outside what you defined.'
    },
    {
      name: 'enum',
      meaning: 'Strict allowed literal values',
      syntax: '{"enum": ["low", "medium", "high"]}',
      example: 'Restricts a field strictly to a predetermined set of values. Invaluable for status codes, tags, and categories.'
    },
    {
      name: 'items',
      meaning: 'Schema of array elements',
      syntax: '{"items": { "type": "string" }}',
      example: 'Describes what each item in an array must look like.'
    },
    {
      name: 'description',
      meaning: 'LLM semantic guidance',
      syntax: '{"description": "The customer\'s primary phone number with country code"}',
      example: 'Crucial for LLMs! Acts as field-level prompting telling the model what to extract.'
    },
    {
      name: 'minimum / maximum',
      meaning: 'Numeric range bounds',
      syntax: '{"minimum": 0, "maximum": 100}',
      example: 'Constrains numbers (e.g. percentages between 0 and 100, ratings between 1 and 5).'
    }
  ];

  // Simple client-side schema evaluator
  const evaluateValidation = () => {
    try {
      const schema = JSON.parse(schemaText);
      const data = JSON.parse(sampleDataText);
      const errors: string[] = [];

      // check root type
      if (schema.type === 'object' && (typeof data !== 'object' || Array.isArray(data) || data === null)) {
        errors.push('Root must be an object');
      }

      // check required
      if (Array.isArray(schema.required)) {
        for (const req of schema.required) {
          if (data[req] === undefined) {
            errors.push(`Missing required field: "${req}"`);
          }
        }
      }

      // check additionalProperties
      if (schema.additionalProperties === false && schema.properties) {
        for (const key of Object.keys(data)) {
          if (!schema.properties[key]) {
            errors.push(`Unallowed additional property found: "${key}" (forbidden by additionalProperties: false)`);
          }
        }
      }

      // check property types & enums
      if (schema.properties) {
        for (const [key, propDef] of Object.entries<any>(schema.properties)) {
          const val = data[key];
          if (val !== undefined) {
            if (propDef.type === 'string' && typeof val !== 'string') {
              errors.push(`Field "${key}" must be a string, received ${typeof val}`);
            }
            if (propDef.type === 'number' && typeof val !== 'number') {
              errors.push(`Field "${key}" must be a number, received ${typeof val}`);
            }
            if (propDef.type === 'boolean' && typeof val !== 'boolean') {
              errors.push(`Field "${key}" must be a boolean, received ${typeof val}`);
            }
            if (propDef.type === 'array' && !Array.isArray(val)) {
              errors.push(`Field "${key}" must be an array`);
            }
            if (propDef.enum && !propDef.enum.includes(val)) {
              errors.push(`Field "${key}" value "${val}" is not in allowed enum: [${propDef.enum.map((e: any) => `"${e}"`).join(', ')}]`);
            }
            if (typeof propDef.minimum === 'number' && val < propDef.minimum) {
              errors.push(`Field "${key}" (${val}) is less than minimum permitted (${propDef.minimum})`);
            }
          }
        }
      }

      return { valid: errors.length === 0, errors };
    } catch (e: any) {
      return { valid: false, errors: ['JSON Syntax error in schema or data: ' + e.message] };
    }
  };

  const validationResult = evaluateValidation();

  return (
    <div className="space-y-8 max-w-6xl mx-auto py-2">
      {/* Intro */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <div className="inline-flex items-center space-x-2 px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-3">
          Layer 3 • The Contract
        </div>
        <h2 className="text-2xl font-bold text-white tracking-tight">
          What is JSON Schema?
        </h2>
        <p className="mt-2 text-slate-300 text-sm leading-relaxed">
          Think of a <strong>JSON Schema</strong> as a blueprint or contract. 
          It doesn't contain actual data; instead, it defines the <strong>types, rules, required fields, and allowed values</strong> that valid data must follow.
        </p>
      </div>

      {/* Keywords Reference Matrix */}
      <div>
        <h3 className="text-base font-semibold text-white mb-3 flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-indigo-400" />
          The Key Keywords in LLM Schemas
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
          {keywords.map((kw) => (
            <button
              key={kw.name}
              onClick={() => setSelectedKeyword(kw.name)}
              className={`p-2.5 rounded-xl border text-left transition-all ${
                selectedKeyword === kw.name
                  ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-sm'
                  : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              <div className="font-mono text-xs font-semibold text-indigo-300">{kw.name}</div>
              <div className="text-[11px] text-slate-400 truncate mt-0.5">{kw.meaning}</div>
            </button>
          ))}
        </div>

        {/* Selected Keyword Deep Dive */}
        {keywords.find((k) => k.name === selectedKeyword) && (
          <div className="bg-slate-900 border border-indigo-500/30 rounded-2xl p-5 shadow-lg">
            {(() => {
              const kw = keywords.find((k) => k.name === selectedKeyword)!;
              return (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-lg text-indigo-400">{kw.name}</span>
                    <span className="text-xs bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 px-2.5 py-0.5 rounded-full font-medium">
                      {kw.meaning}
                    </span>
                  </div>
                  <pre className="p-3 bg-slate-950 rounded-xl font-mono text-xs text-amber-300 border border-slate-800 overflow-x-auto">
                    {kw.syntax}
                  </pre>
                  <p className="text-xs text-slate-300 leading-relaxed">{kw.example}</p>
                </div>
              );
            })()}
          </div>
        )}
      </div>

      {/* Interactive Schema vs Data Playground */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Layers className="w-4 h-4 text-indigo-400" />
            Interactive Schema Validator Lab
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Edit the schema or test data to see how the validation contract reacts in real-time. Try changing <code className="text-indigo-300">"editor"</code> to <code className="text-indigo-300">"super_admin"</code> to trigger an enum error!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Schema Editor */}
          <div>
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5 font-medium">
              <span>JSON Schema Blueprint:</span>
              <span className="font-mono text-indigo-400 text-[11px]">The Contract</span>
            </div>
            <textarea
              value={schemaText}
              onChange={(e) => setSchemaText(e.target.value)}
              rows={14}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3.5 font-mono text-xs text-indigo-300 focus:outline-none focus:border-indigo-500 leading-relaxed"
            />
          </div>

          {/* Test Data & Validation Status */}
          <div className="space-y-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5 font-medium">
                <span>Test JSON Data Payload:</span>
                <span className="font-mono text-emerald-400 text-[11px]">The Candidate Payload</span>
              </div>
              <textarea
                value={sampleDataText}
                onChange={(e) => setSampleDataText(e.target.value)}
                rows={7}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3.5 font-mono text-xs text-slate-200 focus:outline-none focus:border-indigo-500 leading-relaxed"
              />

              {/* Validation Result Box */}
              <div className="mt-3">
                <div
                  className={`p-4 rounded-xl border flex items-start space-x-3 ${
                    validationResult.valid
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                      : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
                  }`}
                >
                  {validationResult.valid ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  ) : (
                    <XCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                  )}
                  <div>
                    <div className="font-semibold text-sm">
                      {validationResult.valid ? 'Payload Fully Validated!' : 'Contract Violation Detected'}
                    </div>
                    {validationResult.valid ? (
                      <p className="text-xs text-emerald-200/90 mt-1">
                        All required fields exist, data types match, enums match, and no unauthorized extra keys exist.
                      </p>
                    ) : (
                      <ul className="text-xs space-y-1 mt-1.5 list-disc pl-4 text-rose-200">
                        {validationResult.errors.map((err, i) => (
                          <li key={i}>{err}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Test Presets */}
            <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-800">
              <span className="text-[11px] text-slate-400 self-center">Quick tests:</span>
              <button
                onClick={() => {
                  const obj = JSON.parse(sampleDataText);
                  obj.role = "super_admin"; // invalid enum
                  setSampleDataText(JSON.stringify(obj, null, 2));
                }}
                className="text-[11px] bg-slate-800 hover:bg-slate-700 text-amber-300 px-2.5 py-1 rounded-md"
              >
                Break Enum ("super_admin")
              </button>
              <button
                onClick={() => {
                  const obj = JSON.parse(sampleDataText);
                  delete obj.name; // remove required
                  setSampleDataText(JSON.stringify(obj, null, 2));
                }}
                className="text-[11px] bg-slate-800 hover:bg-slate-700 text-rose-300 px-2.5 py-1 rounded-md"
              >
                Delete Required "name"
              </button>
              <button
                onClick={() => {
                  const obj = JSON.parse(sampleDataText);
                  obj.hackerField = "injected!"; // unexpected property
                  setSampleDataText(JSON.stringify(obj, null, 2));
                }}
                className="text-[11px] bg-slate-800 hover:bg-slate-700 text-purple-300 px-2.5 py-1 rounded-md"
              >
                Add Unexpected Field
              </button>
              <button
                onClick={() => {
                  setSampleDataText(
`{
  "name": "Alex",
  "age": 25,
  "role": "editor",
  "skills": ["React", "TypeScript"]
}`
                  );
                }}
                className="text-[11px] bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-200 px-2.5 py-1 rounded-md"
              >
                Reset Valid Data
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
