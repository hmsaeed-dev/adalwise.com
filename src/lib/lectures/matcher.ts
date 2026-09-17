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
	let score = 50;
	const titleLower = item.title.toLowerCase();
	const urduLower = (item.urduTitle || "").toLowerCase();
	const descLower = item.description.toLowerCase();
	const tagsLower = (item.tags || []).map((t) => t.toLowerCase());
	const topicsLower = (item.topics || []).map((t) => t.toLowerCase());

	// 1. Exact phrase match in title
	if (titleLower === cleanQuery) {
		score += 1000;
	} else if (titleLower.startsWith(cleanQuery)) {
		score += 800;
	} else if (titleLower.includes(cleanQuery)) {
		score += 600;
	}

	// 2. Exact phrase in Urdu title
	if (urduLower && urduLower.includes(cleanQuery)) {
		score += 400;
	}

	// 3. Exact phrase in description
	if (descLower.includes(cleanQuery)) {
		score += 200;
	}

	// 4. Token matches in title vs Urdu vs description vs tags/topics
	tokenGroups.forEach((variants) => {
		if (variants.some((v) => titleLower.includes(v))) {
			score += 150;
		} else if (variants.some((v) => urduLower.includes(v))) {
			score += 100;
		} else if (variants.some((v) => descLower.includes(v))) {
			score += 50;
		} else if (
			variants.some((v) => tagsLower.some((t) => t.includes(v)) || topicsLower.some((t) => t.includes(v)))
		) {
			score += 30;
		} else {
			score += 15;
		}
	});

	if (item.category.toLowerCase().includes(cleanQuery)) {
		score += 70;
	}

	// 5. Coursework contextual weighting:
	// Prioritize standalone masterclasses and key discourses over repetitive daily coursework
	// unless the user specifically searched for a session, coursework, or number
	if (item.isCoursework) {
		const hasCourseworkIntent =
			/\b(dora|daura|tarjuma|session|sitting|dars|course|\d+)\b/i.test(cleanQuery) ||
			/(دورہ|دورۂ|ترجمہ|نشست|درس)/.test(cleanQuery);

		if (!hasCourseworkIntent) {
			score -= 250;
		}
	}

	return Math.max(1, score);
}
