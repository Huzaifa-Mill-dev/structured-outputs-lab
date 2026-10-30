import type { PlaygroundPreset, QuizQuestion } from '../types';

export const PRESETS: PlaygroundPreset[] = [
  {
    id: 'expense-tracker',
    name: '💳 Expense Tracker',
    description: 'Extract amount, merchant, category, and date into structured accounting records',
    userPrompt: 'I spent ₹450 on dinner at Domino\'s yesterday evening with my colleagues.',
    systemInstruction: 'You are an accounting parser. Extract all financial transaction metadata accurately.',
    schema: {
      type: 'object',
      properties: {
        amount: {
          type: 'number',
          description: 'The numeric transaction amount spent'
        },
        currency: {
          type: 'string',
          enum: ['INR', 'USD', 'EUR', 'GBP'],
          description: 'Standard 3-letter currency code'
        },
        merchant: {
          type: 'string',
          description: 'The store, merchant, or restaurant name'
        },
        category: {
          type: 'string',
          enum: ['Food', 'Transportation', 'Entertainment', 'Utilities', 'Shopping'],
          description: 'Categorization for personal budgeting'
        },
        isReimbursable: {
          type: 'boolean',
          description: 'Whether this looks like a business or group expense'
        }
      },
      required: ['amount', 'currency', 'merchant', 'category', 'isReimbursable']
    },
    sampleOutput: {
      amount: 450,
      currency: 'INR',
      merchant: "Domino's",
      category: 'Food',
      isReimbursable: true
    },
    sampleBadOutput: `You spent ₹450 at Domino's yesterday.
Merchant: Domino's Pizza
Category: Food & Beverage
Colleagues present: yes`
  },
  {
    id: 'support-ticket',
    name: '🎫 Support Ticket Classifier',
    description: 'Identify customer issue, urgency, sentiment, and refund eligibility for customer service',
    userPrompt: 'My payment failed twice, and I have been charged ₹1,000. Please resolve this immediately!',
    systemInstruction: 'You are an automated support ticket triage specialist. Classify the customer complaint objectively.',
    schema: {
      type: 'object',
      properties: {
        issue: {
          type: 'string',
          description: 'Concise summary of the customer\'s core problem'
        },
        priority: {
          type: 'string',
          enum: ['low', 'medium', 'high'],
          description: 'Calculated urgency level based on monetary impact and sentiment'
        },
        sentiment: {
          type: 'string',
          enum: ['positive', 'neutral', 'frustrated'],
          description: 'Customer mood detected from tone and punctuation'
        },
        refundRequired: {
          type: 'boolean',
          description: 'True if duplicate charges or unauthorized billing is reported'
        },
        suggestedAction: {
          type: 'string',
          description: 'Recommended next action for the support representative'
        }
      },
      required: ['issue', 'priority', 'sentiment', 'refundRequired', 'suggestedAction']
    },
    sampleOutput: {
      issue: 'Payment failed twice with duplicate ₹1,000 charge',
      priority: 'high',
      sentiment: 'frustrated',
      refundRequired: true,
      suggestedAction: 'Check payment gateway logs for duplicate transaction and initiate immediate ₹1,000 refund.'
    },
    sampleBadOutput: `The user is very upset.
Issue: Double payment failure.
Urgency: SUPER URGENT! (Not in our enum: low/medium/high)
Action: give refund asap.`
  },
  {
    id: 'resume-analyzer',
    name: '💼 Candidate Resume Analyzer',
    description: 'Extract skills, seniority level, and React competence from applicant background',
    userPrompt: 'Alex has been building web apps for 4 years. Proficient in React, TypeScript, Next.js, and Node.js. Has led a team of 3 juniors.',
    systemInstruction: 'Analyze the candidate profile for technical hiring pipeline.',
    schema: {
      type: 'object',
      properties: {
        candidateName: {
          type: 'string',
          description: 'Full name of candidate'
        },
        yearsOfExperience: {
          type: 'number',
          description: 'Total professional software engineering experience in years'
        },
        skills: {
          type: 'array',
          items: {
            type: 'string'
          },
          description: 'List of technical skills and frameworks mentioned'
        },
        knowsReact: {
          type: 'boolean',
          description: 'Whether candidate has verified React proficiency'
        },
        experienceLevel: {
          type: 'string',
          enum: ['Junior', 'Mid', 'Senior'],
          description: 'Assessed engineering seniority bracket'
        }
      },
      required: ['candidateName', 'yearsOfExperience', 'skills', 'knowsReact', 'experienceLevel']
    },
    sampleOutput: {
      candidateName: 'Alex',
      yearsOfExperience: 4,
      skills: ['React', 'TypeScript', 'Next.js', 'Node.js'],
      knowsReact: true,
      experienceLevel: 'Mid'
    },
    sampleBadOutput: `Name: Alex
Experience: 4 yrs
Skills: React, TS
Level: Experienced Mid-Level (Broken enum)`
  }
];

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: '1. In a JSON Schema for an API response representing an applicant record, what should the root type be?',
    options: ['string', 'object', 'array'],
    correctIndex: 1,
    explanation: 'A structured record with key-value properties (like candidate name, experience, skills) is represented as an "object" at the root.'
  },
  {
    id: 2,
    question: '2. In JSON Schema, what should the `skills` field\'s type be to store a list of multiple programming skills?',
    options: ['string', 'array', 'boolean'],
    correctIndex: 1,
    explanation: 'A collection of items (such as ["React", "TypeScript", "Node.js"]) is represented by the "array" type with an "items" sub-schema.'
  },
  {
    id: 3,
    question: '3. How would you restrict the `experienceLevel` field to ONLY allow "Junior", "Mid", or "Senior"?',
    options: ['description', 'enum', 'additionalProperties'],
    correctIndex: 1,
    explanation: 'The `enum` keyword explicitly specifies a fixed list of allowed literal values (e.g. `enum: ["Junior", "Mid", "Senior"]`).'
  },
  {
    id: 4,
    question: '4. What property prevents the AI model from hallucinating or appending unexpected extra fields outside your schema?',
    options: ['required', 'items', 'additionalProperties: false'],
    correctIndex: 2,
    explanation: 'Setting `"additionalProperties": false` strictly disallows any keys that were not explicitly listed in the `properties` definition.'
  }
];
