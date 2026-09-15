"""
YouTube Channel Advanced Deep Insights Engine & Strict Categorizer
Optimized for: Dr. Hafiz Haseeb's Channel Content Analytics
"""

import os
import csv
import re
from datetime import datetime
from googleapiclient.discovery import build

# ---- CONFIG & ADVANCED ARCHITECTURE ---------------------------------------
API_KEY = os.environ.get("YOUTUBE_API_KEY", "AIzaSyA5Cy0vBE0uGCpmG-7jTihKG9_Sf3M2-g4")
CHANNEL_ID = os.environ.get("YOUTUBE_CHANNEL_ID", "UC-kXQOPfwXspzHaxsPd9PEg")
OUTPUT_CSV = "channel_deep_analytics.csv"

# Tier 1: Structural Delivery Archetypes Matrix
ARCHETYPE_TAXONOMY = {
    "Serial Coursework": ["ep-", "ep ", "episode", "part", "lec-", "lecture-", "قسط", "سبق", "کلاس", "course"],
    "Standalone Keynotes": ["bayan", "khutbah", "juma", "address", "خطبہ", "بیان", "تقریر", "sermon"],
    "Thematic Academic Seminars": ["special lecture", "seminar", "workshop", "webinar"],
    "Public Dialogue": ["q&a", "sawal", "jawab", "interview", "podcast", "meeting", "نشست", "سوال", "جواب"]
}


# Tier 2: Thematic Knowledge Domains (Information Architecture Plan)
THEMATIC_TAXONOMY = {
    "Iqbalian Philosophy (Fikr-e-Iqbal)": {
        "keywords": ["iqbal", "allama iqbal", "kalam-e-iqbal", "khudi", "shaheen", "philosoph", "اقبال", "ضربِ کلیم", "بانگِ درا"],
        "sub_categories": {
            "Bang-e-Dra": ["bang-e-dra", "dra", "بانگ"],
            "Bal-e-Jibril": ["bal-e-jibril", "jibril", "جبریل"],
            "Zarb-e-Kalim": ["zarb-e-kalim", "kalim", "کلیم"],
            "Javid-Nama": ["javid nama", "javid", "جاوید"],
            "Shikwa / Jawab-e-Shikwa": ["shikwa", "jawab-e-shikwa", "شکوہ"],
            "Philosophical Concepts": ["khudi", "shaheen", "mard-e-momin", "philosophy", "fikr"]
        }
    },
    "Quranic Exegesis & Core Theology": {
        "keywords": ["allah", "fatiha", "baqara", "quran", "divine", "guidance", "hidayah", "نعبد", "نستعین", "ہدایت", "قرآن"],
        "sub_categories": {
            "Translation & Explanation": ["tarjuma", "explanation", "tarjumaequran", "exegesis"],
            "Theological Principles": ["allah", "divine", "guidance", "hidayah", "faith", "توحید"]
        }
    },
    "Civilizational History & Seerah": {
        "keywords": ["history", "tareekh", "khilafat", "caliphate", "sahaba", "seerat", "seerah", "prophet", "battle", "ghazwa", "andalus", "ottoman", "تاریخ", "سیرت", "مصطفٰی", "مدینہ", "madina", "sermon"],
        "sub_categories": {
            "Prophetic Era (Seerah)": ["seerat", "seerah", "prophet", "ghazwa", "غزوہ", "مصطفٰی", "madina", "مدینہ", "sermon"],
            "Companions (Sahaba)": ["sahaba", "صحابہ", "sahabiyat"],
            "Empires & Caliphates": ["khilafat", "caliphate", "ottoman", "andalus", "empire", "tareekh", "عثمانی"]
        }
    },
    "Constitutional Law & Statecraft": {
        "keywords": ["constitution", "pakistan constitution", "1973", "constitutional", "amendment", "law", "supreme court", "article", "ain", "آئین", "قانون"],
        "sub_categories": {
            "Constitutional Articles Breakdown": ["article", "art", "دفعہ"],
            "Amendments & Legal History": ["amendment", "1973", "ain", "law", "ترمیم"],
            "State Framework & Judiciary": ["supreme court", "court", "fundamental rights", "judiciary", "عدالت"]
        }
    },
    "Contemporary Socio-Political Issues": {
        "keywords": ["secularism", "state", "imran khan", "politics", "ummat", "gaza", "justice", "عدل", "سیاست", "معاشی"],
        "sub_categories": {
            "State vs. Secularism": ["secularism", "secular", "state", "west"],
            "Current Events & Social Critiques": ["imran khan", "politics", "ummat", "gaza", "justice", "عدل"]
        }
    },
    "Classical Literature & Prose": {
        "keywords": ["adab", "literature", "shayari", "shaeri", "ghazal", "nazm", "urdu poetry", "rumi", "ghalib", "book review", "kitab", "ادب", "شعر", "غزل"],
        "sub_categories": {
            "Classical Urdu Poetry": ["shayari", "shaeri", "ghazal", "nazm", "urdu poetry", "ghalib", "شاعری", "عشق"],
            "Literary Reviews & Prose": ["adab", "literature", "book review", "kitab", "rumi", "کتاب"]
        }
    },
    "Socio-Spiritual Ethics & Family": {
        "keywords": ["reflection", "tazkiyah", "tarbiyat", "soul", "spirituality", "tasawwuf", "sufi", "islah", "advice", "naseehat", "family", "marriage", "parenting", "divorce", "talaq", "nikah", "خاندان", "تربیت", "purpose of life"],
        "sub_categories": {
            "Social & Family Ethics": ["family", "marriage", "parenting", "divorce", "talaq", "nikah", "children", "نکاح", "طلاق"],
            "Spiritual Purification (Tazkiyah)": ["reflection", "tazkiyah", "tarbiyat", "soul", "spirituality", "tasawwuf", "sufi", "islah", "advice", "تزکیہ", "purpose"]
        }
    }
}

# ---- CORE ENGINE PARSERS --------------------------------------------------

def parse_iso_duration_to_seconds(duration_str):
    match = re.match(r'PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?', duration_str)
    if not match:
        return 0
    hours = int(match.group(1)) if match.group(1) else 0
    minutes = int(match.group(2)) if match.group(2) else 0
    seconds = int(match.group(3)) if match.group(3) else 0
    return (hours * 3600) + (minutes * 60) + seconds


def format_seconds(total_seconds):
    if total_seconds == 0:
        return "00:00"
    hours = total_seconds // 3600
    minutes = (total_seconds % 3600) // 60
    seconds = total_seconds % 60
    if hours > 0:
        return f"{hours:02d}:{minutes:02d}:{seconds:02d}"
    return f"{minutes:02d}:{seconds:02d}"


def clean_description(desc_text):
    """Sanitizes descriptions into single-line formats to secure cell alignment integrity in Excel/Sheets."""
    if not desc_text:
        return ""
    # Strip URLs and collapse newline breaks/tabs safely
    desc_cleaned = re.sub(r'http\s\S+', '', desc_text)
    desc_cleaned = " ".join(desc_cleaned.split())
    return desc_cleaned[:600] + "..." if len(desc_cleaned) > 600 else desc_cleaned


def extract_structural_archetype(title_text, desc_tags_text):
    """Identifies presentation format using strict matching constraints."""
    text_corpus = f"{title_text} {desc_tags_text}".lower()
    scores = {}

    for arch, keywords in ARCHETYPE_TAXONOMY.items():
        score = sum(len(re.findall(re.escape(kw), text_corpus)) for kw in keywords)
        if score > 0:
            scores[arch] = score

    if scores:
        return max(scores, key=scores.get)
    return "General Discourse"


def process_hierarchical_category(title_text, desc_tags_text):
    """Executes multi-tier weighted taxonomy tracking to protect against unorganized categorization anomalies."""
    title_text_lower = title_text.lower()
    desc_tags_text_lower = desc_tags_text.lower()

    primary_scores = {}

    # Tier 1 Analysis loop
    for domain, domain_data in THEMATIC_TAXONOMY.items():
        score = 0
        for kw in domain_data["keywords"]:
            clean_kw = re.escape(kw.lower())
            score += len(re.findall(clean_kw, title_text_lower)) * 5  # Strong title weighting factor
            score += len(re.findall(clean_kw, desc_tags_text_lower))
        if score > 0:
            primary_scores[domain] = score

    if primary_scores:
        chosen_primary = max(primary_scores, key=primary_scores.get)

        # Tier 2 Analysis loop
        sub_maps = THEMATIC_TAXONOMY[chosen_primary]["sub_categories"]
        sub_scores = {}
        for sub_cat, sub_kws in sub_maps.items():
            sub_score = 0
            for skw in sub_kws:
                clean_skw = re.escape(skw.lower())
                sub_score += len(re.findall(clean_skw, title_text_lower)) * 3
                sub_score += len(re.findall(clean_skw, desc_tags_text_lower))
            if sub_score > 0:
                sub_scores[sub_cat] = sub_score

        chosen_sub = max(sub_scores, key=sub_scores.get) if sub_scores else "General Discussion"
        return chosen_primary, chosen_sub

    # ---- HEURISTIC ARCHETYPE REGEX WATERFALL FALLBACKS ----
    legal_fallback = r'(sc|hc|nab|court|judge|عدالت|مقدمہ|آرٹیکل)'
    prophetic_fallback = r'(ﷺ|ؓ|ؒ|علیہ السلام|صحابہ)'

    if re.search(legal_fallback, title_text_lower):
        return "Constitutional Law & Statecraft", "General Legal Commentary"
    if re.search(prophetic_fallback, title_text_lower):
        return "Civilizational History & Seerah", "General Historical Reflections"

    return "General Public Address", "Unassigned Overview Topics"

# ---- RUNNER LOGIC ---------------------------------------------------------

def main():
    if "PASTE_YOUR" in API_KEY or "PASTE_" in CHANNEL_ID:
        print("[CRITICAL] Check your configuration keys.")
        return

    youtube = build("youtube", "v3", developerKey=API_KEY)

    resp = youtube.channels().list(part="contentDetails,snippet", id=CHANNEL_ID).execute()
    if not resp.get("items"):
        print("[ERROR] Channel context missing.")
        return

    uploads_playlist_id = resp["items"][0]["contentDetails"]["relatedPlaylists"]["uploads"]
    channel_name = resp["items"][0]["snippet"]["title"]
    print(f"Executing Deep Harvest for Channel: {channel_name}")

    video_ids = []
    next_page = None
    while True:
        p_resp = youtube.playlistItems().list(
            part="contentDetails", playlistId=uploads_playlist_id, maxResults=50, pageToken=next_page
        ).execute()
        video_ids.extend(item["contentDetails"]["videoId"] for item in p_resp["items"])
        next_page = p_resp.get("nextPageToken")
        if not next_page:
            break

    processed_videos = []
    for chunk in [video_ids[i:i + 50] for i in range(0, len(video_ids), 50)]:
        v_resp = youtube.videos().list(
            part="snippet,statistics,contentDetails", id=",".join(chunk)
        ).execute()

        for item in v_resp.get("items", []):
            snippet = item["snippet"]
            stats = item.get("statistics", {})
            cd = item["contentDetails"]

            views = int(stats.get("viewCount", 0))
            likes = int(stats.get("likeCount", 0))
            comments = int(stats.get("commentCount", 0))

            raw_desc = snippet.get("description", "")
            raw_tags = ", ".join(snippet.get("tags", []))

            pub_date_raw = snippet.get("publishedAt", "")
            dt_obj = datetime.strptime(pub_date_raw, "%Y-%m-%dT%H:%M:%SZ") if pub_date_raw else None

            thumbnails = snippet.get("thumbnails", {})
            best_thumb = thumbnails.get("maxres", thumbnails.get("standard", thumbnails.get("high", {}))).get("url", "")

            v_data = {
                "video_id": item["id"],
                "title": snippet.get("title", ""),
                "description_clean": clean_description(raw_desc),
                "published_date": dt_obj.strftime("%Y-%m-%d") if dt_obj else "",
                "publish_day": dt_obj.strftime("%A") if dt_obj else "",
                "publish_hour": dt_obj.hour if dt_obj else 0,
                "duration_seconds": parse_iso_duration_to_seconds(cd.get("duration", "PT0S")),
                "views": views,
                "likes": likes,
                "comments": comments,
                "engagement_rate_%": round(((likes + comments) / views) * 100, 2) if views > 0 else 0.0,
                "thumbnail_url": best_thumb,
                "url": f"https://youtube.com/watch?v={item['id']}"
            }

            # Extract Information Architecture classifications
            v_data["structural_archetype"] = extract_structural_archetype(v_data["title"], f"{raw_desc} {raw_tags}")
            v_data["primary_domain"], v_data["sub_category"] = process_hierarchical_category(v_data["title"], f"{raw_desc} {raw_tags}")
            processed_videos.append(v_data)

    headers = [
        "title", "structural_archetype", "primary_domain", "sub_category", "published_date",
        "publish_day", "publish_hour", "views", "likes", "comments", "engagement_rate_%",
        "duration_formatted", "thumbnail_url", "url", "video_id", "description_clean"
    ]

    with open(OUTPUT_CSV, "w", newline="", encoding="utf-8-sig") as f:
        writer = csv.DictWriter(f, fieldnames=headers, extrasaction="ignore")
        writer.writeheader()
        for v in sorted(processed_videos, key=lambda x: x["views"], reverse=True):
            v["duration_formatted"] = format_seconds(v["duration_seconds"])
            writer.writerow(v)

    print(f"Extraction Successful. Deep records written to {OUTPUT_CSV}")

    # Display Information Architecture Terminal Summary Breakdown
    print("\n" + "="*115)
    print(f" {'PRIMARY KNOWLEDGE DOMAIN':<35} | {'SUB-CATEGORY TAXONOMY':<38} | {'VIDEOS':<6} | {'AVG VIEWS':<12}")
    print("="*115)

    summary_map = {}
    schedule_analytics = {"days": {}, "hours": {}}

    for v in processed_videos:
        p_dom, s_cat = v["primary_domain"], v["sub_category"]
        summary_map.setdefault(p_dom, {}).setdefault(s_cat, {"count": 0, "views": 0})
        summary_map[p_dom][s_cat]["count"] += 1
        summary_map[p_dom][s_cat]["views"] += v["views"]

        # Aggregate timeline metrics
        day, hour = v["publish_day"], v["publish_hour"]
        schedule_analytics["days"][day] = schedule_analytics["days"].get(day, 0) + v["views"]
        schedule_analytics["hours"][hour] = schedule_analytics["hours"].get(hour, 0) + v["views"]

    for p_dom, sub_dict in sorted(summary_map.items()):
        print(f"► {p_dom.upper():<111}")
        for s_cat, metrics in sorted(sub_dict.items(), key=lambda x: x[1]["views"], reverse=True):
            avg_v = metrics["views"] / metrics["count"]
            print(f"  { ' ':<33} | {s_cat:<38} | {metrics['count']:<6d} | {avg_v:<12,.0f}")
        print("-"*115)

    # Output Timeline Data Insights
    best_day = max(schedule_analytics["days"], key=schedule_analytics["days"].get)
    best_hour = max(schedule_analytics["hours"], key=schedule_analytics["hours"].get)
    print(f"\n[SCHEDULING INSIGHT]: Peak performance drops historically occur on {best_day} around {best_hour}:00 UTC.")

if __name__ == "__main__":
    main()
