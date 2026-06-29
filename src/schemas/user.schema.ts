import {z} from "zod";

export const CreateUserSchema = z.object({
    preferences: z.any().optional(),
});

export const UserIdSchema = z.object({
    id: z.string(),
});