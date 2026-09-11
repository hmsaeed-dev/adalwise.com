import { MainCategory, Series, Topic } from "./types";

export const CATEGORIES: MainCategory[] = [
	"Tafsir",
	"Seerat",
	"Socio-Political",
	"Constitutional Law",
	"Ethics",
	"Statecraft",
];

export const SERIES_LIST: Series[] = [
	{
		id: "surah-al-anam-Tafsir",
		slug: "surah-al-anam-Tafsir",
		title: "Surah al-An'am — Divine Justice and Ontological Order",
		urduTitle: "تفسیر سورۃ الانعام: عدلِ الہی اور نظامِ کائنات",
		description:
			"A comprehensive, verse-by-verse Tafsir exploring the metaphysical grounding of divine justice, creation, and ethical responsibility.",
		category: "Tafsir",
		totalEpisodes: 32,
	},
	{
		id: "charter-of-medina-discourse",
		slug: "charter-of-medina-discourse",
		title: "The Charter of Medina — Constitutionalism and Pluralism",
		urduTitle: "میثاقِ مدینہ: دستوری نظام اور تکثیری سماج",
		description:
			"Juristic deconstruction of the world's earliest written constitutional charter and its principles of civic covenantalism.",
		category: "Constitutional Law",
		totalEpisodes: 18,
	},
	{
		id: "usul-al-fiqh-foundations",
		slug: "usul-al-fiqh-foundations",
		title: "Foundations of Legal Methodology",
		urduTitle: "اصولِ فقہ: استنباطِ احکام کے بنیادی قواعد",
		description:
			"Classical methodologies of textual hermeneutics, legal cause extraction ('Ilal), and universal maqasid.",
		category: "Tafsir",
		totalEpisodes: 24,
	},
	{
		id: "statecraft-and-necessity",
		slug: "statecraft-and-necessity",
		title: "Sovereignty, Debt, and Juridical Necessity",
		urduTitle: "ریاست، قرض اور شرعی ضرورت",
		description:
			"Contemporary constitutional and political economy questions examined under the doctrine of public welfare (Maslahah Mursalah).",
		category: "Statecraft",
		totalEpisodes: 12,
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
