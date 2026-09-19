import tafsirData from "@content/catalog/tafsir.json";
import civicEthicsData from "@content/catalog/civic-ethics.json";
import seerahData from "@content/catalog/seerah.json";
import lisanUlQuranData from "@content/catalog/lisan-ul-quran.json";
import constitutionalLawData from "@content/catalog/constitutional-law.json";
import iqbalData from "@content/catalog/iqbal.json";
import { LectureItem } from "./types";

export const TAFSIR_LECTURES_RAW = tafsirData as unknown as LectureItem[];
export const CIVIC_ETHICS_LECTURES_RAW = civicEthicsData as unknown as LectureItem[];
export const SEERAH_LECTURES_RAW = seerahData as unknown as LectureItem[];
export const LISAN_UL_QURAN_LECTURES_RAW = lisanUlQuranData as unknown as LectureItem[];
export const CONSTITUTIONAL_LAW_LECTURES_RAW = constitutionalLawData as unknown as LectureItem[];
export const IQBAL_LECTURES_RAW = iqbalData as unknown as LectureItem[];

/**
 * Merged raw lectures catalog assembled from chunked domain modules at build time.
 * Strictly sorted descending by publication timestamp.
 */
export const ALL_LECTURES_RAW: LectureItem[] = [
	...TAFSIR_LECTURES_RAW,
	...CIVIC_ETHICS_LECTURES_RAW,
	...SEERAH_LECTURES_RAW,
	...LISAN_UL_QURAN_LECTURES_RAW,
	...CONSTITUTIONAL_LAW_LECTURES_RAW,
	...IQBAL_LECTURES_RAW,
].sort(
	(a, b) =>
		new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
);

/**
 * Domain-specific raw lectures map for fast targeted domain retrieval.
 */
export const DOMAIN_CHUNKS_MAP: Record<string, LectureItem[]> = {
	tafsir: TAFSIR_LECTURES_RAW,
	"civic-ethics": CIVIC_ETHICS_LECTURES_RAW,
	seerah: SEERAH_LECTURES_RAW,
	"lisan-ul-quran": LISAN_UL_QURAN_LECTURES_RAW,
	"constitutional-law": CONSTITUTIONAL_LAW_LECTURES_RAW,
	iqbal: IQBAL_LECTURES_RAW,
};
