import {Place, Tour} from "./map.types";
import {ChatRole, PersonaId, QuickAction} from "./types";

export type ChatMessage =
    | (Base & { kind: "text"; text: string })
    | (Base & { kind: "places"; text?: string; places: Place[] })
    | (Base & { kind: "tour"; text?: string; tour: Tour })
    | (Base & { kind: "tourOptions"; text?: string; tours: Tour[] })
    | (Base & { kind: "trivia"; question: string; options: string[]; answerIndex: number; selectedIndex?: number })
    | (Base & {
    kind: "quiz";
    text?: string;
    questions: { question: string; options: string[]; answerIndex: number }[]
})
    | (Base & { kind: "quickActions"; actions: QuickAction[] })
    | (Base & { kind: "cityIntro"; title: string; tagline: string; segments: any[]; image?: string })
    | (Base & { kind: "team"; text?: string; members: any[] })
    | (Base & { kind: "tourConfirmed"; tour: Tour })
    | (Base & { kind: "placeAdded"; place: Place });

interface Base {
    id: string;
    role: ChatRole;
    createdAt: number;
    personaId?: PersonaId;
}