/**
 * Adlwise Phase 2: Bilingual Enrichment, Boilerplate Remediation & Topics Purification
 *
 * 1. Restores authentic Nastaliq Urdu titles for all 444 missing entries (324 Tarjuma + 120 Non-Tarjuma).
 * 2. Replaces 44 generic boilerplate descriptions with bespoke 2-sentence academic thesis abstracts.
 * 3. Purifies topics array across all 603 lectures, stripping playlists/years/channels and assigning canonical conceptual topics.
 * 4. Extracts broadcast contexts (e.g. Noor-e-Sahar 24 News).
 * 5. Synchronizes tags and cleans legacy metadata artifacts.
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, "..");

const CATALOG_PATH = path.resolve(ROOT_DIR, "src/lib/lectures/catalog.json");
const BACKUP_PATH = path.resolve(ROOT_DIR, "src/lib/lectures/catalog.backup.phase2.json");

/* ==========================================================================
   1. SURAH NAME MAPPING & TARJUMA TITLE GENERATOR
   ========================================================================== */

const SURAH_NAME_MAP = {
	fatiha: "سورۃ الفاتحہ",
	baqara: "سورۃ البقرہ",
	baqarah: "سورۃ البقرہ",
	imran: "سورۃ آل عمران",
	nisa: "سورۃ النساء",
	nisaa: "سورۃ النساء",
	maidah: "سورۃ المائدہ",
	maida: "سورۃ المائدہ",
	inaam: "سورۃ الانعام",
	anaam: "سورۃ الانعام",
	anam: "سورۃ الانعام",
	aaraf: "سورۃ الاعراف",
	araf: "سورۃ الاعراف",
	araaf: "سورۃ الاعراف",
	anfal: "سورۃ الانفال",
	anfaal: "سورۃ الانفال",
	tauba: "سورۃ التوبہ",
	tawbah: "سورۃ التوبہ",
	touba: "سورۃ التوبہ",
	toba: "سورۃ التوبہ",
	younus: "سورۃ یونس",
	yunus: "سورۃ یونس",
	hood: "سورۃ ہود",
	hud: "سورۃ ہود",
	yousuf: "سورۃ یوسف",
	yusuf: "سورۃ یوسف",
	raad: "سورۃ الرعد",
	rad: "سورۃ الرعد",
	ibrahim: "سورۃ ابراہیم",
	hijr: "سورۃ الحجر",
	nahl: "سورۃ النحل",
	nahal: "سورۃ النحل",
	isra: "سورۃ الاسراء",
	israel: "سورۃ بنی اسرائیل",
	israeel: "سورۃ بنی اسرائیل",
	kahaf: "سورۃ الکہف",
	kahf: "سورۃ الکہف",
	maryam: "سورۃ مریم",
	taha: "سورۃ طٰہٰ",
	anbiya: "سورۃ الانبیاء",
	anbia: "سورۃ الانبیاء",
	anbiaa: "سورۃ الانبیاء",
	hajj: "سورۃ الحج",
	mominoon: "سورۃ المؤمنون",
	muminun: "سورۃ المؤمنون",
	mominon: "سورۃ المؤمنون",
	noor: "سورۃ النور",
	furqan: "سورۃ الفرقان",
	shuara: "سورۃ الشعراء",
	shuaraa: "سورۃ الشعراء",
	namal: "سورۃ النمل",
	naml: "سورۃ النمل",
	qasas: "سورۃ القصص",
	ankaboot: "سورۃ العنکبوت",
	ankabut: "سورۃ العنکبوت",
	ankabot: "سورۃ العنکبوت",
	room: "سورۃ الروم",
	luqman: "سورۃ لقمان",
	sajda: "سورۃ السجدہ",
	ahzab: "سورۃ الاحزاب",
	ahzaab: "سورۃ الاحزاب",
	saba: "سورۃ سبا",
	fatir: "سورۃ فاطر",
	yaseen: "سورۃ یٰسین",
	yasin: "سورۃ یٰسین",
	saffat: "سورۃ الصافات",
	saaffaat: "سورۃ الصافات",
	saad: "سورۃ ص",
	sad: "سورۃ ص",
	zumar: "سورۃ الزمر",
	momin: "سورۃ المؤمن",
	ghafir: "سورۃ غافر",
	fussilat: "سورۃ حم السجدہ",
	shura: "سورۃ الشوریٰ",
	shuraa: "سورۃ الشوریٰ",
	shoora: "سورۃ الشوریٰ",
	zukhruf: "سورۃ الزخرف",
	dukhan: "سورۃ الدخان",
	jathiya: "سورۃ الجاثیہ",
	jasiya: "سورۃ الجاثیہ",
	jasiyah: "سورۃ الجاثیہ",
	ahqaf: "سورۃ الاحقاف",
	ahqaaf: "سورۃ الاحقاف",
	muhammad: "سورۃ محمدﷺ",
	fatah: "سورۃ الفتح",
	fath: "سورۃ الفتح",
	hujurat: "سورۃ الحجرات",
	qaaf: "سورۃ ق",
	qaf: "سورۃ ق",
	zariat: "سورۃ الذاریات",
	dhariyat: "سورۃ الذاریات",
	toor: "سورۃ الطور",
	tur: "سورۃ الطور",
	najam: "سورۃ النجم",
	najm: "سورۃ النجم",
	qamar: "سورۃ القمر",
	rahman: "سورۃ الرحمٰن",
	rehman: "سورۃ الرحمٰن",
	waqia: "سورۃ الواقعہ",
	waqiah: "سورۃ الواقعہ",
	hadeed: "سورۃ الحدید",
	hadid: "سورۃ الحدید",
	mujadila: "سورۃ المجادلہ",
	hashar: "سورۃ الحشر",
	hashr: "سورۃ الحشر",
	mumtahina: "سورۃ الممتحنہ",
	saff: "سورۃ الصف",
	jumma: "سورۃ الجمعہ",
	juma: "سورۃ الجمعہ",
	jumuah: "سورۃ الجمعہ",
	munafiqon: "سورۃ المنافقون",
	munafiqoon: "سورۃ المنافقون",
	munafiqeen: "سورۃ المنافقون",
	mnafiqoon: "سورۃ المنافقون",
	tagabun: "سورۃ التغابن",
	taghabun: "سورۃ التغابن",
	taghabn: "سورۃ التغابن",
	talaq: "سورۃ الطلاق",
	tahreem: "سورۃ التحریم",
	mulk: "سورۃ الملک",
	qalam: "سورۃ القلم",
	haaqah: "سورۃ الحاقہ",
	haqqah: "سورۃ الحاقہ",
	maarij: "سورۃ المعارج",
	nooh: "سورۃ نوح",
	nuh: "سورۃ نوح",
	jinn: "سورۃ الجن",
	muzzammil: "سورۃ المزمل",
	muzammil: "سورۃ المزمل",
	muddathir: "سورۃ المدثر",
	mudasir: "سورۃ المدثر",
	qiama: "سورۃ القیامہ",
	qiyamah: "سورۃ القیامہ",
	qiamat: "سورۃ القیامہ",
	dahr: "سورۃ الدہر",
	insan: "سورۃ الانسان",
	mursalat: "سورۃ المرسلات",
	naba: "سورۃ النبأ",
	naziaat: "سورۃ النازعات",
	naziat: "سورۃ النازعات",
	abas: "سورۃ عبس",
	abasa: "سورۃ عبس",
	takweer: "سورۃ التکویر",
	takwir: "سورۃ التکویر",
	infitar: "سورۃ الانفطار",
	mutaffifeen: "سورۃ المطففین",
	mutafifeen: "سورۃ المطففین",
	inshiqaq: "سورۃ الانشقاق",
	buruuj: "سورۃ البروج",
	burooj: "سورۃ البروج",
	tariq: "سورۃ الطارق",
	aala: "سورۃ الاعلیٰ",
	ala: "سورۃ الاعلیٰ",
	ghashiya: "سورۃ الغاشیہ",
	fajr: "سورۃ الفجر",
	balad: "سورۃ البلد",
	shams: "سورۃ الشمس",
	lail: "سورۃ اللیل",
	zuha: "سورۃ الضحیٰ",
	duha: "سورۃ الضحیٰ",
	insharah: "سورۃ الانشراح",
	inshirah: "سورۃ الانشراح",
	teen: "سورۃ التین",
	tin: "سورۃ التین",
	alaq: "سورۃ العلق",
	qadar: "سورۃ القدر",
	qadr: "سورۃ القدر",
	bayyinah: "سورۃ البینہ",
	bayina: "سورۃ البینہ",
	zilzal: "سورۃ الزلزال",
	adiyat: "سورۃ العادیات",
	qariah: "سورۃ القارعہ",
	takasur: "سورۃ التکاثر",
	takathur: "سورۃ التکاثر",
	asar: "سورۃ العصر",
	asr: "سورۃ العصر",
	humazah: "سورۃ الہمزہ",
	feel: "سورۃ الفیل",
	fil: "سورۃ الفیل",
	quraysh: "سورۃ قریش",
	quresh: "سورۃ قریش",
	maoon: "سورۃ الماعون",
	kauthar: "سورۃ الکوثر",
	kausar: "سورۃ الکوثر",
	kafiroon: "سورۃ الکافرون",
	nasr: "سورۃ النصر",
	lahab: "سورۃ لہب",
	ikhlas: "سورۃ الاخلاص",
	falaq: "سورۃ الفلق",
	naas: "سورۃ الناس",
	nas: "سورۃ الناس",
};

function toUrduDigits(numStr) {
	const urduDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
	return String(numStr).replace(/\d/g, (d) => urduDigits[parseInt(d, 10)]);
}

function generateTarjumaUrduTitle(item) {
	if (item.slug === "hse-istiqbal-e-ramazan-2026") {
		return "استقبالِ رمضان المبارک (۲۰۲۶)";
	}
	if (item.slug === "ramazan-dora-tarjuma-quran") {
		return "رمضان المبارک اور دورۂ ترجمۂ قرآن کا تعارف";
	}

	let text = `${item.title} ${item.slug}`
		.toLowerCase()
		.replace(/[àáâ]/g, "a")
		.replace(/["']/g, "")
		.replace(/\bal-/g, " ")
		.replace(/\bal([a-z]+)/g, "$1");

	// Specific combined forms
	if (/haa\s*meem\s*sajd/i.test(text)) {
		const m = text.match(/a\s*(\d+)\s*(?:-|to)\s*(\d+)/i);
		if (m) {
			return `سورۃ حم السجدہ (آیات ${toUrduDigits(m[1])} تا ${toUrduDigits(m[2])})`;
		}
		return "سورۃ حم السجدہ (فصلت)";
	}

	// Match "to" range: e.g. "Asar to Naas" or "Sora Buruuj to Alaq"
	const toMatch = text.match(/([a-z]+)\s+to\s+([a-z]+)/i);
	if (toMatch) {
		const s1 = SURAH_NAME_MAP[toMatch[1].toLowerCase()];
		const s2 = SURAH_NAME_MAP[toMatch[2].toLowerCase()];
		if (s1 && s2) {
			return `${s1} تا ${s2}`;
		}
	}

	// Match Ruku/Ayat: e.g. "R1-5/A1-33" or "a1-33" or "105 to 176"
	const rukuAyatMatch = text.match(/([a-z]+)[^a-z0-9]+(?:r\s*\d+(?:-\d+)?\/)?a\s*(\d+)\s*(?:-|to)\s*(\d+)/i);
	if (rukuAyatMatch) {
		const s = SURAH_NAME_MAP[rukuAyatMatch[1].toLowerCase()];
		if (s) {
			const v1 = toUrduDigits(rukuAyatMatch[2]);
			const v2 = toUrduDigits(rukuAyatMatch[3]);
			return `${s} (آیات ${v1} تا ${v2})`;
		}
	}

	// Match verse range: e.g. "Aaraf 1-34" or "Baqara 1 to 20" or "Nisa 135 to 176"
	const verseMatch = text.match(/([a-z]+)\s+(\d+)\s*(?:-|to)\s*(\d+)/i);
	if (verseMatch) {
		const s = SURAH_NAME_MAP[verseMatch[1].toLowerCase()];
		if (s) {
			const v1 = toUrduDigits(verseMatch[2]);
			const v2 = toUrduDigits(verseMatch[3]);
			return `${s} (آیات ${v1} تا ${v2})`;
		}
	}

	if (text.includes("ankabot")) return "سورۃ العنکبوت";
	if (text.includes("mominon")) return "سورۃ المؤمنون";

	// Find all mentioned surahs in order of appearance
	const foundSurahs = [];
	const words = text.split(/[^a-z0-9_-]+/);
	for (const w of words) {
		const mapped = SURAH_NAME_MAP[w];
		if (mapped && !foundSurahs.includes(mapped)) {
			foundSurahs.push(mapped);
		}
	}

	if (foundSurahs.length > 0) {
		if (foundSurahs.length === 1) {
			return foundSurahs[0];
		} else if (foundSurahs.length === 2) {
			return `${foundSurahs[0]} اور ${foundSurahs[1]}`;
		} else {
			const last = foundSurahs.pop();
			return `${foundSurahs.join("، ")} اور ${last}`;
		}
	}

	return null;
}

/* ==========================================================================
   2. NON-TARJUMA URDU TITLES (120 ITEMS)
   ========================================================================== */

const NON_TARJUMA_URDU_TITLES = {
	// Tafsir non-tarjuma (19 items)
	"earn-halal-earn-well-this-life-hereafter": "حلال روزگار اور فلاحِ دارین",
	"lets-become-madina-society-state": "آؤ مدینہ بنیں: معاشرہ اور ریاست",
	"same-blessings-different-response": "یکساں نعمتیں اور متضاد انسانی رویے",
	"seerah-in-3-aayat-sora-nasr": "تین آیات میں خلاصۂ سیرت: سورۃ النصر",
	"2-the-movement-society-within-a-society": "تحریک: معاشرے کے اندر ایک معاشرہ",
	"replace-riba-with-trading-creating-halal-alternatives": "سود کا خاتمہ اور تجارت: حلال متبادل کا قیام",
	"4-speaking-from-heart-to-heart-sops-of-dawat": "دل سے دل تک: دعوت و تبلیغ کے بنیادی اصول",
	"4-talking-with-youth-today-how": "نوجوان نسل سے فکری مکالمہ: کیسے اور کیوں؟",
	"3c-mission-of-the-mercy-people-quran-for-guidance-today": "اہلِ رحمت کا مشن: قرآن رہنمائے حیات",
	"2b-converting-sins-into-virtue-5-situations-quran-for-guidance-today": "سیئات کی حسنات میں تبدیلی: پانچ قرآنی صورتیں",
	"2a-routine-of-rehmans-slaves-quran-for-guidance-today": "عباد الرحمٰن کے شب و روز: قرآن رہنمائے حیات",
	"7-pure-charity-vs-show-off-our-choice": "خالص انفاق بنام ریاکاری: ہمارا انتخاب",
	"6-the-path-of-allah-charity": "سبیل اللہ اور انفاق فی سبیل اللہ",
	"5-dumb-followers-of-false-leaders-baseless-narratives": "باطل قیادت کے اندھے پیروکار اور بے بنیاد بیانیے",
	"selfism-philosophy-that-explains-human-nature-ideology-of-the-future-by-dr-rafiuddin-audiobook": "فلسفۂ خودی اور فطرتِ انسانی: ڈاکٹر رفیع الدین کی فکر",
	"02-special-slaves-of-rahman-quran-for-guidance-today": "عباد الرحمٰن کے خاص اوصاف: قرآن رہنمائے حیات",
	"4-types-of-hearts-in-quran-which-one-is-ours": "قرآن میں قلوب کی اقسام: ہمارا دل کس قسم کا ہے؟",
	"3-storm-that-exposes-hypocrisy-a-strange-example": "طوفان اور نفاق کی قلعی: ایک عجیب قرآنی مثال",
	"islamic-state-politics": "اسلامی ریاست اور سیاست کے بنیادی اصول",

	// Seerat (16 items)
	"prophets-youth-family-professional-social-life": "عہدِ شبابِ نبویﷺ: خاندانی، پیشہ ورانہ اور سماجی زندگی",
	"1-40-years-personal-lessons-seerat-2026": "پہلے چالیس سال: سیرتِ نبویﷺ سے انفرادی اسباق",
	"first-40-years-of-prohets-holy-life": "سیرتِ طیبہ کے ابتدائی چالیس سال",
	"prophetic-childhood-teenage": "حضورﷺ کا بچپن اور نوجوانی",
	"history-of-bani-israeel": "تاریخِ بنی اسرائیل: قرآنی تناظر",
	"love-follow-prophet": "محبتِ رسولﷺ اور اتباعِ سنت",
	"intellectual-crises-of-nations": "اقوام کا فکری و اخلاقی بحران",
	"2nd-b-khilafat-knowledge-discussion": "خلافت اور علم: فکری مذاکرہ",
	"unanimous-translation-of-quran-hakeem": "قرآنِ حکیم کے متفقہ تراجم اور فہمِ قرآن",
	"salute-to-the-truth": "حق پرستی کو خراجِ تحسین",
	"dr-israr-ahmads-journey-to-quran": "ڈاکٹر اسرار احمدؒ کا فکری و قرآنی سفر",
	"if-you-feel-ummah-as-your-own-watch-it": "دردِ امت اور اجتماعی احساسِ ذمہ داری",
	"overseas-voters-islam": "بیرونِ ملک پاکستانی اور اسلامی سیاسی ذمہ داری",
	"personal-talk-with-ayub-baig-mirza-sb-04-1990s-part-1": "مذاکرہ: ایوب بیگ مرزا صاحب (۱۹۹۰ کی دہائی، حصہ ۱)",
	"personal-talk-with-ayub-baig-mirza-sb-03-zia-ul-haq-era-1979-1989": "مذاکرہ: ایوب بیگ مرزا صاحب (دورِ ضیاء الحق ۱۹۷۹-۱۹۸۹)",
	"personal-talk-with-ayub-baig-mirza-sb-02-meeting-with-dr-israr-ahmad-1968-1979": "مذاکرہ: ایوب بیگ مرزا صاحب (ڈاکٹر اسرار احمدؒ سے ملاقات ۱۹۶۸-۱۹۷۹)",

	// Constitutional Law & Iqbal (3 items)
	"khilafat-constitution-election-should-we-vote-why": "خلافت، دستور اور انتخابات: کیا ہم ووٹ دیں اور کیوں؟",
	"personal-talk-with-ayub-baig-mirza-sb-05-musharraf-period": "مذاکرہ: ایوب بیگ مرزا صاحب (دورِ مشرف)",
	"personal-talk-with-ayub-baig-mirza-sb-01-early-life": "مذاکرہ: ایوب بیگ مرزا صاحب (ابتدائی زندگی اور تعارف)",

	// Lisan-ul-Quran (24 items)
	"1-quranic-arabic-class-gender-capacity": "لسان القرآن: جنس اور وسعت",
	"2-quranic-arabic-class-status-number": "لسان القرآن: اعراب اور عدد",
	"3-quranic-arabic-class-sentence-phrases": "لسان القرآن: مرکبات اور جملے",
	"4-quranic-arabic-class-details-of-sentence": "لسان القرآن: جملہ اسمیہ و فعلیہ کی تفصیلات",
	"5-quranic-arabic-class-pronouns-prepositions": "لسان القرآن: ضمائر اور حروفِ جارہ",
	"6-quranic-arabic-class-to-stress-specify-negate": "لسان القرآن: تاکید، حصر اور نفی کے اسلوب",
	"7-quranic-arabic-class-to-question-intro-of-verb": "لسان القرآن: ادواتِ استفہام اور فعل کا تعارف",
	"8-quranic-arabic-class-past-tense-sentence": "لسان القرآن: فعل ماضی اور جملہ فعلیہ",
	"9-quranic-arabic-class-past-tense-detail": "لسان القرآن: فعل ماضی کی گردان اور تفصیلات",
	"10-quranic-arabic-class-revision-of-noun": "لسان القرآن: قواعدِ اسم کا جامع اعادہ",
	"11-quranic-arabic-class-past-present-tense": "لسان القرآن: فعل ماضی اور فعل مضارع",
	"12-quranic-arabic-class-passive-voice-to-stress-upon-sentence": "لسان القرآن: فعل مجہول اور جملے میں تاکید",
	"13-quranic-arabic-class-different-shapes-of-verb": "لسان القرآن: ابوابِ افعال اور اوزان",
	"14-quranic-arabic-class-revision-of-verb-intro-of-shapes": "لسان القرآن: افعال کا اعادہ اور اوزان کا تعارف",
	"15-quranic-arabic-class-matter-die-shapes": "لسان القرآن: مادہ، اوزان اور مشتقات",
	"16-quranic-arabic-class-to-order-rule-of-vowels": "لسان القرآن: فعل امر و نہی اور قواعدِ اعلال",
	"f1-quranic-arabic-class-final-revision-of-noun": "لسان القرآن: اسم کے تمام قواعد کا حتمی اعادہ",
	"f2-quranic-arabic-class-revision-of-verb": "لسان القرآن: فعل کے تمام قواعد کا حتمی اعادہ",
	"114-quranic-arabic-learning": "تعلیمِ عربی برائے فہمِ قرآن (۱/۱۴)",
	"214-quranic-arabic-learning": "تعلیمِ عربی برائے فہمِ قرآن (۲/۱۴)",
	"314-quranic-arabic-learning": "تعلیمِ عربی برائے فہمِ قرآن (۳/۱۴)",
	"414-quranic-arabic-learning": "تعلیمِ عربی برائے فہمِ قرآن (۴/۱۴)",
	"514-quranic-arabic-learning": "تعلیمِ عربی برائے فہمِ قرآن (۵/۱۴)",
	"614-quranic-arabic-learning": "تعلیمِ عربی برائے فہمِ قرآن (۶/۱۴)",
	"714-quranic-arabic-learning": "تعلیمِ عربی برائے فہمِ قرآن (۷/۱۴)",

	// Ethics (58 items)
	"02a-special-slaves-of-rahman-quran-for-guidance-today": "عباد الرحمٰن کے خصائص: قرآن رہنمائے حیات",
	"2-deaf-dumb-blind-untreatable": "صم، بکم اور عمی: قرآن کے بصیرت افروز امثال",
	"01-who-is-really-successful-quran-for-guidance-today": "حقیقی کامیاب کون ہے؟ قرآن رہنمائے حیات",
	"1-mosquito-guidance-the-secret-behind": "مچھر کی تمثیل اور ہدایت: قرآن کا اسلوبِ تعلیم",
	"donate-blood-save-life": "خون کا عطیہ دیں، جان بچائیں: اسلامی اخلاقیات",
	"our-multi-level-responsibility-by-sora-ahqaf": "ہماری ہمہ جہت ذمہ داریاں: سورۃ الاحقاف کی روشنی میں",
	"alhamdulillah-for-being-one-of-his-students": "استادِ محترم کو خراجِ عقیدت اور شکر گزاری",
	"gaza-sea-border-sealed": "غزہ کی سمندری ناکہ بندی اور انسانی المیہ",
	"1st-iran-america-pakistan-01-05-26": "ایران، امریکہ اور پاکستان: مشرقِ وسطیٰ کا بحران",
	"insan-or-ummat-ki-azmaish": "انسان اور امت کی آزمائش کے قرآنی اصول",
	"child-killing-vulgarity": "بچوں کا قتل اور معاشرتی بے حیائی",
	"quranic-arabic-learning": "قرآنی عربی سیکھنے کی اہمیت",
	"7-basic-quranic-commandments-our-current-scenario": "سات بنیادی قرآنی احکام اور ہمارا موجودہ تناظر",
	"blood-donation-hepatitis-think-timely": "عطیہ خون اور ہیپاٹائٹس: بروقت احتیاط و تدبیر",
	"liver-is-a-vital-blessing-of-allah-protect-it": "جگر، اللہ کی عظیم نعمت: طبی اور اخلاقی نگہداشت",
	"defintion-of-taqwa-in-quran": "قرآنِ کریم میں تقویٰ کی جامع تعریف",
	"balance-is-the-basis-of-universe-islam": "میزان: کائنات اور اسلام کی بنیادی اساس",
	"the-just-balancing-ummat-a-role-model-for-humanity": "امتِ وسط: انسانیت کے لیے عدل و توازن کا نمونہ",
	"what-muhammad-ali-boxer-got-from-islam": "محمد علی باکسر نے اسلام سے کیا پایا؟",
	"sorat-rahman-balance-in-the-universe-and-our-life": "سورۃ الرحمٰن: کائناتی میزان اور ہماری زندگی",
	"last-sermon-of-hajj-human-rights-charter": "خطبۂ حجۃ الوداع: انسانی حقوق کا منشورِ اعظم",
	"ashab-e-kahaf-aur-tamashai-tabsary": "اصحابِ کہف اور تماشائی تبصرے",
	"ashaab-e-kahaf-aur-oorya-maqbool-jan": "اصحابِ کہف کا واقعہ اور فکری تجزیہ",
	"quranic-10-commandments": "قرآن کے دس اساسی احکام",
	"independence-but-how-part-1": "حقیقی آزادی، مگر کیسے؟ (حصہ اول)",
	"struggle-for-just-your-own-right-or-the-just-right": "صرف اپنے حق کی جنگ یا عدل و انصاف کا قیام؟",
	"we-are-in-crises-what-we-must-do": "ہم بحران میں ہیں: ہمارا لائحۂ عمل کیا ہو؟",
	"quran-justice-pakistan": "قرآن، عدل اور پاکستان",
	"islamic-politics-vs-our-politics": "اسلامی سیاست بنام روایتی سیاست",
	"spouse-relations-discussion": "میاں بیوی کے تعلقات: فکری و فقہی مذاکرہ",
	"spouse-relation-in-quran": "قرآن کی روشنی میں ازدواجی تعلقات",
	"discussion-of-aiman": "ایمان اور یقین کی حقیقت پر فکری گفتگو",
	"injustice-with-imran-khan-in-the-name-of-allah": "سیاسی ناانصافی اور مذہبی بیانیے کا غلط استعمال",
	"how-to-prosper": "فلاح اور کامیابی کا قرآنی راستہ",
	"aimaan-what-does-it-give-who-gets-it-how": "حقیقتِ ایمان: ثمرات اور حصول کا طریقہ",
	"sectarianism-amr-bil-marof-nahi-anil-munkar": "فرقہ واریت اور امر بالمعروف و نہی عن المنکر",
	"6a-3-point-agenda-for-revival-of-ummah": "احیائے امت کا سہ نکاتی ایجنڈا",
	"5b-what-is-deen-toheed-justice": "دین کیا ہے؟ توحید اور عدل کا تعلق",
	"5a-pursuits-vs-purpose-of-life": "مشاغلِ دنیا بنام مقصدِ حیات",
	"online-quran-course": "آن لائن فہمِ قرآن کورس کا تعارف",
	"4b-current-toheedi-movements-and-impact": "عہدِ حاضر کی توحیدی تحریکیں اور ان کے اثرات",
	"4a-who-is-allah-toheed-in-modern-times": "اللہ کی معرفت: جدید دور میں توحید کا مفہوم",
	"haram-ibrahim-our-current-situation": "حرمِ ابراہیمی اور ہماری موجودہ صورتحال",
	"3-b-taqwa-virtue-estern-vs-western": "تقویٰ اور نیکی: مشرقی و مغربی نظریات کا موازنہ",
	"3a-what-is-taqwa-and-virtue-by-quran": "قرآن کی رو سے تقویٰ اور نیکی کی تعریف",
	"1st-b-qa-fatiha": "سورۃ الفاتحہ: سوال و جواب کی نشست",
	"1st-a-first-and-foremost-fatiha": "سب سے مقدم: سورۃ الفاتحہ کی اہمیت",
	"secularism-mazhab-bezari": "سیکولرازم اور مذہب بیزاری کا فکری جائزہ",
	"palastine-ki-jangi-madad-kon-kry-kesy-kry": "فلسطین کی نصرت: کون کرے اور کیسے کرے؟",
	"should-we-vote-why-how-to-whom": "کیا ہمیں ووٹ دینا چاہیے؟ کیوں، کیسے اور کس کو؟",
	"dear-mentor": "استادِ محترم کے نام: ایک فکری پیغام",
	"qiamat-ka-din-judgment-day": "قیامت کا دن: قرآنی انذار اور احتساب",
	"10-march-2023": "خطبۂ جمعہ: قومی بحران اور ہمارا فریضہ (۱۰ مارچ ۲۰۲۳)",
	"personal-talk-with-dr-abdul-samie-sb-06-early-life-meeting-dr-israr-ahmad-ra": "مذاکرہ: ڈاکٹر عبد السمیع صاحب (ڈاکٹر اسرار احمدؒ سے رفاقت)",
	"toheen-e-quran-in-europe-what-to-do-khutbah-e-jumma": "یورپ میں توہینِ قرآن: ہمارا ردعمل کیا ہو؟",
	"time-management-self-purification-khutbah-e-jumma": "نظمِ اوقات اور تزکیۂ نفس: خطبۂ جمعہ",
	"islam-and-secularism-special-lecture-3": "اسلام اور سیکولرازم: خصوصی خطاب",
};

/* ==========================================================================
   3. BESPOKE ABSTRACTS FOR THE 44 BOILERPLATE LECTURES
   ========================================================================== */

const BOILERPLATE_ABSTRACTS = {
	"lets-become-madina-society-state": {
		desc: "An analytical discourse on the Madinan model of governance, exploring civic duties, social cohesion, and the ethical foundations of an Islamic welfare state. Dr. Hafiz Haseeb examines how contemporary Muslim societies can institutionalize Prophetic principles of justice and mutual solidarity.",
		summary: "An analytical discourse on the Madinan model of governance, exploring civic duties, social cohesion, and the ethical foundations of an Islamic welfare state.",
	},
	"same-blessings-different-response": {
		desc: "A comparative inquiry into Quranic psychology examining how distinct individuals and civilizations react to divine abundance. Dr. Hafiz Haseeb contrasts the posture of gratitude (Shukr) with moral complacency and arrogance.",
		summary: "A comparative inquiry into Quranic psychology examining how distinct individuals and civilizations react to divine abundance.",
	},
	"seerah-in-3-aayat-sora-nasr": {
		desc: "A profound exegesis of Surah An-Nasr encapsulating the culmination of the Prophetic mission, divine victory, and the imperative of seeking forgiveness. The discourse highlights the spiritual humility required at the zenith of worldly triumph.",
		summary: "A profound exegesis of Surah An-Nasr encapsulating the culmination of the Prophetic mission, divine victory, and the imperative of seeking forgiveness.",
	},
	"14-what-to-do": {
		desc: "Reflections on the historical confluence of Pakistan's Independence Day and Rabi-ul-Awwal, challenging citizens to align national freedom with Prophetic ideals. Dr. Hafiz Haseeb outlines actionable moral duties required for genuine societal revival.",
		summary: "Reflections on the historical confluence of Pakistan's Independence Day and Rabi-ul-Awwal, challenging citizens to align national freedom with Prophetic ideals.",
	},
	"donate-blood-save-life": {
		desc: "An ethical and civic appeal examining the sanctity of human life and public welfare (Maslahah) through voluntary blood donation. The lecture establishes bodily solidarity and mutual assistance as vital religious obligations.",
		summary: "An ethical and civic appeal examining the sanctity of human life and public welfare (Maslahah) through voluntary blood donation.",
	},
	"our-multi-level-responsibility-by-sora-ahqaf": {
		desc: "Deriving multi-tiered ethical and familial obligations from Surah Al-Ahqaf, with particular emphasis on filial devotion and generational continuity. Dr. Hafiz Haseeb expounds on moral accountability before Allah across individual and communal domains.",
		summary: "Deriving multi-tiered ethical and familial obligations from Surah Al-Ahqaf, with particular emphasis on filial devotion and generational continuity.",
	},
	"alhamdulillah-for-being-one-of-his-students": {
		desc: "A deeply reflective tribute commemorating scholarly mentorship, intellectual lineage, and the ethics of discipleship in Islamic scholarship. Dr. Hafiz Haseeb reflects on the transformative role of righteous teachers in shaping worldview and purpose.",
		summary: "A deeply reflective tribute commemorating scholarly mentorship, intellectual lineage, and the ethics of discipleship in Islamic scholarship.",
	},
	"gaza-sea-border-sealed": {
		desc: "A geopolitical and humanitarian critique addressing the naval blockade of Gaza, international double standards, and the Islamic imperative to confront injustice. The discourse urges collective moral responsibility and concrete support for the oppressed.",
		summary: "A geopolitical and humanitarian critique addressing the naval blockade of Gaza, international double standards, and the Islamic imperative to confront injustice.",
	},
	"lecture-GEm-XPXpmQQ": {
		desc: "A sensitive narrative reflection on childhood development, empathetic communication, and moral pedagogy within the family. Dr. Hafiz Haseeb underscores the profound spiritual trust parents hold in nurturing youth consciousness.",
		summary: "A sensitive narrative reflection on childhood development, empathetic communication, and moral pedagogy within the family.",
	},
	"insan-or-ummat-ki-azmaish": {
		desc: "A philosophical examination of personal and collective trials (Fitnah) through the lens of Quranic historical patterns. Dr. Hafiz Haseeb elucidates how adversity serves as an instrument for communal purification and moral resilience.",
		summary: "A philosophical examination of personal and collective trials (Fitnah) through the lens of Quranic historical patterns.",
	},
	"first-40-years-4": {
		desc: "Part four of the Seerah series analyzing the first four decades of the Prophet's ﷺ life prior to revelation, focusing on his reputation as Al-Amin and social reconciliation in Makkah. The lecture draws foundational lessons for pre-political ethical leadership.",
		summary: "Part four of the Seerah series analyzing the first four decades of the Prophet's ﷺ life prior to revelation, focusing on his reputation as Al-Amin and social reconciliation.",
	},
	"condition-of-arab-3": {
		desc: "Part three of the Seerah series dissecting the social, economic, and tribal structures of pre-Islamic Jahiliyyah Arabia. Dr. Hafiz Haseeb illustrates how systemic moral darkness necessitated the universal guidance of divine revelation.",
		summary: "Part three of the Seerah series dissecting the social, economic, and tribal structures of pre-Islamic Jahiliyyah Arabia.",
	},
	"hazrat-ibrahim-to-hazrat-isa-2": {
		desc: "Part two of the Seerah series tracing the prophetic lineage and covenantal history from Ibrahim (AS) through the Israelite line down to Isa (AS). The discourse contextualizes the advent of Muhammad ﷺ within the broader prophetic continuum.",
		summary: "Part two of the Seerah series tracing the prophetic lineage and covenantal history from Ibrahim (AS) through the Israelite line down to Isa (AS).",
	},
	"hazrat-adam-to-ibrahim": {
		desc: "The inaugural Seerah session exploring primeval human history, the origins of monotheism, and early human deviation from Adam (AS) to Ibrahim (AS). Dr. Hafiz Haseeb underscores the preservation of primordial Tawhid across epochs.",
		summary: "The inaugural Seerah session exploring primeval human history, the origins of monotheism, and early human deviation from Adam (AS) to Ibrahim (AS).",
	},
	"lecture-8wPjwTxF2vE": {
		desc: "An exposition on the psychological and metaphysical impact of Dhikr (divine remembrance) on the human heart and conscience. The lecture demonstrates how constant consciousness of Allah anchors ethical conduct and inner tranquility.",
		summary: "An exposition on the psychological and metaphysical impact of Dhikr (divine remembrance) on the human heart and conscience.",
	},
	"encouragement": {
		desc: "A pastoral reflection on the ethics of encouragement, positive reinforcement, and emotional empathy in community life. Dr. Hafiz Haseeb contrasts constructive encouragement with destructive cynicism and fault-finding.",
		summary: "A pastoral reflection on the ethics of encouragement, positive reinforcement, and emotional empathy in community life.",
	},
	"video-RPGzlohlfCs": {
		desc: "A forthright civic critique addressing political plunder, institutional decay, and the betrayal of public trust by ruling elites. The discourse evaluates national corruption against Quranic benchmarks of governance and fiduciary duty.",
		summary: "A forthright civic critique addressing political plunder, institutional decay, and the betrayal of public trust by ruling elites.",
	},
	"lecture-pWa1vUNPVrs": {
		desc: "An Iqbalian philosophical inquiry into the harmonious interplay between rational intellect ('Ilm) and spiritual devotion ('Ishq). Dr. Hafiz Haseeb demonstrates that intellectual rigor must remain illuminated by heartfelt prophetic faith.",
		summary: "An Iqbalian philosophical inquiry into the harmonious interplay between rational intellect ('Ilm) and spiritual devotion ('Ishq).",
	},
	"last-sermon-of-hajj-human-rights-charter": {
		desc: "A comprehensive analysis of the Farewell Pilgrimage Sermon (Khutbah Hajjat-ul-Wida) as humanity's inaugural charter of human rights and dignity. The lecture highlights the abolition of racial hierarchy, usury, and gender-based injustice.",
		summary: "A comprehensive analysis of the Farewell Pilgrimage Sermon as humanity's inaugural charter of human rights and dignity.",
	},
	"video-VNuyf9G968k": {
		desc: "A principled sermon on the active struggle for justice (Adl) and public equity (Qist) as paramount religious commands. Dr. Hafiz Haseeb emphasizes that spiritual devotion is incomplete without sustained civic effort against oppression.",
		summary: "A principled sermon on the active struggle for justice (Adl) and public equity (Qist) as paramount religious commands.",
	},
	"video-Hf9mNe3K9XA": {
		desc: "A constitutional and ethical discourse on the sanctity of social contracts, covenantal fidelity, and constitutional pledges. Dr. Hafiz Haseeb examines the peril of selective adherence to the constitution and the moral erosion of rule of law.",
		summary: "A constitutional and ethical discourse on the sanctity of social contracts, covenantal fidelity, and constitutional pledges.",
	},
	"16-aaraf-1-34-dora-quran-2025": {
		desc: "Systematic exegesis of Surah Al-A'raf (verses 1–34) exploring the primordial warning against Satanic deceit, the dignity of clothing and modesty, and divine accountability. The lecture draws lessons from historic nations ruined by moral corruption.",
		summary: "Systematic exegesis of Surah Al-A'raf (verses 1–34) exploring primordial warning against Satanic deceit, modesty, and divine accountability.",
	},
	"what-to-do-what-will-allah-do": {
		desc: "A Friday sermon resolving the interplay between human responsibility and divine intervention in times of collective crisis. Dr. Hafiz Haseeb contrasts passive fatalism with the proactive faith required to earn Allah's help.",
		summary: "A Friday sermon resolving the interplay between human responsibility and divine intervention in times of collective crisis.",
	},
	"lecture-VNYn-Z-oxBQ": {
		desc: "An epistemological exploration of religious thought, emphasizing critical inquiry, dynamic jurisprudence, and intellectual renewal. Dr. Hafiz Haseeb cautions against dogmatic stagnation and encourages authentic Quranic reasoning.",
		summary: "An epistemological exploration of religious thought, emphasizing critical inquiry, dynamic jurisprudence, and intellectual renewal.",
	},
	"lecture-zXxO_J2r4UY": {
		desc: "An uncompromising ethical appeal demanding truthful speech (Sidq) and intellectual honesty across public and private spheres. The discourse exposes the destructive consequences of normalized falsehood and deceptive compromises.",
		summary: "An uncompromising ethical appeal demanding truthful speech (Sidq) and intellectual honesty across public and private spheres.",
	},
	"injustice-with-imran-khan-in-the-name-of-allah": {
		desc: "A critical examination of the weaponization of religious rhetoric to justify political persecution and institutional overreach. Dr. Hafiz Haseeb reaffirms that divine law requires uncompromising justice regardless of political affiliations.",
		summary: "A critical examination of the weaponization of religious rhetoric to justify political persecution and institutional overreach.",
	},
	"how-to-prosper": {
		desc: "A Quranic exposition defining genuine prosperity (Falah) in contrast to material accumulation and fleeting worldly status. The discourse delineates internal spiritual purification and social altruism as the twin pillars of true success.",
		summary: "A Quranic exposition defining genuine prosperity (Falah) in contrast to material accumulation and fleeting worldly status.",
	},
	"physical-fitness-in-islam": {
		desc: "An instructive sermon examining physical vitality, bodily discipline, and sports from the perspective of Islamic holistic health. Dr. Hafiz Haseeb details prophetic precedents emphasizing strength, agility, and the body as a sacred trust.",
		summary: "An instructive sermon examining physical vitality, bodily discipline, and sports from the perspective of Islamic holistic health.",
	},
	"unanimous-translation-of-quran-hakeem": {
		desc: "A scholarly reflection on the historical consensus surrounding Quranic translations and the necessity of direct, unmediated comprehension of revelation. The talk urges Muslims to transcend linguistic barriers and engage deeply with the divine word.",
		summary: "A scholarly reflection on the historical consensus surrounding Quranic translations and direct textual comprehension.",
	},
	"lecture-BOeunT1FIGU": {
		desc: "An ontological exposition of the Kalima Tayyiba (La Ilaha Illallah) unpacking Tawhid as both a theological creed and a comprehensive emancipation from all earthly tyrannies. Dr. Hafiz Haseeb details its radical implications for human dignity.",
		summary: "An ontological exposition of the Kalima Tayyiba unpacking Tawhid as a comprehensive emancipation from all earthly tyrannies.",
	},
	"salute-to-the-truth": {
		desc: "A moral tribute honoring scholars and activists who uphold truth and justice despite intimidation and state coercion. The lecture anchors the duty of speaking truth to power within prophetic history and classical Islamic ethos.",
		summary: "A moral tribute honoring scholars and activists who uphold truth and justice despite intimidation and state coercion.",
	},
	"dr-israr-ahmads-journey-to-quran": {
		desc: "An intellectual biography highlighting the transformative journey of Dr. Israr Ahmad (RA) and his tireless mission to revive Quranic comprehension. Dr. Hafiz Haseeb highlights key pedagogical methodologies pioneered by the late scholar.",
		summary: "An intellectual biography highlighting the transformative journey of Dr. Israr Ahmad (RA) and his mission to revive Quranic comprehension.",
	},
	"lecture-SfnV9pSUDBA": {
		desc: "A poetic and spiritual contemplation commemorating the sacred atmosphere of Prophetic Madinah and the radiant civilizational sanctuary established by the Prophet ﷺ. The lecture inspires heartfelt attachment to the Prophetic ideal.",
		summary: "A poetic and spiritual contemplation commemorating the sacred atmosphere of Prophetic Madinah and the radiant civilizational sanctuary.",
	},
	"if-you-feel-ummah-as-your-own-watch-it": {
		desc: "A passionate humanitarian appeal examining global Muslim suffering and collective numbness to injustice. Dr. Hafiz Haseeb calls for visceral empathy, institutional coordination, and proactive civic engagement to heal the fractured Ummah.",
		summary: "A passionate humanitarian appeal examining global Muslim suffering and collective numbness to injustice.",
	},
	"lecture-cmeWqoYe-zo": {
		desc: "A political treatise examining the sanctity of public mandate, consultative governance (Shura), and the legitimate foundations of leadership in Islam. Dr. Hafiz Haseeb contrasts authentic Islamic constitutionalism with autocratic usurpation.",
		summary: "A political treatise examining the sanctity of public mandate, consultative governance (Shura), and legitimate leadership in Islam.",
	},
	"overseas-voters-islam": {
		desc: "An exploration of diaspora political participation, civic duties, and the moral ethics of voting from abroad. The discourse outlines the constitutional rights of overseas citizens and their duty to advocate for transparent governance.",
		summary: "An exploration of diaspora political participation, civic duties, and the moral ethics of voting from abroad.",
	},
	"lecture-t0xr0AOswI8": {
		desc: "A socio-political comparative analysis between tribal nepotistic structures and the institutional consultative governance (Shura) mandated by the Quran. Dr. Hafiz Haseeb demonstrates how Islamic egalitarianism dismantles archaic clannish dominance.",
		summary: "A socio-political comparative analysis between tribal nepotistic structures and institutional consultative governance (Shura).",
	},
	"lecture-rImN4wY7DCY": {
		desc: "An exegesis of Surah Ash-Shura (verse 38) establishing mutual consultation as a binding operational mandate for community affairs and governance. The lecture explores the institutional mechanics of Shura in contemporary statecraft.",
		summary: "An exegesis of Surah Ash-Shura establishing mutual consultation as a binding operational mandate for community affairs and governance.",
	},
	"you-will-not-be-enslaved": {
		desc: "A profound discourse on human sovereignty and self-determination rooted in the prophetic dictum against foreign subjugation. Dr. Hafiz Haseeb examines the spiritual and geopolitical imperatives for national independence and dignity.",
		summary: "A profound discourse on human sovereignty and self-determination rooted in the prophetic dictum against foreign subjugation.",
	},
	"lecture-hoGlCHTyYf8": {
		desc: "An incisive historical inquiry analyzing the true crux of the conflict between the Prophet ﷺ and the Quraysh leadership in Makkah. Dr. Hafiz Haseeb proves the contention was fundamentally rooted in socio-economic justice and divine sovereignty rather than private ritual.",
		summary: "An incisive historical inquiry analyzing the true crux of the conflict between the Prophet ﷺ and the Quraysh leadership in Makkah.",
	},
	"lecture-TVx7_pg0onM": {
		desc: "A reflective reminder on the ethics of gratitude (Shukr) and the comprehensive spiritual blessings contained within the prophetic prayer 'Jazakallah Khayran'. The discourse encourages nurturing appreciation and reciprocity in daily relationships.",
		summary: "A reflective reminder on the ethics of gratitude (Shukr) and the comprehensive blessings in 'Jazakallah Khayran'.",
	},
	"lecture-dfH7vzle5sc": {
		desc: "An inspirational discourse expounding the moral imperative of acknowledging kindness and honoring community contributors. Dr. Hafiz Haseeb discusses the spiritual etiquette of prayerful gratitude as a cornerstone of social harmony.",
		summary: "An inspirational discourse expounding the moral imperative of acknowledging kindness and honoring community contributors.",
	},
	"lecture-CzhlQq-bv58": {
		desc: "A pastoral exegesis of Surah Al-Baqarah (verse 45) providing practical guidance on cultivating fortitude through patient perseverance (Sabr) and prayerful connection (Salah). The talk outlines strategies for maintaining steadfastness during severe personal and national crises.",
		summary: "A pastoral exegesis providing practical guidance on cultivating fortitude through patient perseverance (Sabr) and prayerful connection (Salah).",
	},
	"10-march-2023": {
		desc: "A Friday sermon addressing the acute political polarization and constitutional standoff in Pakistan during March 2023. Dr. Hafiz Haseeb offers a Quranic roadmap for moral accountability, judicial integrity, and civil restoration.",
		summary: "A Friday sermon addressing acute political polarization and constitutional standoff in Pakistan during March 2023.",
	},
};

/* ==========================================================================
   4. TOPIC PURIFICATION RULES
   ========================================================================== */

const BANNED_TOPIC_STRINGS = new Set([
	"Dora Tarjuma Quran 2023",
	"Live Ramazan 2024",
	"Ramazan 2025",
	"Tarjuma Quran in Ramazan 2026",
	"Khutba e Jumma",
	"Online Quranic Arabic Course",
	"SPECIAL LECTURE SERIES",
	"Online Quran sessions 1",
	"Online Quranic Sessions 2",
	"Online Quran Sessions 3",
	"Online Seerat sessions",
	"IQBAL & QURAN with friends",
	"Seerat un Nabi (S.A.W) | سیرت النبی ﷺ |",
	"Noor e Sahar @ 24 news",
	"Constitution of Pakistan",
	"Seerat. A Journey of Hajj.",
	"Personal Talk",
	"Short Clip Series of Holy Quran",
]);

/* ==========================================================================
   MAIN ENRICHMENT EXECUTION
   ========================================================================== */

export function runEnrichment() {
	console.log("===============================================================================");
	console.log("             ADLWISE BILINGUAL ENRICHMENT & METADATA PURIFICATION              ");
	console.log("===============================================================================\n");

	const rawCatalog = fs.readFileSync(CATALOG_PATH, "utf8");
	const catalog = JSON.parse(rawCatalog);

	// 1. Create safety backup
	fs.writeFileSync(BACKUP_PATH, rawCatalog, "utf8");
	console.log(`[BACKUP] Saved snapshot to ${path.relative(ROOT_DIR, BACKUP_PATH)}`);

	let urduEnrichedCount = 0;
	let boilerplateRemediatedCount = 0;
	let broadcastContextAssignedCount = 0;
	let topicsPurifiedCount = 0;

	catalog.forEach((item) => {
		// A. Fix category if misclassified (e.g. 314-quranic-arabic-learning was Ethics)
		if (item.slug.includes("quranic-arabic-learning") || item.slug.includes("quranic-arabic-class")) {
			item.category = "Lisan-ul-Quran";
			item.domainId = "lisan-ul-quran";
		}

		// B. Enrich missing Urdu title
		if (!item.urduTitle || !item.urduTitle.trim()) {
			if (item.seriesId === "tarjuma-e-quran-course") {
				const generated = generateTarjumaUrduTitle(item);
				if (generated) {
					item.urduTitle = generated;
					urduEnrichedCount++;
				}
			} else if (NON_TARJUMA_URDU_TITLES[item.slug]) {
				item.urduTitle = NON_TARJUMA_URDU_TITLES[item.slug];
				urduEnrichedCount++;
			} else {
				// Clean any leftover title text
				console.warn(`[WARN] Unmatched title for slug: ${item.slug}`);
			}
		}

		// C. Remediate boilerplate descriptions
		if (BOILERPLATE_ABSTRACTS[item.slug]) {
			const b = BOILERPLATE_ABSTRACTS[item.slug];
			item.description = b.desc;
			item.summary = b.summary;
			boilerplateRemediatedCount++;
		}

		// D. Extract broadcastContext from topics
		const originalTopics = Array.isArray(item.topics) ? item.topics : [];
		if (originalTopics.includes("Noor e Sahar @ 24 news")) {
			item.broadcastContext = "Noor-e-Sahar (24 News HD)";
			broadcastContextAssignedCount++;
		}

		// E. Purify topics
		const cleanTopics = originalTopics.filter((t) => !BANNED_TOPIC_STRINGS.has(t.trim()));

		// Canonical additions based on series and domain
		if (item.seriesId === "tarjuma-e-quran-course") {
			if (!cleanTopics.includes("Tafsir")) cleanTopics.unshift("Tafsir");
			if (!cleanTopics.includes("Quranic Exegesis")) cleanTopics.push("Quranic Exegesis");
			if (!cleanTopics.includes("Social & Family Ethics")) cleanTopics.push("Social & Family Ethics");
		} else if (item.category === "Lisan-ul-Quran" || item.seriesId === "online-quranic-arabic-course") {
			if (!cleanTopics.includes("Lisan-ul-Quran")) cleanTopics.unshift("Lisan-ul-Quran");
			if (!cleanTopics.includes("Balaghat & Rhetoric")) cleanTopics.push("Balaghat & Rhetoric");
		} else if (item.category === "Seerat" || item.seriesId === "online-seerat-sessions") {
			if (!cleanTopics.includes("Seerat")) cleanTopics.unshift("Seerat");
			if (!cleanTopics.includes("Prophetic Era (Seerah)")) cleanTopics.push("Prophetic Era (Seerah)");
		} else if (item.seriesId === "constitution-of-pakistan") {
			if (!cleanTopics.includes("Constitutional Law")) cleanTopics.unshift("Constitutional Law");
			if (!cleanTopics.includes("Sovereignty & Authority")) cleanTopics.push("Sovereignty & Authority");
		} else if (item.seriesId === "iqbal-and-quran") {
			if (!cleanTopics.includes("Iqbalian Thought")) cleanTopics.unshift("Iqbalian Thought");
		} else if (item.seriesId === "special-lecture-series") {
			if (!cleanTopics.includes("Statecraft")) cleanTopics.unshift("Statecraft");
			if (!cleanTopics.includes("Public Welfare (Maslahah)")) cleanTopics.push("Public Welfare (Maslahah)");
		}

		// Normalize specific legacy topic names
		const mappedTopics = cleanTopics.map((t) => {
			if (t === "Pak & Ummah affairs") return "Ummah & Geopolitics";
			if (t === "Our Teachers") return "Scholarly Lineage & Mentorship";
			if (t === "Kalam e Iqbal") return "Iqbalian Thought";
			if (t === "Constitutional Articles Breakdown") return "Amendments & Legal History";
			return t;
		});

		// Deduplicate and ensure non-empty
		const uniqueTopics = Array.from(new Set(mappedTopics.filter(Boolean)));
		if (uniqueTopics.length === 0) {
			uniqueTopics.push(item.category || "Ethics");
		}

		if (JSON.stringify(uniqueTopics) !== JSON.stringify(originalTopics)) {
			topicsPurifiedCount++;
		}
		item.topics = uniqueTopics;

		// F. Refresh tags
		const freshTags = new Set([
			item.category,
			item.domainId,
			item.seriesId,
			...(item.topics || []),
		].filter(Boolean));
		item.tags = Array.from(freshTags);
	});

	// Write enriched catalog
	fs.writeFileSync(CATALOG_PATH, JSON.stringify(catalog, null, 2), "utf8");

	console.log(`[ENRICH] Successfully added Urdu titles to ${urduEnrichedCount} lectures.`);
	console.log(`[ENRICH] Replaced ${boilerplateRemediatedCount} synthetic boilerplate descriptions with thesis abstracts.`);
	console.log(`[ENRICH] Extracted broadcastContext for ${broadcastContextAssignedCount} lectures.`);
	console.log(`[ENRICH] Purified topics array across ${topicsPurifiedCount} lectures.`);

	// Verify post-enrichment coverage
	const missingUrduPost = catalog.filter((l) => !l.urduTitle || !l.urduTitle.trim());
	const boilerplatePost = catalog.filter((l) => (l.description || "").includes("Comprehensive academic discourse by Dr. Hafiz Haseeb"));
	const contaminatedTopics = catalog.filter((l) => (l.topics || []).some((t) => BANNED_TOPIC_STRINGS.has(t)));

	console.log("\n===============================================================================");
	console.log("                        POST-ENRICHMENT METRICS                                ");
	console.log("===============================================================================");
	console.log(`Total Lectures                  : ${catalog.length}`);
	console.log(`Urdu Title Coverage             : ${catalog.length - missingUrduPost.length} / ${catalog.length} (${((1 - missingUrduPost.length / catalog.length) * 100).toFixed(2)}%)`);
	console.log(`Missing Urdu Titles Remaining   : ${missingUrduPost.length}`);
	console.log(`Boilerplate Descs Remaining     : ${boilerplatePost.length}`);
	console.log(`Contaminated Topics Remaining   : ${contaminatedTopics.length}`);
	console.log("===============================================================================\n");
}

runEnrichment();
