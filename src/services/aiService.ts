import OpenAI from "openai";

const groq = new OpenAI({
    apiKey: process.env.GROQ_API_KEY,
    baseURL: "https://api.groq.com/openai/v1",
});
const MODEL = process.env.GROQ_MODEL ?? "llama-3.1-8b-instant";

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

export interface ReplyInput {
    title: string;
    rawText: string;
    knowledge: { title: string; content: string; }[];
}

export interface TicketDetailAnalysis {
    summary: string;
    suggestedReply: string;
    confidence: number;
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
    Return example: { "priority":"HIGH", "sentiment":"NEGATIVE" }`;

    const response = await groq.chat.completions.create({
        model: MODEL,
        messages: [{ role: "user", content: prompt }],
        temperature: 0.2,
    });

    const text = response.choices[0]?.message?.content ?? "{}";

    try {
        return JSON.parse(text);
    } catch (error) {
        console.error(error);
        return { priority: "LOW", sentiment: "NEUTRAL", };
    }
}

export async function generateReply(input: ReplyInput): Promise<string> {
    const knowledge = input.knowledge.map(k => `Title: ${k.title} Content: ${k.content}`)
        .join("\n\n-----------------\n\n");

    const prompt = `You are a professional customer support agent.
    Your job is to write a helpful, polite response.
    Use the company knowledge below.
    If the knowledge contains relevant information, use it.
    If not, reply professionally anyway.

    Knowledge Base: ${knowledge}
    ----------------------------
    Customer Ticket
    Title: ${input.title}
    Description: ${input.rawText}
    ----------------------------
    Return ONLY the reply.
    Do not explain.
    Do not use markdown.`;

    const response = await await groq.chat.completions.create({
        model: MODEL,
        messages: [{ role: "user", content: prompt }],
    });

    const text = response.choices[0]?.message?.content ?? "{}";

    return JSON.parse(text);
}

export async function generateTicketAnalysis(title: string, rawText: string): Promise<TicketDetailAnalysis> {
    const prompt = `You are an experienced customer support manager.
    Read this ticket.

    Ticket Title: ${title}
    Ticket Description: ${rawText}

    Return ONLY JSON.
    Return example: { "summary":"...", "suggestedReply":"...", "confidence":95 }`;

    const response = await groq.chat.completions.create({
        model: MODEL,
        messages: [{ role: "user", content: prompt, }],
        temperature: 0.3,
    });

    const text = response.choices[0]?.message?.content ?? "{}";

    try {
        return JSON.parse(text);
    } catch (error) {
        console.error(error);
        return {
            summary: "Unable to generate summary.",
            suggestedReply: "Please contact support.",
            confidence: 0,
        };
    }
}