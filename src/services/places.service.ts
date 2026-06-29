import {GOOGLE_PLACES_KEY, ANCHOR} from "../config/env";
import {getGoogleHeaders, mapSearchResult, photoUrl, seedMatch, seedSearchMany} from "../helpers/places.helper";
import {SEED} from "../config/places.config";
import {Place, PlaceDetails} from "../types/map.types";

const SEARCH_URL = "https://places.googleapis.com/v1/places:searchText";
const PLACE_URL = "https://places.googleapis.com/v1/places";

export const placesService = {
    async search(query: string, lat?: number, lng?: number): Promise<Place | null> {
        if (!GOOGLE_PLACES_KEY) return seedMatch(query);

        const center = (lat !== undefined && lng !== undefined)
            ? {latitude: lat, longitude: lng}
            : ANCHOR;

        try {
            const res = await fetch(SEARCH_URL, {
                method: "POST",
                headers: getGoogleHeaders("places.id,places.displayName,places.location,places.rating,places.formattedAddress,places.primaryType,places.photos"),
                body: JSON.stringify({
                    textQuery: `${query} Zurich`,
                    locationBias: {circle: {center, radius: 5000}},
                    maxResultCount: 1,
                }),
            });

            if (!res.ok) throw new Error(`Google Search API: ${res.status}`);

            const data = await res.json() as { places?: any[] };
            const p = data.places?.[0];
            return p?.location ? mapSearchResult(p) : null;
        } catch (err) {
            console.warn("[places] search failed, seeding:", (err as Error).message);
            return seedMatch(query);
        }
    },

    async searchText(query: string, limit = 6, lat?: number, lng?: number): Promise<Place[]> {
        if (!GOOGLE_PLACES_KEY) return seedSearchMany(query, limit);

        // Determine the location center bias dynamically based on frontend user viewport position
        const center = (lat !== undefined && lng !== undefined)
            ? {latitude: lat, longitude: lng}
            : ANCHOR;

        try {
            const res = await fetch(SEARCH_URL, {
                method: "POST",
                headers: getGoogleHeaders("places.id,places.displayName,places.location,places.rating,places.formattedAddress,places.primaryType,places.photos"),
                body: JSON.stringify({
                    textQuery: `${query} Zurich`,
                    locationBias: {circle: {center, radius: 5000}},
                    maxResultCount: limit,
                }),
            });

            if (!res.ok) throw new Error(`Google SearchText API: ${res.status}`);

            const data = await res.json() as { places?: any[] };
            const results = (data.places ?? []).filter((p) => p?.location).map(mapSearchResult);

            if (results.length > 0) {
                const normalizedTop = results[0].name.toLowerCase();
                const q = query.toLowerCase().trim();
                if (normalizedTop.includes(q) || q.includes(normalizedTop)) {
                    results[0].isExactMatch = true;
                }
            }
            return results;
        } catch (err) {
            console.warn("[places] searchText failed, seeding:", (err as Error).message);
            return seedSearchMany(query, limit);
        }
    },

    async searchMany(queries: string[]): Promise<Place[]> {
        // Simple mapping structure passing undefined viewports for downstream standard batches
        const results = await Promise.all(queries.map((q) => this.search(q)));
        return results.filter((p): p is Place => p !== null);
    },

    async getDetails(placeId: string): Promise<PlaceDetails> {
        if (placeId.startsWith("seed-") || !GOOGLE_PLACES_KEY) {
            const seed = SEED.find((p) => p.id === placeId) ?? SEED[0];
            return {...seed, openNow: true, description: seed.note};
        }

        const res = await fetch(`${PLACE_URL}/${encodeURIComponent(placeId)}`, {
            headers: getGoogleHeaders("id,displayName,location,rating,userRatingCount,formattedAddress,primaryType,priceLevel,editorialSummary,currentOpeningHours,internationalPhoneNumber,websiteUri,photos,reviews", false),
        });

        if (!res.ok) throw new Error(`Google Details API: ${res.status}`);

        const p = await res.json() as any;
        return {
            id: p.id,
            name: p.displayName?.text ?? "Place",
            latitude: p.location?.latitude,
            longitude: p.location?.longitude,
            rating: p.rating,
            userRatingCount: p.userRatingCount,
            address: p.formattedAddress,
            category: p.primaryType,
            description: p.editorialSummary?.text,
            priceLevel: typeof p.priceLevel === "number" ? p.priceLevel : undefined,
            phone: p.internationalPhoneNumber,
            website: p.websiteUri,
            openNow: p.currentOpeningHours?.openNow,
            hours: p.currentOpeningHours?.weekdayDescriptions,
            reviews: (p.reviews ?? []).slice(0, 4).map((r: any) => ({
                author: r.authorAttribution?.displayName,
                rating: r.rating,
                text: r.text?.text,
                when: r.relativePublishTimeDescription,
            })),
            thumbnail: p.photos?.[0]?.name ? photoUrl(p.photos[0].name, 400) : undefined,
            photos: (p.photos ?? []).slice(0, 4).map((ph: any) => photoUrl(ph.name)),
        };
    }
};