import axios from "axios";

const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";

interface OpenRouterMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

interface OpenRouterRequest {
  model: string;
  messages: OpenRouterMessage[];
  temperature?: number;
  max_tokens?: number;
}

interface OpenRouterResponse {
  choices: Array<{
    message: {
      role: string;
      content: string;
    };
  }>;
}

/**
 * Call OpenRouter API with the specified model and messages
 */
export async function callOpenRouter(
  request: OpenRouterRequest
): Promise<string> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  
  if (!apiKey) {
    throw new Error("OPENROUTER_API_KEY environment variable is not set");
  }

  try {
    const response = await axios.post<OpenRouterResponse>(
      OPENROUTER_API_URL,
      request,
      {
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "https://praywith.faith",
          "X-Title": "PrayWith-Faith",
        },
        timeout: 60000, // 60 second timeout
      }
    );

    const content = response.data.choices[0]?.message?.content;
    
    if (!content) {
      throw new Error("No content in OpenRouter response");
    }

    return content;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("[OpenRouter] API Error:", error.response?.data || error.message);
      throw new Error(`OpenRouter API error: ${error.response?.data?.error?.message || error.message}`);
    }
    throw error;
  }
}

/**
 * Generate a prayer using OpenRouter AI
 */
export async function generatePrayer(params: {
  language: "en" | "es" | "fr" | "pt";
  date: string;
  eventType?: string;
}): Promise<{
  title: string;
  subtitle?: string;
  body: string;
  affirmation: string;
  actionStep: string;
  whisperPrayer?: string;
  blessing: string;
}> {
  const languageNames = {
    en: "English",
    es: "Spanish",
    fr: "French",
    pt: "Portuguese",
  };

  const systemPrompt = `You are a prayer writer creating daily prayers for PrayWith-Faith, a spiritual companion app. Your prayers should be:
- Gender-neutral and inclusive
- Warm, encouraging, and contemplative
- Relevant to the day/event
- Written in ${languageNames[params.language]}

Return ONLY valid JSON with this exact structure:
{
  "title": "A contextual title reflecting the day/event",
  "subtitle": "Optional theme (can be null)",
  "body": "3-5 paragraphs of prayer text, separated by \\n\\n",
  "affirmation": "First-person declaration starting with 'I am...' or 'I...'",
  "actionStep": "Practical action for today",
  "whisperPrayer": "Optional brief prayer (can be null)",
  "blessing": "Third-person closing blessing"
}`;

  const userPrompt = `Create a prayer for ${params.date}${params.eventType ? ` (${params.eventType})` : ""}.`;

  const response = await callOpenRouter({
    model: "mistralai/ministral-8b",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
    temperature: 0.8,
    max_tokens: 2000,
  });

  try {
    const parsed = JSON.parse(response);
    return parsed;
  } catch (error) {
    console.error("[OpenRouter] Failed to parse prayer JSON:", response);
    throw new Error("Failed to parse prayer response from OpenRouter");
  }
}

/**
 * Generate a chat response using OpenRouter AI
 */
export async function generateChatResponse(params: {
  messages: OpenRouterMessage[];
  prayerContext?: string;
}): Promise<string> {
  const systemPrompt = `You are a compassionate spiritual companion helping users reflect on their prayers and faith journey. Be:
- Warm and empathetic
- Thoughtful and contemplative
- Supportive and encouraging
- Respectful of all faith traditions

${params.prayerContext ? `Context: The user is reflecting on this prayer:\n${params.prayerContext}` : ""}`;

  const response = await callOpenRouter({
    model: "meta-llama/llama-3.3-70b-instruct",
    messages: [
      { role: "system", content: systemPrompt },
      ...params.messages,
    ],
    temperature: 0.7,
    max_tokens: 1000,
  });

  return response;
}
