import {z} from "zod";

const TourSchema = z.object({
    title: z.string(),
    theme: z.string(),
    durationMinutes: z.number().optional(),
    stops: z.array(z.object({
        query: z.string(),
        note: z.string().optional(),
    })),
});

const RawGuideMessageSchema = z.object({
    kind: z.enum(["text", "places", "tour", "tourOptions", "trivia", "quiz", "quickActions"]),
    persona: z.enum(["host", "historian", "foodie", "guideMaker"]).optional(),
    text: z.string().optional(),
    placeQueries: z.array(z.string()).optional(),
    tour: TourSchema.optional(),
    tours: z.array(TourSchema).optional(),
    trivia: z.object({
        question: z.string(),
        options: z.array(z.string()),
        answerIndex: z.number(),
    }).optional(),
    quiz: z.object({
        questions: z.array(z.object({
            question: z.string(),
            options: z.array(z.string()),
            answerIndex: z.number(),
        })),
    }).optional(),
    quickActions: z.array(z.object({label: z.string(), prompt: z.string()})).optional(),
});

export const ResponseSchema = z.object({
    messages: z.array(RawGuideMessageSchema),
});

export const GEMINI_RESPONSE_SCHEMA =
    z.toJSONSchema(ResponseSchema);

const BaseSchema = z.object({
    id: z.string(),
    role: z.enum(["user", "guide"]),
    createdAt: z.number(),
    personaId: z.enum(["host", "historian", "foodie", "guideMaker"]).optional(),
});

export const ChatMessageSchema = z.discriminatedUnion("kind", [
    BaseSchema.extend({ kind: z.literal("text"), text: z.string() }),
    BaseSchema.extend({ kind: z.literal("places"), text: z.string().optional(), places: z.array(z.any()) }),
    BaseSchema.extend({ kind: z.literal("tour"), text: z.string().optional(), tour: z.any() }),
    BaseSchema.extend({ kind: z.literal("tourOptions"), text: z.string().optional(), tours: z.array(z.any()) }),
    BaseSchema.extend({
        kind: z.literal("trivia"),
        question: z.string(),
        options: z.array(z.string()),
        answerIndex: z.number(),
        selectedIndex: z.number().optional()
    }),
    BaseSchema.extend({ kind: z.literal("quiz"), text: z.string().optional(), questions: z.array(z.any()) }),
    BaseSchema.extend({
        kind: z.literal("quickActions"),
        actions: z.array(z.object({ id: z.string(), label: z.string(), prompt: z.string() }))
    }),
    BaseSchema.extend({
        kind: z.literal("cityIntro"),
        title: z.string(),
        tagline: z.string(),
        segments: z.array(z.any()),
        image: z.string().optional()
    }),
    BaseSchema.extend({
        kind: z.literal("team"),
        text: z.string().optional(),
        members: z.array(z.any())
    }),
    BaseSchema.extend({ kind: z.literal("tourConfirmed"), tour: z.any() }),
    BaseSchema.extend({ kind: z.literal("placeAdded"), place: z.any() }),
]);

export const ChatRequestSchema = z.object({
    messages: z.array(ChatMessageSchema),
});