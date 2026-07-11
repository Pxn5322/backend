import { Request, Response, NextFunction } from "express";

export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
    console.error(err);

    if (err instanceof Error) {
        return res.status(400).json({ message: err.message });
    }

    return res.status(500).json({ message: "Internal Server Error" });
}