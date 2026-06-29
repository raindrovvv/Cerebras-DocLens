# Cerebras DocLens

**Cerebras DocLens** is a multi-agent document intelligence demo that helps people understand long insurance policies, contracts, medical forms, and government documents faster.

The app uses **Gemma 4 31B through the Cerebras API** as the core AI engine. It turns dense documents into clear summaries, risk warnings, cost details, deadlines, action checklists, persona-based explanations, and follow-up chat.

- Live app: https://cerebras-ai-doc.vercel.app
- Repository: https://github.com/raindrovvv/Cerebras-DocLens
- Core model: `gemma-4-31b`
- Primary provider: Cerebras API
- Demo video: https://x.com/raindrovvv/status/2071482635063632182
- Baseline comparison: GPT-4.1
- Submitted tracks: Multi-Agent + Multimodal, Enterprise Impact

## One-Minute Pitch

Cerebras DocLens turns complex PDFs like insurance policies, contracts, and medical consent forms into plain-language guidance using **Gemma 4 31B on Cerebras**.

It runs a shared-evidence intake step, then parallel specialist agents extract summaries, risks, costs, timelines, next actions, and persona-specific explanations for children, seniors, general users, and experts.

The core idea: **fast Cerebras inference makes multi-agent document review feel interactive, not slow**.

## What Judges Should Try

1. Open the live app.
2. Click the key icon in the top navigation.
3. Add your own Cerebras API key. If you want speed comparison mode, also add an OpenAI API key.
4. Upload a real PDF, such as an insurance policy or government benefit document.
5. Run analysis with **Cerebras** first.
6. Run **Compare** mode to see Cerebras and GPT-4.1 latency side by side.
7. Switch between Child, Senior, General, and Expert explanations.
8. Ask a follow-up question in the document chatbot.

If no API key is provided, the app opens the API key dialog and explains what the user needs to do.

## Why This Uses Cerebras

Long document analysis is most useful when the user does not feel stuck waiting.

Cerebras DocLens is designed around fast inference:

- A document intake stage reads the source once.
- The intake stage builds a shared evidence cache with important quotes and page numbers.
- Specialist agents reuse that cache instead of rereading the whole PDF.
- Multiple agents can run in parallel.
- The UI shows measured latency for Cerebras and GPT-4.1 in Compare mode.

This makes speed visible as a product feature, not just a benchmark.

## Hackathon Requirement Mapping

### Required: Gemma 4 31B

- The primary model is `gemma-4-31b`.
- Calls are made through the Cerebras OpenAI-compatible API endpoint.
- Cerebras is the default provider and the core AI path for document analysis.
- There is no fallback model for Cerebras failures; if Gemma 4 31B access fails, the app reports the issue.

Relevant file:

```text
src/services/llm.ts
```

### Required: Cerebras Speed Experience

The app includes an explicit latency comparison panel.

- Cerebras and GPT-4.1 can be run in the same Compare mode.
- The chart separates overall completion time from per-agent timing.
- Outliers are shown when one agent behaves differently from the overall winner.
- The UI explains that shorter bars are faster and that the intake cache reduces repeated document reads.

Relevant files:

```text
src/components/ResultDashboard.tsx
src/app/api/analyze/route.ts
```

### Track 1: Multi-Agent + Multimodal

The analysis pipeline uses multiple agents:

- **Intake Agent**: reads the document and builds the shared evidence cache.
- **Summary Agent**: classifies and summarizes the document.
- **Risk Agent**: finds risky clauses, exclusions, penalties, and responsibilities.
- **Cost Agent**: extracts premiums, fees, payouts, deposits, and other money-related details.
- **Timeline Agent**: extracts deadlines, waiting periods, renewal dates, and time-sensitive terms.
- **Action Agent**: turns the analysis into a practical checklist.
- **Persona Agent**: rewrites the same document for children, seniors, general users, and experts.

The upload flow supports text-based PDFs and document images such as PNG, JPG, and WebP. For scanned PDFs without a readable text layer, the app gives a clear fallback instruction: export the page as an image and upload that image for multimodal analysis.

Relevant files:

```text
src/app/api/parse-pdf/route.ts
src/app/api/analyze/route.ts
src/components/UploadZone.tsx
```

### Track 3: Enterprise Problem Solving

The app targets a practical enterprise and consumer problem: reviewing long, high-stakes documents quickly.

Example use cases:

- Insurance policy review before purchase or claim filing.
- Contract review before signing.
- Medical consent review before a procedure.
- Government or benefit document explanation.
- Customer support teams summarizing policy documents for different audiences.

The output is designed to support real decisions:

- Summary for quick orientation.
- Risk and clause explanations.
- Cost extraction.
- Deadline extraction.
- Action checklist.
- Evidence quotes with page numbers.
- Persona-specific explanation.
- Follow-up chatbot.

## Architecture

```text
User uploads PDF or document image
        |
        v
Parse / extract pages
        |
        v
Intake Agent
- reads source once
- extracts important quotes
- builds shared evidence cache
        |
        v
Specialist agents
- Summary
- Risk
- Cost
- Timeline
        |
        v
Synthesis agents
- Action checklist
- Persona explanations
        |
        v
Result dashboard
- evidence-backed analysis
- speed comparison
- follow-up chat
```

## API Key Model

The public app uses a BYOK model: **Bring Your Own Key**.

- Users enter their own Cerebras and optional OpenAI keys in the browser.
- Keys are stored only in the browser's `localStorage`.
- Keys are sent to the server only when an analysis request is made.
- No real API keys are committed to the repository.

For quick testing, create a temporary API key, use it for the demo, and revoke it afterward.

## Local Setup

```bash
npm install
npm run dev
```

Open:

```text
http://localhost:3000
```

Optional local environment variables:

```text
CEREBRAS_API_KEY=your_cerebras_key
OPENAI_API_KEY=your_openai_key
```

The app also works without server environment variables if the user enters API keys through the UI.

## Build

```bash
npm run build
npm run start
```

## Important Routes

```text
/                         Main app
/api/parse-pdf            PDF and image parsing
/api/analyze              Multi-agent document analysis
/api/ask                  Follow-up Q&A
/api/ask-stream           Streaming follow-up Q&A
```

## Demo Script Summary

Cerebras DocLens helps people understand complex documents faster. It uses Gemma 4 31B on Cerebras to run a document-intake and specialist-agent pipeline. The app extracts risks, costs, deadlines, and next steps, then explains the same document for different audiences. Compare mode shows why fast inference matters for a real user experience.

## Safety Disclaimer

Cerebras DocLens is an AI document comprehension tool. It does not replace professional legal, medical, insurance, or financial advice. Users should consult a qualified expert before making important decisions.