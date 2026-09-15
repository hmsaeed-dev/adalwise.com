import { LectureItem } from "./types";
import { expandQueryTokens } from "@/lib/search/synonyms";

/**
 * Checks if a lecture matches all token groups (each token group can be satisfied by any synonym)
 */
export function matchLecture(item: LectureItem, tokenGroups: string[][]): boolean {
	if (tokenGroups.length === 0) return true;

	const corpus = [
		item.title,
		item.urduTitle,
		item.description,
		item.searchText,
		item.category,
		item.domainId,
		item.seriesTitle,
		...(item.topics || []),
		...(item.tags || []),
	]
		.filter(Boolean)
		.join(" ")
		.toLowerCase();

	return tokenGroups.every((variants) =>
		variants.some((v) => corpus.includes(v)),
	);
}

/**
 * Calculates a relevance score for ranking matching lectures
 */
export function scoreLecture(
	item: LectureItem,
	cleanQuery: string,
	tokenGroups: string[][],
): number {
	let score = 0;
	const titleLower = item.title.toLowerCase();
	const urduLower = (item.urduTitle || "").toLowerCase();
	const descLower = item.description.toLowerCase();

	// 1. Exact phrase match in title
	if (titleLower === cleanQuery) {
		score += 1000;
	} else if (titleLower.startsWith(cleanQuery)) {
		score += 800;
	} else if (titleLower.includes(cleanQuery)) {
		score += 500;
	}

	// 2. Exact phrase in Urdu title
	if (urduLower && urduLower.includes(cleanQuery)) {
		score += 400;
	}

	// 3. Exact phrase in description
	if (descLower.includes(cleanQuery)) {
		score += 200;
	}

	// 4. Token matches in title vs Urdu vs description
	tokenGroups.forEach((variants) => {
		if (variants.some((v) => titleLower.includes(v))) {
			score += 100;
		} else if (variants.some((v) => urduLower.includes(v))) {
			score += 80;
		} else if (variants.some((v) => descLower.includes(v))) {
			score += 40;
		} else {
			score += 10;
		}
	});

	return score;
}
