/**
 * Islamic, Quranic, and Urdu/English Transliteration Synonyms Dictionary
 * Powers high-recall, high-precision search across Adlwise holdings.
 */

export const TRANSLITERATION_SYNONYMS: Record<string, string[]> = {
	// Holy Month & Coursework
	ramadan: ["ramzan", "ramadhan", "رمضان"],
	ramzan: ["ramadan", "ramadhan", "رمضان"],
	ramadhan: ["ramadan", "ramzan", "رمضان"],
	رمضان: ["ramadan", "ramzan"],

	dora: ["daura", "dour", "دورہ", "دورۂ"],
	daura: ["dora", "دورہ", "دورۂ"],
	دورہ: ["dora", "daura"],

	// Surah Term Variations
	surah: ["sorat", "surat", "soorat", "سورت", "سورۃ", "سورہ"],
	sorat: ["surah", "surat", "سورت", "سورۃ", "سورہ"],
	surat: ["surah", "sorat", "سورت", "سورۃ", "سورہ"],
	سورت: ["surah", "sorat"],
	سورۃ: ["surah", "sorat"],
	سورہ: ["surah", "sorat"],

	// Core Surahs
	fatiha: ["fateha", "فاتحہ", "فاتحة"],
	fateha: ["fatiha", "فاتحہ"],
	فاتحہ: ["fatiha", "fateha"],

	baqarah: ["baqara", "بقرہ", "بقرۃ"],
	baqara: ["baqarah", "بقرہ", "بقرۃ"],
	بقرہ: ["baqarah", "baqara"],

	imran: ["al-imran", "aal-e-imran", "عمران"],
	عمران: ["imran", "al-imran"],

	nisa: ["an-nisa", "نساء"],
	نساء: ["nisa", "an-nisa"],

	maida: ["al-maidah", "مائدہ"],
	مائدہ: ["maida"],

	kahf: ["al-kahf", "کہف"],
	کہف: ["kahf", "al-kahf"],

	yasin: ["ya-sin", "yaseen", "یس", "یاسین"],
	"ya-sin": ["yasin", "yaseen", "یس"],
	یاسین: ["yasin", "ya-sin"],

	taghabun: ["at-taghabun", "تغابن"],
	تغابن: ["taghabun"],

	talaq: ["at-talaq", "طلاق"],
	طلاق: ["talaq"],

	asr: ["al-asr", "عصر"],
	عصر: ["asr"],

	ikhlas: ["al-ikhlas", "اخلاص"],
	اخلاص: ["ikhlas"],

	// Academic Domains & Disciplines
	seerah: ["seerat", "سیرت", "prophetic"],
	seerat: ["seerah", "سیرت", "prophetic"],
	سیرت: ["seerah", "seerat"],

	constitution: ["aain", "aaeen", "دستور", "آئین", "آئینی", "دستوری"],
	aain: ["constitution", "آئین", "دستور"],
	aaeen: ["constitution", "آئین", "دستور"],
	آئین: ["constitution", "aain"],
	دستور: ["constitution", "aain"],

	iqbal: ["allama iqbal", "اقبال", "علامہ اقبال", "خودی", "ضربِ کلیم"],
	اقبال: ["iqbal", "allama iqbal"],

	tafsir: ["tafseer", "exegesis", "تفسیر"],
	tafseer: ["tafsir", "تفسیر"],
	تفسیر: ["tafsir", "tafseer"],

	hadith: ["hadees", "حدیث", "احادیث"],
	hadees: ["hadith", "حدیث"],
	حدیث: ["hadith", "hadees"],

	medina: ["madina", "madinah", "مدینہ", "مدنی"],
	madina: ["medina", "مدینہ", "مدنی"],
	مدینہ: ["medina", "madina"],

	pakistan: ["پاکستان"],
	پاکستان: ["pakistan"],

	khutba: ["khutbah", "خطبہ", "خطبات"],
	khutbah: ["khutba", "خطبہ", "خطبات"],
	خطبہ: ["khutba", "khutbah"],

	haseeb: ["dr haseeb", "hafiz haseeb", "حسیب"],
	حسیب: ["haseeb", "dr haseeb"],

	ethics: ["civic ethics", "اخلاق", "اخلاقیات"],
	اخلاق: ["ethics"],
	اخلاقیات: ["ethics"],

	law: ["fiqh", "jurisprudence", "فقہ", "قانون"],
	فقہ: ["fiqh", "jurisprudence"],
	قانون: ["law"],
};

/**
 * Expand search query tokens with synonyms for broad-recall matching
 */
export function expandQueryTokens(query: string): string[][] {
	const rawTokens = query
		.toLowerCase()
		.trim()
		.split(/[\s,./\\;:'"[\]{}|!@#$%^&*()_+=\-–—]+/)
		.filter(Boolean);

	return rawTokens.map((token) => {
		const variants = new Set<string>([token]);
		const syns = TRANSLITERATION_SYNONYMS[token];
		if (syns) {
			syns.forEach((v) => variants.add(v.toLowerCase()));
		}
		return Array.from(variants);
	});
}
