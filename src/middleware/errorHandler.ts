import { type Request, type Response, type NextFunction } from "express";

export const errorHandler = (err: unknown, _req: Request, res: Response, _next: NextFunction) => {
    console.error("Unhandled error:", err);
    res.status(500).json({ error: "Internal server error" });
};