import localFont from "next/font/local";

export const ebGaramond = localFont({
  src: [
    {
      path: "../fonts/EBGaramond-Roman.woff2",
      weight: "400 800",
      style: "normal",
    },
    {
      path: "../fonts/EBGaramond-Italic.woff2",
      weight: "400 800",
      style: "italic",
    },
  ],
  variable: "--font-garamond",
  display: "swap",
});

export const inter = localFont({
  src: "../fonts/Inter-Variable.woff2",
  variable: "--font-inter",
  display: "swap",
});

export const notoUrdu = localFont({
  src: "../fonts/NotoNastaliqUrdu-Regular.woff2",
  variable: "--font-urdu",
  display: "swap",
});

export const amiri = localFont({
  src: [
    {
      path: "../fonts/Amiri-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../fonts/Amiri-Bold.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-amiri",
  display: "swap",
});
