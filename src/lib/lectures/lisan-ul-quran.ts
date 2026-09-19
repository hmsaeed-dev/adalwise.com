import { LISAN_UL_QURAN_LECTURES_RAW } from "./catalog-loader";
import { LectureItem } from "./types";
import { ParsedTarjumaSession } from "./tarjuma-quran";

export interface ParsedLisanSession extends ParsedTarjumaSession {
	lessonNumber: number;
}

export interface LisanEditionMeta {
	id: string;
	label: string;
	badge: string;
	description: string;
	sessionCount: number;
	sessions: ParsedLisanSession[];
}

function cleanLisanTopicTitle(rawTitle: string): {
	cleanTitle: string;
	sessionCode: string;
	sortOrder: number;
} {
	const t = rawTitle.trim();

	// 1. Numbered classes (1. to 16.)
	const match1to16 = t.match(/^(\d+)\.\s*Quranic\s*Arabic\s*Class\s*\|\s*(.*)$/i);
	if (match1to16) {
		const num = parseInt(match1to16[1], 10);
		const topic = match1to16[2].trim();
		const code = num < 10 ? `0${num}` : `${num}`;
		return {
			cleanTitle: topic,
			sessionCode: code,
			sortOrder: num,
		};
	}

	// 2. Final Revision of Noun -> 17
	if (/^F1\./i.test(t) || /final\s*revision\s*of\s*noun/i.test(t)) {
		return {
			cleanTitle: "Final Comprehensive Revision: Nouns",
			sessionCode: "17",
			sortOrder: 17,
		};
	}

	// 3. Final Revision of Verb -> 18
	if (/^F2\./i.test(t) || /revision\s*of\s*verb/i.test(t)) {
		return {
			cleanTitle: "Final Comprehensive Revision: Verbs",
			sessionCode: "18",
			sortOrder: 18,
		};
	}

	// 4. Orientation / Foundations -> 19
	if (/^Quranic\s*Arabic\s*Learning$/i.test(t)) {
		return {
			cleanTitle: "Foundations & Study Methodology",
			sessionCode: "19",
			sortOrder: 19,
		};
	}

	// 5. Applied Intensive series (1/14 to 7/14) -> 20 to 26
	const matchIntensive = t.match(/^(\d+)\/14\s*Quranic\s*Arabic\s*Learning/i);
	if (matchIntensive) {
		const num = parseInt(matchIntensive[1], 10);
		const sessionNum = 19 + num; // 1 -> 20, ..., 7 -> 26
		const code = sessionNum < 10 ? `0${sessionNum}` : `${sessionNum}`;
		return {
			cleanTitle: `Applied Quranic Arabic: Session ${num < 10 ? `0${num}` : num}`,
			sessionCode: code,
			sortOrder: sessionNum,
		};
	}

	return {
		cleanTitle: t,
		sessionCode: "•",
		sortOrder: 99,
	};
}

export function getLisanUlQuranSessions(): ParsedLisanSession[] {
	const all = LISAN_UL_QURAN_LECTURES_RAW as LectureItem[];

	const sessions = all.map((item) => {
		const { cleanTitle, sessionCode, sortOrder } = cleanLisanTopicTitle(item.title);
		const mins = Math.max(1, Math.round(item.durationSeconds / 60));
		const durationFormatted = `${mins} min`;

		return {
			id: item.id,
			slug: item.slug,
			youtubeId: item.youtubeId,
			sessionCode,
			sortOrder,
			title: cleanTitle,
			cleanSurahTitle: cleanTitle,
			urduTitle: item.urduTitle || "",
			rangeLabel: durationFormatted,
			durationSeconds: item.durationSeconds,
			durationFormatted,
			publishedAt: item.publishedAt,
			juzList: [],
			edition: "lisan" as const,
			rawTitle: item.title,
			thumbnailUrl: item.thumbnailUrl,
			summary: item.summary,
			lessonNumber: sortOrder,
		};
	});

	return sessions.sort((a, b) => a.sortOrder - b.sortOrder);
}

export function getLisanUlQuranEditions(): LisanEditionMeta[] {
	const sessions = getLisanUlQuranSessions();
	return [
		{
			id: "series",
			label: "Lisan-ul-Quran Series",
			badge: "Complete 26-Session Curriculum",
			description:
				"Systematic Quranic Arabic grammar, morphology, and syntax series taught by Dr. Hafiz Haseeb.",
			sessionCount: sessions.length,
			sessions,
		},
	];
}
