import {GEMINI_API_KEY, GEMINI_MODEL} from "../config/env";
import {getLocalFallback, toContents} from "../helpers/chat.helper";
import {SYSTEM_INSTRUCTION} from "../config/chat.config";
import {GEMINI_RESPONSE_SCHEMA} from "../schemas/chat.schema";
import {GoogleGenAI} from "@google/genai";
import {ChatMessage} from "../types/chat.types";
import {RawGuideMessage} from "../types/llm.types";

const ai = GEMINI_API_KEY ? new GoogleGenAI({apiKey: GEMINI_API_KEY}) : null;


export async function generateGuideMessages(history: ChatMessage[]): Promise<RawGuideMessage[]> {
    const lastUser = [...history].reverse().find((m) => m.role === "user" && m.kind === "text");
    const lastText = lastUser && lastUser.kind === "text" ? lastUser.text : "";

    if (!ai) return getLocalFallback(lastText);

    try {
        const response = await ai.models.generateContent({
            model: GEMINI_MODEL,
            contents: toContents(history),
            config: {
                systemInstruction: SYSTEM_INSTRUCTION,
                responseMimeType: "application/json",
                responseSchema: GEMINI_RESPONSE_SCHEMA as any,
                temperature: 0.8,
            },
        });
        const raw = response.text;
        if (!raw) throw new Error("empty response");
        const parsed = JSON.parse(raw) as { messages?: RawGuideMessage[] };
        const messages = parsed.messages ?? [];
        return messages.length ? messages : getLocalFallback(lastText);
    } catch (err) {
        console.warn("[gemini] generation failed, using local fallback:", (err as Error).message);
        return getLocalFallback(lastText);
    }
}

