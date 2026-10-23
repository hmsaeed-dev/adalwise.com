import json

with open('Haseeb-Brain/05_TRANSCRIPTS/CdCbvPohFD4_gemini_raw.json', encoding='utf-8') as f:
    d = json.load(f)

print('Language:', d.get('language'))
print('Duration:', d.get('durationSeconds'), 'seconds')
print('\n=== INTELLECTUAL SUMMARY ===')
print(d.get('summary'))

print(f"\n=== SEGMENTS ({len(d.get('segments', []))} total) ===")
for s in d.get('segments', [])[:5]:
    start = s.get('start', 0)
    end = s.get('end', 0)
    m_s = f"{int(start//60):02d}:{int(start%60):02d}"
    m_e = f"{int(end//60):02d}:{int(end%60):02d}"
    print(f"[{m_s} - {m_e}] ({start:.1f}s - {end:.1f}s): {s.get('text')}")

print("\n=== GOLDEN QUOTES ATTRIBUTED TO DR. HASEEB ===")
for q in d.get('goldenQuotes', []):
    ts = q.get('timestampSeconds', 0)
    m_s = f"{int(ts//60):02d}:{int(ts%60):02d}"
    print(f"[{m_s}] ({ts:.1f}s): \"{q.get('quote')}\"")

print("\n=== QURAN CITATIONS ===")
for qc in d.get('quranCitations', []):
    print(f"Surah {qc.get('surahName')} ({qc.get('surahNumber')}:{qc.get('ayahNumber')}): {qc.get('arabicText')}")
