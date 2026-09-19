export interface Speaker {
	id: string;
	name: string;
	urduName: string;
	title: string;
	urduTitle?: string;
	avatarUrl: string;
	bio?: string;
	urduBio?: string;
}

export const CANONICAL_SPEAKERS: Record<string, Speaker> = {
	"dr-hafiz-haseeb": {
		id: "dr-hafiz-haseeb",
		name: "Dr. Hafiz Haseeb",
		urduName: "ڈاکٹر حافظ حسیب",
		title: "Consultant Hematologist & Quranic Researcher",
		urduTitle: "کنسلٹنٹ ہیماٹولوجسٹ و محققِ قرآن",
		avatarUrl: "/images/haseeb-02.jpg",
		bio: "Consultant Hematologist (FCPS) and researcher in classical Islamic jurisprudence, Quranic hermeneutics, and constitutional statecraft. Student of Dr. Israr Ahmed and founder of Peaceful Quranic Revival Society (PQRS).",
	},
};

export const DEFAULT_SPEAKER_ID = "dr-hafiz-haseeb";

export function getSpeakerById(id?: string): Speaker {
	if (id && CANONICAL_SPEAKERS[id]) {
		return CANONICAL_SPEAKERS[id];
	}
	return CANONICAL_SPEAKERS[DEFAULT_SPEAKER_ID];
}
