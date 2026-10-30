# Structured Outputs & JSON Schema Lab 🧪

An interactive developer learning lab and API studio to master **Structured Outputs**, **JSON Schemas**, and **Constrained Decoding** in modern Large Language Models (LLMs) such as Google Gemini and OpenAI.

---

## 🚀 Features

- **Layer 1: The Problem Demonstrated** — Side-by-side interactive failure demonstration showing how freeform LLM output (prose, markdown, hallucinated keys, strings instead of numbers) causes frontend runtime errors vs. guaranteed schema compliance.
- **Layer 2: JSON Fundamentals** — Visual type inspector & live parser detecting syntax violations (comments, single quotes, unquoted keys, `undefined`, functions).
- **Layer 3: JSON Schema Contract** — Interactive schema explorer for `type`, `properties`, `required`, `additionalProperties: false`, `enum`, `items`, and `description`.
- **Layer 4: Constrained Decoding Under the Hood** — Interactive token logit masking simulator demonstrating how token probabilities are masked to $-\infty$ during sampling to enforce valid grammar.
- **Layer 5: JSON Mode vs Structured Outputs** — Head-to-head comparison matrix and live edge case battles (enum failures, missing keys, type corruption).
- **Layer 6: Rosetta Stone** — Convert schemas between **JSON Schema**, **TypeScript Types**, **Zod**, **Pydantic (Python)**, and **Google Gemini / OpenAI SDKs**.
- **🧪 Live Studio & Playground** — Experiment with real model responses using Google Gemini API (`responseSchema` / `responseMimeType: "application/json"`) or an offline high-fidelity simulator.
- **Layer 7: Interactive Quiz & Schema Challenge** — Mini quiz with explanations, live schema builder test, and confetti celebration.
- **Layer 8: Roadmap & Bookmarks** — 5-phase developer learning journey and curated reference docs.

---

## 🛠️ Getting Started

### Prerequisites

- [Bun](https://bun.sh/) (recommended) or [Node.js](https://nodejs.org/) (v18+)

### Installation

```bash
# Clone the repository
git clone https://github.com/Huzaifa-Mill-dev/structured-outputs-lab.git
cd structured-outputs-lab

# Install dependencies
bun install
# or
npm install
```

### Running Locally

```bash
bun run dev
# or
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🔑 Optional Gemini API Key

You can use the lab completely offline using the built-in simulator. To test live with Google Gemini:
1. Get a free API key from [Google AI Studio](https://aistudio.google.com/app/apikey).
2. Click the **API Key** button in the app header and paste your key.
3. The key is stored purely in your browser's `localStorage` and sent directly to Google's API endpoint.

---

## 📄 License

MIT
