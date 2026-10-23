"""
Runner for the remaining 2 pilot lectures:
1. 6lOzG4pUxo4 (Civic Ethics, 60m) - audio is already downloaded on disk!
2. 7J0Jie2ZtvI (Seerah, 61m) - protected by json_repair
"""

import os
import sys
import importlib.util

# Ensure unbuffered output
os.environ["PYTHONIOENCODING"] = "utf-8"

script_path = os.path.join(os.path.dirname(__file__), "run-pilot-pipeline.py")
spec = importlib.util.spec_from_file_location("pipeline_module", script_path)
mod = importlib.util.module_from_spec(spec)
spec.loader.exec_module(mod)

REMAINING_IDS = ["6lOzG4pUxo4", "7J0Jie2ZtvI"]

def main():
    print("▶ Running remaining 2 pilot lectures with json_repair and Flash fallback...", flush=True)
    lectures_to_run = [lec for lec in mod.PILOT_LECTURES if lec["youtubeId"] in REMAINING_IDS]
    
    success = 0
    for idx, lec in enumerate(lectures_to_run):
        print(f"\n--- [{idx+1}/{len(lectures_to_run)}] Processing {lec['title']} ({lec['youtubeId']}) ---", flush=True)
        if mod.process_lecture(lec):
            success += 1
            print(f"✓ Succeeded on {lec['youtubeId']}", flush=True)
        else:
            print(f"✗ Failed on {lec['youtubeId']}", flush=True)
            
    print(f"\n==========================================", flush=True)
    print(f"Remaining batch complete: {success}/{len(lectures_to_run)} succeeded!", flush=True)
    print(f"==========================================", flush=True)

if __name__ == "__main__":
    main()
