import {GOOGLE_PLACES_KEY} from "../config/env";
import {SEED} from "../config/places.config";
import {Place} from "../types/map.types";

const PHOTO_BASE = "https://places.googleapis.com/v1";


export const getGoogleHeaders = (fieldMask: string, isPost = true) => {
    const headers: Record<string, string> = {
        "X-Goog-Api-Key": GOOGLE_PLACES_KEY!,
        "X-Goog-FieldMask": fieldMask,
    };

    if (isPost) {
        headers["Content-Type"] = "application/json";
    }

    return headers;
};

export const photoUrl = (name: string, maxWidthPx = 800) =>
    `${PHOTO_BASE}/${name}/media?maxWidthPx=${maxWidthPx}&key=${GOOGLE_PLACES_KEY}`;

export function mapSearchResult(p: any): Place {
    return {
        id: p.id,
        name: p.displayName?.text ?? "Unknown",
        latitude: p.location?.latitude,
        longitude: p.location?.longitude,
        rating: p.rating,
        address: p.formattedAddress,
        category: p.primaryType,
        thumbnail: p.photos?.[0]?.name ? photoUrl(p.photos[0].name, 400) : undefined,
    };
}

export function seedMatch(query: string): Place {
    const q = query.toLowerCase();
    return (
        SEED.find((p) => p.name.toLowerCase().includes(q) || q.includes(p.name.toLowerCase().split(" ")[0])) ?? SEED[0]
    );
}

export function seedSearchMany(query: string, limit: number): Place[] {
    const needle = query.toLowerCase();
    const matches = [...SEED]
        .sort(
            (a, b) =>
                Number(b.name.toLowerCase().includes(needle)) - Number(a.name.toLowerCase().includes(needle)),
        )
        .slice(0, limit);

    if (matches.length > 0) {
        const topMatchName = matches[0].name.toLowerCase();
        if (topMatchName.includes(needle) || needle.includes(topMatchName)) {
            matches[0].isExactMatch = true;
        }
    }
    return matches;
}
