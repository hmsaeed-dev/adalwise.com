import os
import sys
import importlib.util

os.environ["PYTHONIOENCODING"] = "utf-8"

script_path = os.path.join(os.path.dirname(__file__), "run-pilot-pipeline.py")
spec = importlib.util.spec_from_file_location("pipeline_module", script_path)
mod = importlib.util.module_from_spec(spec)
spec.loader.exec_module(mod)

hadid_lec = {
    "domain": "tafsir",
    "title": "99- Hadid R4/A29 | Dora Tarjuma Quran",
    "youtubeId": "yPiU9XaJpsw",
    "slug": "99-hadid-r4-a29-dora-tarjuma-quran",
    "date": "2026-05-01"
}

print("▶ Re-running yt-yPiU9XaJpsw with fixed window and threshold 0.80...")
mod.process_lecture(hadid_lec, force=True)
