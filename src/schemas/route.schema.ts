import {z} from "zod";

export const RouteRequestSchema = z.object({
    stops: z.array(z.object({
        latitude: z.number().min(-90).max(90),
        longitude: z.number().min(-180).max(180)
    })).min(2),
    mode: z.enum(["WALK", "DRIVE", "TRANSIT", "BICYCLE"]).default("WALK")
});