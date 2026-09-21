import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const tarjumaContent = fs.readFileSync(path.join(__dirname, "../src/lib/lectures/tarjuma-quran.ts"), "utf-8");

const surahsMatch = tarjumaContent.match(/(?:export const QURAN_SURAHS|const RAW_QURAN_SURAHS)[^=]*=\s*(\[[\s\S]*?\]);/);
const aliasesMatch = tarjumaContent.match(/const SURAH_ALIASES[^=]*=\s*(\[[\s\S]*?\]);/);

const QURAN_SURAHS = surahsMatch ? eval(surahsMatch[1]) : [];
const SURAH_ALIASES = aliasesMatch ? eval(aliasesMatch[1]) : [];

if (SURAH_ALIASES.length > 0) {
  SURAH_ALIASES.push({ alias: "bani israeel", surahNum: 17 });
  SURAH_ALIASES.push({ alias: "israeel", surahNum: 17 });
  SURAH_ALIASES.push({ alias: "ahqaaf", surahNum: 46 });
}

function normalizeText(text) {
  return text
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/["'’`]/g, "")
    .toLowerCase();
}

export function extractQuranContext(item) {
  let t = item.title.trim();

  // If not coursework, require explicit Surah mention
  if (!item.isCoursework) {
    const hasExplicitSurah = /\b(?:surah|sora|sorah)\b/i.test(t) || /سور[ۃة]/.test(item.urduTitle || "") || /سور[ۃة]/.test(t);
    if (!hasExplicitSurah) return null;
  }

  t = t.replace(/\s*\|\s*(?:Ramzan\s*\d*|Dora\s*Tarjuma\s*(?:e\s*)?Quran(?:\s*\d*)?)[^|]*$/i, "");
  t = t.replace(/\s*#\s*(?:Dora\s*(?:Tarjuma\s*)?Quran|Ramzan)(?:\s*\d*)?[^#]*$/i, "");
  t = t.replace(/^(?:\d+(?:[a-zA-Z]|&\d+)?|[a-zA-Z]+)[.\-*\s☆]+/, "").trim();

  if (/istiqbal/i.test(item.title)) {
    return {
      surahNumber: 1,
      surahNameEnglish: "Al-Fatiha",
      surahNameUrdu: "سورۃ الفاتحہ",
      juzNumber: 1,
    };
  }
  if (/ramazan\s*&\s*dora/i.test(item.title)) {
    return {
      surahNumber: 1,
      surahNameEnglish: "Al-Fatiha",
      surahNameUrdu: "سورۃ الفاتحہ",
      juzNumber: 1,
    };
  }
  if (/love\s*&\s*respect/i.test(item.title)) {
    return {
      surahNumber: 4,
      surahNameEnglish: "An-Nisa",
      surahNameUrdu: "سورۃ النساء",
      juzNumber: 4,
    };
  }

  const cleanForMatch = normalizeText(t);
  const matchedSurahNums = new Set();

  for (const { alias, surahNum } of SURAH_ALIASES) {
    const escaped = alias.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const rx = new RegExp(`(?:^|[\\s\\-_/,&.:;!?])${escaped}(?:$|[\\s\\-_/,&.:;!?0-9])`, "i");
    if (rx.test(cleanForMatch)) {
      matchedSurahNums.add(surahNum);
    }
  }

  if (item.urduTitle && /سور[ۃة]/.test(item.urduTitle)) {
    for (const surah of QURAN_SURAHS) {
      if (item.urduTitle.includes(surah.urdu)) {
        matchedSurahNums.add(surah.number);
      }
    }
  }

  const surahs = Array.from(matchedSurahNums)
    .sort((a, b) => a - b)
    .map((num) => QURAN_SURAHS.find((s) => s.number === num))
    .filter(Boolean);

  if (surahs.length === 0) return null;

  let ayahStart;
  let ayahEnd;
  const ayahMatch = t.match(/(?:A|Ayah|Ayat|\b)\s*(\d+)\s*(?:to|-)\s*(\d+)/i);
  if (ayahMatch) {
    ayahStart = parseInt(ayahMatch[1], 10);
    ayahEnd = parseInt(ayahMatch[2], 10);
  }

  const sFirst = surahs[0];
  const sLast = surahs[surahs.length - 1];

  const ctx = {
    surahNumber: sFirst.number,
    surahNameEnglish: sFirst.name,
    surahNameUrdu: sFirst.urdu,
    juzNumber: sFirst.juz[0],
  };

  if (ayahStart !== undefined) ctx.ayahStart = ayahStart;
  if (ayahEnd !== undefined) ctx.ayahEnd = ayahEnd;

  if (surahs.length > 1) {
    ctx.surahEndNumber = sLast.number;
    ctx.surahNameEnglish = `${sFirst.name} to ${sLast.name}`;
    ctx.surahNameUrdu = `${sFirst.urdu} تا ${sLast.urdu}`;
    ctx.juzEndNumber = sLast.juz[sLast.juz.length - 1];
  }

  return ctx;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const catalogPath = path.join(__dirname, "../src/lib/lectures/catalog.json");
  const catalog = JSON.parse(fs.readFileSync(catalogPath, "utf-8"));
  let enrichedCount = 0;
  for (const item of catalog) {
    const ctx = extractQuranContext(item);
    if (ctx) {
      item.quranContext = ctx;
      enrichedCount++;
    } else {
      delete item.quranContext;
    }
  }

  fs.writeFileSync(catalogPath, JSON.stringify(catalog, null, 2), "utf-8");
  console.log(`Enriched ${enrichedCount} lectures with structured quranContext in catalog.json`);
}
