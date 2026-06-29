/**
 * Generates a rich, city-wide explore dataset from the real Places API and
 * writes it to src/data/explore.json (consumed by exploreService).
 *
 * Run once, with a key:
 *   GOOGLE_PLACES_KEY=... npx tsx scripts/buildExplore.ts
 *
 * It queries many categories across Zürich neighbourhoods so POIs are spread
 * across the whole city, dedupes by place id, and keeps a thumbnail + blurb.
 */
import "dotenv/config";

import { writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

import {Place} from "../src/types/map.types";

const KEY = process.env.GOOGLE_PLACES_KEY;
if (!KEY) {
    console.error("Set GOOGLE_PLACES_KEY to build the explore dataset.");
    process.exit(1);
}

const ANCHOR = { latitude: 47.3769, longitude: 8.5417 };

// Spread across the city: pair categories with neighbourhoods/areas.
const QUERIES = [
    "top landmarks in Zurich", "historic churches in Zurich", "museums in Zurich",
    "art galleries in Zurich", "viewpoints in Zurich", "parks in Zurich",
    "gardens in Zurich", "famous restaurants in Zurich old town", "cafes in Niederdorf Zurich",
    "things to do in Zurich West", "attractions in Seefeld Zurich", "attractions in Enge Zurich",
    "Lake Zurich attractions", "Uetliberg Zurich", "Zurich Zoo", "botanical garden Zurich",
    "Bahnhofstrasse Zurich", "theatres in Zurich", "markets in Zurich", "bars in Zurich Kreis 5",
];

const PHOTO_BASE = "https://places.googleapis.com/v1";
const photoUrl = (name: string) => `${PHOTO_BASE}/${name}/media?maxWidthPx=400&key=${KEY}`;

async function search(query: string): Promise<Place[]> {
    const res = await fetch("https://places.googleapis.com/v1/places:searchText", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "X-Goog-Api-Key": KEY!,
            "X-Goog-FieldMask":
                "places.id,places.displayName,places.location,places.rating,places.primaryType,places.editorialSummary,places.photos",
        },
        body: JSON.stringify({
            textQuery: query,
            locationBias: { circle: { center: ANCHOR, radius: 7000 } },
            maxResultCount: 6,
        }),
    });
    if (!res.ok) {
        console.warn(`  ! ${query} -> ${res.status}`);
        return [];
    }
    const data = (await res.json()) as { places?: any[] };
    return (data.places ?? [])
        .filter((p) => p.location)
        .map((p) => ({
            id: p.id,
            name: p.displayName?.text ?? "Place",
            latitude: p.location.latitude,
            longitude: p.location.longitude,
            rating: p.rating,
            category: coarseCategory(p.primaryType),
            note: p.editorialSummary?.text,
            thumbnail: p.photos?.[0]?.name ? photoUrl(p.photos[0].name) : undefined,
        }));
}

async function main() {
    const byId = new Map<string, Place>();
    for (const q of QUERIES) {
        process.stdout.write(`Fetching: ${q}\n`);
        const places = await search(q);
        for (const p of places) if (!byId.has(p.id)) byId.set(p.id, p);
        await new Promise((r) => setTimeout(r, 200)); // gentle pacing
    }

    const all = [...byId.values()];
    const __dirname = dirname(fileURLToPath(import.meta.url));
    const out = join(__dirname, "../data/explore.json");
    await writeFile(out, JSON.stringify(all, null, 2));
    console.log(`\n✅ Wrote ${all.length} POIs to ${out}`);
}

main().catch((e) => { console.error(e); process.exit(1); });

/**
 * Maps granular Google Places primaryTypes to a broad, user-friendly category.
 */
function coarseCategory(primaryType: string | undefined): string {
    if (!primaryType) return "other";

    const type = primaryType.toLowerCase();

    // Nature & Outdoors
    if (type.includes("park") || type.includes("garden") || type.includes("hiking") || type.includes("beach") || type.includes("nature")) {
        return "nature";
    }

    // Culture & History
    if (type.includes("museum") || type.includes("art_gallery") || type.includes("church") || type.includes("place_of_worship") || type.includes("historical")) {
        return "culture";
    }

    // Landmarks & Sightseeing
    if (type.includes("landmark") || type.includes("monument") || type.includes("tourist_attraction") || type.includes("visitor_center") || type.includes("zoo")) {
        return "landmark";
    }

    // Food & Drink
    if (type.includes("restaurant") || type.includes("cafe") || type.includes("bar") || type.includes("coffee") || type.includes("food")) {
        return "food_drink";
    }

    // Entertainment & Arts
    if (type.includes("theater") || type.includes("theatre") || type.includes("movie") || type.includes("entertainment") || type.includes("performing_arts")) {
        return "entertainment";
    }

    // Shopping
    if (type.includes("shopping") || type.includes("market") || type.includes("store") || type.includes("mall")) {
        return "shopping";
    }

    return "other";
}