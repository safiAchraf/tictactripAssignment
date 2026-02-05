import { Router, Request, Response } from "express";
import { generateToken } from "../utils/auth";

const router = Router();

interface TokenRequest {
	email: string;
}

router.post("/", (req: Request, res: Response) => {
	const body = req.body as TokenRequest;

	if (!body.email) {
		res.status(400).json({ error: "Email requis" });
		return;
	}

	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	if (!emailRegex.test(body.email)) {
		res.status(400).json({ error: "Format d'email invalide" });
		return;
	}

	const token = generateToken(body.email);

	res.json({ token });
});

export default router;
