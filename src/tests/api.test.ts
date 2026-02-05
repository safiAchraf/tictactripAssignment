import request from "supertest";
import app from "../app";
import { resetTokens } from "../utils/auth";

describe("API Tests", () => {
	beforeEach(() => {
		resetTokens();
	});

	describe("POST /api/token", () => {
		it("should return a token for valid email", async () => {
			const res = await request(app)
				.post("/api/token")
				.send({ email: "test@example.com" });

			expect(res.status).toBe(200);
			expect(res.body).toHaveProperty("token");
			expect(typeof res.body.token).toBe("string");
		});

		it("should return same token for same email", async () => {
			const res1 = await request(app)
				.post("/api/token")
				.send({ email: "test@example.com" });

			const res2 = await request(app)
				.post("/api/token")
				.send({ email: "test@example.com" });

			expect(res1.body.token).toBe(res2.body.token);
		});

		it("should return 400 for missing email", async () => {
			const res = await request(app).post("/api/token").send({});

			expect(res.status).toBe(400);
		});

	});

	describe("POST /api/justify", () => {
		let token: string;

		beforeEach(async () => {
			const res = await request(app)
				.post("/api/token")
				.send({ email: "test@example.com" });
			token = res.body.token;
		});

		it("should return 401 without token", async () => {
			const res = await request(app)
				.post("/api/justify")
				.set("Content-Type", "text/plain")
				.send("Hello world");

			expect(res.status).toBe(401);
		});

		it("should return 401 with invalid token", async () => {
			const res = await request(app)
				.post("/api/justify")
				.set("Authorization", "Bearer invalid-token")
				.set("Content-Type", "text/plain")
				.send("Hello world");

			expect(res.status).toBe(401);
		});

		it("should justify text with valid token", async () => {
			const text =
				"Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua";

			const res = await request(app)
				.post("/api/justify")
				.set("Authorization", `Bearer ${token}`)
				.set("Content-Type", "text/plain")
				.send(text);

			expect(res.status).toBe(200);
			expect(res.type).toBe("text/plain");
		});

		it("should return lines with max 80 characters", async () => {
			const text =
				"Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua Ut enim ad minim veniam quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat";

			const res = await request(app)
				.post("/api/justify")
				.set("Authorization", `Bearer ${token}`)
				.set("Content-Type", "text/plain")
				.send(text);

			const lines = res.text.split("\n");
			lines.forEach((line: string, index: number) => {
				if (index < lines.length - 1) {
					expect(line.length).toBe(80);
				} else {
					expect(line.length).toBeLessThanOrEqual(80);
				}
			});
		});

		it("should return 400 for empty text", async () => {
			const res = await request(app)
				.post("/api/justify")
				.set("Authorization", `Bearer ${token}`)
				.set("Content-Type", "text/plain")
				.send("   ");

			expect(res.status).toBe(400);
		});
	});

	describe("GET /health", () => {
		it("should return OK status", async () => {
			const res = await request(app).get("/health");

			expect(res.status).toBe(200);
			expect(res.body.status).toBe("OK");
		});
	});

	describe("GET /", () => {
		it("should return API documentation", async () => {
			const res = await request(app).get("/");

			expect(res.status).toBe(200);
			expect(res.body).toHaveProperty("endpoints");
		});
	});
});
