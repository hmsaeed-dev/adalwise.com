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
    title: "Twasi al-Haq",
    urduTitle: "تواصی بالحق",
    href: "/twasi-al-haq",
    icon: "balance",
  },
  {
    title: "Lectures",
    urduTitle: "دروس و خطابات",
    href: "/media",
    icon: "video_library",
  },
  {
    title: "Majlis",
    urduTitle: "مجلسِ",
    href: "/majlis",
    icon: "groups_2",
  },
  {
    title: "Articles",
    urduTitle: "مقالات",
    href: "/articles",
    icon: "auto_stories",
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
    { title: "Lectures", href: "/media" },
    { title: "Majlis", href: "/majlis" },
  ],
  academy: [
    { title: "Articles", href: "/articles" },
    { title: "About Dr. Haseeb", href: "/about" },
    { title: "Join the Circle", href: "/join" },
    { title: "Search", href: "/search" },
  ],
};
