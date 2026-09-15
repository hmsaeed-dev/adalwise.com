export interface StudyNote {
	id: string;
	title: string;
	urduTitle?: string;
	category: "Lisan-ul-Quran" | "Seerah" | "Statecraft";
	type: "infographic" | "pdf" | "handout";
	filePath: string;
	description: string;
	relatedSeriesId?: string;
}

export const STUDY_NOTES_REGISTRY: StudyNote[] = [
	// Lisan-ul-Quran Grammar Notes
	{
		id: "murakkab-izafi",
		title: "Possessive Compounds (Murakkab-e-Izafi)",
		urduTitle: "مرکبِ اضافی کے بنیادی قواعد",
		category: "Lisan-ul-Quran",
		type: "infographic",
		filePath: "/study-notes/lisan-ul-quran/Murakkab e Izaffi.jpg",
		description: "Rules governing Mudaf and Mudaf Ilayh in Quranic Arabic sentence construction.",
		relatedSeriesId: "online-quranic-arabic-course",
	},
	{
		id: "gardaan-noun",
		title: "Declension & Cases of Nouns (Gardaan)",
		urduTitle: "اسم کی گردان اور اعرابی حالتیں",
		category: "Lisan-ul-Quran",
		type: "infographic",
		filePath: "/study-notes/lisan-ul-quran/Gardaan Noun.jpg",
		description: "Overview of Marfoo', Mansoob, and Majroor states of classical Arabic nouns.",
		relatedSeriesId: "online-quranic-arabic-course",
	},
	{
		id: "noun-adjectives",
		title: "Descriptive Compounds (Murakkab-e-Tauseefi)",
		urduTitle: "مرکبِ توصیفی (موصوف و صفت)",
		category: "Lisan-ul-Quran",
		type: "infographic",
		filePath: "/study-notes/lisan-ul-quran/Noun and Adjectives.jpg",
		description: "Grammatical concordance between Mawsoof and Sifah in Quranic phrasing.",
		relatedSeriesId: "online-quranic-arabic-course",
	},
	{
		id: "demonstrative-pronouns",
		title: "Demonstrative Pronouns (Asmaa al-Isharah)",
		urduTitle: "اسمائے اشارہ (قریب و بعید)",
		category: "Lisan-ul-Quran",
		type: "infographic",
		filePath: "/study-notes/lisan-ul-quran/Demonstrative Pronouns.jpg",
		description: "Singular, dual, and plural demonstratives for near and distant referents.",
		relatedSeriesId: "online-quranic-arabic-course",
	},
	{
		id: "prepositions",
		title: "Prepositions (Huroof al-Jarr)",
		urduTitle: "حروفِ جار اور ان کے اثرات",
		category: "Lisan-ul-Quran",
		type: "infographic",
		filePath: "/study-notes/lisan-ul-quran/Prepositions.jpg",
		description: "Operative particles governing the genitive case in Quranic syntax.",
		relatedSeriesId: "online-quranic-arabic-course",
	},
	{
		id: "types-of-sentences",
		title: "Sentence Types (Nominal & Verbal)",
		urduTitle: "جملہ اسمیہ اور جملہ فعلیہ کی ساخت",
		category: "Lisan-ul-Quran",
		type: "infographic",
		filePath: "/study-notes/lisan-ul-quran/Types of Sentences.jpg",
		description: "Foundations of Jumla Ismiyyah (Mubtada/Khabar) and Jumla Fi'liyyah.",
		relatedSeriesId: "online-quranic-arabic-course",
	},
	{
		id: "question-words",
		title: "Interrogative Particles (Huroof al-Istifham)",
		urduTitle: "حروف و اسمائے استفہام",
		category: "Lisan-ul-Quran",
		type: "infographic",
		filePath: "/study-notes/lisan-ul-quran/Question Words.jpg",
		description: "Classical Quranic questions: Hal, A, Man, Ma, Ayna, Kayfa, and Mata.",
		relatedSeriesId: "online-quranic-arabic-course",
	},
	{
		id: "negative-sentences",
		title: "Negative Particles & Negation",
		urduTitle: "حروفِ نفی اور منفی جملے",
		category: "Lisan-ul-Quran",
		type: "infographic",
		filePath: "/study-notes/lisan-ul-quran/Sentences in Negative.jpg",
		description: "Syntax and rhetorical impact of Ma, La, Lan, and Lam in the Quran.",
		relatedSeriesId: "online-quranic-arabic-course",
	},

	// Seerat Timelines & Chronologies
	{
		id: "makki-period-timeline",
		title: "Makki Era Chronology & Milestones",
		urduTitle: "مکی دورِ نبوت کا ارتقائی نقشہ",
		category: "Seerah",
		type: "infographic",
		filePath: "/study-notes/seerat/makki-period.png",
		description: "Chronological mapping of the Prophet's (SAW) early dawah, persecution, and boycott.",
		relatedSeriesId: "online-seerat-sessions",
	},
	{
		id: "madani-period-timeline",
		title: "Madani Era & Constitutional Statehood",
		urduTitle: "مدنی دور: میثاق، مواخات اور ریاست",
		category: "Seerah",
		type: "infographic",
		filePath: "/study-notes/seerat/madni-period.png",
		description: "Milestones of the Medina covenant, institution-building, and defensive campaigns.",
		relatedSeriesId: "online-seerat-sessions",
	},
	{
		id: "timeline-rasool",
		title: "Prophetic Lifespan Panoramic Timeline",
		urduTitle: "حیاتِ طیبہ کا مجموعی زمانی خاکہ",
		category: "Seerah",
		type: "infographic",
		filePath: "/study-notes/seerat/timeline-rasool.png",
		description: "From the Year of the Elephant to the Farewell Pilgrimage (Hajjat al-Wida).",
		relatedSeriesId: "online-seerat-sessions",
	},
	{
		id: "40-yrs-muhammad",
		title: "The Pre-Prophetic Forty Years",
		urduTitle: "قبلِ نبوت کے چالیس سال: کردار و امانت",
		category: "Seerah",
		type: "infographic",
		filePath: "/study-notes/seerat/40-yrs-muhammad.png",
		description: "The moral and social foundation of the Prophet (SAW) prior to revelation.",
		relatedSeriesId: "online-seerat-sessions",
	},

	// Socio-Political / Economic Treatises
	{
		id: "third-way-economics-urdu",
		title: "Third Way Economics: An Islamic Critique (Urdu)",
		urduTitle: "تیسرا معاشی راستہ: اسلامی معیشت کا اساسی خاکہ",
		category: "Statecraft",
		type: "pdf",
		filePath: "/study-notes/treatises/third-way-economics-article-urdu.pdf",
		description: "Dr. Hafiz Haseeb's published treatise examining capitalism, socialism, and Quranic justice.",
		relatedSeriesId: "special-lecture-series",
	},
	{
		id: "third-way-economics-en",
		title: "Third Way Economics: Constitutional & Juridical Framework",
		urduTitle: "تھرڈ وے اکنامکس: انگریزی مقالہ",
		category: "Statecraft",
		type: "pdf",
		filePath: "/study-notes/treatises/third-way-economics-article.pdf",
		description: "English monograph on public equity, sovereign debt, and Islamic economic jurisprudence.",
		relatedSeriesId: "special-lecture-series",
	},
];
