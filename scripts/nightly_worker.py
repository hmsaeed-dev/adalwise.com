"""
Haseeb-Brain Nightly Autonomous Ingestion Worker.
Intended to run automatically via Windows Task Scheduler.
- Ingests the next N skeleton lectures.
- Verifies quotes & Quranic citations.
- Updates manifest.json.
- Automatically commits and pushes to GitHub.
- Logs execution to scripts/logs/nightly_YYYY-MM-DD.log.
"""

import os
import sys
import json
import subprocess
from datetime import datetime
import importlib.util

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
LOGS_DIR = os.path.join(SCRIPT_DIR, 'logs')
os.makedirs(LOGS_DIR, exist_ok=True)

today_str = datetime.now().strftime('%Y-%m-%d')
log_file = os.path.join(LOGS_DIR, f"nightly_{today_str}.log")

# Setup logging helper
def log(msg):
    timestamp = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    line = f"[{timestamp}] {msg}"
    print(line, flush=True)
    with open(log_file, 'a', encoding='utf-8') as f:
        f.write(line + '\n')

VAULT_ROOT = os.path.abspath(os.path.join(SCRIPT_DIR, '../../Haseeb-Brain'))
MANIFEST_PATH = os.path.join(VAULT_ROOT, 'manifest.json')

# Dynamically import pipeline module
pipeline_path = os.path.join(SCRIPT_DIR, "run-pilot-pipeline.py")
spec = importlib.util.spec_from_file_location("pipeline_module", pipeline_path)
mod = importlib.util.module_from_spec(spec)
spec.loader.exec_module(mod)

# Dynamically import manifest module
gen_manifest_path = os.path.join(SCRIPT_DIR, "generate-brain-manifest.py")
spec_m = importlib.util.spec_from_file_location("manifest_module", gen_manifest_path)
mod_m = importlib.util.module_from_spec(spec_m)
spec_m.loader.exec_module(mod_m)

BATCH_SIZE = int(os.environ.get('NIGHTLY_BATCH_SIZE', 15))
MAX_CONSECUTIVE_FAILURES = 3

def main():
    log("=======================================================")
    log(f"Starting Haseeb-Brain Nightly Autonomous Ingestion")
    log(f"Target Batch Size: {BATCH_SIZE} lectures")
    log("=======================================================")

    api_key = os.environ.get('GEMINI_API_KEY') or os.environ.get('GOOGLE_API_KEY')
    if not api_key:
        log("ERROR: No GEMINI_API_KEY found in environment. Aborting.")
        sys.exit(1)

    if not os.path.exists(MANIFEST_PATH):
        log(f"ERROR: manifest.json not found at {MANIFEST_PATH}. Aborting.")
        sys.exit(1)

    with open(MANIFEST_PATH, 'r', encoding='utf-8') as f:
        manifest = json.load(f)

    # Find pending skeleton lectures
    pending = [
        lec for lec in manifest['lectures']
        if not lec.get('hasFullDossier', False)
    ]

    if not pending:
        log("✓ SUCCESS: All 576 lectures have already been ingested into full dossiers!")
        return

    batch = pending[:BATCH_SIZE]
    log(f"Selected {len(batch)} lectures to ingest tonight.")

    success_count = 0
    consecutive_failures = 0

    for idx, lec in enumerate(batch):
        yid = lec.get('youtubeId')
        title = lec.get('title')
        domain = lec.get('domain')
        log(f"[{idx+1}/{len(batch)}] Ingesting ({domain}) {title} [{yid}]...")

        lecture_input = {
            "domain": domain,
            "title": title,
            "youtubeId": yid,
            "slug": lec.get("slug"),
            "date": lec.get("publishedAt", "2026-01-01")
        }

        try:
            ok = mod.process_lecture(lecture_input)
            if ok:
                success_count += 1
                consecutive_failures = 0
                log(f"✓ Ingested successfully: {yid}")
            else:
                consecutive_failures += 1
                log(f"✗ Failed: {yid}")
        except Exception as e:
            consecutive_failures += 1
            log(f"✗ Exception on {yid}: {e}")

        # Circuit breaker safety check
        if consecutive_failures >= MAX_CONSECUTIVE_FAILURES:
            log(f"⚠️ Circuit Breaker: {consecutive_failures} consecutive failures. Stopping batch early to protect quota/network.")
            break

    # Regenerate manifest
    log("Updating manifest.json single-source-of-truth...")
    mod_m.generate_manifest()

    # Commit and Push to GitHub
    if success_count > 0:
        log(f"Committing {success_count} newly ingested dossiers to Git...")
        try:
            subprocess.run(["git", "add", "."], cwd=VAULT_ROOT, check=True)
            commit_msg = f"feat(nightly): ingest {success_count} lecture dossiers [{today_str}]"
            subprocess.run(["git", "commit", "-m", commit_msg], cwd=VAULT_ROOT, check=True)
            subprocess.run(["git", "push", "origin", "main"], cwd=VAULT_ROOT, check=True)
            log("✓ Successfully pushed batch to GitHub! Vercel Curator Studio is updated.")
        except Exception as e:
            log(f"⚠️ Git push failed: {e}")
    else:
        log("No lectures were successfully ingested. Skipping git push.")

    log(f"Nightly run complete: {success_count} ingested, {len(batch) - success_count} failed/skipped.")

if __name__ == '__main__':
    main()
