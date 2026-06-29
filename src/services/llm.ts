import OpenAI from 'openai';

const cerebrasApiKey = process.env.CEREBRAS_API_KEY;
const openAIApiKey = process.env.OPENAI_API_KEY;

if (!cerebrasApiKey) {
  console.warn("CEREBRAS_API_KEY is not defined in the environment variables.");
}
if (!openAIApiKey) {
  console.warn("OPENAI_API_KEY is not defined in the environment variables.");
}

const cerebrasClient = new OpenAI({
  apiKey: cerebrasApiKey || 'dummy-key',
  baseURL: 'https://api.cerebras.ai/v1',
});

const openAIClient = new OpenAI({
  apiKey: openAIApiKey || 'dummy-key',
});

export const DEFAULT_MODEL = 'gemma-4-31b';
export const OPENAI_COMPARE_MODEL = 'gpt-4.1';

export type UserApiKeys = {
  cerebras?: string;
  openai?: string;
};

type ChatMessage = {
  role: 'system' | 'user' | 'assistant';
  content:
    | string
    | Array<
        | { type: 'text'; text: string }
        | { type: 'image_url'; image_url: { url: string } }
      >;
};

/**
 * Strips markdown code block wrappers (like ```json ... ```) from a string.
 */
export function cleanJsonString(str: string): string {
  let cleaned = str.trim();
  
  // Remove markdown code blocks if present
  if (cleaned.startsWith('```')) {
    const lines = cleaned.split('\n');
    if (lines[0].startsWith('```')) {
      lines.shift();
    }
    if (lines[lines.length - 1].startsWith('```')) {
      lines.pop();
    }
    cleaned = lines.join('\n').trim();
  }
  
  // In case the model still put backticks or other wrappers
  cleaned = cleaned.replace(/^```json\s*/i, '').replace(/```$/, '').trim();
  
  // Try to locate a complete JSON object or array if there's surrounding text.
  // Prefer the earliest JSON opener so array responses keep their outer brackets.
  const firstBrace = cleaned.indexOf('{');
  const firstBracket = cleaned.indexOf('[');
  const startsWithArray = firstBracket !== -1 && (firstBrace === -1 || firstBracket < firstBrace);

  if (startsWithArray) {
    const lastBracket = cleaned.lastIndexOf(']');
    if (lastBracket > firstBracket) {
      cleaned = cleaned.substring(firstBracket, lastBracket + 1);
    }
  } else if (firstBrace !== -1) {
    const lastBrace = cleaned.lastIndexOf('}');
    if (lastBrace > firstBrace) {
      cleaned = cleaned.substring(firstBrace, lastBrace + 1);
    }
  }
  
  return cleaned;
}

/**
 * Call selected LLM API to generate completion
 */
export async function getChatCompletion(
  messages: ChatMessage[],
  temperature = 0.2,
  provider: 'cerebras' | 'openai' = 'cerebras',
  apiKeys: UserApiKeys = {},
  maxTokens = 1200
): Promise<string> {
  try {
    if (provider === 'openai') {
      const userKey = apiKeys.openai?.trim();
      const apiKey = userKey || openAIApiKey;
      if (!apiKey) {
        throw new Error('Missing OpenAI API key. Add your GPT-4.1 key in API Key settings.');
      }
      const client = userKey ? new OpenAI({ apiKey }) : openAIClient;
      const response = await client.chat.completions.create({
        model: OPENAI_COMPARE_MODEL,
        messages: messages as any,
        temperature,
        max_tokens: maxTokens,
      });
      return response.choices[0]?.message?.content || '';
    } else {
      const userKey = apiKeys.cerebras?.trim();
      const apiKey = userKey || cerebrasApiKey;
      if (!apiKey) {
        throw new Error(`Missing Cerebras API key. Add your ${DEFAULT_MODEL} key in API Key settings.`);
      }
      const client = userKey ? new OpenAI({ apiKey, baseURL: 'https://api.cerebras.ai/v1' }) : cerebrasClient;
      const response = await client.chat.completions.create({
        model: DEFAULT_MODEL,
        messages: messages as any,
        temperature,
        max_tokens: maxTokens,
      });
      return response.choices[0]?.message?.content || '';
    }
  } catch (error: any) {
    if (provider === 'cerebras') {
      console.warn("Cerebras API completion error:", error.message || error);
      throw new Error(`Cerebras Gemma 4 31B request failed. Demo mode requires ${DEFAULT_MODEL}; no fallback model was used.`);
    } else {
      console.error("OpenAI API completion error:", error.message || error);
    }
    throw error;
  }
}

/**
 * Call selected API and expect a structured JSON response
 */
export async function getJsonCompletion<T>(
  messages: ChatMessage[],
  temperature = 0.1,
  provider: 'cerebras' | 'openai' = 'cerebras',
  apiKeys: UserApiKeys = {},
  maxTokens = 1200
): Promise<T> {
  const content = await getChatCompletion(messages, temperature, provider, apiKeys, maxTokens);
  const cleaned = cleanJsonString(content);
  
  try {
    return JSON.parse(cleaned) as T;
  } catch (e) {
    console.error("Failed to parse JSON from response. Raw content was:\n", content);
    console.error("Cleaned content was:\n", cleaned);
    throw new Error(`Invalid JSON format in LLM response: ${(e as Error).message}`);
  }
}
