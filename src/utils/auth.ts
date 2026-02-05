import crypto from "crypto";

interface TokenData {
	email: string;
	createdAt: Date;
	wordCount: number;
	lastResetDate: string;
}

const tokens: Map<string, TokenData> = new Map();

const DAILY_WORD_LIMIT = 80000;

export function generateToken(email: string): string {
	for (const [token, data] of tokens.entries()) {
		if (data.email === email) {
			return token;
		}
	}

	// Générer un nouveau token unique
	const token = crypto.randomBytes(32).toString("hex");
	const today = new Date().toISOString().split("T")[0];

	tokens.set(token, {
		email,
		createdAt: new Date(),
		wordCount: 0,
		lastResetDate: today,
	});

	return token;
}

export function isValidToken(token: string): boolean {
	return tokens.has(token);
}

export function getTokenData(token: string): TokenData | undefined {
	return tokens.get(token);
}

export function canProcessWords(token: string, wordCount: number): boolean {
	const data = tokens.get(token);
	if (!data) {
		return false;
	}

	const today = new Date().toISOString().split("T")[0];

	if (data.lastResetDate !== today) {
		data.wordCount = 0;
		data.lastResetDate = today;
	}

	return data.wordCount + wordCount <= DAILY_WORD_LIMIT;
}

export function addWordsToCount(token: string, wordCount: number): void {
	const data = tokens.get(token);
	if (data) {
		const today = new Date().toISOString().split("T")[0];

		if (data.lastResetDate !== today) {
			data.wordCount = 0;
			data.lastResetDate = today;
		}

		data.wordCount += wordCount;
	}
}

export function getRemainingWords(token: string): number {
	const data = tokens.get(token);
	if (!data) {
		return 0;
	}

	const today = new Date().toISOString().split("T")[0];

	if (data.lastResetDate !== today) {
		return DAILY_WORD_LIMIT;
	}

	return Math.max(0, DAILY_WORD_LIMIT - data.wordCount);
}

export function resetTokens(): void {
	tokens.clear();
}
