import { justifyText, countWords } from "../utils/justify";

describe("justifyText", () => {
	it("should return empty string for empty input", () => {
		expect(justifyText("")).toBe("");
	});

	it("should not modify short lines", () => {
		const text = "Hello world";
		const result = justifyText(text);
		expect(result).toBe("Hello world");
	});

	it("should justify lines to 80 characters", () => {
		const text =
			"Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua";
		const result = justifyText(text);
		const lines = result.split("\n");

		lines.forEach((line, index) => {
			if (index < lines.length - 1) {
				expect(line.length).toBe(80);
			}
		});
	});

	it("should handle multiple paragraphs", () => {
		const text = "First paragraph.\n\nSecond paragraph.";
		const result = justifyText(text);
		expect(result).toContain("\n\n");
	});

	it("should preserve paragraph breaks", () => {
		const text = "Para one.\n\nPara two.\n\nPara three.";
		const result = justifyText(text);
		const paragraphs = result.split("\n\n");
		expect(paragraphs.length).toBe(3);
	});

	it("should handle single word", () => {
		const text = "Hello";
		const result = justifyText(text);
		expect(result).toBe("Hello");
	});

	it("should distribute spaces evenly", () => {
		const text =
			"one two three four five six seven eight nine ten eleven twelve thirteen";
		const result = justifyText(text);
		const lines = result.split("\n");

		if (lines.length > 1) {
			expect(lines[0].length).toBe(80);
		}
	});
});

describe("countWords", () => {
	it("should return 0 for empty string", () => {
		expect(countWords("")).toBe(0);
	});

	it("should count words correctly", () => {
		expect(countWords("hello world")).toBe(2);
	});

	it("should handle multiple spaces", () => {
		expect(countWords("hello   world")).toBe(2);
	});

	it("should handle newlines", () => {
		expect(countWords("hello\nworld")).toBe(2);
	});

	it("should handle tabs", () => {
		expect(countWords("hello\tworld")).toBe(2);
	});

	it("should handle leading and trailing spaces", () => {
		expect(countWords("  hello world  ")).toBe(2);
	});
});
