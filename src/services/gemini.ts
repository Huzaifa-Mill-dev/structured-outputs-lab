export interface GeminiCallParams {
  apiKey?: string;
  model?: string;
  prompt: string;
  schema?: Record<string, any>;
  isStructured: boolean;
  systemInstruction?: string;
}

export interface GeminiResponseResult {
  text: string;
  parsedJson: any | null;
  isValidJson: boolean;
  matchesSchema: boolean;
  executionTimeMs: number;
  isSimulated: boolean;
  rawResponse?: any;
  error?: string;
}

export async function callGemini(params: GeminiCallParams): Promise<GeminiResponseResult> {
  const startTime = performance.now();
  const { apiKey, model = 'gemini-2.5-flash', prompt, schema, isStructured, systemInstruction } = params;

  // If no API key is provided, use high-fidelity simulation
  if (!apiKey || apiKey.trim() === '') {
    await new Promise((resolve) => setTimeout(resolve, 800));
    return simulateModelResponse(prompt, schema, isStructured, startTime);
  }

  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey.trim()}`;
    
    const body: Record<string, any> = {
      contents: [
        {
          role: 'user',
          parts: [{ text: prompt }]
        }
      ]
    };

    if (systemInstruction) {
      body.systemInstruction = {
        parts: [{ text: systemInstruction }]
      };
    }

    if (isStructured && schema) {
      body.generationConfig = {
        responseMimeType: 'application/json',
        responseSchema: cleanSchemaForGemini(schema)
      };
    }

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });

    const data = await response.json();
    const duration = Math.round(performance.now() - startTime);

    if (!response.ok) {
      return {
        text: '',
        parsedJson: null,
        isValidJson: false,
        matchesSchema: false,
        executionTimeMs: duration,
        isSimulated: false,
        rawResponse: data,
        error: data.error?.message || `API error: ${response.status} ${response.statusText}`
      };
    }

    const candidate = data.candidates?.[0];
    const rawText = candidate?.content?.parts?.[0]?.text || '';

    let parsed: any = null;
    let isValid = false;

    try {
      parsed = JSON.parse(rawText.trim());
      isValid = true;
    } catch {
      isValid = false;
    }

    return {
      text: rawText,
      parsedJson: parsed,
      isValidJson: isValid,
      matchesSchema: isValid && isStructured,
      executionTimeMs: duration,
      isSimulated: false,
      rawResponse: data
    };
  } catch (err: any) {
    const duration = Math.round(performance.now() - startTime);
    return {
      text: '',
      parsedJson: null,
      isValidJson: false,
      matchesSchema: false,
      executionTimeMs: duration,
      isSimulated: false,
      error: err.message || 'Network error occurred while contacting Gemini API'
    };
  }
}

/**
 * Gemini responseSchema supports OpenAPI 3.0 / JSON Schema subsets.
 * Standardizes types and removes unsupported draft-07 keywords if needed.
 */
function cleanSchemaForGemini(schema: Record<string, any>): Record<string, any> {
  const clone = JSON.parse(JSON.stringify(schema));
  // recursive cleanup
  function clean(obj: any) {
    if (!obj || typeof obj !== 'object') return;
    delete obj.$schema;
    delete obj.additionalProperties; // Gemini doesn't strictly require additionalProperties keyword
    for (const key of Object.keys(obj)) {
      if (typeof obj[key] === 'object') {
        clean(obj[key]);
      }
    }
  }
  clean(clone);
  return clone;
}

/**
 * High-fidelity simulator when user doesn't have an API key yet
 */
function simulateModelResponse(
  prompt: string,
  schema: Record<string, any> | undefined,
  isStructured: boolean,
  startTime: number
): GeminiResponseResult {
  const duration = Math.round(performance.now() - startTime + Math.random() * 200);

  if (!isStructured) {
    // Freeform or JSON Mode simulation
    if (prompt.toLowerCase().includes('domino') || prompt.toLowerCase().includes('dinner') || prompt.toLowerCase().includes('450')) {
      const freeformVariations = [
        `You spent ₹450 at Domino's yesterday. Merchant: Domino's Pizza, Category: Food & Dining. Transaction status: complete.`,
        `Transaction Summary:\n- Amount: 450 INR\n- Place: Domino's\n- Category: Food\n- Date: Yesterday`,
        `{\n  "amount": 450,\n  "vendor": "Domino's",\n  "category": "Dining",\n  "notes": "Dinner with friends"\n}` // Note: key is "vendor", not "merchant"!
      ];
      const text = freeformVariations[Math.floor(Math.random() * freeformVariations.length)];
      let parsed = null;
      try { parsed = JSON.parse(text); } catch {}
      return {
        text,
        parsedJson: parsed,
        isValidJson: parsed !== null,
        matchesSchema: false,
        executionTimeMs: duration,
        isSimulated: true
      };
    }

    if (prompt.toLowerCase().includes('payment failed') || prompt.toLowerCase().includes('support')) {
      return {
        text: `The user is facing an issue with payment failure where ₹1,000 was debited twice. Priority: URGENT. Sentiment: VERY ANGRY. Recommended Action: Refund money.`,
        parsedJson: null,
        isValidJson: false,
        matchesSchema: false,
        executionTimeMs: duration,
        isSimulated: true
      };
    }

    return {
      text: `Based on your request, here is the analysis:\n- Key finding: Analysis complete\n- Details: Extracted elements from the input\n- Recommended next step: Proceed with software pipeline`,
      parsedJson: null,
      isValidJson: false,
      matchesSchema: false,
      executionTimeMs: duration,
      isSimulated: true
    };
  }

  // Structured mode simulation: Generate exact conforming JSON
  if (schema) {
    const generated = generateMockFromSchema(schema, prompt);
    return {
      text: JSON.stringify(generated, null, 2),
      parsedJson: generated,
      isValidJson: true,
      matchesSchema: true,
      executionTimeMs: duration,
      isSimulated: true
    };
  }

  return {
    text: `{}`,
    parsedJson: {},
    isValidJson: true,
    matchesSchema: true,
    executionTimeMs: duration,
    isSimulated: true
  };
}

function generateMockFromSchema(schema: Record<string, any>, contextPrompt: string): any {
  const type = schema.type || 'object';

  if (schema.enum && Array.isArray(schema.enum) && schema.enum.length > 0) {
    return schema.enum[0];
  }

  if (type === 'string') {
    if (contextPrompt.toLowerCase().includes('domino')) {
      if (schema.description?.toLowerCase().includes('merchant') || schema.title?.toLowerCase().includes('merchant')) return "Domino's Pizza";
      if (schema.description?.toLowerCase().includes('category')) return "Food & Dining";
    }
    if (contextPrompt.toLowerCase().includes('payment')) {
      if (schema.description?.toLowerCase().includes('issue')) return "Double charge on failed payment";
      if (schema.description?.toLowerCase().includes('action')) return "Initiate duplicate charge verification and refund ₹1,000";
    }
    return "Sample value";
  }

  if (type === 'number' || type === 'integer') {
    if (contextPrompt.includes('450')) return 450;
    if (contextPrompt.includes('1000') || contextPrompt.includes('1,000')) return 1000;
    return 42;
  }

  if (type === 'boolean') {
    return true;
  }

  if (type === 'array') {
    const itemSchema = schema.items || { type: 'string' };
    if (contextPrompt.toLowerCase().includes('react') || contextPrompt.toLowerCase().includes('alex')) {
      return ["React", "TypeScript", "Node.js", "TailwindCSS"];
    }
    return [generateMockFromSchema(itemSchema, contextPrompt), generateMockFromSchema(itemSchema, contextPrompt)];
  }

  if (type === 'object') {
    const result: Record<string, any> = {};
    const props = schema.properties || {};
    for (const [key, propDef] of Object.entries<any>(props)) {
      if (key === 'amount') result[key] = 450;
      else if (key === 'merchant') result[key] = "Domino's";
      else if (key === 'category') result[key] = propDef.enum ? propDef.enum[0] : "Food";
      else if (key === 'issue') result[key] = "Duplicate charge after failed payment";
      else if (key === 'priority') result[key] = propDef.enum ? propDef.enum[0] : "high";
      else if (key === 'sentiment') result[key] = propDef.enum ? propDef.enum[2] || propDef.enum[0] : "frustrated";
      else if (key === 'refundRequired') result[key] = true;
      else if (key === 'suggestedAction') result[key] = "Verify gateway logs and issue ₹1,000 refund";
      else if (key === 'candidateName') result[key] = "Alex Rivera";
      else if (key === 'yearsOfExperience') result[key] = 4;
      else if (key === 'skills') result[key] = ["React", "TypeScript", "Next.js", "Node.js"];
      else if (key === 'knowsReact') result[key] = true;
      else if (key === 'experienceLevel') result[key] = propDef.enum ? propDef.enum[1] || propDef.enum[0] : "Mid";
      else {
        result[key] = generateMockFromSchema(propDef, contextPrompt);
      }
    }
    return result;
  }

  return null;
}
