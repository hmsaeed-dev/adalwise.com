import { TAFSIR_LECTURES_RAW } from "./catalog-loader";
import { LectureItem, QuranContext } from "./types";

export interface QuranSurahMeta {
	number: number;
	name: string;
	arabic: string;
	urdu: string;
	verses: number;
	juz: number[];
	type: "Makki" | "Madani";
}

export interface QuranJuzMeta {
	number: number;
	arabicName: string;
	urduName: string;
	transliteration: string;
}

export interface ParsedTarjumaSession {
	id: string;
	slug: string;
	youtubeId: string;
	sessionCode: string;
	sortOrder: number;
	title: string;
	cleanSurahTitle: string;
	urduTitle: string;
	rangeLabel?: string;
	durationSeconds: number;
	durationFormatted: string;
	publishedAt: string;
	juzList: number[];
	edition: "2026" | "2025" | "2024" | "2023" | "lisan";
	rawTitle: string;
	thumbnailUrl: string;
	summary?: string;
	quranContext?: QuranContext;
}

export interface TarjumaEditionMeta {
	id: "2026" | "2025" | "2024" | "2023";
	year: number;
	label: string;
	badge: string;
	description: string;
	sessionCount: number;
	sessions: ParsedTarjumaSession[];
}

export const QURAN_JUZ_LIST: QuranJuzMeta[] = [
	{ number: 1, arabicName: "الم", urduName: "الم (الف لام میم)", transliteration: "Alif-Lam-Mim" },
	{ number: 2, arabicName: "سَيَقُولُ", urduName: "سیقول", transliteration: "Sayaqool" },
	{ number: 3, arabicName: "تِلْكَ الرُّسُلُ", urduName: "تلک الرسل", transliteration: "Tilka'r-Rusul" },
	{ number: 4, arabicName: "لَنْ تَنَالُوا", urduName: "لن تنالوا", transliteration: "Lan Tanaaloo" },
	{ number: 5, arabicName: "وَالْمُحْصَنَاتُ", urduName: "والمحصنات", transliteration: "Wal-Muhsanat" },
	{ number: 6, arabicName: "لَا يُحِبُّ اللَّهُ", urduName: "لا یحب اللہ", transliteration: "La Yuhibbullah" },
	{ number: 7, arabicName: "وَإِذَا سَمِعُوا", urduName: "واذا سمعوا", transliteration: "Wa-Iza Sami'oo" },
	{ number: 8, arabicName: "وَلَوْ أَنَّنَا", urduName: "ولو اننا", transliteration: "Wa-Law Annana" },
	{ number: 9, arabicName: "قَالَ الْمَلَأُ", urduName: "قال الملاء", transliteration: "Qalal Mala'u" },
	{ number: 10, arabicName: "وَاعْلَمُوا", urduName: "واعلموا", transliteration: "Wa-A'lamoo" },
	{ number: 11, arabicName: "يَعْتَذِرُونَ", urduName: "یعتذرون", transliteration: "Ya'taziroon" },
	{ number: 12, arabicName: "وَمَا مِنْ دَابَّةٍ", urduName: "وما من دابۃ", transliteration: "Wa-Mamin Dabbah" },
	{ number: 13, arabicName: "وَمَا أُبَرِّئُ", urduName: "وما ابریٔ", transliteration: "Wa-Ma Oobarri'u" },
	{ number: 14, arabicName: "رُبَمَا", urduName: "ربما", transliteration: "Rubama" },
	{ number: 15, arabicName: "سُبْحَانَ الَّذِي", urduName: "سبحان الذی", transliteration: "Subhanallazi" },
	{ number: 16, arabicName: "قَالَ أَلَمْ", urduName: "قال الم", transliteration: "Qala Alam" },
	{ number: 17, arabicName: "اقْتَرَبَ", urduName: "اقترب", transliteration: "Iqtaraba" },
	{ number: 18, arabicName: "قَدْ أَفْلَحَ", urduName: "قد افلح", transliteration: "Qadd Aflaha" },
	{ number: 19, arabicName: "وَقَالَ الَّذِينَ", urduName: "وقال الذین", transliteration: "Wa-Qalal Lazina" },
	{ number: 20, arabicName: "أَمَّنْ خَلَقَ", urduName: "امن خلق", transliteration: "A'man Khalaqa" },
	{ number: 21, arabicName: "اتْلُ مَا أُوحِيَ", urduName: "اتل ما اوحی", transliteration: "Utlu Ma Oohiya" },
	{ number: 22, arabicName: "وَمَنْ يَقْنُتْ", urduName: "ومن یقنت", transliteration: "Wa-Man Yaqnut" },
	{ number: 23, arabicName: "وَمَا لِيَ", urduName: "وما لی", transliteration: "Wa-Maliya" },
	{ number: 24, arabicName: "فَمَنْ أَظْلَمُ", urduName: "فمن اظلم", transliteration: "Faman Azlamu" },
	{ number: 25, arabicName: "إِلَيْهِ يُرَدُّ", urduName: "الیہ یرد", transliteration: "Ilayhi Yuraddu" },
	{ number: 26, arabicName: "حم", urduName: "حم (حا میم)", transliteration: "Ha-Meem" },
	{ number: 27, arabicName: "قَالَ فَمَا خَطْبُكُمْ", urduName: "قال فما خطبکم", transliteration: "Qala Fama Khatbukum" },
	{ number: 28, arabicName: "قَدْ سَمِعَ اللَّهُ", urduName: "قد سمع اللہ", transliteration: "Qadd Sami'allah" },
	{ number: 29, arabicName: "تَبَارَكَ الَّذِي", urduName: "تبارک الذی", transliteration: "Tabarakallazi" },
	{ number: 30, arabicName: "عَمَّ", urduName: "عم (عم یتساءلون)", transliteration: "Amma" },
];

export const MADANI_SURAH_NUMBERS = new Set<number>([
	2, 3, 4, 5, 8, 9, 13, 22, 24, 33, 47, 48, 49, 55, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 76, 98, 99, 110,
]);

const RAW_QURAN_SURAHS: Omit<QuranSurahMeta, "type">[] = [
	{ number: 1, name: "Al-Fatiha", arabic: "الفاتحة", urdu: "سورۃ الفاتحہ", verses: 7, juz: [1] },
	{ number: 2, name: "Al-Baqarah", arabic: "البقرة", urdu: "سورۃ البقرہ", verses: 286, juz: [1, 2, 3] },
	{ number: 3, name: "Ali 'Imran", arabic: "آل عمران", urdu: "سورۃ آل عمران", verses: 200, juz: [3, 4] },
	{ number: 4, name: "An-Nisa", arabic: "النساء", urdu: "سورۃ النساء", verses: 176, juz: [4, 5, 6] },
	{ number: 5, name: "Al-Ma'idah", arabic: "المائدة", urdu: "سورۃ المائدہ", verses: 120, juz: [6, 7] },
	{ number: 6, name: "Al-An'am", arabic: "الأنعام", urdu: "سورۃ الانعام", verses: 165, juz: [7, 8] },
	{ number: 7, name: "Al-A'raf", arabic: "الأعراف", urdu: "سورۃ الاعراف", verses: 206, juz: [8, 9] },
	{ number: 8, name: "Al-Anfal", arabic: "الأنفال", urdu: "سورۃ الانفال", verses: 75, juz: [9, 10] },
	{ number: 9, name: "At-Tawbah", arabic: "التوبة", urdu: "سورۃ التوبہ", verses: 129, juz: [10, 11] },
	{ number: 10, name: "Yunus", arabic: "يونس", urdu: "سورۃ یونس", verses: 109, juz: [11] },
	{ number: 11, name: "Hud", arabic: "هود", urdu: "سورۃ ہود", verses: 123, juz: [11, 12] },
	{ number: 12, name: "Yusuf", arabic: "يوسف", urdu: "سورۃ یوسف", verses: 111, juz: [12, 13] },
	{ number: 13, name: "Ar-Ra'd", arabic: "الرعد", urdu: "سورۃ الرعد", verses: 43, juz: [13] },
	{ number: 14, name: "Ibrahim", arabic: "إبراهيم", urdu: "سورۃ ابراہیم", verses: 52, juz: [13] },
	{ number: 15, name: "Al-Hijr", arabic: "الحجر", urdu: "سورۃ الحجر", verses: 99, juz: [14] },
	{ number: 16, name: "An-Nahl", arabic: "النحل", urdu: "سورۃ النحل", verses: 128, juz: [14] },
	{ number: 17, name: "Al-Isra", arabic: "الإسراء", urdu: "سورۃ بنی اسرائیل", verses: 111, juz: [15] },
	{ number: 18, name: "Al-Kahf", arabic: "الكهف", urdu: "سورۃ الکہف", verses: 110, juz: [15, 16] },
	{ number: 19, name: "Maryam", arabic: "مريم", urdu: "سورۃ مریم", verses: 98, juz: [16] },
	{ number: 20, name: "Ta-Ha", arabic: "طه", urdu: "سورۃ طہ", verses: 135, juz: [16] },
	{ number: 21, name: "Al-Anbiya", arabic: "الأنبياء", urdu: "سورۃ الانبیاء", verses: 112, juz: [17] },
	{ number: 22, name: "Al-Hajj", arabic: "الحج", urdu: "سورۃ الحج", verses: 78, juz: [17] },
	{ number: 23, name: "Al-Mu'minun", arabic: "المؤمنون", urdu: "سورۃ المؤمنون", verses: 118, juz: [18] },
	{ number: 24, name: "An-Nur", arabic: "النور", urdu: "سورۃ النور", verses: 64, juz: [18] },
	{ number: 25, name: "Al-Furqan", arabic: "الفرقان", urdu: "سورۃ الفرقان", verses: 77, juz: [18, 19] },
	{ number: 26, name: "Ash-Shu'ara", arabic: "الشعراء", urdu: "سورۃ الشعراء", verses: 227, juz: [19] },
	{ number: 27, name: "An-Naml", arabic: "النمل", urdu: "سورۃ النمل", verses: 93, juz: [19, 20] },
	{ number: 28, name: "Al-Qasas", arabic: "القصص", urdu: "سورۃ القصص", verses: 88, juz: [20] },
	{ number: 29, name: "Al-Ankabut", arabic: "العنكبوت", urdu: "سورۃ العنکبوت", verses: 69, juz: [20, 21] },
	{ number: 30, name: "Ar-Rum", arabic: "الروم", urdu: "سورۃ الروم", verses: 60, juz: [21] },
	{ number: 31, name: "Luqman", arabic: "لقمان", urdu: "سورۃ لقمان", verses: 34, juz: [21] },
	{ number: 32, name: "As-Sajdah", arabic: "السجدة", urdu: "سورۃ السجدہ", verses: 30, juz: [21] },
	{ number: 33, name: "Al-Ahzab", arabic: "الأحزاب", urdu: "سورۃ الاحزاب", verses: 73, juz: [21, 22] },
	{ number: 34, name: "Saba", arabic: "سبأ", urdu: "سورۃ سبا", verses: 54, juz: [22] },
	{ number: 35, name: "Fatir", arabic: "فاطر", urdu: "سورۃ فاطر", verses: 45, juz: [22] },
	{ number: 36, name: "Ya-Sin", arabic: "يس", urdu: "سورۃ یس", verses: 83, juz: [22, 23] },
	{ number: 37, name: "As-Saffat", arabic: "الصافات", urdu: "سورۃ الصافات", verses: 182, juz: [23] },
	{ number: 38, name: "Sad", arabic: "ص", urdu: "سورۃ ص", verses: 88, juz: [23] },
	{ number: 39, name: "Az-Zumar", arabic: "الزمر", urdu: "سورۃ الزمر", verses: 75, juz: [23, 24] },
	{ number: 40, name: "Ghafir", arabic: "غافر", urdu: "سورۃ غافر (المؤمن)", verses: 85, juz: [24] },
	{ number: 41, name: "Fussilat", arabic: "فصلت", urdu: "سورۃ فصلت (حم سجدہ)", verses: 54, juz: [24, 25] },
	{ number: 42, name: "Ash-Shura", arabic: "الشورى", urdu: "سورۃ الشوری", verses: 53, juz: [25] },
	{ number: 43, name: "Az-Zukhruf", arabic: "الزخرف", urdu: "سورۃ الزخرف", verses: 89, juz: [25] },
	{ number: 44, name: "Ad-Dukhan", arabic: "الدخان", urdu: "سورۃ الدخان", verses: 59, juz: [25] },
	{ number: 45, name: "Al-Jathiyah", arabic: "الجاثية", urdu: "سورۃ الجاثیہ", verses: 37, juz: [25] },
	{ number: 46, name: "Al-Ahqaf", arabic: "الأحقاف", urdu: "سورۃ الاحقاف", verses: 35, juz: [26] },
	{ number: 47, name: "Muhammad", arabic: "محمد", urdu: "سورۃ محمد", verses: 38, juz: [26] },
	{ number: 48, name: "Al-Fath", arabic: "الفتح", urdu: "سورۃ الفتح", verses: 29, juz: [26] },
	{ number: 49, name: "Al-Hujurat", arabic: "الحجرات", urdu: "سورۃ الحجرات", verses: 18, juz: [26] },
	{ number: 50, name: "Qaf", arabic: "ق", urdu: "سورۃ ق", verses: 45, juz: [26] },
	{ number: 51, name: "Adh-Dhariyat", arabic: "الذاريات", urdu: "سورۃ الذاریات", verses: 60, juz: [26, 27] },
	{ number: 52, name: "At-Tur", arabic: "الطور", urdu: "سورۃ الطور", verses: 49, juz: [27] },
	{ number: 53, name: "An-Najm", arabic: "النجم", urdu: "سورۃ النجم", verses: 62, juz: [27] },
	{ number: 54, name: "Al-Qamar", arabic: "القمر", urdu: "سورۃ القمر", verses: 55, juz: [27] },
	{ number: 55, name: "Ar-Rahman", arabic: "الرحمن", urdu: "سورۃ الرحمن", verses: 78, juz: [27] },
	{ number: 56, name: "Al-Waqi'ah", arabic: "الواقعة", urdu: "سورۃ الواقعہ", verses: 96, juz: [27] },
	{ number: 57, name: "Al-Hadid", arabic: "الحديد", urdu: "سورۃ الحدید", verses: 29, juz: [27] },
	{ number: 58, name: "Al-Mujadila", arabic: "المجادلة", urdu: "سورۃ المجادلہ", verses: 22, juz: [28] },
	{ number: 59, name: "Al-Hashr", arabic: "الحشر", urdu: "سورۃ الحشر", verses: 24, juz: [28] },
	{ number: 60, name: "Al-Mumtahanah", arabic: "الممتحنة", urdu: "سورۃ الممتحنہ", verses: 13, juz: [28] },
	{ number: 61, name: "As-Saff", arabic: "الصف", urdu: "سورۃ الصف", verses: 14, juz: [28] },
	{ number: 62, name: "Al-Jumu'ah", arabic: "الجمعة", urdu: "سورۃ الجمعہ", verses: 11, juz: [28] },
	{ number: 63, name: "Al-Munafiqun", arabic: "المنافقون", urdu: "سورۃ المنافقون", verses: 11, juz: [28] },
	{ number: 64, name: "At-Taghabun", arabic: "التغابن", urdu: "سورۃ التغابن", verses: 18, juz: [28] },
	{ number: 65, name: "At-Talaq", arabic: "الطلاق", urdu: "سورۃ الطلاق", verses: 12, juz: [28] },
	{ number: 66, name: "At-Tahrim", arabic: "التحريم", urdu: "سورۃ التحریم", verses: 12, juz: [28] },
	{ number: 67, name: "Al-Mulk", arabic: "الملك", urdu: "سورۃ الملک", verses: 30, juz: [29] },
	{ number: 68, name: "Al-Qalam", arabic: "القلم", urdu: "سورۃ القلم", verses: 52, juz: [29] },
	{ number: 69, name: "Al-Haqqah", arabic: "الحاقة", urdu: "سورۃ الحاقہ", verses: 52, juz: [29] },
	{ number: 70, name: "Al-Ma'arij", arabic: "المعارج", urdu: "سورۃ المعارج", verses: 44, juz: [29] },
	{ number: 71, name: "Nuh", arabic: "نوح", urdu: "سورۃ نوح", verses: 28, juz: [29] },
	{ number: 72, name: "Al-Jinn", arabic: "الجن", urdu: "سورۃ الجن", verses: 28, juz: [29] },
	{ number: 73, name: "Al-Muzzammil", arabic: "المزمل", urdu: "سورۃ المزمل", verses: 20, juz: [29] },
	{ number: 74, name: "Al-Muddaththir", arabic: "المدثر", urdu: "سورۃ المدثر", verses: 56, juz: [29] },
	{ number: 75, name: "Al-Qiyamah", arabic: "القيامة", urdu: "سورۃ القیامہ", verses: 40, juz: [29] },
	{ number: 76, name: "Al-Insan", arabic: "الإنسان", urdu: "سورۃ الدہر (الانسان)", verses: 31, juz: [29] },
	{ number: 77, name: "Al-Mursalat", arabic: "المرسلات", urdu: "سورۃ المرسلات", verses: 50, juz: [29] },
	{ number: 78, name: "An-Naba", arabic: "النبأ", urdu: "سورۃ النبأ", verses: 40, juz: [30] },
	{ number: 79, name: "An-Nazi'at", arabic: "النازعات", urdu: "سورۃ النازعات", verses: 46, juz: [30] },
	{ number: 80, name: "Abasa", arabic: "عبس", urdu: "سورۃ عبس", verses: 42, juz: [30] },
	{ number: 81, name: "At-Takwir", arabic: "التكوير", urdu: "سورۃ التکویر", verses: 29, juz: [30] },
	{ number: 82, name: "Al-Infitar", arabic: "الانفطار", urdu: "سورۃ الانفطار", verses: 19, juz: [30] },
	{ number: 83, name: "Al-Mutaffifin", arabic: "المطففين", urdu: "سورۃ المطففین", verses: 36, juz: [30] },
	{ number: 84, name: "Al-Inshiqaq", arabic: "الانشقاق", urdu: "سورۃ الانشقاق", verses: 25, juz: [30] },
	{ number: 85, name: "Al-Buruj", arabic: "البروج", urdu: "سورۃ البروج", verses: 22, juz: [30] },
	{ number: 86, name: "At-Tariq", arabic: "الطارق", urdu: "سورۃ الطارق", verses: 17, juz: [30] },
	{ number: 87, name: "Al-A'la", arabic: "الأعلى", urdu: "سورۃ الاعلی", verses: 19, juz: [30] },
	{ number: 88, name: "Al-Ghashiyah", arabic: "الغاشية", urdu: "سورۃ الغاشیہ", verses: 26, juz: [30] },
	{ number: 89, name: "Al-Fajr", arabic: "الفجر", urdu: "سورۃ الفجر", verses: 30, juz: [30] },
	{ number: 90, name: "Al-Balad", arabic: "البلد", urdu: "سورۃ البلد", verses: 20, juz: [30] },
	{ number: 91, name: "Ash-Shams", arabic: "الشمس", urdu: "سورۃ الشمس", verses: 15, juz: [30] },
	{ number: 92, name: "Al-Layl", arabic: "الليل", urdu: "سورۃ اللیل", verses: 21, juz: [30] },
	{ number: 93, name: "Ad-Duha", arabic: "الضحى", urdu: "سورۃ الضحی", verses: 11, juz: [30] },
	{ number: 94, name: "Ash-Sharh", arabic: "الشرح", urdu: "سورۃ الانشراح", verses: 8, juz: [30] },
	{ number: 95, name: "At-Tin", arabic: "التين", urdu: "سورۃ التین", verses: 8, juz: [30] },
	{ number: 96, name: "Al-Alaq", arabic: "العلق", urdu: "سورۃ العلق", verses: 19, juz: [30] },
	{ number: 97, name: "Al-Qadr", arabic: "القدر", urdu: "سورۃ القدر", verses: 5, juz: [30] },
	{ number: 98, name: "Al-Bayyinah", arabic: "البينة", urdu: "سورۃ البینہ", verses: 8, juz: [30] },
	{ number: 99, name: "Az-Zalzalah", arabic: "الزلزلة", urdu: "سورۃ الزلزلہ", verses: 8, juz: [30] },
	{ number: 100, name: "Al-Adiyat", arabic: "العاديات", urdu: "سورۃ العادیات", verses: 11, juz: [30] },
	{ number: 101, name: "Al-Qari'ah", arabic: "القارعة", urdu: "سورۃ القارعہ", verses: 11, juz: [30] },
	{ number: 102, name: "At-Takathur", arabic: "التكاثر", urdu: "سورۃ التکاثر", verses: 8, juz: [30] },
	{ number: 103, name: "Al-Asr", arabic: "العصر", urdu: "سورۃ العصر", verses: 3, juz: [30] },
	{ number: 104, name: "Al-Humazah", arabic: "الهمزة", urdu: "سورۃ الہمزہ", verses: 9, juz: [30] },
	{ number: 105, name: "Al-Fil", arabic: "الفيل", urdu: "سورۃ الفیل", verses: 5, juz: [30] },
	{ number: 106, name: "Quraysh", arabic: "قريش", urdu: "سورۃ قریش", verses: 4, juz: [30] },
	{ number: 107, name: "Al-Ma'un", arabic: "الماعون", urdu: "سورۃ الماعون", verses: 7, juz: [30] },
	{ number: 108, name: "Al-Kawthar", arabic: "الكوثر", urdu: "سورۃ الکوثر", verses: 3, juz: [30] },
	{ number: 109, name: "Al-Kafirun", arabic: "الكافرون", urdu: "سورۃ الکافرون", verses: 6, juz: [30] },
	{ number: 110, name: "An-Nasr", arabic: "النصر", urdu: "سورۃ النصر", verses: 3, juz: [30] },
	{ number: 111, name: "Al-Masad", arabic: "المسد", urdu: "سورۃ المسد", verses: 5, juz: [30] },
	{ number: 112, name: "Al-Ikhlas", arabic: "الإخلاص", urdu: "سورۃ الاخلاص", verses: 4, juz: [30] },
	{ number: 113, name: "Al-Falaq", arabic: "الفلق", urdu: "سورۃ الفلق", verses: 5, juz: [30] },
	{ number: 114, name: "An-Nas", arabic: "الناس", urdu: "سورۃ الناس", verses: 6, juz: [30] },
];

export const QURAN_SURAHS: QuranSurahMeta[] = RAW_QURAN_SURAHS.map((s) => ({
	...s,
	type: MADANI_SURAH_NUMBERS.has(s.number) ? "Madani" : "Makki",
}));

// Mapping helper to detect Surahs from title string
const SURAH_ALIASES: { alias: string; surahNum: number }[] = [
	{ alias: "fatiha", surahNum: 1 },
	{ alias: "baqara", surahNum: 2 },
	{ alias: "baqarah", surahNum: 2 },
	{ alias: "aal e imran", surahNum: 3 },
	{ alias: "al imran", surahNum: 3 },
	{ alias: "imran", surahNum: 3 },
	{ alias: "nisa", surahNum: 4 },
	{ alias: "nisaa", surahNum: 4 },
	{ alias: "maida", surahNum: 5 },
	{ alias: "maidah", surahNum: 5 },
	{ alias: "anam", surahNum: 6 },
	{ alias: "anaam", surahNum: 6 },
	{ alias: "inam", surahNum: 6 },
	{ alias: "araf", surahNum: 7 },
	{ alias: "aaraf", surahNum: 7 },
	{ alias: "araaf", surahNum: 7 },
	{ alias: "anfal", surahNum: 8 },
	{ alias: "anfaal", surahNum: 8 },
	{ alias: "tauba", surahNum: 9 },
	{ alias: "touba", surahNum: 9 },
	{ alias: "toba", surahNum: 9 },
	{ alias: "younus", surahNum: 10 },
	{ alias: "yunus", surahNum: 10 },
	{ alias: "hood", surahNum: 11 },
	{ alias: "hud", surahNum: 11 },
	{ alias: "yousuf", surahNum: 12 },
	{ alias: "yusuf", surahNum: 12 },
	{ alias: "raad", surahNum: 13 },
	{ alias: "rad", surahNum: 13 },
	{ alias: "ibrahim", surahNum: 14 },
	{ alias: "hijr", surahNum: 15 },
	{ alias: "nahal", surahNum: 16 },
	{ alias: "alnahal", surahNum: 16 },
	{ alias: "nahl", surahNum: 16 },
	{ alias: "isra", surahNum: 17 },
	{ alias: "bani israel", surahNum: 17 },
	{ alias: "bani israeel", surahNum: 17 },
	{ alias: "israeel", surahNum: 17 },
	{ alias: "kahaf", surahNum: 18 },
	{ alias: "kahf", surahNum: 18 },
	{ alias: "maryam", surahNum: 19 },
	{ alias: "taha", surahNum: 20 },
	{ alias: "anbea", surahNum: 21 },
	{ alias: "anbia", surahNum: 21 },
	{ alias: "anbiaa", surahNum: 21 },
	{ alias: "ambia", surahNum: 21 },
	{ alias: "hajj", surahNum: 22 },
	{ alias: "mominon", surahNum: 23 },
	{ alias: "mominoon", surahNum: 23 },
	{ alias: "muminun", surahNum: 23 },
	{ alias: "noor", surahNum: 24 },
	{ alias: "furqan", surahNum: 25 },
	{ alias: "shuara", surahNum: 26 },
	{ alias: "shuaraa", surahNum: 26 },
	{ alias: "shuraa", surahNum: 26 },
	{ alias: "shoara", surahNum: 26 },
	{ alias: "namal", surahNum: 27 },
	{ alias: "naml", surahNum: 27 },
	{ alias: "qasas", surahNum: 28 },
	{ alias: "ankabot", surahNum: 29 },
	{ alias: "ankaboot", surahNum: 29 },
	{ alias: "ankabut", surahNum: 29 },
	{ alias: "room", surahNum: 30 },
	{ alias: "rum", surahNum: 30 },
	{ alias: "luqman", surahNum: 31 },
	{ alias: "sajda", surahNum: 32 },
	{ alias: "sajdah", surahNum: 32 },
	{ alias: "ahzab", surahNum: 33 },
	{ alias: "ahzaab", surahNum: 33 },
	{ alias: "saba", surahNum: 34 },
	{ alias: "fatir", surahNum: 35 },
	{ alias: "yaseen", surahNum: 36 },
	{ alias: "yasin", surahNum: 36 },
	{ alias: "saffat", surahNum: 37 },
	{ alias: "saaffaat", surahNum: 37 },
	{ alias: "saad", surahNum: 38 },
	{ alias: "sad", surahNum: 38 },
	{ alias: "zumar", surahNum: 39 },
	{ alias: "momin", surahNum: 40 },
	{ alias: "ghafir", surahNum: 40 },
	{ alias: "hamim sajda", surahNum: 41 },
	{ alias: "fussilat", surahNum: 41 },
	{ alias: "shooraa", surahNum: 42 },
	{ alias: "shoora", surahNum: 42 },
	{ alias: "shura", surahNum: 42 },
	{ alias: "zukhruf", surahNum: 43 },
	{ alias: "dukhan", surahNum: 44 },
	{ alias: "jasia", surahNum: 45 },
	{ alias: "jasiyah", surahNum: 45 },
	{ alias: "jathiyah", surahNum: 45 },
	{ alias: "ahqaf", surahNum: 46 },
	{ alias: "ahqaaf", surahNum: 46 },
	{ alias: "muhammad", surahNum: 47 },
	{ alias: "fatah", surahNum: 48 },
	{ alias: "fath", surahNum: 48 },
	{ alias: "hujurat", surahNum: 49 },
	{ alias: "qaaf", surahNum: 50 },
	{ alias: "qaf", surahNum: 50 },
	{ alias: "zariat", surahNum: 51 },
	{ alias: "dhariyat", surahNum: 51 },
	{ alias: "toor", surahNum: 52 },
	{ alias: "tur", surahNum: 52 },
	{ alias: "najam", surahNum: 53 },
	{ alias: "najm", surahNum: 53 },
	{ alias: "qamar", surahNum: 54 },
	{ alias: "rahman", surahNum: 55 },
	{ alias: "waqia", surahNum: 56 },
	{ alias: "waqiah", surahNum: 56 },
	{ alias: "hadeed", surahNum: 57 },
	{ alias: "hadid", surahNum: 57 },
	{ alias: "mujadila", surahNum: 58 },
	{ alias: "hashar", surahNum: 59 },
	{ alias: "hashr", surahNum: 59 },
	{ alias: "mumtahina", surahNum: 60 },
	{ alias: "saff", surahNum: 61 },
	{ alias: "jumma", surahNum: 62 },
	{ alias: "jumuah", surahNum: 62 },
	{ alias: "munafiqon", surahNum: 63 },
	{ alias: "munafiqun", surahNum: 63 },
	{ alias: "mnafiqoon", surahNum: 63 },
	{ alias: "tagabun", surahNum: 64 },
	{ alias: "taghabun", surahNum: 64 },
	{ alias: "taghabn", surahNum: 64 },
	{ alias: "talaq", surahNum: 65 },
	{ alias: "tahreem", surahNum: 66 },
	{ alias: "mulk", surahNum: 67 },
	{ alias: "qalam", surahNum: 68 },
	{ alias: "haaqqa", surahNum: 69 },
	{ alias: "maarij", surahNum: 70 },
	{ alias: "nooh", surahNum: 71 },
	{ alias: "jinn", surahNum: 72 },
	{ alias: "muzzammil", surahNum: 73 },
	{ alias: "mudassir", surahNum: 74 },
	{ alias: "qiama", surahNum: 75 },
	{ alias: "qiyama", surahNum: 75 },
	{ alias: "dahar", surahNum: 76 },
	{ alias: "insan", surahNum: 76 },
	{ alias: "mursalat", surahNum: 77 },
	{ alias: "naba", surahNum: 78 },
	{ alias: "naziat", surahNum: 79 },
	{ alias: "naziaat", surahNum: 79 },
	{ alias: "abas", surahNum: 80 },
	{ alias: "takweer", surahNum: 81 },
	{ alias: "infitar", surahNum: 82 },
	{ alias: "mutaffifeen", surahNum: 83 },
	{ alias: "inshiqaq", surahNum: 84 },
	{ alias: "burooj", surahNum: 85 },
	{ alias: "tariq", surahNum: 86 },
	{ alias: "aala", surahNum: 87 },
	{ alias: "ghashiya", surahNum: 88 },
	{ alias: "fajar", surahNum: 89 },
	{ alias: "fajr", surahNum: 89 },
	{ alias: "balad", surahNum: 90 },
	{ alias: "shams", surahNum: 91 },
	{ alias: "lail", surahNum: 92 },
	{ alias: "zuha", surahNum: 93 },
	{ alias: "insharah", surahNum: 94 },
	{ alias: "teen", surahNum: 95 },
	{ alias: "alaq", surahNum: 96 },
	{ alias: "qadr", surahNum: 97 },
	{ alias: "qadar", surahNum: 97 },
	{ alias: "bayyina", surahNum: 98 },
	{ alias: "zilzal", surahNum: 99 },
	{ alias: "aadiyat", surahNum: 100 },
	{ alias: "qaria", surahNum: 101 },
	{ alias: "takasur", surahNum: 102 },
	{ alias: "takathur", surahNum: 102 },
	{ alias: "asar", surahNum: 103 },
	{ alias: "asr", surahNum: 103 },
	{ alias: "humaza", surahNum: 104 },
	{ alias: "feel", surahNum: 105 },
	{ alias: "fil", surahNum: 105 },
	{ alias: "quraish", surahNum: 106 },
	{ alias: "maoon", surahNum: 107 },
	{ alias: "kousar", surahNum: 108 },
	{ alias: "kauthar", surahNum: 109 },
	{ alias: "kafiroon", surahNum: 109 },
	{ alias: "nasr", surahNum: 110 },
	{ alias: "masad", surahNum: 111 },
	{ alias: "ikhlas", surahNum: 112 },
	{ alias: "falaq", surahNum: 113 },
	{ alias: "naas", surahNum: 114 },
];

function classifyEdition(item: LectureItem): "2026" | "2025" | "2024" | "2023" {
	if (item.batchYear === 2026) return "2026";
	if (item.batchYear === 2025) return "2025";
	if (item.batchYear === 2024) return "2024";
	if (item.batchYear === 2023) return "2023";

	const s = item.seriesTitle || "";
	const t = item.title;
	if (s.includes("2026") || s === "Tarjuma Quran in Ramazan 2026") return "2026";
	if (s.includes("2025") || s === "Ramazan 2025") return "2025";
	if (s.includes("2024") || s === "Live Ramazan 2024") return "2024";
	if (s.includes("2023") || s === "Dora Tarjuma Quran 2023") return "2023";
	if (t.includes("Ramzan 26") || t.includes("2026")) return "2026";
	if (t.includes("2025") || t.includes("Ramzan 25")) return "2025";
	if (t.includes("2024") || t.includes("Ramzan 24")) return "2024";
	return "2023";
}

function calculateSortKey(title: string): number {
	const t = title.trim();
	if (/^(?:hse\s+)?istiqbal|^(?:ramazan\s*&\s*dora)|^(?:tarjuma\s*e\s*quran)/i.test(t)) return 0;
	if (/^last/i.test(t)) return 999;

	const m = t.match(/^(\d+)(?:([a-zA-Z])|(?:\*+)|(?:\s*&\s*(\d+)))?/);
	if (m) {
		const mainNum = parseInt(m[1], 10);
		let sub = 0;
		if (m[2]) sub = (m[2].toLowerCase().charCodeAt(0) - 96) * 0.1;
		if (t.includes("**")) sub = 0.05;
		return mainNum + sub;
	}
	return 500;
}

function extractSessionCode(title: string): string {
	const t = title.trim();
	if (/^(?:hse\s+)?istiqbal/i.test(t)) return "Prologue";
	if (/^ramazan\s*&\s*dora/i.test(t)) return "Prologue";
	if (/^last/i.test(t)) return "Closing";
	if (/^love\s*&\s*respect/i.test(t)) return "Special";

	const m = t.match(/^(\d+(?:[a-zA-Z]|&\d+)?)/);
	if (m) {
		const code = m[1];
		if (/^\d+$/.test(code) && parseInt(code, 10) < 10) {
			return `0${code}`;
		}
		return code;
	}
	return "•";
}

function extractCleanSurahAndRange(title: string): {
	cleanTitle: string;
	urduTitle: string;
	rangeLabel?: string;
	juzList: number[];
	quranContext?: QuranContext;
} {
	let t = title.trim();
	// Remove trailing meta suffixes
	t = t.replace(/\s*\|\s*(?:Ramzan\s*\d*|Dora\s*Tarjuma\s*(?:e\s*)?Quran(?:\s*\d*)?)[^|]*$/i, "");
	t = t.replace(/\s*#\s*(?:Dora\s*(?:Tarjuma\s*)?Quran|Ramzan)(?:\s*\d*)?[^#]*$/i, "");
	// Remove leading session number
	t = t.replace(/^(?:\d+(?:[a-zA-Z]|&\d+)?|[a-zA-Z]+)[.\-*\s☆]+/, "").trim();

	// Check special cases
	if (/istiqbal/i.test(title)) {
		return {
			cleanTitle: "Welcoming Ramadan",
			urduTitle: "استقبالِ رمضان المبارک",
			rangeLabel: "Opening Discourse",
			juzList: [1],
		};
	}
	if (/ramazan\s*&\s*dora/i.test(title)) {
		return {
			cleanTitle: "Ramadan & Quranic (Khutbah)",
			urduTitle: "فہمِ قرآن اور رمضان",
			rangeLabel: "Introductory Khutbah",
			juzList: [1],
		};
	}
	if (/love\s*&\s*respect/i.test(title)) {
		return {
			cleanTitle: "Marital Harmony: Love & Mutual Respect in Quranic Ethics",
			urduTitle: "قرآنی اخلاقیات: ازدواجی زندگی میں الفت اور احترام",
			rangeLabel: "Special Excursus",
			juzList: [4, 21],
		};
	}

	// Detect covered surahs with diacritic and punctuation normalization
	const cleanForMatch = t
		.normalize("NFD")
		.replace(/[\u0300-\u036f]/g, "")
		.replace(/["'’`]/g, "")
		.toLowerCase();

	const matchedSurahNums = new Set<number>();

	for (const { alias, surahNum } of SURAH_ALIASES) {
		const escaped = alias.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
		const rx = new RegExp(`(?:^|[\\s\\-_/,&.:;!?])${escaped}(?:$|[\\s\\-_/,&.:;!?0-9])`, "i");
		if (rx.test(cleanForMatch)) {
			matchedSurahNums.add(surahNum);
		}
	}

	const surahs = Array.from(matchedSurahNums)
		.sort((a, b) => a - b)
		.map((num) => QURAN_SURAHS.find((s) => s.number === num)!)
		.filter(Boolean);

	// Extract ruku / ayah ranges if present (e.g. R10-16/A71-128 or 27 to 82 or 1-39)
	let rangeLabel: string | undefined;
	const rukuAyahMatch = t.match(/R\s*(\d+(?:-\d+)?)\s*(?:\/|\s+)?A\s*(\d+(?:-\d+)?)/i);
	if (rukuAyahMatch) {
		rangeLabel = `Ruku ${rukuAyahMatch[1]} · Ayah ${rukuAyahMatch[2]}`;
	} else {
		const ayahMatch = t.match(/(?:A|Ayah|Ayat|\b)\s*(\d+)\s*(?:to|-)\s*(\d+)/i);
		if (ayahMatch) {
			rangeLabel = `Ayah ${ayahMatch[1]}–${ayahMatch[2]}`;
		}
	}

	// Format English & Urdu titles
	let cleanTitle = t;
	let urduTitle = "";
	const juzSet = new Set<number>();

	if (surahs.length > 0) {
		surahs.forEach((s) => s.juz.forEach((j) => juzSet.add(j)));

		if (surahs.length === 1) {
			const s = surahs[0];
			cleanTitle = `Surah ${s.name}${rangeLabel ? ` (${rangeLabel})` : ""}`;
			urduTitle = s.urdu;
		} else if (surahs.length === 2) {
			const s1 = surahs[0];
			const s2 = surahs[1];
			cleanTitle = `Surah ${s1.name} to ${s2.name}${rangeLabel ? ` (${rangeLabel})` : ""}`;
			urduTitle = `${s1.urdu} تا ${s2.urdu}`;
		} else {
			const sFirst = surahs[0];
			const sLast = surahs[surahs.length - 1];
			cleanTitle = `Surah ${sFirst.name} to ${sLast.name} (${surahs.length} Surahs)`;
			urduTitle = `${sFirst.urdu} تا ${sLast.urdu}`;
		}
	} else {
		// Clean the string directly if no Surah matched
		cleanTitle = t
			.replace(/^sora\s+/i, "Surah ")
			.replace(/^sorat\s+/i, "Surah ");
	}

	// Default Juz 1 if none found
	const juzList = juzSet.size > 0 ? Array.from(juzSet).sort((a, b) => a - b) : [1];

	let quranContext: QuranContext | undefined;
	if (surahs.length > 0) {
		const sFirst = surahs[0];
		const sLast = surahs[surahs.length - 1];
		quranContext = {
			surahNumber: sFirst.number,
			surahNameEnglish: sFirst.name,
			surahNameUrdu: sFirst.urdu,
			juzNumber: sFirst.juz[0],
		};
		if (surahs.length > 1) {
			quranContext.surahEndNumber = sLast.number;
			quranContext.surahNameEnglish = `${sFirst.name} to ${sLast.name}`;
			quranContext.surahNameUrdu = `${sFirst.urdu} تا ${sLast.urdu}`;
			quranContext.juzEndNumber = sLast.juz[sLast.juz.length - 1];
		}
	}

	return {
		cleanTitle,
		urduTitle,
		rangeLabel,
		juzList,
		quranContext,
	};
}

export function parseAllTarjumaLectures(): ParsedTarjumaSession[] {
	const all = TAFSIR_LECTURES_RAW;
	// Filter out coursework with 0 duration (broken placeholder/livestream records)
	const coursework = all.filter((item) => item.isCoursework && item.durationSeconds > 0);

	return coursework.map((item) => {
		const edition = classifyEdition(item);
		const sessionCode = extractSessionCode(item.title);
		const sortOrder = calculateSortKey(item.title);
		const { cleanTitle, urduTitle, rangeLabel, juzList, quranContext } = extractCleanSurahAndRange(item.title);

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
			urduTitle: urduTitle || item.urduTitle || "",
			rangeLabel,
			durationSeconds: item.durationSeconds,
			durationFormatted,
			publishedAt: item.publishedAt,
			juzList,
			edition,
			rawTitle: item.title,
			thumbnailUrl: item.thumbnailUrl,
			summary: item.summary,
			quranContext: item.quranContext || quranContext,
		};
	});
}

export function getTarjumaEditions(): TarjumaEditionMeta[] {
	const allSessions = parseAllTarjumaLectures();

	const editionsData: {
		id: "2026" | "2025" | "2024" | "2023";
		year: number;
		label: string;
		badge: string;
		description: string;
	}[] = [
		{
			id: "2026",
			year: 2026,
			label: "2026 (Latest Edition)",
			badge: "Complete 64-Part Cycle",
			description:
				"The most recent, comprehensive Ramadan exegesis recorded in high-fidelity studio audio, covering the Quran from Al-Fatiha to An-Nas.",
		},
		{
			id: "2025",
			year: 2025,
			label: "2025 Edition",
			badge: "67 Intensive Sessions",
			description:
				"The previous year's systematic traversal focusing heavily on theological reflections and contemporary societal parallels.",
		},
		{
			id: "2024",
			year: 2024,
			label: "2024 Edition",
			badge: "78 Live Sessions",
			description:
				"Daily Ramadan lectures structured into three thematic sittings per day (a, b, c), examining character building and governance.",
		},
		{
			id: "2023",
			year: 2023,
			label: "2023 Edition",
			badge: "116 Master Sessions",
			description:
				"The most granular verse-by-verse breakdown available, systematically exploring every Ruku and linguistic inflection.",
		},
	];

	return editionsData.map((meta) => {
		const sessions = allSessions
			.filter((s) => s.edition === meta.id)
			.sort((a, b) => a.sortOrder - b.sortOrder);

		return {
			...meta,
			sessionCount: sessions.length,
			sessions,
		};
	});
}

export interface QuranSurahWithSessions extends QuranSurahMeta {
	sessionCount: number;
	sessions: ParsedTarjumaSession[];
}

export function getSurahByNumber(num: number): QuranSurahMeta | undefined {
	return QURAN_SURAHS.find((s) => s.number === num);
}

export function getAllSurahsWithSessions(): QuranSurahWithSessions[] {
	const allSessions = parseAllTarjumaLectures();
	return QURAN_SURAHS.map((surah) => {
		const matching = allSessions.filter((s) => {
			if (s.quranContext) {
				if (s.quranContext.surahEndNumber) {
					return surah.number >= s.quranContext.surahNumber && surah.number <= s.quranContext.surahEndNumber;
				}
				return s.quranContext.surahNumber === surah.number;
			}
			return false;
		});

		return {
			...surah,
			sessionCount: matching.length,
			sessions: matching,
		};
	});
}

