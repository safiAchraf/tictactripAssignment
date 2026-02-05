const LINE_LENGTH = 80;

export function justifyText(text: string): string {
	const paragraphs = text.split(/\n\s*\n/);

	const justifiedParagraphs = paragraphs.map((paragraph) => {
		const cleanedParagraph = paragraph.replace(/\n/g, " ").trim();

		if (cleanedParagraph.length === 0) {
			return "";
		}

		return justifyParagraph(cleanedParagraph);
	});

	return justifiedParagraphs.join("\n\n");
}

function justifyParagraph(paragraph: string): string {
	const words = paragraph.split(/\s+/).filter((word) => word.length > 0);

	if (words.length === 0) {
		return "";
	}

	const lines: string[] = [];
	let currentLineWords: string[] = [];
	let currentLineLength = 0;

	for (const word of words) {
		const additionalLength =
			currentLineWords.length === 0 ? word.length : word.length + 1;

		if (currentLineLength + additionalLength <= LINE_LENGTH) {
			currentLineWords.push(word);
			currentLineLength += additionalLength;
		} else {
			if (currentLineWords.length > 0) {
				lines.push(justifyLine(currentLineWords, LINE_LENGTH));
			}
			currentLineWords = [word];
			currentLineLength = word.length;
		}
	}

	if (currentLineWords.length > 0) {
		lines.push(currentLineWords.join(" "));
	}

	return lines.join("\n");
}

function justifyLine(words: string[], targetLength: number): string {
	if (words.length === 1) {
		return words[0];
	}

	const totalWordsLength = words.reduce((sum, word) => sum + word.length, 0);
	const totalSpacesNeeded = targetLength - totalWordsLength;
	const gaps = words.length - 1;

	const baseSpaces = Math.floor(totalSpacesNeeded / gaps);
	const extraSpaces = totalSpacesNeeded % gaps;

	let result = "";

	for (let i = 0; i < words.length; i++) {
		result += words[i];

		if (i < words.length - 1) {
			const spacesToAdd = baseSpaces + (i < extraSpaces ? 1 : 0);
			result += " ".repeat(spacesToAdd);
		}
	}

	return result;
}

export function countWords(text: string): number {
	const words = text.split(/\s+/).filter((word) => word.length > 0);
	return words.length;
}
