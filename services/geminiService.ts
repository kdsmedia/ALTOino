
import { GoogleGenAI, Type } from "@google/genai";
import { AIResponse, ProjectAudit, PinControl } from "../types";
import { SYSTEM_PROMPT } from "../constants";

export class GeminiService {
  private ai: GoogleGenAI;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }

  private cleanJsonResponse(text: string): string {
    return text.replace(/```json/g, "").replace(/```/g, "").trim();
  }

  async generateArduinoCode(prompt: string, context?: { code: string, wiring: string, batteryType?: string, controls?: PinControl[] }): Promise<AIResponse> {
    try {
      let fullPrompt = prompt;
      
      if (context) {
        const controlsStr = context.controls ? JSON.stringify(context.controls, null, 2) : 'None defined';
        fullPrompt = `
PROJECT CONTEXT:
--- CODE ---
${context.code}

--- WIRING ---
${context.wiring}

--- HARDWARE ---
${controlsStr}

--- POWER ---
Source: ${context.batteryType || 'USB 5V'}

USER REQUEST:
${prompt}

INSTRUCTION: 
Update the project. The wiringInstructions MUST be a Markdown table.
`;
      }

      const response = await this.ai.models.generateContent({
        model: "gemini-3-pro-preview",
        contents: fullPrompt,
        config: {
          systemInstruction: SYSTEM_PROMPT,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              code: { type: Type.STRING },
              explanation: { type: Type.STRING },
              libraries: { 
                type: Type.ARRAY,
                items: { type: Type.STRING }
              },
              wiringInstructions: { type: Type.STRING }
            },
            required: ["code", "explanation", "libraries", "wiringInstructions"]
          }
        }
      });

      const cleanedText = this.cleanJsonResponse(response.text || '{}');
      return JSON.parse(cleanedText) as AIResponse;
    } catch (error) {
      console.error("Gemini API Error:", error);
      throw new Error("Gagal generate kode Arduino.");
    }
  }

  async syncWiringWithHardware(code: string, controls: PinControl[], batteryType: string): Promise<string> {
    try {
      const prompt = `
Generate an expert Markdown wiring table for an Arduino project.
CODE: ${code}
CONTROLS: ${JSON.stringify(controls)}
POWER: ${batteryType}

RULES:
1. Table columns: | Komponen | Pin Arduino | Deskripsi & Komponen Pasif |
2. Identify PWM pins (3, 5, 6, 9, 10, 11) for analogWrite.
3. Suggest 220-330 ohm resistors for LEDs.
4. If using high voltage source, mention voltage regulators.
5. Return ONLY the Markdown table.
`;

      const response = await this.ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
          systemInstruction: "You are a professional hardware engineer. Provide only high-quality Markdown tables."
        }
      });

      return response.text || "Gagal sinkronisasi wiring.";
    } catch (error) {
      console.error("Sync Wiring Error:", error);
      return "Gagal sinkronisasi wiring.";
    }
  }
}

export const arduinoAI = new GeminiService();
