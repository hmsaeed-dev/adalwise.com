export interface NavItem {
	title: string;
	urduTitle?: string;
	href: string;
	icon?: string;
	isCta?: boolean;
}

export const mainNavItems: NavItem[] = [
	{
		title: "Home",
		urduTitle: "صفحہ اول",
		href: "/",
		icon: "home",
	},
	{
		title: "Quran",
		urduTitle: "دورۂ قرآن",
		href: "/tarjuma-e-quran",
		icon: "book",
	},
	{
		title: "Listen",
		urduTitle: "درس و خطابات",
		href: "/lectures",
		icon: "video_library",
	},
	{
		title: "Majlis",
		urduTitle: "مجلس",
		href: "/majlis",
		icon: "groups_2",
	},
	{
		title: "About Us",
		urduTitle: "تعارف",
		href: "/about",
		icon: "person",
	},
];

export const footerNav = {
	navigation: [
		{ title: "Home", href: "/" },
		{ title: "Twasi al-Haq", href: "/twasi-al-haq" },
		{ title: "Lectures", href: "/lectures" },
		{ title: "Majlis", href: "/majlis" },
	],
	curriculum: [
		{ title: "Tarjuma-e-Quran", href: "/tarjuma-e-quran" },
		{ title: "References", href: "/lectures/notes" },
	],
	academy: [
		{ title: "About Us", href: "/about" },
		{ title: "Join the Circle", href: "/join" },
		{ title: "Search", href: "/search" },
	],
};

