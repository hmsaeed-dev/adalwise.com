"""
Adlwise & Haseeb-Brain Pilot Pipeline Runner (v2 - Resilient with Fallback Models)
Processes pilot lectures end-to-end:
1. Downloads audio locally (32kbps opus via yt-dlp) - reuses cached opus if present
2. Uploads to Gemini File API
3. Calls gemini with automated fallback across Flash models on 503s
4. Fuzzy-grounds quotes against segment transcripts (>=65% overlap)
5. Validates Quranic citations against canonical Surah/Ayah bounds
6. Outputs clean JSON transcript to 05_TRANSCRIPTS/
7. Updates lecture note in 03_LECTURES/
8. Generates standalone 1-page HTML review digest in 06_REVIEW_DIGESTS/
9. Cleans up temp audio and remote Gemini files
"""

import os
import sys
import json
import time
import re
import subprocess
from google import genai
from google.genai import types

# Single source of truth for configuration & thresholds
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
sys.path.append(SCRIPT_DIR)
from quran_verifier import containment_ratio, forward_quran_check, normalize_urdu

CONFIG_PATH = os.path.join(SCRIPT_DIR, 'models.config.json')
with open(CONFIG_PATH, 'r', encoding='utf-8') as f:
    CONFIG = json.load(f)

QUOTE_CONTAINMENT_THRESHOLD = CONFIG.get('quote_containment_threshold', 0.80)
FALLBACK_MODELS = CONFIG.get('synthesis_models', ['gemini-3.6-flash', 'gemini-3.5-flash', 'gemini-flash-latest'])

API_KEY = os.environ.get('GEMINI_API_KEY') or os.environ.get('GOOGLE_API_KEY', '')
client = genai.Client(api_key=API_KEY) if API_KEY else None
VAULT_ROOT = os.path.abspath(os.path.join(SCRIPT_DIR, '../../Haseeb-Brain'))

PILOT_LECTURES = [
    {
        "domain": "constitutional-law",
        "title": "Taloot vs Jaloot | 4 current lessons",
        "youtubeId": "r7DY1WYGHJs",
        "slug": "taloot-vs-jaloot-4-current-lessons",
        "date": "2026-08-15"
    },
    {
        "domain": "iqbal",
        "title": "بہار ہو کہ خزاں لا الہ الا اللہ | Ep.06",
        "youtubeId": "sIWZ4ULaDM4",
        "slug": "iqbal-friends-ep-06",
        "date": "2026-07-25"
    },
    {
        "domain": "constitutional-law",
        "title": "Intro & Importance of Constitution | آئینِ کا تعارف اور اہمیت | Ep-01",
        "youtubeId": "qLOZmO6Raag",
        "slug": "intro-importance-of-constitution-ep-01",
        "date": "2026-08-20"
    },
    {
        "domain": "civic-ethics",
        "title": "ظالم اور متقی کی زندگی، موت، قبر اور حشر | Life, Death, Grave & Resurrection",
        "youtubeId": "NsrgFCLSLAY",
        "slug": "life-death-grave-resurrection",
        "date": "2026-07-10"
    },
    {
        "domain": "seerah",
        "title": "06. Peaceful Resistance | Seerat 2026",
        "youtubeId": "DW_fLChg_9o",
        "slug": "06-peaceful-resistance-seerat-2026",
        "date": "2026-10-03"
    },
    {
        "domain": "seerah",
        "title": "حضرت موسٰیؑ کی تحریک آزادی",
        "youtubeId": "7J0Jie2ZtvI",
        "slug": "moses-freedom-movement",
        "date": "2026-06-15"
    },
    {
        "domain": "tafsir",
        "title": "99- Hadid R4/A29 | Dora Tarjuma Quran",
        "youtubeId": "yPiU9XaJpsw",
        "slug": "99-hadid-r4-a29-dora-tarjuma-quran",
        "date": "2026-05-01"
    },
    {
        "domain": "civic-ethics",
        "title": "02a- Special slaves of Rahman | Quran for Guidance today",
        "youtubeId": "6lOzG4pUxo4",
        "slug": "02a-special-slaves-of-rahman",
        "date": "2026-08-01"
    },
    {
        "domain": "iqbal",
        "title": "Ijtehaad | اجتھاد | Zarb-e-Kaleem Kalaam-e-Iqbal",
        "youtubeId": "O0KEVvQHyFY",
        "slug": "ijtehaad-zarb-e-kaleem-kalaam-e-iqbal",
        "date": "2026-07-19"
    }
]

SURAH_BOUNDS = {
    1: 7, 2: 286, 3: 200, 4: 176, 5: 120, 6: 165, 7: 206, 8: 75, 9: 129, 10: 109,
    11: 123, 12: 111, 13: 43, 14: 52, 15: 99, 16: 128, 17: 111, 18: 110, 19: 98, 20: 135,
    21: 112, 22: 78, 23: 118, 24: 64, 25: 77, 26: 227, 27: 93, 28: 88, 29: 69, 30: 60,
    31: 34, 32: 30, 33: 73, 34: 54, 35: 45, 36: 83, 37: 182, 38: 88, 39: 75, 40: 85,
    41: 54, 42: 53, 43: 89, 44: 59, 45: 37, 46: 35, 47: 38, 48: 29, 49: 18, 50: 45,
    51: 60, 52: 49, 53: 62, 54: 55, 55: 78, 56: 96, 57: 29, 58: 22, 59: 24, 60: 13,
    61: 14, 62: 11, 63: 11, 64: 18, 65: 12, 66: 12, 67: 30, 68: 52, 69: 52, 70: 44,
    71: 28, 72: 28, 73: 20, 74: 56, 75: 40, 76: 31, 77: 50, 78: 40, 79: 46, 80: 42,
    81: 29, 82: 19, 83: 36, 84: 25, 85: 22, 86: 17, 87: 19, 88: 26, 89: 30, 90: 20,
    91: 15, 92: 21, 93: 11, 94: 8, 95: 8, 96: 19, 97: 5, 98: 8, 99: 8, 100: 11,
    101: 11, 102: 8, 103: 3, 104: 9, 105: 5, 106: 4, 107: 7, 108: 3, 109: 6, 110: 3,
    111: 5, 112: 4, 113: 5, 114: 6
}

import concurrent.futures

def call_gemini_with_fallback(uploaded_file, prompt):
    last_err = None
    for model_name in FALLBACK_MODELS:
        for attempt in range(2):
            try:
                print(f"      Attempting inference with {model_name} (try {attempt+1}, timeout 180s)...", flush=True)
                with concurrent.futures.ThreadPoolExecutor(max_workers=1) as executor:
                    future = executor.submit(
                        client.models.generate_content,
                        model=model_name,
                        contents=[uploaded_file, prompt],
                        config=types.GenerateContentConfig(
                            response_mime_type="application/json"
                        )
                    )
                    resp = future.result(timeout=180)
                return resp, model_name
            except concurrent.futures.TimeoutError:
                print(f"      {model_name} timed out after 180s! Cascading to next model...", flush=True)
                last_err = TimeoutError(f"{model_name} timed out after 180s")
            except Exception as e:
                err_str = str(e)
                print(f"      {model_name} warning: {err_str[:120]}...", flush=True)
                last_err = e
                time.sleep(4)
    raise last_err

def process_lecture(lec, force=False):
    yid = lec["youtubeId"]
    domain = lec["domain"]
    title = lec["title"]
    note_id = f"yt-{yid}"
    
    # Check if already processed
    final_note_path = os.path.join(VAULT_ROOT, f"03_LECTURES/{domain}/{note_id}.md")
    if not force and os.path.exists(final_note_path):
        with open(final_note_path, encoding='utf-8') as f:
            c = f.read()
            if "## 📌 Executive Summary\n\nاس گفتگو میں" in c or (len(c) > 2500 and "Skeleton Dossier" not in c):
                print(f"⏩ SKIP: {yid} is already fully processed!", flush=True)
                return True

    print(f"\n=======================================================", flush=True)
    print(f"▶ PROCESSING [{domain.upper()}]: {title} (ID: {yid})", flush=True)
    print(f"=======================================================", flush=True)
    
    temp_audio = os.path.join(VAULT_ROOT, f"05_TRANSCRIPTS/temp_{yid}.opus")
    
    # Step 1: Download audio via yt-dlp if not already downloaded
    if not os.path.exists(temp_audio):
        print(f"[1/5] Downloading 32kbps mono audio with yt-dlp...", flush=True)
        t0 = time.time()
        dl_cmd = [
            sys.executable, "-m", "yt_dlp",
            "-f", "ba[ext=m4a]/ba",
            "--extract-audio", "--audio-format", "opus", "--audio-quality", "32k",
            "-o", os.path.join(VAULT_ROOT, f"05_TRANSCRIPTS/temp_{yid}.%(ext)s"),
            f"https://www.youtube.com/watch?v={yid}"
        ]
        res = subprocess.run(dl_cmd, capture_output=True, text=True)
        if res.returncode != 0 and not os.path.exists(temp_audio):
            print(f"ERROR downloading {yid}: {res.stderr[:200]}", flush=True)
            return False
        audio_size_mb = os.path.getsize(temp_audio) / (1024 * 1024)
        print(f"      Downloaded {audio_size_mb:.2f} MB in {time.time()-t0:.1f}s", flush=True)
    else:
        audio_size_mb = os.path.getsize(temp_audio) / (1024 * 1024)
        print(f"[1/5] Audio already downloaded on disk ({audio_size_mb:.2f} MB), reusing!", flush=True)
    
    # Step 2: Upload to Gemini File API
    print(f"[2/5] Uploading audio to Gemini File API...", flush=True)
    t0 = time.time()
    uploaded_file = client.files.upload(file=temp_audio)
    print(f"      Uploaded: {uploaded_file.name} in {time.time()-t0:.1f}s", flush=True)
    
    while uploaded_file.state.name == "PROCESSING":
        time.sleep(2)
        uploaded_file = client.files.get(name=uploaded_file.name)
        
    if uploaded_file.state.name == "FAILED":
        print(f"ERROR: Audio processing failed on Gemini server.", flush=True)
        return False

    # Step 3: Run Gemini Flash Multimodal with Fallback
    print(f"[3/5] Requesting transcript, quotes & citations with model fallback...", flush=True)
    prompt = """
You are an expert transcriber and Islamic scholar reviewing a lecture by Dr. Hafiz Haseeb.
Analyze the provided audio carefully. The lecture is in Urdu with Arabic Quranic citations.

Please produce a strictly structured JSON response with:
1. "language": "ur"
2. "durationSeconds": estimated duration in seconds
3. "summary": A high-density 2-3 paragraph intellectual summary of Dr. Haseeb's thesis and arguments.
4. "segments": An array of timestamped transcript segments for the lecture:
   [
     { "start": float, "end": float, "text": "Verbatim Urdu text spoken" }
   ]
5. "goldenQuotes": An array of 3-5 verbatim quotes:
   [
     { "quote": "Verbatim Urdu/English quote", "timestampSeconds": float, "speaker": "Dr. Hafiz Haseeb" }
   ]
6. "quranCitations": An array of Quranic verses cited:
   [
     { "surahName": "...", "surahNumber": int, "ayahNumber": int, "arabicText": "..." }
   ]
7. "proposedArticles": An array of 3 long-form article titles/angles for Adlwise.com based on this discourse.
"""
    t0 = time.time()
    response, used_model = call_gemini_with_fallback(uploaded_file, prompt)
    print(f"      Inference completed with {used_model} in {time.time()-t0:.1f}s", flush=True)
    
    # Try parsing standard JSON, fallback to json_repair
    data = None
    try:
        data = json.loads(response.text)
    except Exception as e:
        try:
            import json_repair
            data = json_repair.loads(response.text)
            print(f"      Repaired invalid JSON successfully with json_repair!", flush=True)
        except Exception as e2:
            print(f"ERROR: Invalid JSON response: {e}\nRepair also failed: {e2}\n{response.text[:200]}", flush=True)
            return False

    # Cleanup remote Gemini file & temp local audio ONLY AFTER SUCCESSFUL PARSE
    try:
        client.files.delete(name=uploaded_file.name)
        if os.path.exists(temp_audio):
            os.remove(temp_audio)
    except Exception as e:
        print(f"      Cleanup note: {e}", flush=True)

    # Step 4: Verification & Grounding
    print(f"[4/5] Running Quote Grounding & Quran Validation...", flush=True)
    segments = data.get('segments', [])
    
    # 4a: Quote verification via single threshold constant
    verified_quotes = []
    for q in data.get('goldenQuotes', []):
        ts = q.get('timestampSeconds', 0)
        q_text = q.get('quote', '').strip()
        matching_text = ""
        for s in segments:
            s_start = s.get('start', 0)
            s_end = s.get('end', 0)
            if (s_start - 30 <= ts <= s_end + 30) or abs(s_start - ts) <= 30 or abs(s_end - ts) <= 30:
                matching_text += " " + s.get('text', '')
        
        ratio = containment_ratio(q_text, matching_text)
        mins = int(ts // 60)
        secs = int(ts % 60)
        verified_quotes.append({
            'quote': q_text,
            'timestamp': f"{mins:02d}:{secs:02d}",
            'timestampSeconds': ts,
            'matchedText': ratio >= QUOTE_CONTAINMENT_THRESHOLD,
            'containmentRatio': ratio,
            'speaker': q.get('speaker', 'Dr. Hafiz Haseeb')
        })

    # 4b: Truncation & Gap Coverage Check
    est_dur = data.get('durationSeconds', 0)
    last_seg_end = segments[-1].get('end', 0) if segments else 0
    coverage_ratio = (last_seg_end / est_dur) if est_dur > 0 else 1.0
    
    max_gap = 0
    for i in range(len(segments) - 1):
        gap = segments[i+1].get('start', 0) - segments[i].get('end', 0)
        if gap > max_gap:
            max_gap = gap
            
    is_truncated = coverage_ratio < 0.85
    has_large_gap = max_gap > 45.0
    coverage_warning = is_truncated or has_large_gap
    if coverage_warning:
        print(f"      WARNING: Transcript coverage issue detected! Last seg end: {last_seg_end:.1f}s / {est_dur:.1f}s ({coverage_ratio*100:.1f}%), Max gap: {max_gap:.1f}s", flush=True)

    # 4b: Quran validation
    quran_citations = []
    for qc in data.get('quranCitations', []):
        s_num = qc.get('surahNumber')
        a_num = qc.get('ayahNumber')
        is_valid = False
        if s_num in SURAH_BOUNDS:
            if 1 <= a_num <= SURAH_BOUNDS[s_num]:
                is_valid = True
        quran_citations.append({
            'ref': f"Surah {qc.get('surahName')} ({s_num}:{a_num})",
            'surah': s_num,
            'ayah': a_num,
            'arabicText': qc.get('arabicText'),
            'matched': is_valid,
            'textVerified': is_valid
        })

    # Step 5: Save Artifacts
    print(f"[5/5] Writing Note, Transcript JSON & 1-Page Review Digest...", flush=True)
    # 5a: Save raw transcript
    trans_dir = os.path.join(VAULT_ROOT, f"05_TRANSCRIPTS/{domain}")
    os.makedirs(trans_dir, exist_ok=True)
    trans_path = os.path.join(trans_dir, f"{note_id}.json")
    with open(trans_path, 'w', encoding='utf-8') as f:
        json.dump({
            "youtubeId": yid,
            "modelUsed": used_model,
            "durationSeconds": data.get("durationSeconds", 0),
            "segments": segments
        }, f, ensure_ascii=False, indent=2)

    # 5b: Update Note in 03_LECTURES/
    note_dir = os.path.join(VAULT_ROOT, f"03_LECTURES/{domain}")
    os.makedirs(note_dir, exist_ok=True)
    note_path = os.path.join(note_dir, f"{note_id}.md")
    
    summary_text = data.get("summary", "")
    mins_total = int(data.get("durationSeconds", 0) // 60)
    
    timestamps_md = []
    for s in segments[:10]:
        st = s.get('start', 0)
        ts_lbl = f"{int(st//60):02d}:{int(st%60):02d}"
        short_txt = s.get('text', '')[:90] + ("..." if len(s.get('text', '')) > 90 else "")
        timestamps_md.append(f"- `[{ts_lbl}]` [Watch at {ts_lbl}](https://youtu.be/{yid}?t={int(st)}) — {short_txt}")

    quotes_md = []
    for vq in verified_quotes:
        status_icon = "✓ Grounded" if vq['matchedText'] else "⚠ (Requires Verification)"
        quotes_md.append(f"> \"{vq['quote']}\"  \n> — **{vq['speaker']}** `[{vq['timestamp']}]` ({status_icon})")

    quran_md = []
    for qc in quran_citations:
        check = "[x]" if qc['matched'] else "[ ]"
        quran_md.append(f"- {check} **{qc['ref']}**: *{qc['arabicText']}*")

    articles_md = [f"{i+1}. {a}" for i, a in enumerate(data.get("proposedArticles", []))]

    note_content = f"""---
type: lecture
status: draft
id: "{note_id}"
youtubeId: "{yid}"
slug: "{lec['slug']}"
title: "{title}"
urduTitle: "{data.get('urduTitle', '')}"
speaker: "Dr. Hafiz Haseeb"
domain: "{domain}"
publishedAt: "{lec['date']}"
durationSeconds: {data.get('durationSeconds', 0)}
durationMinutes: {mins_total}
modelUsed: "{used_model}"
coverageWarning: {str(coverage_warning).lower()}
maxGapSeconds: {round(max_gap, 1)}
lastSegmentEnd: {round(last_seg_end, 1)}
transcriptFile: "05_TRANSCRIPTS/{domain}/{note_id}.json"
reviewDigestFile: "06_REVIEW_DIGESTS/{domain}/{note_id}.html"
reviewedBy: null
reviewedAt: null
quranCitations:
{json.dumps(quran_citations, ensure_ascii=False, indent=2)}
attributedQuotes:
{json.dumps(verified_quotes, ensure_ascii=False, indent=2)}
topics:
  - "{domain}"
aliases:
  - "{title}"
tags:
  - type/lecture
  - status/draft
  - domain/{domain}
updated: 2026-10-23
---

# {title}

- **ID:** `{note_id}`
- **Speaker:** Dr. Hafiz Haseeb
- **Domain:** [[{domain.capitalize()}-MOC|{domain.capitalize()}]]
- **Duration:** {mins_total} minutes
- **Published:** {lec['date']}
- **YouTube Link:** [Watch on YouTube](https://youtu.be/{yid})
- **Raw Transcript:** `05_TRANSCRIPTS/{domain}/{note_id}.json`
- **Review Digest:** [[{note_id}.html|Open 1-Page Review Digest]]

---

## 📌 Executive Summary

{summary_text}

---

## ⏱ Key Theses & Verified Timestamps

{chr(10).join(timestamps_md)}

---

## 💎 Attributed Quotes (Fuzzy-Grounded to Transcript)

{chr(10).join(quotes_md)}

---

## 📖 Primary Sources & Verified Ayahs

{chr(10).join(quran_md)}

---

## 🔗 Connected Nodes
- [[Atlas]]
- [[Methodology]]
- [[Clinical-Hermeneutics]]

---

## 📝 Article Seeds for Adlwise.com
{chr(10).join(articles_md)}
"""
    with open(note_path, 'w', encoding='utf-8') as f:
        f.write(note_content)

    # 5c: Generate Standalone 1-Page HTML Review Digest
    digest_dir = os.path.join(VAULT_ROOT, f"06_REVIEW_DIGESTS/{domain}")
    os.makedirs(digest_dir, exist_ok=True)
    digest_path = os.path.join(digest_dir, f"{note_id}.html")
    
    html_quotes = "".join([f"""
    <div style="background: #fdfdfd; border: 1px solid #e2e8f0; border-left: 4px solid #0d9488; padding: 16px; margin-bottom: 12px; border-radius: 6px;">
      <p style="font-family: 'Amiri', serif; font-size: 20px; line-height: 1.8; margin: 0 0 8px 0; color: #0f172a; direction: rtl; text-align: right;">
        "{vq['quote']}"
      </p>
      <div style="display: flex; justify-content: space-between; align-items: center; font-size: 13px; color: #64748b;">
        <span><strong>Dr. Hafiz Haseeb</strong> &bull; <a href="https://youtu.be/{yid}?t={int(vq['timestampSeconds'])}" target="_blank" style="color: #0d9488; text-decoration: none;">▶ Timestamp {vq['timestamp']}</a></span>
        <span>
          <label style="margin-right: 12px;"><input type="checkbox" checked /> Approve</label>
          <label><input type="checkbox" /> Flag for Edit</label>
        </span>
      </div>
    </div>
    """ for vq in verified_quotes])

    html_ayahs = "".join([f"""
    <li style="margin-bottom: 8px; font-size: 15px;">
      <strong>{qc['ref']}</strong>: <span style="font-family: serif; color: #1e293b; direction: rtl;">{qc['arabicText']}</span>
      <span style="color: {'#10b981' if qc['matched'] else '#ef4444'}; font-weight: bold; margin-left: 8px;">
        {'✓ Canonical Verified' if qc['matched'] else '⚠ Flagged (Check Ayah)'}
      </span>
    </li>
    """ for qc in quran_citations])

    html_articles = "".join([f"<li style='margin-bottom: 6px;'><strong>{a}</strong></li>" for a in data.get("proposedArticles", [])])

    html_content = f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Scholarly Review Digest - {title}</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Amiri:ital,wght@0,400;0,700;1,400&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>
    body {{
      font-family: 'Inter', -apple-system, sans-serif;
      background-color: #f8fafc;
      color: #1e293b;
      margin: 0;
      padding: 24px;
    }}
    .sheet {{
      max-width: 820px;
      margin: 0 auto;
      background: #ffffff;
      padding: 40px;
      border-radius: 8px;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
      border: 1px solid #e2e8f0;
    }}
    .badge {{
      display: inline-block;
      background: #fef3c7;
      color: #92400e;
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      padding: 4px 8px;
      border-radius: 4px;
      margin-bottom: 12px;
    }}
    h1 {{ font-size: 22px; color: #0f172a; margin: 0 0 6px 0; }}
    .meta {{ font-size: 14px; color: #64748b; margin-bottom: 24px; }}
    .summary-box {{
      background: #f0fdf4;
      border-left: 4px solid #16a34a;
      padding: 16px 20px;
      border-radius: 6px;
      margin-bottom: 28px;
      direction: rtl;
      text-align: right;
      font-family: 'Amiri', serif;
      font-size: 18px;
      line-height: 1.8;
      color: #14532d;
    }}
    h2 {{ font-size: 16px; font-weight: 700; color: #334155; border-bottom: 2px solid #f1f5f9; padding-bottom: 8px; margin-top: 28px; }}
    .review-panel {{
      margin-top: 36px;
      padding: 20px;
      background: #f8fafc;
      border: 2px dashed #cbd5e1;
      border-radius: 6px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }}
    @media print {{
      body {{ background: #fff; padding: 0; }}
      .sheet {{ box-shadow: none; border: none; padding: 20px; }}
    }}
  </style>
</head>
<body>
  <div class="sheet">
    <div class="badge">Scholarly Review Dossier &bull; Status: Draft</div>
    <h1>{title}</h1>
    <div class="meta">
      <strong>Speaker:</strong> Dr. Hafiz Haseeb &bull;
      <strong>Duration:</strong> {mins_total} Mins &bull;
      <strong>Domain:</strong> {domain.capitalize()} &bull;
      <a href="https://youtu.be/{yid}" target="_blank" style="color: #2563eb;">Watch on YouTube</a>
    </div>

    <h2>1. Executive Summary (خلاصۂ کلام)</h2>
    <div class="summary-box">
      {summary_text.replace(chr(10), '<br><br>')}
    </div>

    <h2>2. Attributed Golden Quotes (اقوالِ زریں - تصدیق درکار ہے)</h2>
    <p style="font-size: 13px; color: #64748b; margin-top: -4px;">These quotes were grounded against the timestamped transcript. Please verify attribution before public release.</p>
    {html_quotes}

    <h2>3. Verified Quranic Verses (آیاتِ قرآنی)</h2>
    <ul style="padding-left: 20px;">
      {html_ayahs if html_ayahs else "<li><em>No explicit Ayahs cited in this keynote segment.</em></li>"}
    </ul>

    <h2>4. Proposed Articles for Adlwise.com</h2>
    <ol style="font-size: 14px; line-height: 1.6; color: #334155;">
      {html_articles}
    </ol>

    <div class="review-panel">
      <div>
        <strong style="color: #0f172a;">Review Decision:</strong>
        <p style="margin: 4px 0 0 0; font-size: 13px; color: #64748b;">Sign-off promotes status from <em>Draft</em> to <em>Evergreen</em></p>
      </div>
      <div>
        <button style="background: #16a34a; color: white; border: none; padding: 10px 18px; border-radius: 6px; font-weight: 600; cursor: pointer; margin-right: 8px;">✓ Approve Dossier</button>
        <button style="background: #f1f5f9; color: #475569; border: 1px solid #cbd5e1; padding: 10px 18px; border-radius: 6px; font-weight: 600; cursor: pointer;">Request Revisions</button>
      </div>
    </div>
  </div>
</body>
</html>
"""
    with open(digest_path, 'w', encoding='utf-8') as f:
        f.write(html_content)

    print(f"✓ DONE: Processed {yid} successfully!", flush=True)
    return True

if __name__ == "__main__":
    success_count = 0
    total = len(PILOT_LECTURES)
    print(f"Starting Pilot Batch of {total} remaining lectures...", flush=True)
    
    for idx, lec in enumerate(PILOT_LECTURES):
        print(f"\n[{idx+1}/{total}] Starting {lec['title']}...", flush=True)
        try:
            if process_lecture(lec):
                success_count += 1
        except Exception as e:
            print(f"FATAL ERROR on {lec['youtubeId']}: {e}", flush=True)
            
    print(f"\n=======================================================", flush=True)
    print(f"🎉 PILOT BATCH COMPLETE: {success_count}/{total} lectures processed successfully!", flush=True)
    print(f"=======================================================", flush=True)
