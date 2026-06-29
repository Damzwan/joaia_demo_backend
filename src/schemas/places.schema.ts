import {z} from "zod";

export const SearchQuerySchema = z.object({
    q: z.string().trim().min(2),
    limit: z.coerce.number().int().min(1).max(10).default(6),
    lat: z.coerce.number().min(-90).max(90).optional(),
    lng: z.coerce.number().min(-180).max(180).optional(),
});

export const PlaceIdSchema = z.object({
    id: z.string().min(1),
});