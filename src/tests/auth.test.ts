import {
	generateToken,
	isValidToken,
	canProcessWords,
	addWordsToCount,
	getRemainingWords,
	resetTokens,
} from "../utils/auth";

describe("Auth Utils", () => {
	beforeEach(() => {
		resetTokens();
	});

	describe("generateToken", () => {
		it("should generate a token for email", () => {
			const token = generateToken("test@example.com");
			expect(token).toBeDefined();
			expect(typeof token).toBe("string");
			expect(token.length).toBe(64);
		});

		it("should return same token for same email", () => {
			const token1 = generateToken("test@example.com");
			const token2 = generateToken("test@example.com");
			expect(token1).toBe(token2);
		});

		it("should return different tokens for different emails", () => {
			const token1 = generateToken("test1@example.com");
			const token2 = generateToken("test2@example.com");
			expect(token1).not.toBe(token2);
		});
	});

	describe("isValidToken", () => {
		it("should return true for valid token", () => {
			const token = generateToken("test@example.com");
			expect(isValidToken(token)).toBe(true);
		});

		it("should return false for invalid token", () => {
			expect(isValidToken("invalid-token")).toBe(false);
		});
	});

	describe("canProcessWords", () => {
		it("should return true when under limit", () => {
			const token = generateToken("test@example.com");
			expect(canProcessWords(token, 1000)).toBe(true);
		});

		it("should return false when over limit", () => {
			const token = generateToken("test@example.com");
			expect(canProcessWords(token, 80001)).toBe(false);
		});

		it("should return false for invalid token", () => {
			expect(canProcessWords("invalid", 100)).toBe(false);
		});
	});

	describe("addWordsToCount", () => {
		it("should increment word count", () => {
			const token = generateToken("test@example.com");
			addWordsToCount(token, 1000);
			expect(getRemainingWords(token)).toBe(79000);
		});

		it("should accumulate word counts", () => {
			const token = generateToken("test@example.com");
			addWordsToCount(token, 1000);
			addWordsToCount(token, 2000);
			expect(getRemainingWords(token)).toBe(77000);
		});
	});

	describe("getRemainingWords", () => {
		it("should return full limit for new token", () => {
			const token = generateToken("test@example.com");
			expect(getRemainingWords(token)).toBe(80000);
		});

		it("should return 0 for invalid token", () => {
			expect(getRemainingWords("invalid")).toBe(0);
		});
	});
});
