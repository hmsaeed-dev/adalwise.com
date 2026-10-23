import os
import re
import json

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
QURAN_DATA_PATH = os.path.join(SCRIPT_DIR, '../data/quran-uthmani.json')

# Load canonical Quran
with open(QURAN_DATA_PATH, encoding='utf-8') as f:
    CANONICAL_VERSES = json.load(f)

# Fast index by (surah, ayah)
VERSE_INDEX = {}
for v in CANONICAL_VERSES:
    VERSE_INDEX[(v['surah'], v['ayah'])] = v

SURAH_BOUNDS = {}
for v in CANONICAL_VERSES:
    s = v['surah']
    SURAH_BOUNDS[s] = max(SURAH_BOUNDS.get(s, 0), v['ayah'])

def normalize_arabic(text):
    if not text:
        return ""
    # Strip Quranic recitation symbols, tanween, harakat, small high symbols
    t = re.sub(r'[\u0617-\u061A\u064B-\u065F\u06D6-\u06DC\u06DF-\u06E8\u06EA-\u06ED]', '', text)
    # Convert dagger alif \u0670 to normal alif
    t = re.sub(r'\u0670', 'ا', t)
    # Normalize alifs and wasla
    t = re.sub(r'[إأآٱ]', 'ا', t)
    # Normalize taa marbuta
    t = re.sub(r'ة', 'ہ', t)
    # Normalize yeh and alef maksura
    t = re.sub(r'[يىئ]', 'ی', t)
    # Normalize Kaf
    t = re.sub(r'ك', 'ک', t)
    # Normalize spaces
    t = re.sub(r'[^\w\s\u0600-\u06FF]', ' ', t)
    t = re.sub(r'\s+', ' ', t).strip()
    return t

def normalize_urdu(text):
    if not text:
        return ""
    # Strip aerab
    t = re.sub(r'[\u064B-\u065F\u0670]', '', text)
    # Normalize Yeh variants
    t = re.sub(r'[يےئ]', 'ی', t)
    # Normalize Heh variants
    t = re.sub(r'[ۂھة]', 'ہ', t)
    # Normalize Kaf
    t = re.sub(r'ك', 'ک', t)
    # Normalize Alif variants
    t = re.sub(r'[آأإ]', 'ا', t)
    # Strip non-letter punctuation
    t = re.sub(r'[^\w\s\u0600-\u06FF]', ' ', t)
    t = re.sub(r'\s+', ' ', t).strip()
    return t

def containment_ratio(quote_text, segment_window_text):
    q_norm = normalize_urdu(quote_text)
    s_norm = normalize_urdu(segment_window_text)
    
    q_tokens = set(q_norm.split())
    if not q_tokens:
        return 0.0
    s_tokens = set(s_norm.split())
    
    overlap = len(q_tokens.intersection(s_tokens))
    return round(overlap / len(q_tokens), 3)

def forward_quran_check(surah, ayah, claimed_text=None):
    if surah not in SURAH_BOUNDS:
        return {"valid": False, "reason": f"Surah {surah} does not exist (must be 1-114)"}
    max_ayahs = SURAH_BOUNDS[surah]
    if ayah < 1 or ayah > max_ayahs:
        return {"valid": False, "reason": f"Ayah {ayah} out of bounds for Surah {surah} (1-{max_ayahs})"}
    
    canonical = VERSE_INDEX.get((surah, ayah))
    if not canonical:
        return {"valid": False, "reason": "Verse not found in canonical index"}
    
    canon_text = canonical['text']
    text_matches = True
    if claimed_text:
        c_norm = normalize_arabic(canon_text)
        q_norm = normalize_arabic(claimed_text)
        # Check if words from claimed text exist in canonical verse
        words_q = set(q_norm.split())
        words_c = set(c_norm.split())
        if words_q and len(words_q.intersection(words_c)) / len(words_q) < 0.60:
            text_matches = False
            
    return {
        "valid": True,
        "surah": surah,
        "ayah": ayah,
        "surahName": canonical.get('surahName', ''),
        "canonicalArabic": canon_text,
        "textMatches": text_matches
    }

# Fast Inverted Word Index for O(1) Reverse Quran Search
INVERTED_QURAN_INDEX = {}
for idx, v in enumerate(CANONICAL_VERSES):
    v_norm = normalize_arabic(v['text'])
    v['norm_text'] = v_norm
    for w in set(v_norm.split()):
        if len(w) >= 3:
            if w not in INVERTED_QURAN_INDEX:
                INVERTED_QURAN_INDEX[w] = []
            INVERTED_QURAN_INDEX[w].append(idx)

def reverse_quran_scan(transcript_text, min_words=4):
    """
    Lightning-fast reverse Quran detection using Inverted Word Index.
    Scans transcript for 4+ consecutive words matching canonical Quran.
    """
    if not transcript_text:
        return []
        
    t_norm = normalize_arabic(transcript_text)
    t_words = t_norm.split()
    if len(t_words) < min_words:
        return []
        
    detected = []
    seen_verses = set()
    
    # Check 4-word to 6-word windows
    for n in range(min_words, min(7, len(t_words) + 1)):
        for i in range(len(t_words) - n + 1):
            w0 = t_words[i]
            w1 = t_words[i+1]
            if len(w0) < 3 or len(w1) < 3:
                continue
                
            # Intersect candidates for first two words
            cands0 = INVERTED_QURAN_INDEX.get(w0, [])
            cands1 = set(INVERTED_QURAN_INDEX.get(w1, []))
            common = [c for c in cands0 if c in cands1]
            if not common:
                continue
                
            ngram = " ".join(t_words[i:i+n])
            for c_idx in common:
                v = CANONICAL_VERSES[c_idx]
                v_key = (v['surah'], v['ayah'])
                if v_key in seen_verses:
                    continue
                if ngram in v['norm_text']:
                    seen_verses.add(v_key)
                    detected.append({
                        "surah": v['surah'],
                        "ayah": v['ayah'],
                        "surahName": v.get('surahName', ''),
                        "canonicalArabic": v['text'],
                        "matchedPhrase": ngram
                    })
                    break
    return detected

if __name__ == "__main__":
    print("Testing Urdu Normalizer & Quran Verifier...")
    # Test quote containment
    q = "صبر بزدلی کا نام نہیں ہے"
    s = "انہوں نے فرمایا کہ صبر بزدلی کا نام نہیں ہے بلکہ اخلاقی حکمت عملی ہے"
    c = containment_ratio(q, s)
    print(f"Quote: '{q}'\nIn: '{s}'\nContainment Ratio: {c} (Threshold 0.80 -> {'PASS' if c >= 0.80 else 'FAIL'})")
    
    # Test forward check
    fcheck = forward_quran_check(25, 52, "فلا تطع الکافرین وجاهدهم به جهادا کبیرا")
    print("\nForward Quran Check (25:52):", fcheck)
    
    # Test reverse scan
    sample_discourse = "یہاں فرمایا وجاهدهم به جهادا کبیرا پس کافروں کی بات نہ مانو"
    rscan = reverse_quran_scan(sample_discourse)
    print("\nReverse Quran Scan:", rscan)
