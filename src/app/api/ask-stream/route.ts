import { OpenAI } from "openai";

const cerebrasClient = new OpenAI({
  apiKey: process.env.CEREBRAS_API_KEY || "dummy-key",
  baseURL: "https://api.cerebras.ai/v1",
});

const openAIClient = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "dummy-key",
});

export async function POST(req: Request) {
  try {
    const { documentText, question, mode, lang, provider, history, apiKeys = {} } = await req.json();

    if (!question) {
      return new Response("Missing question", { status: 400 });
    }

    const docContext = (documentText || "No document text available.").substring(0, 8000);
    const selectedMode = mode || "general";
    const isEn = lang === "en";

    let personaGuideline = "";
    if (selectedMode === "child") {
      personaGuideline = isEn
        ? "Explain like a friendly, warm 10-year-old child (in English). Use very simple words, short sentences, and everyday analogies. No scary details."
        : "10살 어린이가 이해할 수 있는 아주 쉬운 말로 설명해주세요. 짧은 문장, 친근한 비유를 사용하세요.";
    } else if (selectedMode === "senior") {
      personaGuideline = isEn
        ? "Explain for an elderly senior (in English). Use simple, clear, respectful, action-first language. Start with what to do first, then money/deadlines, then who to contact. Use short lines. Do not use markdown symbols like **, #, or tables."
        : "어르신을 위해 크고 명확하게, 행동 중심으로 설명해주세요. 먼저 해야 할 일, 돈/기한, 문의할 곳 순서로 짧게 설명하세요. **, #, 표 같은 마크다운 기호는 쓰지 마세요.";
    } else if (selectedMode === "expert") {
      personaGuideline = isEn
        ? "Explain like a professional legal/medical consultant (in English). Maintain formal, precise vocabulary and cite clauses."
        : "법률·의료 전문가 관점에서 전문 용어를 사용하여 정확하고 분석적으로 설명해주세요.";
    } else {
      personaGuideline = isEn
        ? "Explain in plain, clear English for everyday adults. Be straightforward and easy to read."
        : "일반 성인을 위해 쉬운 말로 명확하게 설명해주세요.";
    }

    const targetLanguage = isEn ? "English" : "Korean";
    const fallbackMsg = isEn
      ? "I could not find the relevant information in this document."
      : "문서에서 해당 내용을 찾을 수 없습니다.";

    // Build conversation history
    const historyMessages: Array<{ role: "system" | "user" | "assistant"; content: string }> =
      (history || [])
        .slice(-8)
        .flatMap((msg: { sender: string; text: string }) => {
          if (msg.sender === "user") return [{ role: "user" as const, content: msg.text }];
          if (msg.sender === "bot") return [{ role: "assistant" as const, content: msg.text }];
          return [];
        });

    const systemPrompt = `You are an AI document assistant. Answer ONLY from the provided document context.
If the answer is not in the document, say "${fallbackMsg}".
Persona: ${personaGuideline}
Respond in ${targetLanguage}. Keep the answer concise and direct. Do NOT output JSON, just plain text.`;

    const messages: Array<{ role: "system" | "user" | "assistant"; content: string }> = [
      {
        role: "system",
        content: systemPrompt + `\n\nDocument Context:\n${docContext}`,
      },
      ...historyMessages,
      { role: "user", content: question },
    ];

    const userKey = provider === "openai" ? apiKeys.openai?.trim() : apiKeys.cerebras?.trim();
    const fallbackKey = provider === "openai" ? process.env.OPENAI_API_KEY : process.env.CEREBRAS_API_KEY;
    const apiKey = userKey || fallbackKey;
    if (!apiKey) {
      return new Response(provider === "openai" ? "Missing GPT-4.1 API key" : "Missing Cerebras API key", { status: 400 });
    }
    const client = userKey
      ? new OpenAI({
          apiKey,
          ...(provider === "openai" ? {} : { baseURL: "https://api.cerebras.ai/v1" }),
        })
      : provider === "openai" ? openAIClient : cerebrasClient;
    const model = provider === "openai" ? "gpt-4.1" : "gemma-4-31b";

    const stream = await client.chat.completions.create({
      model,
      messages,
      stream: true,
      temperature: 0.2,
      max_tokens: 700,
    });

    // Return a streaming response
    const readableStream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();
        try {
          for await (const chunk of stream) {
            const text = chunk.choices[0]?.delta?.content || "";
            if (text) {
              controller.enqueue(encoder.encode(text));
            }
          }
        } catch (err) {
          console.error("Streaming error:", err);
        } finally {
          controller.close();
        }
      },
    });

    return new Response(readableStream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (error) {
    console.error("Ask-stream route error:", error);
    return new Response("Stream failed", { status: 500 });
  }
}
