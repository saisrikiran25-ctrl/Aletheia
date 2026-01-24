import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult } from "../types";



const analysisSchema = {
  type: Type.OBJECT,
  properties: {
    consensus: {
      type: Type.OBJECT,
      properties: {
        theme: { type: Type.STRING, description: "The dominant narrative or conventional wisdom." },
        points: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: "List of 3 key beliefs held by the majority."
        },
        marketSaturation: { type: Type.NUMBER, description: "Estimated saturation 0-100." }
      },
      required: ["theme", "points", "marketSaturation"]
    },
    skeptic: {
      type: Type.OBJECT,
      properties: {
        fallacies: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: "Logical fallacies in the consensus view."
        },
        stagnationPoint: { type: Type.STRING, description: "Where progress has stalled." },
        mimeticTraps: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: "Common traps founders fall into."
        }
      },
      required: ["fallacies", "stagnationPoint", "mimeticTraps"]
    },
    synthesis: {
      type: Type.OBJECT,
      properties: {
        secret: { type: Type.STRING, description: "The contrarian truth or 'Secret'." },
        verticalStrategy: { type: Type.STRING, description: "Strategy to build a monopoly." },
        opportunityScore: { type: Type.NUMBER, description: "0-100 score of opportunity." }
      },
      required: ["secret", "verticalStrategy", "opportunityScore"]
    }
  },
  required: ["consensus", "skeptic", "synthesis"]
};

export const analyzeMarket = async (query: string): Promise<AnalysisResult> => {
  try {
    const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY;

    if (!apiKey) {
      throw new Error("API Key is missing. Please set GEMINI_API_KEY in your environment variables.");
    }

    const ai = new GoogleGenAI({ apiKey });

    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash-exp',
      contents: `Perform a dialectical analysis on the market/topic: "${query}".
      
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
      
      IMPORTANT: You must return the result as specific, valid JSON only. Do not use markdown blocks. Do not explain. Just the JSON text.`,
      config: {
        tools: [{ googleSearch: {} }], // Enable Google Search Grounding
        // responseMimeType: "application/json", // CONFLICT: JSON Mode is also "Controlled Generation" and conflicts with Search
        // responseSchema: analysisSchema, // CONFLICT: Cannot use Schema with Search tool
        systemInstruction: "You are ALETHEIA, a high-fidelity intelligence terminal designed for Zero-to-One founders. You reject bubbly optimism. You provide cold, hard, contrarian analysis based on real-world data. Be concise, technical, and ruthless.",
      },
    });

    let text = response.text;
    if (!text) throw new Error("No response from Aletheia Core.");

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

      // Extract Grounding Metadata (Sources)
      if (response.candidates?.[0]?.groundingMetadata?.groundingChunks) {
        const chunks = response.candidates[0].groundingMetadata.groundingChunks;
        const sources = chunks
          .map((chunk: any) => ({
            title: chunk.web?.title || 'Verified Intelligence Source',
            uri: chunk.web?.uri
          }))
          .filter((s: any): s is { title: string; uri: string } => !!s.uri);

        // Deduplicate sources
        const uniqueSources = Array.from(
          new Map(sources.map((item) => [item.uri, item])).values()
        );
        result.sources = uniqueSources as { title: string; uri: string }[];
      }

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