"""
bulk_update_metadata.py

Bulk-updates YouTube video titles/descriptions from a spreadsheet.

SETUP (one time):
    pip install google-auth-oauthlib google-api-python-client pandas openpyxl

    Place your OAuth file as client_secret.json in this same folder.
    (Google Cloud Console -> APIs & Services -> Credentials -> OAuth client ID -> Desktop app)

INPUT FILE:
    An .xlsx or .csv with these columns (extra columns are ignored):
        video_id         - required, the 11-char YouTube video ID
        new_title        - optional, leave blank to keep existing title
        new_description  - optional, leave blank to keep existing description

    Only rows where new_title or new_description is non-empty get updated.

USAGE:
    python bulk_update_metadata.py updates.xlsx
    python bulk_update_metadata.py updates.xlsx --dry-run     # preview only, no API calls that write
    python bulk_update_metadata.py updates.xlsx --limit 50    # cap how many videos to update this run

QUOTA NOTE:
    Each video update costs ~50 + 1 quota units (1 read + 1 write call).
    Default daily project quota is 10,000 units -> roughly 190 video updates/day.
    Run in batches across multiple days for large catalogs, or request a quota increase
    in Google Cloud Console (APIs & Services -> YouTube Data API v3 -> Quotas).
"""

import argparse
import sys
import time
import pandas as pd
from pathlib import Path

from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError

SCOPES = ["https://www.googleapis.com/auth/youtube"]
CLIENT_SECRET_FILE = "client_secret.json"
TOKEN_FILE = "token.json"


def get_authenticated_service():
    creds = None
    if Path(TOKEN_FILE).exists():
        creds = Credentials.from_authorized_user_file(TOKEN_FILE, SCOPES)
    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            if not Path(CLIENT_SECRET_FILE).exists():
                sys.exit(
                    f"ERROR: {CLIENT_SECRET_FILE} not found. Download it from "
                    "Google Cloud Console -> Credentials -> your OAuth client -> Download JSON."
                )
            flow = InstalledAppFlow.from_client_secrets_file(CLIENT_SECRET_FILE, SCOPES)
            creds = flow.run_local_server(port=0)
        with open(TOKEN_FILE, "w") as f:
            f.write(creds.to_json())
    return build("youtube", "v3", credentials=creds)


def load_updates(path):
    path = Path(path)
    if path.suffix.lower() == ".csv":
        df = pd.read_csv(path, dtype=str)
    else:
        df = pd.read_excel(path, dtype=str)
    df.columns = [c.strip().lower() for c in df.columns]
    required = {"video_id"}
    if not required.issubset(df.columns):
        sys.exit(f"ERROR: input file must contain a 'video_id' column. Found: {list(df.columns)}")
    if "new_title" not in df.columns:
        df["new_title"] = None
    if "new_description" not in df.columns:
        df["new_description"] = None

    df = df[df["video_id"].notna() & (df["video_id"].str.strip() != "")]
    df = df[
        (df["new_title"].notna() & (df["new_title"].str.strip() != ""))
        | (df["new_description"].notna() & (df["new_description"].str.strip() != ""))
    ]
    return df.reset_index(drop=True)


def update_video(youtube, video_id, new_title, new_description, dry_run=False):
    # Must fetch current snippet first -- videos.update overwrites the WHOLE snippet object
    resp = youtube.videos().list(part="snippet", id=video_id).execute()
    items = resp.get("items", [])
    if not items:
        return "NOT_FOUND", None

    snippet = items[0]["snippet"]
    old_title = snippet.get("title")
    old_desc = snippet.get("description")

    if new_title and new_title.strip():
        snippet["title"] = new_title.strip()
    if new_description and new_description.strip():
        snippet["description"] = new_description.strip()

    if dry_run:
        return "DRY_RUN", {"old_title": old_title, "new_title": snippet["title"]}

    youtube.videos().update(part="snippet", body={"id": video_id, "snippet": snippet}).execute()
    return "OK", {"old_title": old_title, "new_title": snippet["title"]}


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("input_file", help="xlsx or csv with video_id, new_title, new_description")
    parser.add_argument("--dry-run", action="store_true", help="preview changes without writing")
    parser.add_argument("--limit", type=int, default=None, help="max number of videos to update this run")
    parser.add_argument("--sleep", type=float, default=0.5, help="seconds to wait between API calls")
    args = parser.parse_args()

    df = load_updates(args.input_file)
    if args.limit:
        df = df.head(args.limit)

    if df.empty:
        print("Nothing to update -- no rows had new_title or new_description filled in.")
        return

    print(f"{len(df)} video(s) queued for update. Dry run: {args.dry_run}")

    youtube = get_authenticated_service() if not args.dry_run else None
    if args.dry_run:
        # still need auth for read, but no writes happen
        youtube = get_authenticated_service()

    results = []
    for i, row in df.iterrows():
        vid = row["video_id"].strip()
        try:
            status, info = update_video(
                youtube, vid, row.get("new_title"), row.get("new_description"), dry_run=args.dry_run
            )
            print(f"[{i+1}/{len(df)}] {vid}: {status} -- {info}")
            results.append({"video_id": vid, "status": status, **(info or {})})
        except HttpError as e:
            print(f"[{i+1}/{len(df)}] {vid}: ERROR -- {e}")
            results.append({"video_id": vid, "status": "ERROR", "error": str(e)})
        time.sleep(args.sleep)

    out_path = Path(args.input_file).with_name("update_results.csv")
    pd.DataFrame(results).to_csv(out_path, index=False)
    print(f"\nDone. Log written to {out_path}")


if __name__ == "__main__":
    main()
