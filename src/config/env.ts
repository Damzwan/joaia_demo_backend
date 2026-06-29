import "dotenv/config";

export const PORT = Number(process.env.PORT ?? 3000);
export const MONGO_URI = process.env.MONGO_URI ?? "mongodb://localhost:27017";
export const DB_NAME = "travel_guide";

export const GEMINI_API_KEY = process.env.GEMINI_API_KEY ?? "";
export const GEMINI_MODEL = process.env.GEMINI_MODEL ?? "gemini-3.1-flash-lite";

export const GOOGLE_PLACES_KEY = process.env.GOOGLE_PLACES_KEY ?? "";

export const ANCHOR = {latitude: 47.3769, longitude: 8.5417};