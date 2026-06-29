import { NextResponse } from "next/server";
import { getJsonCompletion } from "@/services/llm";
import { FinalAnalysisResult } from "@/types";

export async function POST(req: Request) {
  try {
    const { documentId, fileName, pageCount, pages, visualPages, inputMode, provider, fairCompare = false, lang, apiKeys = {} } = await req.json();

    if (!pages || !Array.isArray(pages)) {
      return NextResponse.json({ error: "Missing document pages content" }, { status: 400 });
    }

    // Limit to first 15 pages to avoid rate limits / context issues.
    // The intake agent reads this full working set once, then downstream agents use its shared evidence cache.
    const processingPages = pages.slice(0, 15);
    const documentText = processingPages
      .map((p: any) => `--- START PAGE ${p.pageNum} ---\n${p.text}\n--- END PAGE ${p.pageNum} ---`)
      .join("\n\n");

    const compactText = (text: string, maxChars: number) =>
      text.length > maxChars
        ? `${text.slice(0, maxChars)}\n\n--- TRUNCATED FOR LATENCY: use the strongest evidence above. ---`
        : text;

    const imageInputs = Array.isArray(visualPages)
      ? visualPages
          .filter((p: any) => typeof p?.dataUrl === "string" && p.dataUrl.startsWith("data:image/"))
          .slice(0, 3)
      : [];

    const startOverall = Date.now();
    const isKo = lang !== "en";
    const L = isKo ? "Korean" : "English";
    const selectedProvider = provider || "cerebras";
    const selectedKey = selectedProvider === "openai" ? apiKeys.openai?.trim() : apiKeys.cerebras?.trim();
    const fallbackKey = selectedProvider === "openai" ? process.env.OPENAI_API_KEY : process.env.CEREBRAS_API_KEY;
    if (!selectedKey && !fallbackKey) {
      const providerLabel = selectedProvider === "openai" ? "GPT-4.1" : "Cerebras";
      return NextResponse.json({
        error: `Missing ${providerLabel} API key`,
        code: "missing_api_key",
        provider: selectedProvider
      }, { status: 400 });
    }

    const systemCommon = `You are a helpful AI document intelligence agent.
Base all your answers STRICTLY on the text, shared evidence cache, and image evidence provided. Do not extrapolate, hallucinate, or assume facts not written in the document.
Write every user-facing generated field in ${L}. Keep evidence.quote values in the original document language only.
If image pages are attached, analyze visible text and visual evidence in the image. If you cannot find clear evidence, return empty structures or mark confidence as low.`;

    const buildUserContent = (instruction: string) => {
      if (imageInputs.length === 0) return instruction;
      return [
        { type: "text", text: `${instruction}\n\nAttached image pages are part of the document. Use them as visual evidence and cite page numbers from the IMAGE PAGE markers when possible.` },
        ...imageInputs.map((p: any) => ({
          type: "image_url",
          image_url: { url: p.dataUrl }
        }))
      ];
    };

    const createFallbackIntake = () => {
      const firstLines = processingPages
        .flatMap((p: any) => String(p.text || "").split(/\r?\n/).map((line) => ({ page: p.pageNum, line: line.trim() })))
        .filter((item) => item.line.length > 40)
        .slice(0, 12);

      return {
        documentType: "other",
        confidence: 0.5,
        language: isKo ? "ko" : "en",
        executiveSummary: [],
        keyPoints: [],
        pageSummaries: processingPages.map((p: any) => ({
          page: p.pageNum,
          summary: compactText(String(p.text || "").replace(/\s+/g, " ").trim(), 360)
        })),
        riskCandidates: [],
        moneyCandidates: [],
        timelineCandidates: [],
        actionHints: [],
        importantQuotes: firstLines.map((item) => ({ page: item.page, quote: item.line }))
      };
    };

    const agentMaxTokens: Record<string, number> = {
      intake: 2600,
      summary: 800,
      risks: 1500,
      money: 1000,
      timeline: 900,
      actions: 1100,
      persona: 1100,
    };

    // Helper to run an agent with per-agent timeout and record performance.
    const runAgent = async (name: string, prompt: any[]) => {
      const start = Date.now();
      const timeoutMs = selectedProvider === "cerebras" ? 35000 : 85000;
      try {
        const timeoutPromise = new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error(`Agent ${name} timed out after ${timeoutMs / 1000}s`)), timeoutMs)
        );
        const result = await Promise.race([
          getJsonCompletion<any>(prompt, 0.1, selectedProvider, apiKeys, agentMaxTokens[name] || 1200),
          timeoutPromise
        ]);
        const duration = (Date.now() - start) / 1000;
        return { name, result, duration, success: true };
      } catch (err) {
        console.error(`Agent ${name} failed:`, err);
        const duration = (Date.now() - start) / 1000;
        return { name, result: null, duration, success: false, error: (err as Error).message };
      }
    };

    const intakePrompt: any[] = [
      { role: "system", content: `${systemCommon}\nYou are the Document Intake Agent. Read the full working document once and build a compact shared evidence cache for downstream specialist agents.` },
      {
        role: "user",
        content: buildUserContent(`Read the document once and create a shared evidence cache. This cache will be reused by specialist agents, so preserve exact quotes and page numbers for important evidence.
Return ONLY a valid JSON object matching this schema:
{
  "documentType": "insurance" | "legal" | "medical" | "government" | "financial" | "other",
  "confidence": number (between 0.0 and 1.0),
  "language": "ko" | "en" | "other",
  "executiveSummary": string[] (exactly 3 items, in ${L}),
  "keyPoints": string[] (3-5 items, in ${L}),
  "pageSummaries": [{ "page": number, "summary": string (in ${L}) }],
  "riskCandidates": [{ "page": number, "quote": string (exact original quote), "whyRisky": string (in ${L}), "severityHint": "high" | "medium" | "low" }],
  "moneyCandidates": [{ "page": number, "quote": string (exact original quote), "amount": string, "meaning": string (in ${L}) }],
  "timelineCandidates": [{ "page": number, "quote": string (exact original quote), "dateText": string, "meaning": string (in ${L}) }],
  "actionHints": [{ "page": number, "quote": string (exact original quote), "taskHint": string (in ${L}) }],
  "importantQuotes": [{ "page": number, "quote": string (exact original quote) }]
}

Rules:
- Keep the cache compact but useful.
- Prefer decision-relevant evidence: eligibility, exclusions, costs, deadlines, duties, warnings, cancellation, renewals, and contact instructions.
- Include at most 8 riskCandidates, 8 moneyCandidates, 8 timelineCandidates, 8 actionHints, and 12 importantQuotes.

Document:
${documentText}`)
      }
    ];

    const intakeRun = await runAgent("intake", intakePrompt);
    const intake = intakeRun.result || createFallbackIntake();
    const sharedCache = compactText(JSON.stringify(intake, null, 2), 16000);

    const summaryPrompt: any[] = [
      { role: "system", content: `${systemCommon}\nYou are the Document Summary Agent. Use the shared evidence cache instead of rereading the full PDF.` },
      {
        role: "user",
        content: `Analyze this shared evidence cache and produce classification, confidence, language, 3-line executive summary, and 3-5 key points.
Return ONLY a valid JSON object matching this schema:
{
  "documentType": "insurance" | "legal" | "medical" | "government" | "financial" | "other",
  "confidence": number (between 0.0 and 1.0),
  "language": "ko" | "en" | "other",
  "executiveSummary": string[] (exactly 3 items, in ${L}),
  "keyPoints": string[] (in ${L})
}

Shared evidence cache:
${sharedCache}`
      }
    ];

    const riskPrompt: any[] = [
      { role: "system", content: `${systemCommon}\nYou are the Document Risk Analysis Agent. Use riskCandidates, importantQuotes, and pageSummaries from the shared evidence cache.` },
      {
        role: "user",
        content: `Identify clauses, terms, penalties, exclusions, or responsibilities that are unfavorable to the user or represent significant risk.
Use exact quotes from the shared cache for evidence.
Return ONLY a JSON array of risk items matching this schema:
[
  {
    "id": string (unique ID e.g. "risk_1"),
    "title": string (brief title of risk in ${L}),
    "severity": "high" | "medium" | "low",
    "plainExplanation": string (explanation in simple ${L}),
    "whyItMatters": string (explanation of consequence in ${L}),
    "evidence": [{ "page": number, "quote": string (exact original quote from cache), "confidence": number (0.0 to 1.0) }]
  }
]

Shared evidence cache:
${sharedCache}`
      }
    ];

    const moneyPrompt: any[] = [
      { role: "system", content: `${systemCommon}\nYou are the Document Financial Analysis Agent. Use moneyCandidates and pageSummaries from the shared evidence cache.` },
      {
        role: "user",
        content: `Extract amounts, fees, payouts, deposits, penalties, premium rules, or costs mentioned in the shared evidence cache.
Use exact quotes from the shared cache for evidence.
Return ONLY a JSON array of money items matching this schema:
[
  {
    "id": string (unique ID e.g. "money_1"),
    "amount": string,
    "type": "you_pay" | "you_receive" | "conditional" | "unknown",
    "description": string (what the payment is for, in ${L}),
    "evidence": [{ "page": number, "quote": string (exact original quote from cache), "confidence": number }]
  }
]

Shared evidence cache:
${sharedCache}`
      }
    ];

    const timelinePrompt: any[] = [
      { role: "system", content: `${systemCommon}\nYou are the Document Timeline Agent. Use timelineCandidates and actionHints from the shared evidence cache.` },
      {
        role: "user",
        content: `Extract only the 3-6 most important dates, deadlines, periods, or durations. Prefer items that affect user decisions, costs, eligibility, or coverage.
Use exact quotes from the shared cache for evidence.
Return ONLY a JSON array of timeline items matching this schema:
[
  {
    "id": string (unique ID e.g. "time_1"),
    "dateText": string,
    "meaning": string (explanation of the date's significance in ${L}),
    "urgency": "high" | "medium" | "low",
    "evidence": [{ "page": number, "quote": string (exact original quote from cache), "confidence": number }]
  }
]

Shared evidence cache:
${sharedCache}`
      }
    ];

    const runCoreAgents = async () => {
      const corePrompts: Array<[string, any[]]> = [
        ["summary", summaryPrompt],
        ["risks", riskPrompt],
        ["money", moneyPrompt],
        ["timeline", timelinePrompt],
      ];

      if (selectedProvider === "openai" && !fairCompare) {
        const sequential = [];
        for (const [name, prompt] of corePrompts) sequential.push(await runAgent(name, prompt));
        return sequential;
      }

      return Promise.all(corePrompts.map(([name, prompt]) => runAgent(name, prompt)));
    };

    const coreResults = await runCoreAgents();
    const coreMap = Object.fromEntries(coreResults.map((r) => [r.name, r.result]));
    const synthesisContext = compactText(JSON.stringify({
      intake,
      summary: coreMap.summary,
      risks: coreMap.risks,
      money: coreMap.money,
      timeline: coreMap.timeline,
    }, null, 2), 18000);

    const actionPrompt: any[] = [
      { role: "system", content: `${systemCommon}\nYou are the Document Action Item Agent. Synthesize actions from the shared cache and specialist outputs; do not reread the full PDF.` },
      {
        role: "user",
        content: `Extract key action items or checklists that the user must perform or remember.
Use the risk, money, timeline, and actionHints data below. Each task must start with a verb in ${L}.
Use exact quotes from the cache or specialist evidence.
Return ONLY a JSON array of action items matching this schema:
[
  {
    "id": string (unique ID e.g. "act_1"),
    "task": string (actionable task in ${L}),
    "priority": "high" | "medium" | "low",
    "dueDate": string (optional, e.g. "2026-08-01" or empty if none),
    "reason": string (why they must do it, in ${L}),
    "evidence": [{ "page": number, "quote": string (exact original quote), "confidence": number }]
  }
]

Shared specialist context:
${synthesisContext}`
      }
    ];

    const personaPrompt: any[] = [
      { role: "system", content: `${systemCommon}\nYou are the Accessibility Persona Explanation Agent. Synthesize explanations from the summary, risk, money, timeline, and action outputs; do not reread the full PDF.` },
      {
        role: "user",
        content: `Rewrite the main message of the document into 4 persona-based explanations:
1. child: Explain like a 10-year-old using friendly terms, simple analogies, and a warm tone (in ${L}).
2. senior: Explain for an elderly person in ${L}. Make it action-first and easy to read. Use 4 short numbered lines with these labels translated into ${L}: "What this document is", "What to do first", "Money or deadlines", "Who to contact". Use large-print friendly plain sentences. Do not use markdown symbols such as **, #, or tables. Explain hard terms in parentheses.
3. general: Explain in plain everyday ${L} for adults.
4. expert: Maintain formal technical/legal terminology and cite sections or concepts (in ${L}).
Keep each persona explanation concise. The senior explanation is the most important: make it practical, calm, and action-first. Do not use markdown symbols such as **, #, or tables.

Return ONLY a JSON object matching this schema:
{
  "child": string,
  "senior": string,
  "general": string,
  "expert": string
}

Shared specialist context:
${synthesisContext}`
      }
    ];

    const runSynthesisAgents = async () => {
      const synthesisPrompts: Array<[string, any[]]> = [
        ["actions", actionPrompt],
        ["persona", personaPrompt],
      ];

      if (selectedProvider === "openai" && !fairCompare) {
        const sequential = [];
        for (const [name, prompt] of synthesisPrompts) sequential.push(await runAgent(name, prompt));
        return sequential;
      }

      return Promise.all(synthesisPrompts.map(([name, prompt]) => runAgent(name, prompt)));
    };

    const synthesisResults = await runSynthesisAgents();
    const agentResults = [intakeRun, ...coreResults, ...synthesisResults];

    const durations: Record<string, number> = {};
    const results: Record<string, any> = {};
    const failedAgents: string[] = [];

    agentResults.forEach(r => {
      durations[r.name] = r.duration;
      results[r.name] = r.result;
      if (!r.success) failedAgents.push(r.name);
    });

    const overallDuration = (Date.now() - startOverall) / 1000;

    const finalResult: FinalAnalysisResult = {
      document: {
        id: documentId || `doc_${Math.random().toString(36).substring(7)}`,
        fileName: fileName || "uploaded_document.pdf",
        fileType: inputMode === "image" ? "image" : "pdf",
        pageCount: pageCount || processingPages.length,
        uploadedAt: new Date().toISOString(),
        documentType: results.summary?.documentType || intake.documentType || "other",
        language: results.summary?.language || intake.language || (isKo ? "ko" : "en")
      },
      executiveSummary: results.summary?.executiveSummary || intake.executiveSummary || [
        isKo ? "문서 요약 분석에 실패했습니다." : "Document summary analysis failed.",
        isKo ? "위험, 날짜 및 행동 체크리스트 항목을 하단에서 확인해 주세요." : "Please check risks, dates, and action items below.",
        isKo ? "일부 분석 과정에서 오류가 발생했을 수 있습니다." : "Some analysis steps may have encountered errors."
      ],
      keyPoints: results.summary?.keyPoints || intake.keyPoints || [],
      risks: Array.isArray(results.risks) ? results.risks : [],
      moneyItems: Array.isArray(results.money) ? results.money : [],
      timeline: Array.isArray(results.timeline) ? results.timeline : [],
      actions: Array.isArray(results.actions) ? results.actions : [],
      personaBrief: results.persona || {
        child: isKo ? "어려운 말이 가득해서 설명하기 어려워요. 챗봇에 질문해 보세요!" : "This is a complex document. Try asking me a question about it!",
        senior: isKo ? "설명 생성이 지연되었습니다. 하단의 해야 할 일 체크리스트를 먼저 확인해 주십시오." : "Explanation unavailable. Please refer to the action checklist below.",
        general: isKo ? "페르소나별 설명을 생성하지 못했습니다. 챗봇에 질문해 보세요." : "Persona explanation unavailable. Try asking the chatbot.",
        expert: isKo ? "페르소나 분석 생성 실패. 원문 데이터를 직접 참조하십시오." : "Persona brief generation failed. Please refer to raw analysis outputs."
      },
      disclaimer: isKo
        ? "Cerebras DocLens은 문서 이해를 돕는 AI 도구입니다. 법률, 의료, 보험, 금융에 대한 전문 자문을 대체하지 않습니다. 중요한 결정 전에는 반드시 전문가 또는 해당 기관에 확인하세요."
        : "Cerebras DocLens is an AI tool to aid document comprehension. It does not replace professional legal, medical, insurance, or financial advice. Always consult a qualified expert before making major decisions."
    };

    return NextResponse.json({
      success: true,
      result: finalResult,
      durations,
      overallDuration,
      failedAgents: failedAgents.length > 0 ? failedAgents : undefined
    });
  } catch (error) {
    console.error("Analysis route error:", error);
    const message = (error as Error).message || "Failed to analyze document content";
    const isMissingKey = message.toLowerCase().includes("missing") && message.toLowerCase().includes("api key");
    return NextResponse.json({
      error: isMissingKey ? message : "Failed to analyze document content",
      code: isMissingKey ? "missing_api_key" : "analysis_failed"
    }, { status: isMissingKey ? 400 : 500 });
  }
}