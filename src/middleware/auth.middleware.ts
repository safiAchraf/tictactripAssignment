import { Request, Response, NextFunction } from "express";
import { isValidToken } from "../utils/auth";

export function authMiddleware(
	req: Request,
	res: Response,
	next: NextFunction,
): void {
	const authHeader = req.headers.authorization;

	if (!authHeader) {
		res.status(401).json({
			error: "Token manquant. Utilisez le header Authorization: Bearer <token>",
		});
		return;
	}

	const parts = authHeader.split(" ");

	if (parts.length !== 2 || parts[0] !== "Bearer") {
		res
			.status(401)
			.json({ error: "Format de token invalide. Utilisez: Bearer <token>" });
		return;
	}

	const token = parts[1];

	if (!token || !isValidToken(token)) {
		res.status(401).json({ error: "Token invalide" });
		return;
	}

	(req as any).token = token;

	next();
}
