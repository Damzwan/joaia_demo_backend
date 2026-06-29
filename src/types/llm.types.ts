import {ChatMessage} from "./chat.types";
import {PersonaId} from "./types";

export interface RawTourStop {
    query: string;
    note?: string;
}

export interface RawTour {
    title: string;
    theme: string;
    durationMinutes: number;
    summary?: string;
    stops: RawTourStop[];
}

export interface RawQuizQuestion {
    question: string;
    options: string[];
    answerIndex: number;
}

export interface RawGuideMessage {
    kind: ChatMessage["kind"];
    persona?: PersonaId;
    text?: string;
    placeQueries?: string[];
    tour?: RawTour;
    tours?: RawTour[];
    trivia?: RawQuizQuestion;
    quiz?: { questions: RawQuizQuestion[] };
    quickActions?: { label: string; prompt: string }[];
}