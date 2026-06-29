import {FUN_FACT_ACTION, QUIZ_BANK, TOUR_OPTIONS} from "../config/chat.config";
import {ChatMessage} from "../types/chat.types";
import {RawGuideMessage} from "../types/llm.types";

export function getLocalFallback(input: string): RawGuideMessage[] {
    const t = input.toLowerCase();
    const hasDuration = /(hour|half|full|day|morning|afternoon|quick)/.test(t);

    // 1. Historical Footsteps / Tours
    if (/(footsteps|trace|tracing|historical tour)/.test(t)) {
        return handleHistoricalFootsteps(t);
    }

    // 2. Transport & Logistics
    if (/(transport|get around|getting around|tram|train|metro|bus|public)/.test(t)) {
        return [
            {
                kind: "text",
                persona: "host",
                text: "Zurich is small and walkable, but the trams and S-Bahn (run by ZVV) are superb. A ZVV day pass is usually worth it the moment you take three rides — and it covers the boats on the lake too."
            },
            {
                kind: "quickActions",
                persona: "host",
                quickActions: [{label: "Plan a tour", prompt: "Build me a tour of Zurich"}, FUN_FACT_ACTION]
            },
        ];
    }

    // 3. Fun Facts
    if (/(fun fact|surprise|interesting)/.test(t)) {
        return [
            {
                kind: "text",
                persona: "historian",
                text: "Here's one: Zurich has over 1,200 public fountains, and most pour drinking water — locals refill bottles straight from the street."
            },
            {
                kind: "quickActions",
                persona: "host",
                quickActions: [{
                    label: "Another fact",
                    prompt: "Tell me a fun fact about Zurich"
                }, {label: "Plan a tour", prompt: "Build me a tour of Zurich"}]
            },
        ];
    }

    // 4. Tour Planning
    if (/(tour|itinerary|route|plan)/.test(t)) {
        if (!hasDuration && !/(history|food|view|nature)/.test(t)) {
            return [
                {
                    kind: "text",
                    persona: "guideMaker",
                    text: "Theo here — I'll build the perfect loop. How long do you have?"
                },
                {
                    kind: "quickActions", persona: "guideMaker", quickActions: [
                        {label: "A couple of hours", prompt: "Build me a 2 hour tour of Zurich"},
                        {label: "Half day", prompt: "Build me a half day tour of Zurich"},
                        {label: "Full day", prompt: "Build me a full day tour of Zurich"},
                    ]
                },
            ];
        }
        return [
            {
                kind: "tourOptions",
                persona: "guideMaker",
                text: "Here are three routes — pick one and I'll pin it for you:",
                tours: TOUR_OPTIONS
            },
        ];
    }

    // 5. Food & Dining
    if (/(eat|food|restaurant|lunch|dinner|coffee|cafe|drink)/.test(t)) {
        return [{
            kind: "places",
            persona: "foodie",
            text: "Eat like a local — tap a card for details, or add to your plan:",
            placeQueries: ["Zeughauskeller", "Confiserie Sprüngli", "Kronenhalle"]
        }];
    }

    // 6. Parks & Nature
    if (/(green|park|nature|garden|lake|outdoor)/.test(t)) {
        return [{
            kind: "places",
            persona: "host",
            text: "Some breathing room — all addable to your plan:",
            placeQueries: ["Lake Zurich Promenade", "Uetliberg", "Chinagarten Zürich"]
        }];
    }

    // 7. History
    if (/(history|old|past|founded|roman|medieval)/.test(t)) {
        return [
            {
                kind: "text",
                persona: "historian",
                text: "Zurich began as the Roman customs post Turicum on the Lindenhof hill around 15 BC. In 1519, Huldrych Zwingli began preaching at the Grossmünster and lit the fuse of the Swiss Reformation."
            },
            {
                kind: "places",
                persona: "historian",
                text: "Stand in these to feel both eras:",
                placeQueries: ["Lindenhof", "Grossmünster"]
            },
            {
                kind: "quickActions",
                persona: "historian",
                quickActions: [FUN_FACT_ACTION, {label: "Quiz me", prompt: "Give me a trivia question"}]
            },
        ];
    }

    // 8. Trivia/Quiz
    if (/(trivia|quiz|question|game|another|play again)/.test(t)) {
        const shuffled = [...QUIZ_BANK].sort(() => Math.random() - 0.5).slice(0, 3);
        return [
            {
                kind: "quiz",
                persona: "host",
                text: "Let's see how well you know Zürich — three questions:",
                quiz: {questions: shuffled}
            },
            {
                kind: "quickActions",
                persona: "host",
                quickActions: [{label: "Play again", prompt: "Give me another quiz"}, FUN_FACT_ACTION]
            },
        ];
    }

    // 9. Recommendations
    if (/(see|do|visit|recommend|where|view|sight)/.test(t)) {
        return [{
            kind: "places",
            persona: "host",
            text: "Here's where I'd start — tap for details, + to add to your plan:",
            placeQueries: ["Grossmünster", "Lindenhof", "Kunsthaus Zürich", "Lake Zurich Promenade"]
        }];
    }

    // Default Fallback
    return [
        {kind: "text", persona: "host", text: "Happy to help! Want some spots to explore, a tour, or a quick quiz?"},
        {
            kind: "quickActions", persona: "host", quickActions: [
                {label: "Plan a tour", prompt: "Build me a tour of Zurich"},
                {label: "Where to eat", prompt: "Where should I eat?"},
                {label: "Getting around", prompt: "How do I get around Zurich?"},
                {label: "Quiz me", prompt: "Give me a trivia question"},
            ]
        },
    ];
}

function handleHistoricalFootsteps(t: string): RawGuideMessage[] {
    let title = "Historical Footsteps";
    let stops = [{query: "Grossmünster", note: "Where history left its mark."}];

    if (t.includes("zwingli")) {
        title = "Zwingli's Reformation Trail";
        stops = [
            {query: "Grossmünster", note: "Zwingli's primary pulpit where the Swiss Reformation erupted in 1519."},
            {query: "Wasserkirche", note: "Lakeside execution point rich with early Reformation history."}
        ];
    } else if (t.includes("einstein")) {
        title = "Einstein's Academic Genius";
        stops = [
            {
                query: "ETH Zürich",
                note: "Where Albert Einstein studied physics and returned later as a full professor."
            },
            {
                query: "Universität Zürich",
                note: "The institution that certified his doctoral thesis during his 1905 miracle year."
            }
        ];
    } else if (t.includes("jung")) {
        title = "Carl Jung's Analytical Minds";
        stops = [
            {query: "Lake Zurich Promenade", note: "Walk paths near the water leading down to his lakeside retreat."},
            {
                query: "Psychologischer Club Zürich",
                note: "The primary venue founded by Jung for analytical psychology debates."
            }
        ];
    } else if (t.includes("escher")) {
        title = "Alfred Escher's Industrial Era";
        stops = [
            {
                query: "Zürich Hauptbahnhof",
                note: "The central rail system hub he created. Look for his statue right outside."
            },
            {query: "ETH Zürich", note: "The elite technological institute he co-founded to fuel national growth."}
        ];
    } else if (t.includes("turner")) {
        title = "Tina Turner's Quiet Haven";
        stops = [
            {
                query: "Lake Zurich Promenade",
                note: "The scenic walking tracks she loved wandering during her decades calling Switzerland home."
            },
            {
                query: "Opernhaus Zürich",
                note: "A legendary cultural landmark matching the arts landscape she deeply cherished."
            }
        ];
    } else if (t.includes("taeuber-arp")) {
        title = "Sophie Taeuber-Arp Dadaist Trail";
        stops = [
            {
                query: "Kunsthaus Zürich",
                note: "Hosts geometric abstract pieces and historical modern artworks celebrating her pioneer status."
            },
            {
                query: "Lindenhof",
                note: "Historic backdrop tracking the neighborhoods where Zurich Dadaism challenged conventions."
            }
        ];
    }

    return [{
        kind: "tour",
        persona: "guideMaker",
        text: "Theo here! I've calculated a specialized footprint tour tracing this figure across historical markers. Check out your plan to review the stops!",
        tour: {title, theme: "History", durationMinutes: 120, stops}
    }];
}

export function toContents(history: ChatMessage[]) {
    return history
        .map((m) => {
            const text = m.role === "user" ? summarizeUser(m) : summarizeGuide(m);
            if (!text) return null;
            return {role: m.role === "user" ? "user" : "model", parts: [{text}]};
        })
        .filter((c): c is { role: string; parts: { text: string }[] } => c !== null);
}

function summarizeUser(m: ChatMessage): string {
    return m.kind === "text" ? m.text : "";
}

function summarizeGuide(m: ChatMessage): string {
    switch (m.kind) {
        case "text":
            return m.text;
        case "places":
            return `Suggested: ${m.places.map((p) => p.name).join(", ")}`;
        case "tour":
            return `Proposed tour "${m.tour.title}"`;
        case "tourOptions":
            return `Offered tours: ${m.tours.map((t) => t.title).join(", ")}`;
        case "trivia":
            return `Quiz: ${m.question}`;
        case "quiz":
            return `Quiz of ${m.questions.length} questions`;
        case "quickActions":
            return `Offered: ${m.actions.map((a) => a.label).join(", ")}`;
        case "cityIntro":
            return `Intro: ${m.title}`;
        case "team":
            return `Meet the team: ${m.members.length} members`;
        case "tourConfirmed":
            return `Tour confirmed: ${m.tour.title}`;
        case "placeAdded":
            return `Added to plan: ${m.place.name}`;
        default:
            return "";
    }
}