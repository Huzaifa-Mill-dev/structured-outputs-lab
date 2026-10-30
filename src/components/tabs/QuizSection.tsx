import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { CheckCircle2, XCircle, Award, RefreshCw, Sparkles, HelpCircle } from 'lucide-react';
import { QUIZ_QUESTIONS } from '../../data/presets';

export const QuizSection: React.FC = () => {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState<boolean>(false);

  // Schema challenge state
  const [challengeCode, setChallengeCode] = useState<string>(
`{
  "type": "object",
  "properties": {
    "candidateName": { "type": "string" },
    "yearsOfExperience": { "type": "number" },
    "skills": { 
      "type": "array",
      "items": { "type": "string" }
    },
    "knowsReact": { "type": "boolean" },
    "experienceLevel": {
      "type": "string",
      "enum": ["Junior", "Mid", "Senior"]
    }
  },
  "required": ["candidateName", "yearsOfExperience", "skills", "knowsReact", "experienceLevel"],
  "additionalProperties": false
}`
  );
  const [challengeResult, setChallengeResult] = useState<{ passed: boolean; message: string; details: string[] } | null>(null);

  const handleSelectOption = (questionId: number, optionIdx: number) => {
    if (submitted) return;
    setSelectedAnswers((prev) => ({ ...prev, [questionId]: optionIdx }));
  };

  const answeredCount = Object.keys(selectedAnswers).length;

  const handleSubmit = () => {
    setSubmitted(true);
    let correctCount = 0;
    QUIZ_QUESTIONS.forEach((q) => {
      if (selectedAnswers[q.id] === q.correctIndex) {
        correctCount++;
      }
    });

    if (correctCount === QUIZ_QUESTIONS.length) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  };

  const handleReset = () => {
    setSelectedAnswers({});
    setSubmitted(false);
  };

  const getScore = () => {
    let count = 0;
    QUIZ_QUESTIONS.forEach((q) => {
      if (selectedAnswers[q.id] === q.correctIndex) {
        count++;
      }
    });
    return count;
  };

  const verifyChallengeSchema = () => {
    try {
      const s = JSON.parse(challengeCode);
      const errors: string[] = [];

      if (s.type !== 'object') errors.push('Root "type" must be "object"');
      if (!s.properties) errors.push('Missing "properties" definition');
      if (s.properties) {
        if (!s.properties.candidateName || s.properties.candidateName.type !== 'string') {
          errors.push('Field "candidateName" must be type "string"');
        }
        if (!s.properties.yearsOfExperience || (s.properties.yearsOfExperience.type !== 'number' && s.properties.yearsOfExperience.type !== 'integer')) {
          errors.push('Field "yearsOfExperience" must be type "number"');
        }
        if (!s.properties.skills || s.properties.skills.type !== 'array') {
          errors.push('Field "skills" must be type "array"');
        }
        if (s.properties.skills && (!s.properties.skills.items || s.properties.skills.items.type !== 'string')) {
          errors.push('"skills.items" must be defined as type "string"');
        }
        if (!s.properties.knowsReact || s.properties.knowsReact.type !== 'boolean') {
          errors.push('Field "knowsReact" must be type "boolean"');
        }
        if (!s.properties.experienceLevel || s.properties.experienceLevel.type !== 'string' || !Array.isArray(s.properties.experienceLevel.enum)) {
          errors.push('Field "experienceLevel" must have an "enum" array like ["Junior", "Mid", "Senior"]');
        }
      }
      if (!Array.isArray(s.required) || s.required.length < 5) {
        errors.push('All 5 fields must be listed in "required"');
      }
      if (s.additionalProperties !== false) {
        errors.push('Set "additionalProperties": false to prevent extra hallucinated fields');
      }

      if (errors.length === 0) {
        confetti({
          particleCount: 80,
          spread: 60,
          origin: { y: 0.7 }
        });
        setChallengeResult({
          passed: true,
          message: 'Outstanding! Your schema meets 100% of the specifications.',
          details: ['Root object valid', 'All 5 properties strictly typed', 'Enum properly defined', 'Strict additionalProperties: false enforced']
        });
      } else {
        setChallengeResult({
          passed: false,
          message: 'A few requirements are missing in your schema:',
          details: errors
        });
      }
    } catch (e: any) {
      setChallengeResult({
        passed: false,
        message: 'JSON Syntax Error: ' + e.message,
        details: ['Make sure all keys and string values use double quotes', 'Check for matching braces and commas']
      });
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto py-2">
      {/* Intro */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <div className="inline-flex items-center space-x-2 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-3">
          Layer 7 • Knowledge Check
        </div>
        <h2 className="text-2xl font-bold text-white tracking-tight">
          Test Your Understanding: Job Analyzer Exercise
        </h2>
        <p className="mt-2 text-slate-300 text-sm leading-relaxed">
          Imagine you're designing the AI schema for an automated applicant tracking system. 
          The model needs to return: Candidate name, years of experience, skills array, knowsReact boolean, and experience level.
        </p>
      </div>

      {/* Mini Quiz Questions */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-indigo-400" />
            <h3 className="font-bold text-white text-base">JSON Schema Mini Quiz</h3>
          </div>
          <span className="text-xs px-3 py-1 bg-slate-800 text-slate-300 rounded-full font-mono">
            {answeredCount}/{QUIZ_QUESTIONS.length} answered
          </span>
        </div>

        <div className="space-y-6">
          {QUIZ_QUESTIONS.map((q) => {
            const userAnswer = selectedAnswers[q.id];
            const isCorrect = userAnswer === q.correctIndex;

            return (
              <div key={q.id} className="p-4 bg-slate-950/70 rounded-xl border border-slate-800 space-y-3">
                <h4 className="font-semibold text-white text-sm">{q.question}</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {q.options.map((opt, optIdx) => {
                    let btnStyle = 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800';

                    if (submitted) {
                      if (optIdx === q.correctIndex) {
                        btnStyle = 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300 font-bold';
                      } else if (userAnswer === optIdx) {
                        btnStyle = 'bg-rose-500/20 border-rose-500/40 text-rose-300 line-through';
                      }
                    } else if (userAnswer === optIdx) {
                      btnStyle = 'bg-indigo-600 border-indigo-500 text-white font-semibold shadow-md shadow-indigo-600/30';
                    }

                    return (
                      <button
                        key={optIdx}
                        onClick={() => handleSelectOption(q.id, optIdx)}
                        className={`p-3 rounded-lg border text-xs text-left transition-all flex items-center justify-between ${btnStyle}`}
                      >
                        <span className="font-mono">{opt}</span>
                        {submitted && optIdx === q.correctIndex && (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        )}
                        {submitted && userAnswer === optIdx && optIdx !== q.correctIndex && (
                          <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Explanation */}
                {submitted && (
                  <div
                    className={`p-3 rounded-lg text-xs leading-relaxed ${
                      isCorrect ? 'bg-emerald-500/10 text-emerald-200 border border-emerald-500/20' : 'bg-slate-900 text-slate-300 border border-slate-800'
                    }`}
                  >
                    <strong>Explanation: </strong> {q.explanation}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Submit or Reset */}
        <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
          {submitted ? (
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-1.5 text-sm font-bold text-white">
                <Award className="w-5 h-5 text-indigo-400" />
                <span>Your Score: {getScore()} / {QUIZ_QUESTIONS.length}</span>
              </div>
              <button
                onClick={handleReset}
                className="text-xs px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg flex items-center gap-1.5 transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Retake Quiz
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-between w-full">
              <span className="text-xs text-slate-400">
                {answeredCount < QUIZ_QUESTIONS.length ? 'Select answers for all questions above' : 'Ready to evaluate!'}
              </span>
              <button
                onClick={handleSubmit}
                disabled={answeredCount < QUIZ_QUESTIONS.length}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white transition-all shadow-md shadow-indigo-600/30"
              >
                Check My Answers
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Hands-on Schema Builder Challenge */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              Bonus Challenge: Write the Full Schema
            </h3>
            <p className="text-xs text-slate-400">
              Inspect or customize the schema for the Candidate Analyzer and verify it below.
            </p>
          </div>
          <button
            onClick={verifyChallengeSchema}
            className="text-xs px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-lg shadow-md shadow-emerald-600/30 transition-colors self-start sm:self-auto flex items-center gap-1.5"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            Verify Schema Contract
          </button>
        </div>

        <textarea
          value={challengeCode}
          onChange={(e) => setChallengeCode(e.target.value)}
          rows={14}
          className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3.5 font-mono text-xs text-emerald-300 focus:outline-none focus:border-indigo-500 leading-relaxed"
        />

        {challengeResult && (
          <div
            className={`p-4 rounded-xl border flex items-start space-x-3 ${
              challengeResult.passed
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
            }`}
          >
            {challengeResult.passed ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            ) : (
              <XCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            )}
            <div className="text-xs space-y-1">
              <div className="font-bold text-sm">{challengeResult.message}</div>
              <ul className="list-disc pl-4 space-y-0.5 text-slate-300">
                {challengeResult.details.map((d, i) => (
                  <li key={i}>{d}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
