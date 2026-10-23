import os
import time
from google import genai
from google.genai import types

API_KEY = os.environ.get('GEMINI_API_KEY') or os.environ.get('GOOGLE_API_KEY', '')
client = genai.Client(api_key=API_KEY) if API_KEY else None

audio_path = 'Haseeb-Brain/05_TRANSCRIPTS/temp_test.opus'
print(f"Uploading audio: {audio_path}...", flush=True)

uploaded_file = client.files.upload(file=audio_path)
print(f"Uploaded successfully! URI: {uploaded_file.uri}, name: {uploaded_file.name}", flush=True)

# Wait for processing if needed
while uploaded_file.state.name == "PROCESSING":
    print("Processing audio file...", flush=True)
    time.sleep(2)
    uploaded_file = client.files.get(name=uploaded_file.name)

if uploaded_file.state.name == "FAILED":
    print("Audio processing failed.", flush=True)
    exit(1)

print(f"Audio state: {uploaded_file.state.name}", flush=True)

prompt = """
You are an expert transcriber and Islamic scholar reviewing a lecture by Dr. Hafiz Haseeb.
Analyze the provided audio carefully.
The lecture is in Urdu with Arabic Quranic citations.

Please produce a strictly structured JSON response with the following fields:
1. "language": "ur"
2. "durationSeconds": estimated duration in seconds
3. "summary": A concise 2-3 paragraph intellectual summary of the core thesis.
4. "segments": An array of timestamped transcript segments for the lecture:
   [
     { "start": float (seconds), "end": float (seconds), "text": "Verbatim Urdu text spoken" }
   ]
5. "goldenQuotes": An array of direct verbatim quotes:
   [
     { "quote": "Verbatim Urdu/English quote", "timestampSeconds": float, "speaker": "Dr. Hafiz Haseeb" }
   ]
6. "quranCitations": An array of Quranic verses cited:
   [
     { "surahName": "...", "surahNumber": int, "ayahNumber": int, "arabicText": "..." }
   ]
"""

print("Calling gemini-3.8-flash for timestamped transcription & analysis...", flush=True)
start_time = time.time()
response = client.models.generate_content(
    model='gemini-3.8-flash',
    contents=[uploaded_file, prompt],
    config=types.GenerateContentConfig(
        response_mime_type="application/json"
    )
)
elapsed = time.time() - start_time
print(f"Completed in {elapsed:.2f} seconds!", flush=True)
print("Response preview:", flush=True)
print(response.text[:1000], flush=True)

with open('Haseeb-Brain/05_TRANSCRIPTS/CdCbvPohFD4_gemini_raw.json', 'w', encoding='utf-8') as f:
    f.write(response.text)
print("Saved raw response to Haseeb-Brain/05_TRANSCRIPTS/CdCbvPohFD4_gemini_raw.json", flush=True)
