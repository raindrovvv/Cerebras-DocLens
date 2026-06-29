import { NextResponse } from "next/server";
import { getJsonCompletion } from "@/services/llm";

export async function POST(req: Request) {
  try {
    const { documentText, question, mode, lang, provider, history, apiKeys = {} } = await req.json();

    if (!question) {
      return NextResponse.json({ error: "Missing question" }, { status: 400 });
    }

    const docContext = documentText || "No document text available.";
    const selectedMode = mode || "general";
    const isEn = lang === "en";

    let personaGuideline = "";
    if (selectedMode === "child") {
      personaGuideline = isEn 
        ? `Explain like a friendly, warm 10-year-old child (in English). Use very simple words, short sentences, and everyday analogies. Avoid scary details. Keep it extremely easy to understand.`
        : `Explain like a friendly, warm 10-year-old child (in Korean). Use very simple words, short sentences, and everyday analogies. Avoid scary details. Keep it extremely easy to understand.`;
    } else if (selectedMode === "senior") {
      personaGuideline = isEn
        ? `Explain for an elderly senior person (in English). Use simple, clear, respectful, action-first English. Start with what they should do first, then money/deadlines, then who to contact. Use short lines. Do not use markdown symbols such as **, #, or tables.`
        : `Explain for an elderly senior person (in Korean). Use simple, clear, respectful, action-first Korean. Start with what they should do first, then money/deadlines, then who to contact. Use short lines. Do not use markdown symbols such as **, #, or tables.`;
    } else if (selectedMode === "expert") {
      personaGuideline = isEn
        ? `Explain like a professional expert or legal/medical consultant (in English). Maintain formal, precise vocabulary. Quote specific clauses or technical terms where relevant. Be precise and analytical.`
        : `Explain like a professional expert or legal/medical consultant (in Korean). Maintain formal, precise vocabulary. Quote specific clauses or technical terms where relevant. Be precise and analytical.`;
    } else {
      personaGuideline = isEn
        ? `Explain in plain, clear English for everyday adults. Keep it straightforward, accurate, and easy to read without unnecessary jargon.`
        : `Explain in plain, clear Korean for everyday adults. Keep it straightforward, accurate, and easy to read without unnecessary jargon.`;
    }

    const fallbackMsg = isEn ? "Could not find the relevant information in the document." : "문서에서 해당 내용을 찾을 수 없습니다";
    const targetLanguage = isEn ? "English" : "Korean";

    const systemPrompt = `You are an AI document assistant answering questions about a document.
Strictly base your answer on the provided document text. If the answer is not mentioned, say "${fallbackMsg}" and leave evidence empty.
You must adopt the requested persona tone and style.

Persona Style Instruction:
${personaGuideline}

Return ONLY a valid JSON object matching this schema:
{
  "answer": string (the response text, styled according to the persona, in ${targetLanguage}),
  "evidence": [
    {
      "page": number (page number if found, or 0 if unknown),
      "quote": string (exact original quote from the document in its original language),
      "confidence": number (between 0.0 and 1.0)
    }
  ]
}
Do not include any explanation or markdown formatting outside the JSON.`;

    // Build conversation history messages (skip the initial bot welcome)
    const historyMessages: Array<{ role: "system" | "user" | "assistant"; content: string }> = 
      (history || []).slice(-8).flatMap((msg: { sender: string; text: string }) => {
        if (msg.sender === 'user') return [{ role: 'user' as const, content: msg.text }];
        if (msg.sender === 'bot') return [{ role: 'assistant' as const, content: msg.text }];
        return [];
      });

    const messages: Array<{ role: "system" | "user" | "assistant"; content: string }> = [
      { 
        role: "system", 
        content: systemPrompt + `\n\nDocument Text for Reference:\n${docContext.substring(0, 8000)}`
      },
      ...historyMessages,
      { role: "user", content: question }
    ];

    const result = await getJsonCompletion<{
      answer: string;
      evidence: Array<{ page: number; quote: string; confidence: number }>;
    }>(messages, 0.1, provider || "cerebras", apiKeys);

    return NextResponse.json(result);
  } catch (error) {
    console.error("Ask API Route error:", error);
    return NextResponse.json({ error: "Failed to answer question" }, { status: 500 });
  }
}
