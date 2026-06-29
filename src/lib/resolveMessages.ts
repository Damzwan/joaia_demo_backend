import {randomUUID} from "node:crypto";
import {PERSONA_IDS, type PersonaId} from "../types/types";
import {placesService} from "../services/places.service";
import {ChatMessage} from "../types/chat.types";
import {RawGuideMessage} from "../types/llm.types";

const base = (persona?: PersonaId) => ({
    id: randomUUID(),
    role: "guide" as const,
    createdAt: Date.now(),
    personaId: validPersona(persona),
});

function validPersona(p?: string): PersonaId | undefined {
    return PERSONA_IDS.includes(p as PersonaId) ? (p as PersonaId) : undefined;
}

export async function resolveMessages(raw: RawGuideMessage[]): Promise<ChatMessage[]> {
    const out: ChatMessage[] = [];

    for (const m of raw) {
        switch (m.kind) {
            case "text":
                if (m.text?.trim()) out.push({...base(m.persona), kind: "text", text: m.text});
                break;

            case "places": {
                const places = await placesService.searchMany(m.placeQueries ?? []);
                if (places.length) out.push({...base(m.persona), kind: "places", text: m.text, places});
                else if (m.text) out.push({...base(m.persona), kind: "text", text: m.text});
                break;
            }

            case "tour": {
                if (!m.tour) break;
                const resolved = await placesService.searchMany(m.tour.stops.map((s) => s.query));
                const stops = resolved.map((place, i) => ({order: i + 1, place, note: m.tour!.stops[i]?.note}));
                if (stops.length)
                    out.push({
                        ...base(m.persona),
                        kind: "tour",
                        text: m.text,
                        tour: {
                            id: randomUUID(),
                            title: m.tour.title,
                            summary: m.tour.summary,
                            durationMinutes: m.tour.durationMinutes,
                            stops
                        },
                    });
                break;
            }

            case "tourOptions": {
                if (!m.tours?.length) break;
                const tours = [];
                for (const rt of m.tours) {
                    const resolved = await placesService.searchMany(rt.stops.map((s) => s.query));
                    const stops = resolved.map((place, i) => ({order: i + 1, place, note: rt.stops[i]?.note}));
                    if (stops.length) tours.push({
                        id: randomUUID(),
                        title: rt.title,
                        summary: rt.summary,
                        durationMinutes: rt.durationMinutes,
                        stops
                    });
                }
                if (tours.length) out.push({...base(m.persona), kind: "tourOptions", text: m.text, tours});
                break;
            }

            case "trivia":
                if (m.trivia)
                    out.push({
                        ...base(m.persona),
                        kind: "trivia",
                        question: m.trivia.question,
                        options: m.trivia.options,
                        answerIndex: m.trivia.answerIndex,
                    });
                break;

            case "quiz":
                if (m.quiz?.questions?.length)
                    out.push({...base(m.persona), kind: "quiz", text: m.text, questions: m.quiz.questions});
                break;

            case "quickActions":
                if (m.quickActions?.length)
                    out.push({
                        ...base(m.persona),
                        kind: "quickActions",
                        actions: m.quickActions.map((a) => ({id: randomUUID(), label: a.label, prompt: a.prompt})),
                    });
                break;
        }
    }

    // Never return nothing — keep the conversation alive.
    if (!out.length) out.push({...base("host"), kind: "text", text: "Sorry, could you rephrase that?"});
    return out;
}