## Personas & Entry Points

**What:** 4 personas — cold visitor (search/AI), WhatsApp member, researcher/scholar, Majlis-curious prospect.
**Why:** Most traffic lands on content pages, not Home — architecture must serve non-Home entry.
**How:**

| Persona         | Entry               | Needs                    |
| --------------- | ------------------- | ------------------------ |
| Cold visitor    | Article/Video (L3)  | Trust signal + next step |
| WhatsApp member | Direct stream link  | The specific info fast   |
| Researcher      | Direct article link | Clean citation data      |
| Majlis-curious  | Referral/social     | Credibility + join path  |

---

## Information Architecture — Depth

**What:** 3 levels max (L0 Home → L1 streams/pages → L2 stream landing → L3 individual content).
**Why:** Anything past 3 clicks from Home is misfiled; enforces discipline as content scales to 620+ videos.
**How:**

```
L0 — Adlwise.org
L1 — Adlwise (philosophy) · About Dr. Haseeb · Join
L1 — 4 stream subdomains (twasi. · quran. · majlis. · articles.)
L2 — per-stream landing (schedule/archive/CTA)
L3 — individual article / video / Majlis recap
```

---

## Connections

**What:** Footer, cross-stream, subdomain, breadcrumb rules.
**Why:** Content pages must stand alone since most visitors skip Home entirely.
**How:**

- Every L3 page → footer links to About + Join (fixed, no exceptions)
- Cross-links are topical (same subject), not structural (same stream)
- Each subdomain carries full nav back to root + sideways to other 3 streams
- Breadcrumb schema on every L3: `Stream → Content title`

---

## User Journeys

**What:** Journey A (cold visitor) and Journey B (existing member).
**Why:** These two paths carry the most traffic — design decisions optimize for them first.
**How:**

| Journey             | Path                                                 |
| ------------------- | ---------------------------------------------------- |
| A — Cold visitor    | Article (L3) → About → Join                          |
| B — Existing member | Shared link → Subdomain landing (L2) → done, no Home |

---

## Build Order

**What:** Shared layout → L3 template → one full stream → replicate.
**Why:** Sequencing matches the IA dependency chain — nav/footer is load-bearing for every page.
**How:**

1. Header/nav/footer component (About + Join baked in)
2. Article (L3) template
3. Articles stream (L1/L2) — proves hierarchy end-to-end
4. Replicate for remaining 3 streams

## Global Navigation (root — Adlwise.org)

**What:** Persistent header on every root-domain page: logo/wordmark, 4 stream links, About, Join CTA.
**Why:** Root nav is the map — every stream and content type must be reachable in one click from any root page.
**How:**

```
[Adlwise wordmark] — Twasi al-Haq · Quran Learning · Majlis · Articles — About — [Join] (button)
```

- Wordmark links home
- Join is visually a button, not a text link — it's the conversion point
- No dropdowns at this scale (4 streams) — flat, all visible

---

## Subdomain Navigation (per stream)

**What:** Same header component, but current stream is active/highlighted; other 3 streams + root remain one click away.
**Why:** A visitor landing directly on `majlis.Adlwise.org` via shared link must not feel stuck in a silo.
**How:**

```
[Adlwise wordmark → root] — Majlis (active) · Twasi al-Haq · Quran Learning · Articles — About — [Join]
```

- Active stream visually distinct (underline or ink weight, not a new color)
- Wordmark always routes back to `Adlwise.org`, not to the subdomain's own L2 landing

---

## Content-Page (L3) Navigation

**What:** Full global nav + breadcrumb + footer nav — no separate "article nav."
**Why:** L3 is the highest-traffic entry point (SEO/AI citation) — must carry full wayfinding, not assume prior context.
**How:**

```
Header: [wordmark] — 4 streams — About — [Join]
Breadcrumb: Articles → Economic Policy in Islam
Footer: About Dr. Haseeb · Join WhatsApp · [other streams, text links]
```

---

## Mobile Navigation

**What:** Collapsed hamburger for the 4 streams + About; Join stays persistent.
**Why:** Most WhatsApp-referred traffic (Journey B) is mobile — Join CTA must never be hidden behind a menu tap.
**How:**

```
[hamburger] [wordmark]                    [Join]
```

- Hamburger opens: 4 streams, About — stacked, no nesting
- Join button pinned outside the hamburger, always visible

---

## Footer Navigation (sitewide, all pages)

**What:** One consistent footer block — About, Join, all 4 streams, no exceptions per page type.
**Why:** This is the safety net for any visitor who scrolled past the header without acting — must repeat the core paths.
**How:**

```
About Dr. Haseeb   Join WhatsApp Community
Twasi al-Haq · Quran Learning · Majlis · Articles
```

- No sitemap-style exhaustive footer (no per-article links) — keep it to the 6 fixed destinations
- Same markup reused across root + all 4 subdomains (one component, per your Next.js layout structure)
