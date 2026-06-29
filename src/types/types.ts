export type ChatRole = "user" | "guide";

export const PERSONA_IDS = ["host", "historian", "foodie", "guideMaker"] as const;
export type PersonaId = (typeof PERSONA_IDS)[number];

export interface QuickAction {
    id: string;
    label: string;
    prompt: string;
}