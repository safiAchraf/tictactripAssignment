import { Router, Request, Response } from "express";
import { justifyText } from "../utils/justify";
import { authMiddleware } from "../middleware/auth.middleware";
import { rateLimitMiddleware } from "../middleware/rateLimit.middleware";
import { addWordsToCount } from "../utils/auth";

const router = Router();

router.post(
	"/",
	authMiddleware,
	rateLimitMiddleware,
	(req: Request, res: Response) => {
		const text = req.body as string;

		if (!text || typeof text !== "string") {
			res.status(400).send("Le body doit contenir du texte");
			return;
		}

		if (text.trim().length === 0) {
			res.status(400).send("Le texte ne peut pas être vide");
			return;
		}

		try {
			const justifiedText = justifyText(text);

			const token = (req as any).token;
			const wordCount = (req as any).wordCount;
			if (token && wordCount) {
				addWordsToCount(token, wordCount);
			}

			res.type("text/plain").send(justifiedText);
		} catch (error) {
			res.status(500).send("Erreur interne du serveur");
		}
	},
);

export default router;
