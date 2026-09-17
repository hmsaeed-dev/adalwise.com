/**
 * Quranic Notation and Chapter/Verse Notation Parser
 * Automatically maps references like "2:255", "Surah 18", "Para 30", or "Ayat ul Kursi"
 * to rich scholarly search terms (English, Transliteration, Urdu).
 */

export interface SurahMetaEntry {
	number: number;
	name: string;
	transliteration: string;
	urdu: string;
	arabic: string;
}

// Map of all 114 Surahs for rapid O(1) lookup
export const SURAH_MAP: Record<number, { name: string; urdu: string; altNames?: string[] }> = {
	1: { name: "Al-Fatiha", urdu: "فاتحہ", altNames: ["Fateha", "الحمد"] },
	2: { name: "Al-Baqarah", urdu: "بقرہ", altNames: ["Baqara", "البقرة"] },
	3: { name: "Ali 'Imran", urdu: "آل عمران", altNames: ["Imran", "Aal-e-Imran"] },
	4: { name: "An-Nisa", urdu: "نساء", altNames: ["Nisa"] },
	5: { name: "Al-Ma'idah", urdu: "مائدہ", altNames: ["Maida"] },
	6: { name: "Al-An'am", urdu: "انعام", altNames: ["Anam", "Inam"] },
	7: { name: "Al-A'raf", urdu: "اعراف", altNames: ["Araf"] },
	8: { name: "Al-Anfal", urdu: "انفال", altNames: ["Anfal"] },
	9: { name: "At-Tawbah", urdu: "توبہ", altNames: ["Tawba", "Taubah"] },
	10: { name: "Yunus", urdu: "یونس", altNames: ["Jonah"] },
	11: { name: "Hud", urdu: "ہود" },
	12: { name: "Yusuf", urdu: "یوسف", altNames: ["Joseph"] },
	13: { name: "Ar-Ra'd", urdu: "رعد", altNames: ["Rad"] },
	14: { name: "Ibrahim", urdu: "ابراہیم", altNames: ["Abraham"] },
	15: { name: "Al-Hijr", urdu: "حجر", altNames: ["Hijr"] },
	16: { name: "An-Nahl", urdu: "نحل", altNames: ["Nahl"] },
	17: { name: "Al-Isra", urdu: "بنی اسرائیل", altNames: ["Bani Israel", "Isra"] },
	18: { name: "Al-Kahf", urdu: "کہف", altNames: ["Kahf", "Cave"] },
	19: { name: "Maryam", urdu: "مریم", altNames: ["Mary"] },
	20: { name: "Ta-Ha", urdu: "طہ", altNames: ["Taha"] },
	21: { name: "Al-Anbiya", urdu: "انبیاء", altNames: ["Anbiya", "Prophets"] },
	22: { name: "Al-Hajj", urdu: "حج", altNames: ["Hajj"] },
	23: { name: "Al-Mu'minun", urdu: "مؤمنون", altNames: ["Muminun", "Mominoon"] },
	24: { name: "An-Nur", urdu: "نور", altNames: ["Noor", "Light"] },
	25: { name: "Al-Furqan", urdu: "فرقان", altNames: ["Furqan"] },
	26: { name: "Ash-Shu'ara", urdu: "شعراء", altNames: ["Shuara"] },
	27: { name: "An-Naml", urdu: "نمل", altNames: ["Naml"] },
	28: { name: "Al-Qasas", urdu: "قصص", altNames: ["Qasas"] },
	29: { name: "Al-Ankabut", urdu: "عنکبوت", altNames: ["Ankaboot"] },
	30: { name: "Ar-Rum", urdu: "روم", altNames: ["Room", "Rome"] },
	31: { name: "Luqman", urdu: "لقمان" },
	32: { name: "As-Sajdah", urdu: "سجدہ", altNames: ["Sajda"] },
	33: { name: "Al-Ahzab", urdu: "احزاب", altNames: ["Ahzab"] },
	34: { name: "Saba", urdu: "سبا", altNames: ["Sheba"] },
	35: { name: "Fatir", urdu: "فاطر" },
	36: { name: "Ya-Sin", urdu: "یس", altNames: ["Yasin", "Yaseen", "یاسین"] },
	37: { name: "As-Saffat", urdu: "صافات", altNames: ["Saffat"] },
	38: { name: "Sad", urdu: "ص" },
	39: { name: "Az-Zumar", urdu: "زمر", altNames: ["Zumar"] },
	40: { name: "Ghafir", urdu: "غافر", altNames: ["Momin", "مومن"] },
	41: { name: "Fussilat", urdu: "فصلت", altNames: ["Hamim Sajdah", "حم سجدہ"] },
	42: { name: "Ash-Shura", urdu: "شوری", altNames: ["Shura"] },
	43: { name: "Az-Zukhruf", urdu: "زخرف", altNames: ["Zukhruf"] },
	44: { name: "Ad-Dukhan", urdu: "دخان", altNames: ["Dukhan"] },
	45: { name: "Al-Jathiyah", urdu: "جاثیہ", altNames: ["Jathiya"] },
	46: { name: "Al-Ahqaf", urdu: "احقاف", altNames: ["Ahqaf"] },
	47: { name: "Muhammad", urdu: "محمد" },
	48: { name: "Al-Fath", urdu: "فتح", altNames: ["Fath", "Victory"] },
	49: { name: "Al-Hujurat", urdu: "حجرات", altNames: ["Hujurat"] },
	50: { name: "Qaf", urdu: "ق" },
	51: { name: "Adh-Dhariyat", urdu: "ذاریات", altNames: ["Dhariyat"] },
	52: { name: "At-Tur", urdu: "طور", altNames: ["Toor"] },
	53: { name: "An-Najm", urdu: "نجم", altNames: ["Star"] },
	54: { name: "Al-Qamar", urdu: "قمر", altNames: ["Moon"] },
	55: { name: "Ar-Rahman", urdu: "رحمن", altNames: ["Rehman"] },
	56: { name: "Al-Waqi'ah", urdu: "واقعہ", altNames: ["Waqiah", "Waqia"] },
	57: { name: "Al-Hadid", urdu: "حدید", altNames: ["Iron"] },
	58: { name: "Al-Mujadila", urdu: "مجادلہ", altNames: ["Mujadila"] },
	59: { name: "Al-Hashr", urdu: "حشر", altNames: ["Hashr"] },
	60: { name: "Al-Mumtahanah", urdu: "ممتحنہ", altNames: ["Mumtahana"] },
	61: { name: "As-Saff", urdu: "صف", altNames: ["Saff"] },
	62: { name: "Al-Jumu'ah", urdu: "جمعہ", altNames: ["Jummah", "Juma"] },
	63: { name: "Al-Munafiqun", urdu: "منافقون", altNames: ["Munafiqoon", "Munafiqeen"] },
	64: { name: "At-Taghabun", urdu: "تغابن", altNames: ["Taghabun"] },
	65: { name: "At-Talaq", urdu: "طلاق", altNames: ["Talaq", "Divorce"] },
	66: { name: "At-Tahrim", urdu: "تحریم", altNames: ["Tahrim"] },
	67: { name: "Al-Mulk", urdu: "ملک", altNames: ["Mulk", "Dominion"] },
	68: { name: "Al-Qalam", urdu: "قلم", altNames: ["Noon", "Pen"] },
	69: { name: "Al-Haqqah", urdu: "حاقہ", altNames: ["Haqqah"] },
	70: { name: "Al-Ma'arij", urdu: "معارج", altNames: ["Maarij"] },
	71: { name: "Nuh", urdu: "نوح", altNames: ["Noah"] },
	72: { name: "Al-Jinn", urdu: "جن", altNames: ["Jinn"] },
	73: { name: "Al-Muzzammil", urdu: "مزمل", altNames: ["Muzammil"] },
	74: { name: "Al-Muddaththir", urdu: "مدثر", altNames: ["Muddathir", "Mudassir"] },
	75: { name: "Al-Qiyamah", urdu: "قیامت", altNames: ["Qiyama", "Resurrection"] },
	76: { name: "Al-Insan", urdu: "انسان", altNames: ["Dahr", "دہر"] },
	77: { name: "Al-Mursalat", urdu: "مرسلات", altNames: ["Mursalat"] },
	78: { name: "An-Naba", urdu: "نبا", altNames: ["Naba", "Amma", "عم"] },
	79: { name: "An-Nazi'at", urdu: "نازعات", altNames: ["Naziat"] },
	80: { name: "Abasa", urdu: "عبس" },
	81: { name: "At-Takwir", urdu: "تکویر", altNames: ["Takweer"] },
	82: { name: "Al-Infitar", urdu: "انفطار", altNames: ["Infitar"] },
	83: { name: "Al-Mutaffifin", urdu: "مطففین", altNames: ["Mutaffifeen"] },
	84: { name: "Al-Inshiqaq", urdu: "انشقاق", altNames: ["Inshiqaq"] },
	85: { name: "Al-Buruj", urdu: "بروج", altNames: ["Burooj"] },
	86: { name: "At-Tariq", urdu: "طارق", altNames: ["Tariq"] },
	87: { name: "Al-A'la", urdu: "اعلی", altNames: ["Ala"] },
	88: { name: "Al-Ghashiyah", urdu: "غاشیہ", altNames: ["Ghashiya"] },
	89: { name: "Al-Fajr", urdu: "فجر", altNames: ["Fajr", "Dawn"] },
	90: { name: "Al-Balad", urdu: "بلد", altNames: ["City"] },
	91: { name: "Ash-Shams", urdu: "شمس", altNames: ["Sun"] },
	92: { name: "Al-Layl", urdu: "لیل", altNames: ["Night"] },
	93: { name: "Ad-Duha", urdu: "ضحی", altNames: ["Duha"] },
	94: { name: "Ash-Sharh", urdu: "انشراح", altNames: ["Inshirah", "Alam Nashrah"] },
	95: { name: "At-Tin", urdu: "تین", altNames: ["Fig"] },
	96: { name: "Al-Alaq", urdu: "علق", altNames: ["Iqra", "اقرا"] },
	97: { name: "Al-Qadr", urdu: "قدر", altNames: ["Qadr"] },
	98: { name: "Al-Bayyinah", urdu: "بینہ", altNames: ["Bayyinah"] },
	99: { name: "Az-Zalzalah", urdu: "زلزال", altNames: ["Zilzal", "زلزلہ"] },
	100: { name: "Al-Adiyat", urdu: "عادیات", altNames: ["Adiyat"] },
	101: { name: "Al-Qari'ah", urdu: "قارعہ", altNames: ["Qariah"] },
	102: { name: "At-Takathur", urdu: "تکاثر", altNames: ["Takasur"] },
	103: { name: "Al-Asr", urdu: "عصر", altNames: ["Asr", "Time"] },
	104: { name: "Al-Humazah", urdu: "ہمزہ", altNames: ["Humazah"] },
	105: { name: "Al-Fil", urdu: "فیل", altNames: ["Elephant"] },
	106: { name: "Quraysh", urdu: "قریش", altNames: ["Quraish"] },
	107: { name: "Al-Ma'un", urdu: "ماعون", altNames: ["Maun"] },
	108: { name: "Al-Kawthar", urdu: "کوثر", altNames: ["Kausar"] },
	109: { name: "Al-Kafirun", urdu: "کافرون", altNames: ["Kafiroon"] },
	110: { name: "An-Nasr", urdu: "نصر", altNames: ["Nasr"] },
	111: { name: "Al-Masad", urdu: "لہب", altNames: ["Lahab", "مسد"] },
	112: { name: "Al-Ikhlas", urdu: "اخلاص", altNames: ["Ikhlas", "Tauheed"] },
	113: { name: "Al-Falaq", urdu: "فلق", altNames: ["Falaq"] },
	114: { name: "An-Nas", urdu: "ناس", altNames: ["Naas", "Mankind"] },
};

// Map of special notable Quranic passages
export const NOTABLE_AYAT_MAP: Record<string, { surah: number; ayah: number; label: string }> = {
	"ayatul kursi": { surah: 2, ayah: 255, label: "Ayat-ul-Kursi" },
	"ayat al kursi": { surah: 2, ayah: 255, label: "Ayat-ul-Kursi" },
	"آیت الکرسی": { surah: 2, ayah: 255, label: "Ayat-ul-Kursi" },
	"amanar rasool": { surah: 2, ayah: 285, label: "Amanar Rasool" },
	"امنا الرسول": { surah: 2, ayah: 285, label: "Amanar Rasool" },
	"ayat e noor": { surah: 24, ayah: 35, label: "Ayat-un-Noor" },
	"آیت نور": { surah: 24, ayah: 35, label: "Ayat-un-Noor" },
};

/**
 * Checks query for Quranic chapter/verse notations and returns expanded query terms.
 * Examples:
 * - "2:255" -> ["Al-Baqarah", "بقرہ", "Ayat-ul-Kursi"]
 * - "Surah 18" -> ["Al-Kahf", "کہف"]
 * - "Juz 30" -> ["Juz 30", "Amma", "عم"]
 * - "Ayat ul Kursi" -> ["Al-Baqarah", "2:255", "بقرہ"]
 */
export function resolveQuranNotation(query: string): string[] {
	if (!query) return [];
	const clean = query.trim().toLowerCase();
	const tokens = new Set<string>();

	// 1. Chapter:Verse notation (e.g. 2:255, 18:10, 36:1-12)
	const chapterVerseMatch = clean.match(/\b(\d{1,3}):(\d{1,3})(?:-\d{1,3})?\b/);
	if (chapterVerseMatch) {
		const surahNum = parseInt(chapterVerseMatch[1], 10);
		const ayahNum = parseInt(chapterVerseMatch[2], 10);

		if (surahNum >= 1 && surahNum <= 114) {
			const meta = SURAH_MAP[surahNum];
			if (meta) {
				tokens.add(meta.name);
				tokens.add(meta.urdu);
				if (meta.altNames) meta.altNames.forEach((a) => tokens.add(a));

				// Check for specific notable verses like Ayat-ul-Kursi
				if (surahNum === 2 && ayahNum === 255) {
					tokens.add("Ayat-ul-Kursi");
					tokens.add("آیت الکرسی");
					tokens.add("Kursi");
				}
				if (surahNum === 2 && ayahNum >= 284) {
					tokens.add("Amanar Rasool");
					tokens.add("آمن الرسول");
				}
				if (surahNum === 24 && ayahNum === 35) {
					tokens.add("Ayat-un-Noor");
					tokens.add("آیت نور");
				}
			}
		}
	}

	// 2. "Surah <number>" or "Surat <number>" or "سورۃ <number>"
	const surahNumMatch = clean.match(/\b(?:surah|surat|sorat|soorat|سورة|سورۃ|سورہ)\s*(\d{1,3})\b/i);
	if (surahNumMatch) {
		const surahNum = parseInt(surahNumMatch[1], 10);
		if (surahNum >= 1 && surahNum <= 114) {
			const meta = SURAH_MAP[surahNum];
			if (meta) {
				tokens.add(meta.name);
				tokens.add(meta.urdu);
				if (meta.altNames) meta.altNames.forEach((a) => tokens.add(a));
			}
		}
	}

	// 3. "Juz <number>" or "Para <number>" or "پارہ <number>"
	const juzMatch = clean.match(/\b(?:juz|para|sipara|پارہ|جزء|سیپارہ)\s*(\d{1,2})\b/i);
	if (juzMatch) {
		const juzNum = parseInt(juzMatch[1], 10);
		if (juzNum >= 1 && juzNum <= 30) {
			tokens.add(`Juz ${juzNum}`);
			tokens.add(`Para ${juzNum}`);
			tokens.add(`پارہ ${juzNum}`);
			if (juzNum === 30) {
				tokens.add("Amma");
				tokens.add("عم");
			}
			if (juzNum === 1) {
				tokens.add("Alif Lam Mim");
				tokens.add("الم");
			}
		}
	}

	// 4. Famous Ayat Names
	for (const [key, val] of Object.entries(NOTABLE_AYAT_MAP)) {
		if (clean.includes(key)) {
			const meta = SURAH_MAP[val.surah];
			if (meta) {
				tokens.add(meta.name);
				tokens.add(meta.urdu);
				tokens.add(val.label);
			}
		}
	}

	return Array.from(tokens);
}
