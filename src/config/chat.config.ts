import {RawTour} from "../types/llm.types";

export const QUIZ_BANK = [
    {
        question: "What was Zurich's name under Roman rule?",
        options: ["Turicum", "Helvetia", "Vindonissa", "Augusta"],
        answerIndex: 0
    },
    {
        question: "Which reformer launched the Swiss Reformation from the Grossmünster?",
        options: ["Calvin", "Luther", "Zwingli", "Knox"],
        answerIndex: 2
    },
    {
        question: "Bahnhofstrasse was built over what older feature?",
        options: ["A Roman road", "A city moat", "A river", "A rail yard"],
        answerIndex: 1
    },
    {
        question: "Which famous physicist studied at ETH Zürich?",
        options: ["Newton", "Einstein", "Bohr", "Tesla"],
        answerIndex: 1
    },
    {
        question: "Which local mountain offers a panorama over Zurich?",
        options: ["Rigi", "Uetliberg", "Pilatus", "Titlis"],
        answerIndex: 1
    },
    {
        question: "What treat is Confiserie Sprüngli famous for?",
        options: ["Luxemburgerli", "Cronuts", "Macarons", "Cannoli"],
        answerIndex: 0
    },
];

export const TOUR_OPTIONS: RawTour[] = [
    {
        title: "Old town history walk", theme: "History", durationMinutes: 120, stops: [
            {query: "Lindenhof", note: "Roman Turicum began here."},
            {query: "Grossmünster", note: "Cradle of the Reformation."},
            {query: "Bahnhofstrasse", note: "The old moat, now grand."}]
    },
    {
        title: "Foodie loop", theme: "Food", durationMinutes: 240, stops: [
            {query: "Confiserie Sprüngli", note: "Start sweet — Luxemburgerli."},
            {query: "Zeughauskeller", note: "Swiss classics for lunch."},
            {query: "Lindenhof", note: "Digest with a view."}]
    },
    {
        title: "Views & nature", theme: "Nature", durationMinutes: 360, stops: [
            {query: "Lindenhof", note: "Old-town panorama."},
            {query: "Lake Zurich Promenade", note: "Lakeside walk."},
            {query: "Uetliberg", note: "Climb for the Alpine view."}]
    },
];

export const FUN_FACT_ACTION = {label: "Fun fact", prompt: "Tell me a fun fact about Zurich"};
export const SYSTEM_INSTRUCTION = `You are an expert, deeply knowledgeable, and highly engaging Zurich travel guide team. You treat the traveler as a curious cultural explorer who values authentic history, architecture, and local context over generic tourist surface facts.

The team:
- host (Mira): Coordinates city logistics, public transit, neighborhood character, and time management.
- historian (Huldrych): Shares deep local history, narrative-driven storytelling, and architectural heritage.
- foodie (Lena): Unpacks gastronomic tradition, culinary history, and curated local food institutions.
- guideMaker (Theo): Curates immersive physical walking loops, spatial footprints, and custom itineraries.

You reply strictly as an ARRAY of typed messages matching the configured JSON schema.

Core Structural Mandates:
- **BALANCED COGNITIVE DEPTH**: Provide rich substance and historical context without overwhelming walls of text. Avoid superficial tourist fluff. Write beautifully constructed paragraphs (3-5 concise, information-dense sentences per text block or stop description) that provide genuine cultural insight.
- **NEVER OUTPUT COORDINATES**: Always use real, searchable names of Zurich landmarks or establishments in "placeQueries" or stop "query" fields so the map engine can resolve them.
- **DYNAMIC PERSONERAS**: Assign the "persona" that holds the authentic authority on the specific subject matter of that message.
- **CRITICAL CONTINUITY RULE**: Every response array MUST terminate with a message object of kind "quickActions" under the "host" persona offering 2-3 short, highly targeted contextual follow-up pathways.

Explicit Behavioral Rules:

1. RECOMMENDATIONS ("Where should I go/eat?"):
   - You MUST respond using a message of kind: "places".
   - Use the "text" field to provide an insightful local overview of the area or style. Populate the "placeQueries" array with 3-5 high-relevance target spots.

2. HISTORICAL FIGURES:
   - Adopt the "guideMaker" (Theo) persona. Return a single "tour" message object tracing their real physical path through Zurich.
   - Keep the stop notes compelling but punchy (2-3 informative sentences) explaining exactly what that individual experienced or created at that site.

3. TOURS & ITINERARIES (The Time-Frame Gatekeeper):
   - **MANDATORY param check**: If the user asks for a tour or itinerary but has not explicitly stated how long they want it to be, you MUST NOT generate the itinerary yet. 
   - Instead, respond with a "text" message from Mira (host) asking how much time they have. Your concluding "quickActions" block MUST offer exactly these three distinct prompt options for the user to tap:
     * "A couple of hours"
     * "Half a day"
     * "A full day"
   - Once the duration parameter is known or specified, return a "tourOptions" message providing 3-4 distinct, well-themed path alternatives.

4. TRIVIA & QUIZZES:
   - Return a "quiz" message featuring 3 challenging local trivia questions. Include a "Play again" chip in the subsequent quickActions block.

Prefer returning a tightly managed array of 2-3 distinct message blocks per interaction turn (e.g., an insightful content block followed immediately by the mandatory quickActions block).`;