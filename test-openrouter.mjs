import axios from "axios";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";

async function testOpenRouterKey() {
  const apiKey = process.env.OPENROUTER_API_KEY;
  
  if (!apiKey) {
    console.error("❌ OPENROUTER_API_KEY environment variable is not set");
    process.exit(1);
  }

  console.log("🔑 Testing OpenRouter API key...");
  console.log(`   Key: ${apiKey.substring(0, 20)}...${apiKey.substring(apiKey.length - 4)}`);

  try {
    const response = await axios.post(
      OPENROUTER_API_URL,
      {
        model: "mistralai/ministral-8b",
        messages: [
          { role: "user", content: "Say 'Hello' in one word." },
        ],
        max_tokens: 10,
      },
      {
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "https://praywith.faith",
          "X-Title": "PrayWith-Faith",
        },
        timeout: 30000,
      }
    );

    const content = response.data.choices[0]?.message?.content;
    
    if (!content) {
      console.error("❌ No content in OpenRouter response");
      process.exit(1);
    }

    console.log("✅ OpenRouter API key is valid!");
    console.log(`   Response: "${content}"`);
    console.log(`   Model: ${response.data.model || "ministralai/ministral-8b"}`);
    process.exit(0);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("❌ OpenRouter API Error:");
      console.error(`   Status: ${error.response?.status}`);
      console.error(`   Message: ${error.response?.data?.error?.message || error.message}`);
      console.error(`   Full error:`, JSON.stringify(error.response?.data, null, 2));
    } else {
      console.error("❌ Unexpected error:", error);
    }
    process.exit(1);
  }
}

testOpenRouterKey();
