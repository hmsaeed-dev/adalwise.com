/**
 * Initialize Haseeb-Brain Obsidian Vault (v2 - Stable IDs & Granular Verification)
 * 
 * Generates:
 * 1. 00_ATLAS/Atlas.md & Methodology.md
 * 2. 01_DOMAINS/ 6 Domain MOCs linking via immutable IDs [[yt-<id>|Title]]
 * 3. 02_CONCEPTS/ Foundational concept anchor notes
 * 4. 03_LECTURES/[domain]/yt-<youtubeId>.md (576 immutable lecture notes)
 * 5. 05_TRANSCRIPTS/[domain]/ directory for standalone segment JSONs
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CATALOG_PATH = path.resolve(__dirname, '../src/lib/lectures/catalog.json');
const VAULT_ROOT = path.resolve(__dirname, '../../Haseeb-Brain');

if (!fs.existsSync(CATALOG_PATH)) {
  console.error('Catalog not found at:', CATALOG_PATH);
  process.exit(1);
}

const catalog = JSON.parse(fs.readFileSync(CATALOG_PATH, 'utf-8'));
console.log(`Loaded ${catalog.length} lectures from catalog.json`);

const DOMAIN_CONFIG = {
  'tafsir': {
    name: 'Tafsir',
    mocFile: 'Tafsir-MOC.md',
    title: 'Tafsir & Quranic Exegesis',
    description: 'Systematic, contextual, and ayat-by-ayat exploration of the Holy Quran, emphasizing epistemic clarity, thematic coherence, and linguistic fidelity.'
  },
  'civic-ethics': {
    name: 'Civic Ethics',
    mocFile: 'Civic-Ethics-MOC.md',
    title: 'Civic Ethics & Social Reform',
    description: 'The intersection of prophetic guidance and contemporary civic responsibility, professional ethics, public justice, and moral community building.'
  },
  'seerah': {
    name: 'Seerah',
    mocFile: 'Seerah-MOC.md',
    title: 'Seerah & Prophetic Statecraft',
    description: 'The prophetic biography analyzed through institutional development, systemic resistance, diplomacy, and the establishment of the Madinan constitutional order.'
  },
  'lisan-ul-quran': {
    name: 'Lisan ul Quran',
    mocFile: 'Lisan-ul-Quran-MOC.md',
    title: 'Lisan ul Quran & Classical Arabic Grammar',
    description: 'Pedagogical lectures breaking down Quranic Arabic morphology (Sarf), syntax (Nahw), and rhetoric (Balaghah) to unlock direct engagement with sacred texts.'
  },
  'constitutional-law': {
    name: 'Constitutional Law',
    mocFile: 'Constitutional-Law-MOC.md',
    title: 'Constitutional Law & Jurisprudence (Fiqh)',
    description: 'Classical legal philosophy, the Charter of Medina, covenantal obligations, maqasid al-shariah, and modern governance.'
  },
  'iqbal': {
    name: 'Iqbalian Thought',
    mocFile: 'Iqbal-MOC.md',
    title: 'Iqbalian Thought & Civilizational Reconstruction',
    description: 'The poetic, philosophical, and theological reconstruction of Allama Muhammad Iqbal, focusing on Ijtihad, Khudi, spiritual freedom, and anti-imperial resistance.'
  }
};

// Ensure directories
const DIRS = [
  path.join(VAULT_ROOT, '00_ATLAS'),
  path.join(VAULT_ROOT, '01_DOMAINS'),
  path.join(VAULT_ROOT, '02_CONCEPTS'),
  path.join(VAULT_ROOT, '03_LECTURES'),
  path.join(VAULT_ROOT, '04_ARTICLE_SEEDS'),
  path.join(VAULT_ROOT, '05_TRANSCRIPTS'),
  path.join(VAULT_ROOT, '06_REVIEW_DIGESTS'),
];

for (const d of DIRS) {
  if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
}

for (const dom of Object.keys(DOMAIN_CONFIG)) {
  const domDir = path.join(VAULT_ROOT, '03_LECTURES', dom);
  const transDir = path.join(VAULT_ROOT, '05_TRANSCRIPTS', dom);
  if (!fs.existsSync(domDir)) fs.mkdirSync(domDir, { recursive: true });
  if (!fs.existsSync(transDir)) fs.mkdirSync(transDir, { recursive: true });
}

// 1. Generate Atlas.md
const atlasContent = `---
type: hub
status: evergreen
title: "Atlas: The Intellectual Corpus of Dr. Hafiz Haseeb"
aliases:
  - Atlas
  - Haseeb-Brain Nexus
updated: 2026-10-23
---

# 🌌 Atlas: The Intellectual Corpus of Dr. Hafiz Haseeb

> *"Clinical pathology teaches us that treating superficial symptoms without diagnosing the root etiology is malpractice. In sacred hermeneutics, treating textual inquiry as an arena for rhetoric or polemics rather than an exacting forensic science is juristic malpractice."*  
> — **Dr. Hafiz Haseeb**

Welcome to the central second brain of **Dr. Hafiz Haseeb**, physician (consultant hematologist), scholar, and founder of the **Peaceful Quranic Revival Society (PQRS)** and **Adlwise**.

---

## 🧭 Domain Maps of Content (MOCs)

| Domain | MOC Link | Total Lectures | Primary Focus |
| :--- | :--- | :---: | :--- |
| **Tafsir** | [[Tafsir-MOC]] | 349 | Ayat-by-ayat exegesis, thematic coherence, and linguistic precision |
| **Civic Ethics** | [[Civic-Ethics-MOC]] | 109 | Public morality, civic contracts, professional ethics, and reform |
| **Seerah** | [[Seerah-MOC]] | 47 | Prophetic statecraft, constitutional covenants, and peaceful resistance |
| **Lisan ul Quran** | [[Lisan-ul-Quran-MOC]] | 26 | Classical Arabic grammar, morphology, syntax, and rhetoric |
| **Constitutional Law** | [[Constitutional-Law-MOC]] | 25 | Islamic jurisprudence, Charter of Medina, and governance |
| **Iqbalian Thought** | [[Iqbal-MOC]] | 20 | Reconstruction of religious thought, Ijtihad, and intellectual freedom |

**Total Corpus:** **576 Lectures** indexed by immutable ID (\`yt-<id>\`).

---

## 🏛️ Foundational Methodological Anchors

- [[Methodology]]: Clinical diagnostic discipline applied to sacred hermeneutics.
- [[Clinical-Hermeneutics]]: Root etiology vs symptomatic rhetoric.
- [[Prophetic-Statecraft]]: Institutional analysis of the Madinan civic model.
- [[Charter-of-Medina]]: Pluralistic constitutional covenants in classical jurisprudence.
- [[Peaceful-Resistance]]: The Makkan paradigm of intellectual and moral confrontation.
- [[Ijtihad-and-Tradition]]: Iqbal's principle of movement in the structure of Islam.
- [[Civic-Covenants]]: Contractual ethics in modern public life.
`;

fs.writeFileSync(path.join(VAULT_ROOT, '00_ATLAS/Atlas.md'), atlasContent, 'utf-8');

// 2. Generate Methodology.md
const methodContent = `---
type: concept
status: evergreen
title: "The Clinical Hermeneutic Method"
aliases:
  - Clinical Hermeneutics
  - Diagnostic Hermeneutics
updated: 2026-10-23
---

# The Clinical Hermeneutic Method

Dr. Hafiz Haseeb brings the forensic rigor of clinical diagnostic pathology into Islamic jurisprudence and Quranic hermeneutics.

### 1. Etiology Over Symptoms
In clinical medicine, diagnosing an infection by observing fever without isolating the pathogen is malpractice. Similarly, analyzing civilizational decline purely through political crises or sectarian polemics misdiagnoses the disease. The root etiology is epistemic, ethical, and cognitive.

### 2. Systematic Textual Sobriety
Texts must be read in their organic constitutional context. Isolating verses as rhetorical ammunition violates both legal integrity and prophetic methodology.

### 3. Dr. Israr Ahmed (رحمہ اللہ) Legacy
A deep commitment to Quran-centric revival, systemic comprehension, intellectual honesty, and civilizational responsibility serves as an enduring intellectual benchmark.

---

## 🔗 Connected Nodes
- [[Atlas]]
- [[Clinical-Hermeneutics]]
- [[Prophetic-Statecraft]]
- [[Ijtihad-and-Tradition]]
`;

fs.writeFileSync(path.join(VAULT_ROOT, '00_ATLAS/Methodology.md'), methodContent, 'utf-8');

// 3. Generate Core Concepts
const CONCEPTS = [
  {
    slug: 'Clinical-Hermeneutics',
    title: 'Clinical Hermeneutics',
    thesis: 'Forensic diagnostic discipline distinguishing superficial symptoms from root intellectual and moral etiology in textual interpretation.'
  },
  {
    slug: 'Prophetic-Statecraft',
    title: 'Prophetic Statecraft',
    thesis: 'The governance, diplomatic, and constitutional methodology of the Prophet ﷺ in establishing a just social order.'
  },
  {
    slug: 'Charter-of-Medina',
    title: 'Charter of Medina (Mithaq al-Madina)',
    thesis: 'The constitutional covenant establishing a pluralistic federal commonwealth based on shared civic justice (Adl) and collective security.'
  },
  {
    slug: 'Peaceful-Resistance',
    title: 'Peaceful Resistance (Sabr & Civic Discipline)',
    thesis: 'The Makkan strategy of non-violent, intellectually uncompromising confrontation against institutional oligarchy through Quranic dialogue (Al-Furqan 25:52).'
  },
  {
    slug: 'Ijtihad-and-Tradition',
    title: 'Ijtihad and Tradition',
    thesis: 'The principle of movement and renewal in Islamic legal thought as expounded by Allama Iqbal, balancing eternal principles with dynamic historical contexts.'
  },
  {
    slug: 'Civic-Covenants',
    title: 'Civic Covenants & Public Ethics',
    thesis: 'The moral imperatives of modern public contracts, professional responsibility, and judicial accountability rooted in Quranic justice.'
  }
];

for (const c of CONCEPTS) {
  const content = `---
type: concept
status: evergreen
title: "${c.title}"
aliases:
  - "${c.title}"
updated: 2026-10-23
---

# ${c.title}

> **Core Thesis:** ${c.thesis}

---

## 📖 Theoretical Framework
This concept serves as a recurring intellectual pillar throughout Dr. Hafiz Haseeb's discourses and the editorial publications on [Adlwise.com](https://adlwise.com).

---

## 🔗 Connected Nodes
- [[Atlas]]
- [[Methodology]]
`;
  fs.writeFileSync(path.join(VAULT_ROOT, `02_CONCEPTS/${c.slug}.md`), content, 'utf-8');
}

// 4. Group lectures by domain
const domainGroups = {};
for (const key of Object.keys(DOMAIN_CONFIG)) {
  domainGroups[key] = [];
}

for (const item of catalog) {
  const dom = DOMAIN_CONFIG[item.domainId] ? item.domainId : 'tafsir';
  domainGroups[dom].push(item);
}

// 5. Generate Domain MOCs using immutable IDs: [[yt-<id>|Clean Title]]
for (const [domKey, conf] of Object.entries(DOMAIN_CONFIG)) {
  const lectures = domainGroups[domKey] || [];
  
  let tableRows = lectures.map((item, idx) => {
    const mins = Math.round((item.durationSeconds || 0) / 60);
    const date = item.publishedAt ? item.publishedAt.slice(0, 10) : '';
    const cleanTitle = (item.title || item.slug).replace(/\|/g, '-');
    const urdu = item.urduTitle || '-';
    const noteId = `yt-${item.youtubeId}`;
    return `| ${idx + 1} | [[${noteId}\\|${cleanTitle}]] | ${urdu} | ${mins}m | ${date} | [Watch](https://youtu.be/${item.youtubeId}) |`;
  }).join('\n');

  const mocContent = `---
type: hub
status: evergreen
domain: "${domKey}"
title: "${conf.title} (MOC)"
aliases:
  - ${conf.name} MOC
  - ${conf.name} Index
updated: 2026-10-23
---

# 📚 ${conf.title}

> *${conf.description}*

**Total Cataloged Lectures:** **${lectures.length}**  
**Parent Index:** [[Atlas]]

---

## 📑 Lecture Register (Immutable IDs)

| # | Lecture Note | Urdu Title | Duration | Published | Link |
| :-: | :--- | :--- | :-: | :-: | :-: |
${tableRows}

---

## 🔗 Connected Concepts
- [[Atlas]]
- [[Methodology]]
- [[Clinical-Hermeneutics]]
`;

  fs.writeFileSync(path.join(VAULT_ROOT, '01_DOMAINS', conf.mocFile), mocContent, 'utf-8');
}

// 6. Generate 576 Lecture Skeleton Notes with immutable filenames yt-<youtubeId>.md
let createdCount = 0;
for (const item of catalog) {
  const dom = DOMAIN_CONFIG[item.domainId] ? item.domainId : 'tafsir';
  const conf = DOMAIN_CONFIG[dom];
  const mins = Math.round((item.durationSeconds || 0) / 60);
  const date = item.publishedAt ? item.publishedAt.slice(0, 10) : '';
  const cleanTitle = (item.title || item.slug).replace(/["\\]/g, '');
  const urdu = (item.urduTitle || '').replace(/["\\]/g, '');
  const noteId = `yt-${item.youtubeId}`;
  
  const noteContent = `---
type: lecture
status: draft
id: "${noteId}"
youtubeId: "${item.youtubeId}"
slug: "${item.slug}"
title: "${cleanTitle}"
urduTitle: "${urdu}"
speaker: "Dr. Hafiz Haseeb"
domain: "${dom}"
publishedAt: "${date}"
durationSeconds: ${item.durationSeconds || 0}
durationMinutes: ${mins}
transcriptFile: "05_TRANSCRIPTS/${dom}/${noteId}.json"
reviewDigestFile: "06_REVIEW_DIGESTS/${dom}/${noteId}.pdf"
reviewedBy: null
reviewedAt: null
quranCitations: []
attributedQuotes: []
topics:
${(item.topics || [dom]).map(t => `  - "${t}"`).join('\n')}
aliases:
  - "${cleanTitle}"
tags:
  - type/lecture
  - status/draft
  - domain/${dom}
updated: 2026-10-23
---

# ${cleanTitle}

- **ID:** \`${noteId}\`
- **Urdu Title:** ${urdu || 'N/A'}
- **Speaker:** Dr. Hafiz Haseeb
- **Domain:** [[${conf.mocFile.replace('.md', '')}|${conf.name}]]
- **Duration:** ${mins} minutes
- **Published:** ${date}
- **YouTube Link:** [Watch on YouTube](https://youtu.be/${item.youtubeId})
- **Raw Transcript:** \`05_TRANSCRIPTS/${dom}/${noteId}.json\`

---

## 📌 Executive Summary
*(Awaiting segment-grounded transcription & synthesis)*

---

## ⏱ Key Theses & Verified Timestamps
*(Populated from verified Whisper segment bounds)*

---

## 💎 Attributed Quotes (Fuzzy-Grounded to Transcript)
*(Quotes must achieve >=85% fuzzy match against the segment transcript before review)*

---

## 📖 Primary Sources & Granular Ayah Checks
*(Each citation will be validated against canonical Surah:Ayah bounds and Uthmani text)*

---

## 🔗 Connected Nodes
- [[Atlas]]
- [[${conf.mocFile.replace('.md', '')}]]
- [[Methodology]]
- [[Clinical-Hermeneutics]]

---

## 📝 Article Seeds for Adlwise.com
*(Draft article prompts staged for editorial review)*
`;

  const notePath = path.join(VAULT_ROOT, '03_LECTURES', dom, `${noteId}.md`);
  fs.writeFileSync(notePath, noteContent, 'utf-8');
  createdCount++;
}

console.log(`Successfully generated ${createdCount} lecture notes with immutable IDs (yt-<id>.md) across 6 domain directories!`);
