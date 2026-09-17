/**
 * Bilingual Text Normalizer and Tokenizer for MiniSearch
 * Handles Urdu, Arabic, and Latin scripts gracefully:
 * - Strips Arabic/Urdu diacritics (A'raab / Tashkeel)
 * - Normalizes orthographic letter variants (Alef, Yeh, Heh, Kaf)
 * - Removes zero-width characters and invisible joiners
 * - Tokenizes across Latin and Urdu/Arabic punctuation marks
 */

const ARABIC_DIACRITICS_REGEX = /[\u064B-\u065F\u0670\u06D6-\u06ED]/g;
const ZERO_WIDTH_REGEX = /[\u200B-\u200D\uFEFF]/g;
const ALEF_VARIANTS_REGEX = /[\u0622\u0623\u0625\u0671]/g;
const HEH_VARIANTS_REGEX = /[\u0629\u06C2\u06C3\u06BE]/g;
const YEH_VARIANTS_REGEX = /[\u064A\u0649\u0626]/g;
const KAF_VARIANT_REGEX = /\u0643/g;

/**
 * Normalizes a single term or text block for search indexing and querying.
 */
export function normalizeUrduArabic(text: string | undefined | null): string {
	if (!text) return "";
	return text
		.replace(ARABIC_DIACRITICS_REGEX, "")
		.replace(ALEF_VARIANTS_REGEX, "\u0627")
		.replace(HEH_VARIANTS_REGEX, "\u06C1")
		.replace(YEH_VARIANTS_REGEX, "\u06CC")
		.replace(KAF_VARIANT_REGEX, "\u06A9")
		.replace(ZERO_WIDTH_REGEX, "")
		.toLowerCase()
		.trim();
}

/**
 * Tokenizes text across bilingual boundaries, splitting on spaces and
 * both Latin and Perso-Arabic punctuation marks (e.g. '۔', '،', '؟', '؛').
 */
export function tokenizeBilingual(text: string | undefined | null): string[] {
	if (!text) return [];
	return text
		.split(/[\s,./\\;:'"[\]{}|!@#$%^&*()_+=\-–—؟،۔«»‹›"“”'‘’`~]+/u)
		.map((token) => token.trim())
		.filter((token) => token.length > 0);
}
