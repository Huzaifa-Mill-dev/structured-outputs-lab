export type TabType = 
  | 'problem' 
  | 'json-basics' 
  | 'json-schema' 
  | 'constrained-decoding' 
  | 'json-mode-vs-structured' 
  | 'rosetta-stone' 
  | 'playground' 
  | 'quiz' 
  | 'roadmap';

export interface PlaygroundPreset {
  id: string;
  name: string;
  description: string;
  userPrompt: string;
  systemInstruction?: string;
  schema: Record<string, any>;
  sampleOutput: Record<string, any>;
  sampleBadOutput: string;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}
