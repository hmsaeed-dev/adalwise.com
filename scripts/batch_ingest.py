"""
Batch Ingestion Runner for Haseeb-Brain.
Selects un-ingested skeleton notes from manifest.json and runs the
transcription, Gemini synthesis, and verification pipeline.

Usage:
  python scripts/batch_ingest.py --limit 5
  python scripts/batch_ingest.py --domain constitutional-law --limit 10
  python scripts/batch_ingest.py --domain tafsir --limit 20
"""

import os
import sys
import json
import argparse
import importlib.util

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
VAULT_ROOT = os.path.abspath(os.path.join(SCRIPT_DIR, '../../Haseeb-Brain'))
MANIFEST_PATH = os.path.join(VAULT_ROOT, 'manifest.json')

# Dynamically import pipeline module
pipeline_path = os.path.join(SCRIPT_DIR, "run-pilot-pipeline.py")
spec = importlib.util.spec_from_file_location("pipeline_module", pipeline_path)
mod = importlib.util.module_from_spec(spec)
spec.loader.exec_module(mod)

# Dynamically import manifest generator
gen_manifest_path = os.path.join(SCRIPT_DIR, "generate-brain-manifest.py")
spec_m = importlib.util.spec_from_file_location("manifest_module", gen_manifest_path)
mod_m = importlib.util.module_from_spec(spec_m)
spec_m.loader.exec_module(mod_m)

def main():
    parser = argparse.ArgumentParser(description="Batch Ingest Lectures into Haseeb-Brain")
    parser.add_argument("--limit", type=int, default=5, help="Number of lectures to process in this batch (default: 5)")
    parser.add_argument("--domain", type=str, default="all", help="Target domain (tafsir, civic-ethics, seerah, etc.) or 'all'")
    parser.add_argument("--id", type=str, default=None, help="Target a specific lecture ID or YouTube ID directly")
    parser.add_argument("--dry-run", action="store_true", help="Print lectures to be processed without executing")
    args = parser.parse_args()

    if not os.path.exists(MANIFEST_PATH):
        print(f"ERROR: manifest.json not found at {MANIFEST_PATH}", flush=True)
        sys.exit(1)

    with open(MANIFEST_PATH, 'r', encoding='utf-8') as f:
        manifest = json.load(f)

    # Filter skeleton lectures awaiting pipeline
    pending = [
        lec for lec in manifest['lectures']
        if not lec.get('hasFullDossier', False)
    ]

    if args.id:
        target = args.id.replace('yt-', '')
        pending = [lec for lec in pending if lec.get('id') == args.id or lec.get('youtubeId') == target]
        if not pending:
            print(f"Lecture '{args.id}' not found in pending skeleton queue (may already have full dossier)!", flush=True)
            return
    elif args.domain != 'all':
        pending = [lec for lec in pending if lec.get('domain') == args.domain]

    # Priority Sort: Processed first, then Staged/Prioritized items first, then domain, then title
    pending.sort(key=lambda x: (not x.get('priority', False), x.get('domain', ''), x.get('title', '')))

    if not pending:
        print(f"✓ All lectures in domain '{args.domain}' already have full dossiers!", flush=True)
        return

    prioritized_count = sum(1 for p in pending if p.get('priority', False))
    batch = pending[:args.limit]

    print(f"\n=======================================================", flush=True)
    print(f"Haseeb-Brain Batch Ingestion Engine", flush=True)
    print(f"Total Pending in Queue: {len(pending)}")
    print(f"Staged Priorities in Queue: {prioritized_count}")
    print(f"Selected for this batch: {len(batch)} lectures (Domain: {args.domain})")
    print(f"=======================================================\n", flush=True)

    for idx, lec in enumerate(batch):
        tag = "[★ STAGED] " if lec.get('priority') else ""
        print(f"  {idx+1}. {tag}[{lec.get('domain')}] {lec.get('title')} ({lec.get('youtubeId')}) - {lec.get('durationMinutes')} mins")

    if args.dry_run:
        print("\n[Dry run complete. No processing executed.]", flush=True)
        return

    # Check for GEMINI_API_KEY
    api_key = os.environ.get('GEMINI_API_KEY') or os.environ.get('GOOGLE_API_KEY')
    if not api_key:
        print("\n⚠️ WARNING: GEMINI_API_KEY environment variable not detected in shell.", flush=True)
        print("Set it before running: $env:GEMINI_API_KEY = 'your_key'\n", flush=True)

    success_count = 0
    fail_count = 0

    for idx, lec in enumerate(batch):
        print(f"\n[{idx+1}/{len(batch)}] Processing: {lec.get('title')} ({lec.get('youtubeId')})...", flush=True)
        
        lecture_input = {
            "domain": lec.get("domain"),
            "title": lec.get("title"),
            "youtubeId": lec.get("youtubeId"),
            "slug": lec.get("slug"),
            "date": lec.get("publishedAt", "2026-01-01")
        }

        try:
            ok = mod.process_lecture(lecture_input)
            if ok:
                success_count += 1
                print(f"✓ Succeeded: {lec.get('youtubeId')}", flush=True)
            else:
                fail_count += 1
                print(f"✗ Failed: {lec.get('youtubeId')}", flush=True)
        except Exception as e:
            fail_count += 1
            print(f"✗ Exception processing {lec.get('youtubeId')}: {e}", flush=True)

    # Re-generate manifest.json
    print(f"\n[Post-batch] Updating manifest.json single source of truth...", flush=True)
    mod_m.generate_manifest()

    print(f"\n=======================================================", flush=True)
    print(f"Batch Complete: {success_count} succeeded, {fail_count} failed")
    print(f"Now ready for review in Curator Studio!")
    print(f"Tip: Run 'git add . && git commit -m \"feat: ingest batch\" && git push' in Haseeb-Brain to update Vercel.")
    print(f"=======================================================\n", flush=True)

if __name__ == '__main__':
    main()
