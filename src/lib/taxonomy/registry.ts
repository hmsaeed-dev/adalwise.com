import { MainCategory, PrimaryDomain, Series, Topic } from "./types";

export const CATEGORIES: MainCategory[] = [
	"Tafsir",
	"Seerat",
	"Constitutional Law",
	"Iqbalian Thought",
	"Ethics",
	"Statecraft",
	"Socio-Political",
	"Lisan-ul-Quran",
];

export const PRIMARY_DOMAINS: PrimaryDomain[] = [
	{
		id: "tafsir",
		slug: "tafsir",
		title: "Quranic Tafsir",
		urduTitle: "تفسیر و فہمِ قرآن",
		description:
			"Systematic exegesis, thematic surah studies, and epistemological principles of Quranic interpretation.",
		subCategories: [
			{ id: "all", slug: "all", title: "All Tafsir" },
			{ id: "surah-exegesis", slug: "surah-exegesis", title: "Surah-Specific Tafsir" },
			{ id: "theological-principles", slug: "theological-principles", title: "Theological Principles" },
			{ id: "quranic-maxims", slug: "quranic-maxims", title: "Quranic Parables & Maxims" },
		],
	},
	{
		id: "seerah",
		slug: "seerah",
		title: "Seerah",
		urduTitle: "سیرت و نظامِ حکومت",
		description:
			"Prophetic methodology, covenantal statehood, institutional history, and civilizational lessons.",
		subCategories: [
			{ id: "all", slug: "all", title: "All Seerah" },
			{ id: "prophetic-era", slug: "prophetic-era", title: "Makki & Madani Milestones" },
			{ id: "covenant-statecraft", slug: "covenant-statecraft", title: "Charter of Medina & Treaties" },
			{ id: "companions", slug: "companions", title: "Companions & Khilafah" },
		],
	},
	{
		id: "constitutional-law",
		slug: "constitutional-law",
		title: "Law & Statecraft",
		urduTitle: "دستور، قانون اور ریاست",
		description:
			"Constitutional covenants, legal theory (Usul al-Fiqh), sovereignty, and state institutional equity.",
		subCategories: [
			{ id: "all", slug: "all", title: "All Constitutional Law" },
			{ id: "pakistan-constitution", slug: "pakistan-constitution", title: "Constitution of Pakistan (1973)" },
			{ id: "amendments-legal-history", slug: "amendments-legal-history", title: "Amendments & Legal History" },
			{ id: "judiciary-governance", slug: "judiciary-governance", title: "Judiciary & Public Governance" },
		],
	},
	{
		id: "iqbal",
		slug: "iqbal",
		title: "Iqbalian Thought",
		urduTitle: "فکرِ اقبال",
		description:
			"Reconstruction of religious thought, political philosophy, and civilizational revival.",
		subCategories: [
			{ id: "all", slug: "all", title: "All Iqbalian Thought" },
			{ id: "philosophical-concepts", slug: "philosophical-concepts", title: "Khudi, Ijtihad & Modern State" },
			{ id: "zarb-e-kalim", slug: "zarb-e-kalim", title: "Zarb-e-Kalim & Political Will" },
			{ id: "shikwa-jawab", slug: "shikwa-jawab", title: "Shikwa / Jawab-e-Shikwa" },
		],
	},
	{
		id: "civic-ethics",
		slug: "civic-ethics",
		title: "Ethics & Public Philosophy",
		urduTitle: "اخلاقیات اور عمرانیات",
		description:
			"Social cohesion, ethics of disagreement (Adab al-Ikhtilaf), and family jurisprudence.",
		subCategories: [
			{ id: "all", slug: "all", title: "All Civic Ethics" },
			{ id: "social-cohesion", slug: "social-cohesion", title: "Social Ethics & Reform" },
			{ id: "family-ethics", slug: "family-ethics", title: "Family & Civic Jurisprudence" },
			{ id: "tazkiyah", slug: "tazkiyah", title: "Spiritual Ethics (Tazkiyah)" },
		],
	},
	{
		id: "lisan-ul-quran",
		slug: "lisan-ul-quran",
		title: "Lisan-ul-Quran",
		urduTitle: "لسان القرآن",
		description:
			"Quranic Arabic morphology, classical grammar, and direct textual comprehension.",
		subCategories: [
			{ id: "all", slug: "all", title: "All Lisan-ul-Quran" },
			{ id: "arabic-grammar", slug: "arabic-grammar", title: "Arabic Grammar & Morphology" },
			{ id: "vocabulary-syntax", slug: "vocabulary-syntax", title: "Quranic Syntax & Compounds" },
		],
	},
];

export const SERIES_LIST: Series[] = [
	{
		id: "tarjuma-e-quran-course",
		slug: "tarjuma-e-quran",
		title: "Tarjuma-e-Quran",
		urduTitle: "دورۂ ترجمۂ قرآن",
		description:
			"The monumental 324-session verse-by-verse translation and linguistic exegesis of the entire Holy Quran from Surah Al-Fatiha to Surah An-Nas.",
		category: "Tafsir",
		domainId: "tafsir",
		totalEpisodes: 324,
		hasCompanionNotes: true,
	},
	{
		id: "online-quranic-arabic-course",
		slug: "online-quranic-arabic-course",
		title: "Quranic Arabic Course",
		urduTitle: "لسان القرآن: عربی گرامر و فہمِ قرآن",
		description:
			"A 24-session systematic curriculum teaching classical Arabic syntax, morphology, and vocabulary with 17 companion infographic notes.",
		category: "Lisan-ul-Quran",
		domainId: "lisan-ul-quran",
		totalEpisodes: 24,
		hasCompanionNotes: true,
	},
	{
		id: "online-seerat-sessions",
		slug: "online-seerat-sessions",
		title: "Seerat-un-Nabi & Prophetic Statecraft",
		urduTitle: "سیرت النبی ﷺ اور نظامِ مدینہ",
		description:
			"Sustained inquiry into the Makki and Madani eras, covenantal statehood, and constitutional precedents.",
		category: "Seerat",
		domainId: "seerah",
		totalEpisodes: 18,
		hasCompanionNotes: true,
	},
	{
		id: "constitution-of-pakistan",
		slug: "constitution-of-pakistan",
		title: "Constitution of Pakistan & Civic Jurisprudence",
		urduTitle: "آئینِ پاکستان (1973)",
		description:
			"Analytical deconstruction of constitutional articles, amendments, fundamental rights, and judicial review.",
		category: "Constitutional Law",
		domainId: "constitutional-law",
		totalEpisodes: 7,
		hasCompanionNotes: false,
	},
	{
		id: "iqbal-and-quran",
		slug: "iqbal-and-quran",
		title: "Iqbal & the Quranic Worldview",
		urduTitle: "کلامِ اقبال",
		description:
			"Deliberative study of Allama Iqbal's philosophical works including Zarb-e-Kalim, Bang-e-Dra, and the Reconstruction.",
		category: "Iqbalian Thought",
		domainId: "iqbal",
		totalEpisodes: 14,
		hasCompanionNotes: false,
	},
	{
		id: "special-lecture-series",
		slug: "special-lecture-series",
		title: "Special Lecture Series: Statecraft & Third Way Economics",
		urduTitle: "خصوصی خطابات: ریاست، معیشت اور اسلامی نظام",
		description:
			"Keynote discourses examining public debt, capitalism, sovereign justice, and institutional reform with companion treatise PDFs.",
		category: "Statecraft",
		domainId: "constitutional-law",
		totalEpisodes: 24,
		hasCompanionNotes: true,
	},
];

export const TOPICS_LIST: Topic[] = [
	{
		id: "balaghat",
		slug: "balaghat",
		name: "Balaghat & Rhetoric",
		urduName: "بلاغت و فصاحت",
	},
	{
		id: "contractual-equity",
		slug: "contractual-equity",
		name: "Contractual Equity",
		urduName: "عدل فی العقود",
	},
	{
		id: "sovereignty",
		slug: "sovereignty",
		name: "Sovereignty & Authority",
		urduName: "حاکمیت اور اقتدار",
	},
	{
		id: "divine-justice",
		slug: "divine-justice",
		name: "Divine Justice (Adl)",
		urduName: "عدلِ الٰہی",
	},
	{
		id: "ethics-of-dialogue",
		slug: "ethics-of-dialogue",
		name: "Ethics of Disagreement",
		urduName: "آدابِ اختلاف",
	},
	{
		id: "maslahah",
		slug: "maslahah",
		name: "Public Welfare (Maslahah)",
		urduName: "مصلحتِ عامہ",
	},
];
