import {readFile} from "node:fs/promises";
import {fileURLToPath} from "node:url";
import {dirname, join} from "node:path";

import {Place} from "../types/map.types";

const __dirname = dirname(fileURLToPath(import.meta.url));
const GENERATED = join(__dirname, "../../data/explore.json");

let cache: Place[] | null = null;

const EXPLORE_SEED: Place[] = [
    {
        id: "seed_grossmunster",
        name: "Grossmünster",
        latitude: 47.3701,
        longitude: 8.5439,
        rating: 4.6,
        category: "culture",
        note: "Iconic twin-towered Romanesque cathedral in Zurich's Old Town."
    },
    {
        id: "seed_uetliberg",
        name: "Uetliberg Mountain",
        latitude: 47.3496,
        longitude: 8.4914,
        rating: 4.8,
        category: "nature",
        note: "Panoramic views of the entire city and lake from the summit."
    }
];

export const exploreService = {
    async getAll(): Promise<Place[]> {
        if (cache) return cache;
        try {
            const raw = await readFile(GENERATED, "utf8");
            const parsed = JSON.parse(raw) as Place[];
            if (Array.isArray(parsed) && parsed.length) {
                cache = parsed;
                return cache;
            }
        } catch {
        }
        cache = EXPLORE_SEED;
        return cache;
    },
};