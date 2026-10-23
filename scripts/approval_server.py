"""
Adlwise Approval Loopback Micro-Server
Listens on http://localhost:3456
Receives review decisions from 1-page HTML digests:
1. Logs to Haseeb-Brain/06_REVIEW_DIGESTS/approval_ledger.json
2. Updates Haseeb-Brain/03_LECTURES/[domain]/yt-<id>.md frontmatter (status: evergreen)
3. Canonicalizes scholar-edited quotes (editedByScholar: true)
4. Enriches live adlwise-com/src/lib/lectures/catalog.json upon approval
"""

import os
import json
import re
from datetime import datetime
from http.server import HTTPServer, BaseHTTPRequestHandler

PORT = 3456
VAULT_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '../../Haseeb-Brain'))
CATALOG_PATH = os.path.abspath(os.path.join(os.path.dirname(__file__), '../src/lib/lectures/catalog.json'))
LEDGER_PATH = os.path.join(VAULT_ROOT, '06_REVIEW_DIGESTS/approval_ledger.json')

class ReviewHandler(BaseHTTPRequestHandler):
    def _set_cors_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')

    def do_OPTIONS(self):
        self.send_response(200)
        self._set_cors_headers()
        self.end_headers()

    def do_POST(self):
        if self.path == '/api/review':
            content_length = int(self.headers.get('Content-Length', 0))
            post_data = self.rfile.read(content_length)
            try:
                payload = json.loads(post_data.decode('utf-8'))
            except Exception as e:
                self.send_response(400)
                self._set_cors_headers()
                self.end_headers()
                self.wfile.write(json.dumps({"error": f"Invalid JSON: {str(e)}"}).encode())
                return

            yid = payload.get('youtubeId')
            domain = payload.get('domain')
            action = payload.get('action', 'approve')
            reviewed_by = payload.get('reviewedBy', 'Dr. Hafiz Haseeb')
            edited_quotes = payload.get('editedQuotes', [])
            notes = payload.get('notes', '')
            timestamp = datetime.now().isoformat()

            if not yid or not domain:
                self.send_response(400)
                self._set_cors_headers()
                self.end_headers()
                self.wfile.write(json.dumps({"error": "Missing youtubeId or domain"}).encode())
                return

            note_id = f"yt-{yid}"
            note_path = os.path.join(VAULT_ROOT, f"03_LECTURES/{domain}/{note_id}.md")

            # 1. Append to approval ledger
            ledger = []
            if os.path.exists(LEDGER_PATH):
                try:
                    with open(LEDGER_PATH, 'r', encoding='utf-8') as f:
                        ledger = json.load(f)
                except:
                    ledger = []
            
            ledger_entry = {
                "youtubeId": yid,
                "noteId": note_id,
                "domain": domain,
                "action": action,
                "reviewedBy": reviewed_by,
                "timestamp": timestamp,
                "notes": notes,
                "editedQuotes": edited_quotes
            }
            ledger.append(ledger_entry)
            os.makedirs(os.path.dirname(LEDGER_PATH), exist_ok=True)
            with open(LEDGER_PATH, 'w', encoding='utf-8') as f:
                json.dump(ledger, f, ensure_ascii=False, indent=2)

            # 2. Patch Markdown Note in Haseeb-Brain
            if os.path.exists(note_path):
                with open(note_path, 'r', encoding='utf-8') as f:
                    content = f.read()

                # Extract frontmatter
                m = re.match(r'^---\n(.*?)\n---\n(.*)$', content, re.DOTALL)
                if m:
                    fm_text = m.group(1)
                    body_text = m.group(2)

                    if action == 'approve':
                        fm_text = re.sub(r'status:\s*draft', 'status: evergreen', fm_text)
                        fm_text = re.sub(r'reviewedBy:\s*.*', f'reviewedBy: "{reviewed_by}"', fm_text)
                        fm_text = re.sub(r'reviewedAt:\s*.*', f'reviewedAt: "{timestamp[:10]}"', fm_text)

                    # Apply quote edits if any
                    for eq in edited_quotes:
                        old_q = eq.get('oldText', '')
                        new_q = eq.get('newText', '')
                        if old_q and new_q:
                            fm_text = fm_text.replace(f'"{old_q}"', f'"{new_q}"')
                            body_text = body_text.replace(f'"{old_q}"', f'"{new_q}"')

                    new_note_content = f"---\n{fm_text}\n---\n{body_text}"
                    with open(note_path, 'w', encoding='utf-8') as f:
                        f.write(new_note_content)

            # 3. Update catalog.json if approved
            if action == 'approve' and os.path.exists(CATALOG_PATH):
                try:
                    with open(CATALOG_PATH, 'r', encoding='utf-8') as f:
                        catalog = json.load(f)
                    
                    # Read summary from note
                    summary = ""
                    if os.path.exists(note_path):
                        with open(note_path, 'r', encoding='utf-8') as f:
                            raw = f.read()
                            sm = re.search(r'## 📌 Executive Summary\n\n(.*?)\n\n---', raw, re.DOTALL)
                            if sm:
                                summary = sm.group(1).strip()

                    updated = False
                    for item in catalog:
                        if item.get('youtubeId') == yid:
                            if summary:
                                item['summary'] = summary
                            item['isEvergreen'] = True
                            item['reviewedAt'] = timestamp[:10]
                            updated = True
                            break

                    if updated:
                        with open(CATALOG_PATH, 'w', encoding='utf-8') as f:
                            json.dump(catalog, f, ensure_ascii=False, indent=2)
                except Exception as e:
                    print(f"Catalog sync warning: {e}")

            # Send response
            self.send_response(200)
            self._set_cors_headers()
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            resp = {
                "success": True,
                "action": action,
                "noteId": note_id,
                "status": "evergreen" if action == 'approve' else "flagged",
                "message": f"Successfully recorded {action} for {note_id}!"
            }
            self.wfile.write(json.dumps(resp).encode())
        else:
            self.send_response(404)
            self.end_headers()

def run_server():
    server_address = ('', PORT)
    httpd = HTTPServer(server_address, ReviewHandler)
    print(f"Adlwise Approval Server running on http://localhost:{PORT}...")
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nStopping approval server...")
        httpd.server_close()

if __name__ == '__main__':
    run_server()
