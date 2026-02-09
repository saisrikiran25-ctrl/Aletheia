import { AnalysisResult } from "../types";

export const analyzeMarket = async (query: string): Promise<AnalysisResult> => {
  try {
    const apiKey = process.env.OPENROUTER_API_KEY || process.env.API_KEY;

    if (!apiKey) {
      throw new Error("API Key is missing. Please set OPENROUTER_API_KEY in your environment variables.");
    }

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://aletheia.app", // Optional, for OpenRouter rankings
        "X-Title": "Aletheia", // Optional, for OpenRouter rankings
      },
      body: JSON.stringify({
        model: "google/gemini-2.0-flash-exp:free",
        messages: [
          {
            role: "system",
            content: "You are ALETHEIA, a high-fidelity intelligence terminal designed for Zero-to-One founders. You reject bubbly optimism. You provide cold, hard, contrarian analysis based on real-world data. Be concise, technical, and ruthless."
          },
          {
            role: "user",
            content: `Perform a dialectical analysis on the market/topic: "${query}".
      
      Step 1 (Consensus): What does everyone believe? What is the herd doing?
      Step 2 (Skeptic): Attack Step 1. Find the stagnation, the lies, and the mimicry.
      Step 3 (Synthesis): Find the "Zero to One" opportunity. The Secret.
      
      Return the result in strict JSON format according to this schema:
      {
        "consensus": {
          "theme": "string",
          "points": ["string", "string", "string"],
          "marketSaturation": number
        },
        "skeptic": {
          "fallacies": ["string"],
          "stagnationPoint": "string",
          "mimeticTraps": ["string"]
        },
        "synthesis": {
          "secret": "string",
          "verticalStrategy": "string",
          "opportunityScore": number
        }
      }
      
      IMPORTANT: You must return the result as specific, valid JSON only. Do not use markdown blocks. Do not explain. Just the JSON text.`
          }
        ]
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`OpenRouter API Error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    let text = data.choices[0]?.message?.content;

    if (!text) throw new Error("No response from Aletheia Core (OpenRouter).");

    // Aggressively clean markdown and whitespace to find the JSON object
    try {
      text = text.trim();
      // Remove ```json and ``` wrapping if present
      const match = text.match(/\{[\s\S]*\}/);
      if (match) {
        text = match[0];
      } else {
        // Fallback cleanup if regex fails but it looks like JSON
        text = text.replace(/```json/g, '').replace(/```/g, '').trim();
      }

      const result = JSON.parse(text) as AnalysisResult;

      // Note: OpenRouter generic response might not have grounding metadata in the same format as Google GenAI SDK.
      // We will clear existing sources or mock them if needed, but for now strict adherence to new API.
      // If the model supports citations, we'd need to parse them from the text or specific provider non-standard fields.
      // For now, we omit sources or leave them empty to ensure type safety.
      result.sources = [];

      return result;

    } catch (parseError) {
      console.error("JSON Parsing failed. Raw text:", text);
      throw new Error(`Aletheia Core - Parse Error: ${parseError}`);
    }

  } catch (error) {
    console.error("Dialectic Engine Failure:", error);
    throw error;
  }
};