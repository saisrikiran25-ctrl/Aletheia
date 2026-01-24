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
      model: 'gemini-1.5-flash',
      contents: `Perform a dialectical analysis on the market/topic: "${query}".
      
      Step 1 (Consensus): What does everyone believe? What is the herd doing?
      Step 2 (Skeptic): Attack Step 1. Find the stagnation, the lies, and the mimicry.
      Step 3 (Synthesis): Find the "Zero to One" opportunity. The Secret.
      
      Return the result in strict JSON format according to the schema.`,
      config: {
        tools: [{ googleSearch: {} }], // Enable Google Search Grounding
        responseMimeType: "application/json",
        responseSchema: analysisSchema,
        systemInstruction: "You are ALETHEIA, a high-fidelity intelligence terminal designed for Zero-to-One founders. You reject bubbly optimism. You provide cold, hard, contrarian analysis based on real-world data. Be concise, technical, and ruthless.",
      },
    });

    const text = response.text;
    if (!text) throw new Error("No response from Aletheia Core.");

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
  } catch (error) {
    console.error("Dialectic Engine Failure:", error);
    throw error;
  }
};