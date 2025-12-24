import { describe, expect, it } from "vitest";
import { callOpenRouter } from "./openrouter";

describe("OpenRouter API Integration", () => {
  it("validates API key by making a simple request", async () => {
    const response = await callOpenRouter({
      model: "mistralai/ministral-8b",
      messages: [
        { role: "user", content: "Say 'Hello' in one word." },
      ],
      max_tokens: 10,
    });

    expect(response).toBeTruthy();
    expect(typeof response).toBe("string");
    expect(response.length).toBeGreaterThan(0);
  }, 30000); // 30 second timeout for API call

  it("handles prayer generation format", async () => {
    const response = await callOpenRouter({
      model: "mistralai/ministral-8b",
      messages: [
        { 
          role: "system", 
          content: "Return ONLY valid JSON: {\"test\": \"value\"}" 
        },
        { 
          role: "user", 
          content: "Generate the JSON" 
        },
      ],
      max_tokens: 50,
    });

    expect(response).toBeTruthy();
    // Should be parseable JSON
    const parsed = JSON.parse(response);
    expect(parsed).toBeTruthy();
  }, 30000);
});
