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
    title: "Lectures & Media",
    urduTitle: "دروس و خطابات",
    href: "/media",
    icon: "video_library",
  },
  {
    title: "Scholarly Majlis",
    urduTitle: "مجلسِ علم",
    href: "/majlis",
    icon: "groups_2",
  },
  {
    title: "Articles & Treatises",
    urduTitle: "مقالات",
    href: "/articles",
    icon: "auto_stories",
  },
  {
    title: "About & Faculty",
    urduTitle: "تعارف",
    href: "/about",
    icon: "person",
  },
];

export const footerNav = {
  navigation: [
    { title: "Home", href: "/" },
    { title: "Discourses", href: "/twasi-al-haq" },
    { title: "Lectures", href: "/media" },
    { title: "Majlis", href: "/majlis" },
  ],
  academy: [
    { title: "Research Articles", href: "/articles" },
    { title: "About Dr. Haseeb", href: "/about" },
    { title: "Fellowship Circle", href: "/join" },
    { title: "Archive Search", href: "/search" },
  ],
};
