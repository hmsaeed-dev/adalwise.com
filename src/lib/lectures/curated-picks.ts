export interface CuratedPick {
	id: string;
	youtubeId: string;
	slug: string;
	title: string;
	urduTitle?: string;
	domainId: string;
	domainTitle: string;
	durationFormatted: string;
	durationSeconds: number;
	thesisBlurb: string;
	isLead?: boolean;
}

export const CURATED_START_HERE_PICKS: CuratedPick[] = [
	{
		id: "yt-WjfKFOwED5o",
		youtubeId: "WjfKFOwED5o",
		slug: "constitution-of-pakistan-unanimous-pact-ep-02",
		title: "Constitution of Pakistan",
		urduTitle: "آئینِ پاکستان (1973)",
		domainId: "constitutional-law",
		domainTitle: "Constitutional Law",
		durationFormatted: "28:15",
		durationSeconds: 1695,
		thesisBlurb:
			"A juristic breakdown of the 1973 Constitution as a social compact, examining parliamentary sovereignty, fundamental rights, and the ethical mandate of constitutional fidelity.",
		isLead: true,
	},
	{
		id: "yt-y9YYHdIqqWU",
		youtubeId: "y9YYHdIqqWU",
		slug: "1-40-years-personal-lessons-seerat-2026",
		title: "Pre-Prophetic Forty Years",
		urduTitle: "قبلِ نبوت کے چالیس سال",
		domainId: "seerah",
		domainTitle: "Seerah as Statecraft",
		durationFormatted: "46:12",
		durationSeconds: 2772,
		thesisBlurb:
			"Examining the moral and social foundation of the Prophet (SAW) prior to revelation—how commercial honesty (Al-Amin) and civic pacts (Hilf al-Fudul) prepared the ground for Islamic statehood.",
	},
	{
		id: "yt-O0KEVvQHyFY",
		youtubeId: "O0KEVvQHyFY",
		slug: "ijtehaad-zarb-e-kaleem-kalaam-e-iqbal",
		title: "Allama Iqbal on Ijtihad",
		urduTitle: "اجتہاد اور تشکیلِ جدید",
		domainId: "iqbal",
		domainTitle: "Iqbalian Thought",
		durationFormatted: "57:40",
		durationSeconds: 3460,
		thesisBlurb:
			"An in-depth analysis of Iqbal’s critique of fossilized legalism, the principle of movement in Islamic jurisprudence, and the reconstruction of modern institutional authority.",
	},
	{
		id: "yt-fVFArB5Z1IU",
		youtubeId: "fVFArB5Z1IU",
		slug: "quranic-economic-principles-7",
		title: "Legal & Economic System of Islam",
		urduTitle: "اسلام کا قانونی معاشی نظام",
		domainId: "constitutional-law",
		domainTitle: "Statecraft & Economics",
		durationFormatted: "34:20",
		durationSeconds: 2060,
		thesisBlurb:
			"Deconstructing monetary justice, circulation of wealth, prohibition of usury, and public welfare under classical Islamic jurisprudence.",
	},
	{
		id: "yt-6CkIa6xfZR4",
		youtubeId: "6CkIa6xfZR4",
		slug: "26c-family-life-of-momin-and-extreme-behaviours-taghabun-talaq-tahreem",
		title: "Civic & Family Jurisprudence: Surah At-Taghabun & At-Talaq",
		urduTitle: "خاندانی نظام اور معاشرتی اعتدال: تغابن اور طلاق کا فہم",
		domainId: "civic-ethics",
		domainTitle: "Civic Ethics",
		durationFormatted: "63:15",
		durationSeconds: 3795,
		thesisBlurb:
			"Balancing rights and duties in domestic statehood—how the Quran regulates marital dissolution, custody, financial maintenance, and social dignity.",
	},
	{
		id: "yt-DGPYfCUCXw8",
		youtubeId: "DGPYfCUCXw8",
		slug: "quranic-arabic-learning",
		title: "Lisan-ul-Quran",
		urduTitle: "لسان القرآن: عربی گرامر",
		domainId: "lisan-ul-quran",
		domainTitle: "Lisan-ul-Quran",
		durationFormatted: "87:00",
		durationSeconds: 5220,
		thesisBlurb:
			"Foundational methodology for learning classical Arabic syntax and morphology, liberating students from dependence on third-party translations.",
	},
	{
		id: "yt-ja6QWecVtYc",
		youtubeId: "ja6QWecVtYc",
		slug: "alhamdulillah-for-being-one-of-his-students",
		title: "Our Teachers: The Modern Quran-Centric Revival Tradition",
		urduTitle: "اساتذہ کی یاد: ڈاکٹر اسرار احمدؒ اور فہمِ قرآن کی تحریک",
		domainId: "civic-ethics",
		domainTitle: "Intellectual Lineage",
		durationFormatted: "18:45",
		durationSeconds: 1125,
		thesisBlurb:
			"Dr. Haseeb reflects on his years of direct discipleship under Dr. Israr Ahmed (رحمہ اللہ), the methodology of systemic thought, and preserving scholarly humility.",
	},
	{
		id: "yt-mVWbLcjlRag",
		youtubeId: "mVWbLcjlRag",
		slug: "donate-blood-save-life",
		title: "Noor-e-Sahar (24 News HD): Clinical Medicine & Social Ethics",
		urduTitle: "نورِ سحر: طبی اخلاقیات اور انسانی جان کی حرمت",
		domainId: "civic-ethics",
		domainTitle: "Broadcasts",
		durationFormatted: "26:30",
		durationSeconds: 1590,
		thesisBlurb:
			"From Dr. Haseeb’s televised series, examining how the medical sanctity of human life mirrors the constitutional protections of the Shariah.",
	},
	{
		id: "yt-6VgTxXYdlnM",
		youtubeId: "6VgTxXYdlnM",
		slug: "2-the-movement-society-within-a-society",
		title: "The Quranic Movement: Building a Moral Society within Society",
		urduTitle: "قرآنی تحریک: معاشرے کے اندر فکری تنظیم",
		domainId: "tafsir",
		domainTitle: "Tafsir Foundations",
		durationFormatted: "42:10",
		durationSeconds: 2530,
		thesisBlurb:
			"How prophetic communities organized intellectual circles, mutual solidarity (Tawasi), and civic resilience in hostile sociopolitical climates.",
	},
	{
		id: "yt-pDfLWACswqY",
		youtubeId: "pDfLWACswqY",
		slug: "1-fatiha-to-baqara-27-ramzan-26",
		title: "Surah Al-Fatiha to Al-Baqarah: The Hermeneutical Key",
		urduTitle: "سورۃ الفاتحہ تا بقرہ: قرآنی دستور کا دیباچہ",
		domainId: "tafsir",
		domainTitle: "Course Teaser",
		durationFormatted: "76:20",
		durationSeconds: 4580,
		thesisBlurb:
			"Session 001 of the 324-part Translation Course—establishing the grammatical, thematic, and covenantal foundations of the entire Quranic revelation.",
	},
];
