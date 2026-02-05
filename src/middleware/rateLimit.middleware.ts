import { Request, Response, NextFunction } from "express";
import {
	canProcessWords,
	addWordsToCount,
	getRemainingWords,
} from "../utils/auth";
import { countWords } from "../utils/justify";

export function rateLimitMiddleware(
	req: Request,
	res: Response,
	next: NextFunction,
): void {
	const token = (req as any).token;

	if (!token) {
		res.status(401).json({ error: "Token non trouvé" });
		return;
	}

	const text = req.body;

	if (typeof text !== "string") {
		res.status(400).json({ error: "Le body doit être du texte (text/plain)" });
		return;
	}

	const wordCount = countWords(text);

	if (!canProcessWords(token, wordCount)) {
		const remaining = getRemainingWords(token);
		res.status(402).json({
			error: "Payment Required - Limite de mots dépassée",
			message: `Limite quotidienne de 80 000 mots atteinte. Mots restants: ${remaining}`,
			remainingWords: remaining,
		});
		return;
	}

	(req as any).wordCount = wordCount;

	next();
}

export function countWordsMiddleware(
	req: Request,
	res: Response,
	next: NextFunction,
): void {
	const token = (req as any).token;
	const wordCount = (req as any).wordCount;

	if (token && wordCount) {
		addWordsToCount(token, wordCount);
	}

	next();
}
