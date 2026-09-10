---
name: Adalwise Manuscript Institutional
colors:
  surface: '#fff9e9'
  surface-dim: '#dfdac9'
  surface-bright: '#fff9e9'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f9f3e2'
  surface-container: '#f4eedd'
  surface-container-high: '#eee8d7'
  surface-container-highest: '#e8e2d1'
  on-surface: '#1e1c12'
  on-surface-variant: '#414944'
  inverse-surface: '#333125'
  inverse-on-surface: '#f6f0df'
  outline: '#717974'
  outline-variant: '#c0c8c3'
  surface-tint: '#3b6756'
  primary: '#00261a'
  on-primary: '#ffffff'
  primary-container: '#0f3d2e'
  on-primary-container: '#7ba894'
  inverse-primary: '#a2d1bb'
  secondary: '#874f4b'
  on-secondary: '#ffffff'
  secondary-container: '#fdb4ae'
  on-secondary-container: '#794340'
  tertiary: '#755b00'
  on-tertiary: '#ffffff'
  tertiary-container: '#cea72c'
  on-tertiary-container: '#4f3d00'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#beedd7'
  primary-fixed-dim: '#a2d1bb'
  on-primary-fixed: '#002116'
  on-primary-fixed-variant: '#234f3f'
  secondary-fixed: '#ffdad7'
  secondary-fixed-dim: '#fdb4ae'
  on-secondary-fixed: '#360e0d'
  on-secondary-fixed-variant: '#6b3835'
  tertiary-fixed: '#ffe08e'
  tertiary-fixed-dim: '#ecc246'
  on-tertiary-fixed: '#241a00'
  on-tertiary-fixed-variant: '#584400'
  background: '#fff9e9'
  on-background: '#1e1c12'
  surface-variant: '#e8e2d1'
typography:
  display-lg:
    fontFamily: ebGaramond
    fontSize: 48px
    fontWeight: '600'
    lineHeight: 56px
    letterSpacing: -0.01em
  display-lg-mobile:
    fontFamily: ebGaramond
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
  display-md:
    fontFamily: ebGaramond
    fontSize: 36px
    fontWeight: '600'
    lineHeight: 44px
  display-md-mobile:
    fontFamily: ebGaramond
    fontSize: 26px
    fontWeight: '600'
    lineHeight: 34px
  headline-lg:
    fontFamily: ebGaramond
    fontSize: 28px
    fontWeight: '600'
    lineHeight: 36px
  headline-md:
    fontFamily: ebGaramond
    fontSize: 22px
    fontWeight: '500'
    lineHeight: 30px
  headline-sm:
    fontFamily: ebGaramond
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 24px
    letterSpacing: 0.02em
  body-lg:
    fontFamily: inter
    fontSize: 17px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: inter
    fontSize: 15px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: inter
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 20px
  label-md:
    fontFamily: inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.08em
  label-sm:
    fontFamily: inter
    fontSize: 11px
    fontWeight: '600'
    lineHeight: 14px
    letterSpacing: 0.1em
spacing:
  space-2xs: 0.25rem
  space-xs: 0.5rem
  space-sm: 0.75rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2rem
  space-2xl: 3rem
  space-3xl: 4.5rem
  gutter-mobile: 1rem
  gutter-desktop: 2rem
  container-max: 72rem
---

## Brand & Style

This design system establishes a dignified, manuscript-meets-institutional atmosphere for an academic initiative dedicated to justice and wisdom (*Adl wa Hikmah*). Drawing inspiration from classical Islamic scholarly manuscripts, archival bookbinding, and formal academy typography, the visual language prioritizes intellectual weight, calm authority, and timeless clarity.

The target audience comprises scholars, students of jurisprudence, researchers, and thoughtful community members seeking authoritative discourse. The emotional tone must evoke reverence, clarity of thought, and disciplined institutional rigor—distinctly avoiding the disposable aesthetic of modern venture-backed software.

### Aesthetic Principles
- **Manuscript Ink on Parchment:** The interface behaves like a tactile scholarly codex or journal page. Surfaces are predominantly warm, fibrous parchment tones rather than sterile clinical whites.
- **Restraint and Ornamentation Hierarchy:** Visual ornamentation is strictly disciplined. Gold serves solely for structural rules, illuminated borders, and focal points—never as background wash or gratuitous fill.
- **Editorial Orthodoxy:** Crisp 1px hairline dividers, classical typographic hierarchies, and unyielding grid discipline replace modern floating drop-shadows and pillowy curves.

## Colors

The palette is derived directly from classical leather-bound manuscripts, vegetal inks, gold leafing, and unbleached rag paper:

- **Deep Green (`#0F3D2E`):** The primary authority ground and primary ink color. Utilized for major headlines, institutional headers, authoritative badges, and primary interactive buttons.
- **Maroon (`#5A2A27`):** The secondary chromatic accent, reserved for devotional, reflective, commentary, and contemplative excerpts, evoking rubrication in archival texts.
- **Gold (`#C9A227`):** Strict tertiary accent. Used exclusively for fine ornamental rules, illuminated chapter marks, subtle interactive state rings, and rare focal emphasis. Never applied as a massive block background.
- **Parchment (`#F4EEDD`):** The dominant neutral surface. Provides a gentle, low-strain canvas reminiscent of historical vellum and archival stock.
- **Walnut (`#6B4B2A`):** Supporting text tone on parchment, offering warm, high-legibility contrast without the harsh artificiality of pitch black.
- **Brass (`#B08D57`):** Low-frequency architectural divider tone, used for 1px hairline rules, framing matrices, and metadata keys.
- **Parchment Card/Plate (`#EBE4CE`):** Surface tone for flat content insets and reading slates.

## Typography

The typography combines scholarly English serif editorial display, pragmatic functional body UI, and authentic non-Latin calligraphic traditions:

- **Urdu Headings & Wordmark:** Set in **Noto Nastaliq Urdu** (or system Nastaliq fallback) to preserve the genuine fluid balance of Urdu manuscript proportion. Headings in Nastaliq require a generous line-height multiplier (minimum 2.0–2.4x) to avoid diacritic clipping.
- **Quranic Ayat & Sacred Text:** Rendered using **Amiri Quran** (or Amiri fallback), distinguished with an increased font size (+25% compared to parallel Latin body copy) and centered or rubricated with subtle Maroon (`#5A2A27`) or Gold (`#C9A227`) framing brackets.
- **English Display & Section Headers:** Uses **EB Garamond** (incorporating Cormorant Garamond aesthetics) for stately academic hierarchy, classic small caps, and dignified titling.
- **Body & Utility Interface:** Relies on **Inter** at controlled scale for crisp legibility in navigation, data tables, metadata, and interactive form controls against textured parchment backgrounds.

## Layout & Spacing

The layout is built upon the cadence of classical book design and editorial folios:
- **Grid Structure:** A 12-column symmetrical grid with generous margins. Content containers enforce a maximum line length of 65–75 characters for academic treatises, while institutional reference indices utilize dual- or triple-column archival matrices.
- **Page Margins & Breathing Room:** Wide horizontal and vertical paddings replicate the unprinted margins of illuminated manuscripts. Sections transition via deliberate whitespace punctuated by ornamental brass rules.
- **Adaptive Breakpoints:**
  - *Mobile (< 640px):* Single-column flow with compressed 16px margins, maintaining full legible Nastaliq clearance and edge-to-edge ruled section separators.
  - *Tablet (640px – 1024px):* 8-column layout with 24px gutters, introducing side-column annotations and rubrication blocks.
  - *Desktop (> 1024px):* 12-column layout with 32px gutters, accommodating parallel bilingual translations, marginal glosses, and academic commentary rails.

## Elevation & Depth

This system avoids digital drop-shadows, blurred cards, and floating neumorphic planes. Depth is established purely through physical, printed-page techniques:

- **Hairline Framing:** Depth is defined by precise 1px borders using Brass (`#B08D57`) at full or partial opacities (e.g., `rgba(176, 141, 87, 0.4)`).
- **Inlaid Surface Plates:** Elevated reading areas and secondary panels use flat, tonal shifts—such as Parchment Card (`#EBE4CE`) or deep institutional contrast panels in Deep Green (`#0F3D2E`)—without shadow elevation.
- **Concentric Cartouches:** Critical announcements or featured manuscripts are enclosed in double-line borders (a fine inner hairline separated by 3px of whitespace from an outer rule), simulating traditional Islamic illumination bounding boxes (*Jadwal*).

## Shapes

The shape grammar is completely sharp (`roundedness: 0` / 0px radius). 

In keeping with the institutional manuscript identity:
- Cards, buttons, data cells, modal dialogues, and input fields feature unrounded 90-degree corners, echoing traditional book boards, trim edges, and stone-carved architectural inscriptions.
- Pure geometric cuts provide crisp horizontal and vertical alignment with no modern bubbly SaaS silhouettes.
- Small decorative rhombuses (♦) or brass lozenges are permitted as structural bullet points and list dividers.

## Components

### Buttons
- **Primary:** Deep Green (`#0F3D2E`) background, Parchment (`#F4EEDD`) text, perfectly sharp rectangular corners. Bordered by a 1px solid Gold (`#C9A227`) edge. Hover state darkens slightly with an intensified gold glow rule.
- **Secondary / Rubric:** Maroon (`#5A2A27`) background with Parchment text and 1px Brass hairline border for devotional actions or reflective pathways.
- **Outlined / Institutional:** Transparent background on Parchment, 1px Brass (`#B08D57`) border, Walnut (`#6B4B2A`) or Deep Green text. On hover, fills with Parchment Card (`#EBE4CE`).

### Cards & Reading Plates
- Completely flat rectangles with 0px corner radii.
- Parchment or Parchment Card background framed by a 1px Brass (`#B08D57`) boundary.
- For formal academic cards, an optional inner border (inset 4px, 1px width, 30% opacity) evokes classical manuscript borders.

### Chips & Metadata Tags
- Rectangular, zero-radius micro-containers with uppercase tracking.
- Bordered in 1px Brass hairline, background in pale Parchment Card, text in Deep Green or Walnut.

### Inputs & Text Areas
- Unrounded boxes with Parchment ground and a 1px Brass hairline border.
- Active/Focus state replaces the border with a crisp Deep Green rule backed by a subtle 1px Gold interior inset ring.
- Placeholder text set in Walnut (`#6B4B2A`) at 60% opacity.

### Checkboxes & Radio Buttons
- Checkboxes are strict 14px squares with sharp 90-degree corners. Checked state is Deep Green with a crisp geometric checkmark in Gold.
- Radio buttons maintain standard round iconography for accessibility, but with a sharp double-ring indicator in Deep Green and Gold.

### Lists & Citations
- Academic list items separated by 1px Brass hairline dividers.
- Bullets represented by miniature filled gold diamonds (♦) rather than standard circular dots.
- Footnotes and academic glosses set in smaller Walnut serif italics with small-caps citation tags.