import os
import glob
import json
import re

VAULT = 'D:/Work/projects/Adlwise/Haseeb-Brain'
notes = glob.glob(f'{VAULT}/03_LECTURES/*/*.md')

total_lectures = 0
total_mins = 0
total_quotes = 0
grounded_quotes = 0
total_ayahs = 0
verified_ayahs = 0

print(f'=== PILOT BATCH METRICS AUDIT ===')
print(f'{"ID":<14} | {"Domain":<18} | {"Duration":<8} | {"Quotes":<8} | {"Grounded":<8} | {"Ayahs":<6} | {"Status"}')
print('-' * 80)

for n in sorted(notes):
    with open(n, encoding='utf-8') as f:
        c = f.read()
    if 'modelUsed:' not in c:
        continue
        
    m_id = re.search(r'id:\s*["\']yt-(.*?)["\']', c)
    m_dom = re.search(r'domain:\s*["\'](.*?)["\']', c)
    m_dur = re.search(r'durationMinutes:\s*(\d+)', c)
    m_stat = re.search(r'status:\s*(\w+)', c)
    
    if not m_id:
        continue
    
    yid = m_id.group(1)
    dom = m_dom.group(1) if m_dom else 'unknown'
    dur = int(m_dur.group(1)) if m_dur else 0
    stat = m_stat.group(1) if m_stat else 'draft'
    
    total_lectures += 1
    total_mins += dur
    
    # Extract quotes
    qm = re.search(r'attributedQuotes:\n(\[.*?\])\ntopics:', c, re.DOTALL)
    q_count, g_count = 0, 0
    if qm:
        try:
            q_list = json.loads(qm.group(1))
            q_count = len(q_list)
            g_count = sum(1 for q in q_list if q.get('matchedText') or q.get('similarity', 0) >= 0.65)
        except Exception as e:
            pass
            
    # Extract ayahs
    am = re.search(r'quranCitations:\n(\[.*?\])\nattributedQuotes:', c, re.DOTALL)
    a_count, v_count = 0, 0
    if am:
        try:
            a_list = json.loads(am.group(1))
            a_count = len(a_list)
            v_count = sum(1 for a in a_list if a.get('matched') or a.get('textVerified'))
        except Exception as e:
            pass
            
    total_quotes += q_count
    grounded_quotes += g_count
    total_ayahs += a_count
    verified_ayahs += v_count
    
    print(f'{yid:<14} | {dom:<18} | {dur:<4} min | {q_count:<8} | {g_count:<8} | {v_count}/{a_count:<4} | {stat}')

print('-' * 80)
print(f'Total Completed: {total_lectures} lectures ({total_mins} mins / {total_mins/60:.1f} hours)')
print(f'Total Attributed Quotes: {total_quotes} (Grounded: {grounded_quotes}, {grounded_quotes/max(1,total_quotes)*100:.1f}%)')
print(f'Total Quran Citations: {total_ayahs} (Canonical Validated: {verified_ayahs}, {verified_ayahs/max(1,total_ayahs)*100:.1f}%)')
