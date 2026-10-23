"""
Generates the single-source-of-truth manifest.json for Haseeb-Brain.
Scans all notes in 03_LECTURES/ and outputs manifest.json at vault root.
Enables O(1) list loading in the Curator Studio dashboard without reading 576 individual files.
"""

import os
import glob
import json
import re
import sys
from datetime import datetime

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

VAULT_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '../../Haseeb-Brain'))
MANIFEST_PATH = os.path.join(VAULT_ROOT, 'manifest.json')

def generate_manifest():
    notes = glob.glob(os.path.join(VAULT_ROOT, '03_LECTURES/*/*.md'))
    entries = []

    print(f"Scanning {len(notes)} notes in Haseeb-Brain...")

    for npath in sorted(notes):
        with open(npath, 'r', encoding='utf-8') as f:
            c = f.read()

        # Parse frontmatter
        m_fm = re.match(r'^---\n(.*?)\n---', c, re.DOTALL)
        if not m_fm:
            continue
        fm_text = m_fm.group(1)

        def get_val(key, default=""):
            m = re.search(rf'^{key}:\s*["\']?(.*?)["\']?\s*$', fm_text, re.MULTILINE)
            return m.group(1).strip() if m else default

        yid = get_val('youtubeId')
        if not yid:
            continue

        domain = get_val('domain', 'general')
        title = get_val('title', yid)
        slug = get_val('slug', f"yt-{yid}")
        status = get_val('status', 'draft')
        model_used = get_val('modelUsed', None)
        reviewed_by = get_val('reviewedBy', None)
        reviewed_at = get_val('reviewedAt', None)
        coverage_warn = get_val('coverageWarning', 'false').lower() == 'true'

        try:
            dur_mins = int(get_val('durationMinutes', '0'))
        except:
            dur_mins = 0

        try:
            dur_secs = float(get_val('durationSeconds', '0'))
        except:
            dur_secs = 0.0

        # Quotes count & grounding count
        qm = re.search(r'attributedQuotes:\n(\[.*?\])\ntopics:', c, re.DOTALL)
        quote_count = 0
        grounded_count = 0
        quotes = []
        if qm:
            try:
                quotes = json.loads(qm.group(1))
                quote_count = len(quotes)
                grounded_count = sum(1 for q in quotes if q.get('matchedText') is True)
            except:
                pass

        # Ayahs count & valid count
        am = re.search(r'quranCitations:\n(\[.*?\])\nattributedQuotes:', c, re.DOTALL)
        ayah_count = 0
        valid_ayah_count = 0
        ayahs = []
        if am:
            try:
                ayahs = json.loads(am.group(1))
                ayah_count = len(ayahs)
                valid_ayah_count = sum(1 for a in ayahs if a.get('matched') is True or a.get('textVerified') is True)
            except:
                pass

        has_full_dossier = "## 📌 Executive Summary" in c and model_used is not None

        entries.append({
            "id": f"yt-{yid}",
            "youtubeId": yid,
            "title": title,
            "slug": slug,
            "domain": domain,
            "status": status,
            "durationMinutes": dur_mins,
            "durationSeconds": dur_secs,
            "modelUsed": model_used,
            "hasFullDossier": has_full_dossier,
            "quoteCount": quote_count,
            "groundedQuoteCount": grounded_count,
            "ayahCount": ayah_count,
            "validAyahCount": valid_ayah_count,
            "coverageWarning": coverage_warn,
            "reviewedBy": reviewed_by if reviewed_by != 'null' else None,
            "reviewedAt": reviewed_at if reviewed_at != 'null' else None,
            "noteRelativePath": os.path.relpath(npath, VAULT_ROOT).replace('\\', '/')
        })

    # Sort: processed first, then domain, then title
    entries.sort(key=lambda x: (not x['hasFullDossier'], x['domain'], x['title']))

    manifest_data = {
        "generatedAt": datetime.now().isoformat(),
        "totalLectures": len(entries),
        "dossierCompleted": sum(1 for e in entries if e['hasFullDossier']),
        "evergreenCount": sum(1 for e in entries if e['status'] == 'evergreen'),
        "draftCount": sum(1 for e in entries if e['status'] == 'draft'),
        "lectures": entries
    }

    with open(MANIFEST_PATH, 'w', encoding='utf-8') as f:
        json.dump(manifest_data, f, ensure_ascii=False, indent=2)

    print(f"✓ Successfully generated manifest.json with {len(entries)} lectures ({manifest_data['dossierCompleted']} completed dossiers)!")
    return manifest_data

if __name__ == '__main__':
    generate_manifest()
