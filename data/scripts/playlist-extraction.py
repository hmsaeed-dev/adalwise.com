"""
YouTube Channel Advanced Deep Insights Engine & Strict Categorizer
Optimized for: Dr. Hafiz Haseeb's Channel Content Analytics
Strategy Change: Explicit Playlist Matching (Removes Heuristic Text Guesswork)
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

# Tier 1 Fallback structural flags (Used contextually if required)
ARCHETYPE_TAXONOMY = {
    "Serial Coursework": ["ep-", "ep ", "episode", "part", "lec-", "lecture-", "قسط", "سبق", "کلاس", "course"],
    "Standalone Keynotes": ["bayan", "khutbah", "juma", "address", "خطبہ", "بیان", "تقریر", "sermon"],
    "Thematic Academic Seminars": ["special lecture", "seminar", "workshop", "webinar"],
    "Public Dialogue": ["q&a", "sawal", "jawab", "interview", "podcast", "meeting", "نشست", "سوال", "جواب"]
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
    desc_cleaned = re.sub(r'http\s\S+', '', desc_text)
    desc_cleaned = " ".join(desc_cleaned.split())
    return desc_cleaned[:600] + "..." if len(desc_cleaned) > 600 else desc_cleaned


def extract_structural_archetype(title_text, desc_tags_text):
    text_corpus = f"{title_text} {desc_tags_text}".lower()
    scores = {}
    for arch, keywords in ARCHETYPE_TAXONOMY.items():
        score = sum(len(re.findall(re.escape(kw), text_corpus)) for kw in keywords)
        if score > 0:
            scores[arch] = score
    if scores:
        return max(scores, key=scores.get)
    return "General Discourse"

# ---- RUNNER LOGIC ---------------------------------------------------------

def main():
    if "PASTE_YOUR" in API_KEY or "PASTE_" in CHANNEL_ID:
        print("[CRITICAL] Check your configuration keys.")
        return

    youtube = build("youtube", "v3", developerKey=API_KEY)

    resp = youtube.channels().list(part="snippet", id=CHANNEL_ID).execute()
    if not resp.get("items"):
        print("[ERROR] Channel context missing.")
        return

    channel_name = resp["items"][0]["snippet"]["title"]
    print(f"Executing Playlist-Driven Harvest for Channel: {channel_name}\n")

    # Step 1: Harvest all playlists configured on the target channel
    playlists_map = {}
    next_pl_page = None

    print("[PHASE 1]: Fetching available Playlists from Channel...")
    while True:
        pl_resp = youtube.playlists().list(
            part="snippet",
            channelId=CHANNEL_ID,
            maxResults=50,
            pageToken=next_pl_page
        ).execute()

        for pl in pl_resp.get("items", []):
            playlists_map[pl["id"]] = pl["snippet"]["title"]

        next_pl_page = pl_resp.get("nextPageToken")
        if not next_pl_page:
            break

    print(f" Found {len(playlists_map)} custom playlists to scrape.\n")

    # Step 2: Loop through playlists and link video IDs directly to their home tracks
    video_to_playlists = {} # Maps unique video_id -> Set of playlist names it belongs to

    print("[PHASE 2]: Mapping videos from distinct playlists...")
    for pl_id, pl_title in playlists_map.items():
        print(f" -> Mapping elements from: '{pl_title}'")
        next_item_page = None
        while True:
            items_resp = youtube.playlistItems().list(
                part="contentDetails",
                playlistId=pl_id,
                maxResults=50,
                pageToken=next_item_page
            ).execute()

            for item in items_resp.get("items", []):
                vid_id = item["contentDetails"]["videoId"]
                video_to_playlists.setdefault(vid_id, set()).add(pl_title)

            next_item_page = items_resp.get("nextPageToken")
            if not next_item_page:
                break

    # Step 3: Fetch video IDs that aren't bound to custom playlists (Unassigned / Loose uploads)
    print("\n[PHASE 3]: Catching unassigned channel uploads...")
    channel_details = youtube.channels().list(part="contentDetails", id=CHANNEL_ID).execute()
    uploads_playlist_id = channel_details["items"][0]["contentDetails"]["relatedPlaylists"]["uploads"]

    next_upload_page = None
    while True:
        up_resp = youtube.playlistItems().list(
            part="contentDetails",
            playlistId=uploads_playlist_id,
            maxResults=50,
            pageToken=next_upload_page
        ).execute()

        for item in up_resp.get("items", []):
            vid_id = item["contentDetails"]["videoId"]
            # If video isn't tracked in a playlist, mark it explicitly
            if vid_id not in video_to_playlists:
                video_to_playlists[vid_id] = {"Unassigned Individual Uploads"}

        next_upload_page = up_resp.get("nextPageToken")
        if not next_upload_page:
            break

    # Step 4: Batch evaluate metrics via the 50-chunk videos endpoint
    all_video_ids = list(video_to_playlists.keys())
    processed_records = []

    print(f"\n[PHASE 4]: Processing deep details for {len(all_video_ids)} target videos...")
    for chunk in [all_video_ids[i:i + 50] for i in range(0, len(all_video_ids), 50)]:
        v_resp = youtube.videos().list(
            part="snippet,statistics,contentDetails",
            id=",".join(chunk)
        ).execute()

        for item in v_resp.get("items", []):
            vid_id = item["id"]
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

            # Videos can exist in multiple playlists; join names cleanly with a pipe breaker
            assigned_playlists = " | ".join(sorted(list(video_to_playlists[vid_id])))

            v_data = {
                "video_id": vid_id,
                "title": snippet.get("title", ""),
                "primary_domain": assigned_playlists, # Maps directly onto your summary mapping printout
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
                "url": f"https://youtube.com/watch?v={vid_id}"
            }

            v_data["structural_archetype"] = extract_structural_archetype(v_data["title"], f"{raw_desc} {raw_tags}")
            processed_records.append(v_data)

    # Step 5: Save files out to system disk
    headers = [
        "title", "primary_domain", "structural_archetype", "published_date",
        "publish_day", "publish_hour", "views", "likes", "comments", "engagement_rate_%",
        "duration_formatted", "thumbnail_url", "url", "video_id", "description_clean"
    ]

    with open(OUTPUT_CSV, "w", newline="", encoding="utf-8-sig") as f:
        writer = csv.DictWriter(f, fieldnames=headers, extrasaction="ignore")
        writer.writeheader()
        for v in sorted(processed_records, key=lambda x: x["views"], reverse=True):
            v["duration_formatted"] = format_seconds(v["duration_seconds"])
            writer.writerow(v)

    print(f"[SUCCESS]: Deep records written directly to {OUTPUT_CSV}")

    # Step 6: Render Visual Console Hierarchy Structure
    print("\n" + "="*115)
    print(f" {'PLAYLIST ASSIGNMENT NAME (CATEGORIZATION)':<76} | {'VIDEOS':<6} | {'AVG VIEWS':<12}")
    print("="*115)

    summary_map = {}
    schedule_analytics = {"days": {}, "hours": {}}

    for v in processed_records:
        pl_group = v["primary_domain"]
        summary_map.setdefault(pl_group, {"count": 0, "views": 0})
        summary_map[pl_group]["count"] += 1
        summary_map[pl_group]["views"] += v["views"]

        day, hour = v["publish_day"], v["publish_hour"]
        schedule_analytics["days"][day] = schedule_analytics["days"].get(day, 0) + v["views"]
        schedule_analytics["hours"][hour] = schedule_analytics["hours"].get(hour, 0) + v["views"]

    for pl_group, metrics in sorted(summary_map.items(), key=lambda x: x[1]["views"], reverse=True):
        avg_v = metrics["views"] / metrics["count"]
        print(f" ► {pl_group:<73} | {metrics['count']:<6d} | {avg_v:<12,.0f}")
    print("-"*115)

    best_day = max(schedule_analytics["days"], key=schedule_analytics["days"].get)
    best_hour = max(schedule_analytics["hours"], key=schedule_analytics["hours"].get)
    print(f"\n[SCHEDULING INSIGHT]: Peak view distribution historically falls on {best_day}s around {best_hour}:00 UTC.")

if __name__ == "__main__":
    main()
