import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY!, });

export interface TicketAnalysis {
    priority:
    | "LOW"
    | "MEDIUM"
    | "HIGH"
    | "CRITICAL";

    sentiment:
    | "POSITIVE"
    | "NEUTRAL"
    | "NEGATIVE"
    | "ANGRY";
}

export async function analyzeTicket(title: string, rawText: string): Promise<TicketAnalysis> {
    const prompt = `You are an AI customer support ticket classifier.
    Analyze the following ticket. 
    Return ONLY valid JSON. 
    Do not explain anything.

    Allowed priorities:
    LOW
    MEDIUM
    HIGH
    CRITICAL

    Allowed sentiments:
    POSITIVE
    NEUTRAL
    NEGATIVE
    ANGRY

    Ticket Title: ${title}
    Ticket Description: ${rawText}
    Return exactly: { "priority":"HIGH", "sentiment":"NEGATIVE" }`;

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
    });

    const text = response.text ?? "";
    const cleaned = text.replace(/```json/g, "").replace(/```/g, "").trim();

    return JSON.parse(cleaned);
}