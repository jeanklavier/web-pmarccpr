# Website Audit Report — P-MARCC Citizen Guide (web-pmarccpr)

**Date:** August 8, 2026
**Scope:** `index.html`, `sectores/energia.html`, `styles.css`, `script.js`, `nav.js`, `theme.js`, `correction.js`, `sectores/energia.js`
**Audit basis:** Static code review, live payload measurement (curl), internal link crawl, WCAG 2.1 AA contrast verification (previously computed via relative-luminance analysis), and metadata inspection.

---

## Introduction

This audit evaluates the P-MARCC citizen guide — a static, Spanish-language site that translates Puerto Rico's 735-page Climate Change Mitigation, Adaptation and Resilience Plan into a visual, scannable format for the general public. The site's objective is civic engagement: helping non-expert citizens understand the plan's diagnosis, legal targets, and 156 courses of action, and giving them a channel to report inaccuracies. The audit covers visual appeal, informativeness, user experience and accessibility, and technical performance, and closes with prioritized, implementation-ready recommendations.

---

## Audit Findings

### Visual Appeal

**Strengths**

- Coherent, custom design token system (`--blue-900` → `--sun-400`) with full light/dark theming via CSS custom properties; charts re-theme live on toggle.
- Real photography (solar array hero, El Yunque banner divider) layered under gradient scrims — the hero reads well in both themes and text stays legible over imagery.
- Original SVG icon system for the three pillars and sector hero, plus typographic entity monograms (AEE, LUMA, Genera PR, NEPR…) that convey institutional identity without reproducing trademarked logos.
- Serif/sans pairing (Georgia headings, Segoe UI body) gives an editorial, trustworthy tone appropriate for civic content.
- Strong data-visualization layer: four Chart.js charts on the home page, two on the sector page, all with visible titles, source notes, and consistent palette.

**Weaknesses**

- **Both heroes use the same solar-panel photo.** The home page (whole-plan scope) and the Energía sector page share one image, weakening the visual identity of each page.
- **12 sector cards still use emoji icons** (rendered by `script.js`), and the brand mark is a 🌎 emoji. Emoji render inconsistently across Windows/Android/iOS and clash with the new SVG icon language.
- Only 2 of 3 licensed photos are placed; imagery coverage is thin for a site whose stated goal is to be "completamente llamativa." Future sector pages (agua, agricultura, turismo, salud…) currently have no imagery sourced.
- Photo credits say only "Foto: Unsplash." The Unsplash License does not require attribution, but crediting the photographer by name is the expected best practice and adds credibility.
- The El Yunque banner is the only full-bleed visual break on a long home page; the stretch from `#sectores` through `#participa` is card-grid after card-grid with no rhythm change.

### Informativeness

**Strengths**

- Excellent information hierarchy for a complex topic: What is it → The data → Your sector → The action plan → Participate. Each section opens with a plain-language lead.
- Jargon is consistently unpacked (COA, GEI, prosumidores, marejada ciclónica) and numbers are contextualized ("36% menos que en 2005, pero aún por encima de la meta legal").
- Every chart has a visible source note and a screen-reader data table; a dedicated "Fuentes" box on the sector page cites tome, chapter, and page numbers — rare and commendable rigor.
- The AI-content disclosure in the footer plus the section-aware correction form is a model transparency pattern for AI-assisted civic content.
- The Energía page covers all 5 COAs faithfully with responsible entities, timeframes, and metrics.

**Weaknesses**

- **11 of 12 sector pages do not exist yet.** Sector cards for unbuilt pages expand in place, which is a reasonable interim, but nothing tells the user "detailed page coming soon" — the inconsistency (some cards navigate, some expand) is unexplained.
- **The Energía pager links to `infraestructura.html`, which does not exist** — a guaranteed 404 for any user who clicks "Siguiente sector."
- No glossary page. Terms are defined inline on first use, but a citizen landing mid-page (e.g., via a shared anchor link) loses that context.
- The site is Spanish-only. Puerto Rico's context makes Spanish the correct primary language, but an English version would extend reach (diaspora, federal stakeholders); there is currently no `hreflang` or language toggle plan.
- No "last updated" date on pages. For a document tracking a plan that is revised every 5 years with 3-year progress reports, visible content freshness matters for trust.

### User Experience & Accessibility

**Strengths**

- Skip link, `<main>` landmark, `lang="es-PR"`, `aria-expanded`/`aria-controls` on the mobile nav, `role="img"` + hidden data tables on all canvases, visible `:focus-visible` outlines, `prefers-reduced-motion` support.
- All text/background pairs were verified against WCAG 2.1 AA (4.5:1) in both themes, including the fixes to teal accents (`--link-accent`), amber chips, and heading accents in dark mode.
- The correction modal is properly built: `role="dialog"`, `aria-modal`, focus trap, Escape to close, focus restoration, `aria-live` status region, and a bottom-sheet presentation on mobile.
- A dedicated mobile-first pass exists: full-width CTAs, 44px touch targets on coarse pointers, safe-area insets for the floating button, sticky sub-nav offset corrected at small widths.
- No-FOUC theme initialization and `prefers-color-scheme` fallback — dark-mode users never see a light flash.

**Weaknesses**

- **The correction form requires an email address.** For an error-report (not a lead-gen) flow, mandatory email is a drop-off point; the backend only requires `correo` *or* `telefono`, so the front end is stricter than it needs to be.
- Placeholder sector cards use `role="button"` + `aria-expanded` correctly, but a screen-reader user hears no indication of *why* some sectors are links and others are disclosure buttons.
- The scroll-cue arrow (`.scroll-cue`, absolute-positioned) can overlap the hero stats block at short viewport heights on mobile since the hero switched to `min-height:auto`.
- The sticky sector sub-nav has no active-section highlighting (scroll-spy exists in `correction.js` but is not reused to mark the current section in the nav).
- No visible "back to top" affordance on the long home page (the footer is ~6+ viewport-heights down on mobile).

### Performance & Technical Health

**Strengths**

- Tiny first-party payload: all HTML/CSS/JS combined ≈ 96 KB unminified. System font stack — zero webfont cost. Scripts load at end of body.
- `preconnect` to cdnjs; Chart.js pinned to an existing version (4.5.0) after the 4.4.4 404 incident.
- No framework, no build step — ideal for the Netlify static deploy path and trivially cacheable.

**Weaknesses**

- **The hero photo ships 604 KB to every device.** It is a CSS `background-image` at fixed `w=1800`, so mobile devices cannot negotiate a smaller file. The same image at `w=800` is 133 KB — a 78% saving on phones. This is the single largest performance issue (mobile LCP).
- The El Yunque banner (221 KB) also loads eagerly at full width even though it is below the fold.
- **No favicon, no Open Graph / Twitter Card metadata, no canonical URL.** A civic site succeeds through sharing; right now a shared link renders with no image, no rich title, and a blank tab icon.
- No structured data (`schema.org` `WebSite`/`Article`/`GovernmentService`), no `sitemap.xml`, no `robots.txt` — all low-effort SEO wins for discoverability.
- Chart.js (~200 KB) loads on the home page even for users who never scroll to the charts; not critical, but `defer` + lazy initialization via `IntersectionObserver` would improve time-to-interactive on slow connections — relevant for Puerto Rico's mobile-heavy, sometimes bandwidth-constrained audience.

---

## Recommendations (Prioritized)

### Priority 1 — Fix before deploy (breakage & trust)

**1. Remove or disable the dead "Siguiente sector" link.**
*Rationale:* A 404 on the flagship sample page undermines trust immediately.
*Implementation:* Replace the `infraestructura.html` pager link with a non-link "Próximamente: Infraestructura y vivienda" state (grayed `.pager-link` with `aria-disabled="true"`), and restore it as each sector page ships.

**2. Add favicon + Open Graph / Twitter Card metadata to both pages.**
*Rationale:* Civic content spreads through WhatsApp/Facebook/X shares — in Puerto Rico, WhatsApp especially. A rich preview (title, description, hero image) can multiply click-through on shared links; a missing favicon looks unfinished.
*Implementation:* One SVG favicon (reuse the pillar shield or a hurricane-spiral mark), `og:title`, `og:description`, `og:image` (1200×630 export of the hero), `og:locale="es_PR"`, `twitter:card="summary_large_image"`, plus `<link rel="canonical">` once the Netlify URL is final.

**3. Serve responsive hero images.**
*Rationale:* 604 KB → 133 KB on mobile directly improves LCP for the majority audience and honors the "perfecta en móvil" directive.
*Implementation:* Swap the CSS `background-image` for `image-set()` with 800/1200/1800-width variants, or (better) an absolutely-positioned `<img>` with `srcset`/`sizes` and `fetchpriority="high"`, keeping the existing gradient scrim as an overlay. Add `loading="lazy"` semantics to the El Yunque banner by converting it to an `<img>` as well.

### Priority 2 — High impact, low effort (engagement & UX)

**4. Make email optional in the correction form.**
*Rationale:* Every required field costs submissions; the goal is maximizing error reports, and the backend already accepts submissions with contact info of either type. Anonymous reports still carry the auto-captured section reference, which is the actionable part.
*Implementation:* Mark the field "Correo electrónico (opcional — por si necesitamos aclarar algo)". Keep backend validation happy by submitting a sentinel (`anonimo@pmarcc.report`) when blank, or extend the edge function's `pmarcc` source to accept message-only submissions.

**5. Replace remaining emoji with the SVG icon system.**
*Rationale:* Visual consistency and cross-platform rendering; the 12 sector-card emoji are the most visible remnant of the pre-redesign look.
*Implementation:* Add an `svg` field per sector in the `sectores` array in `script.js` (12 simple stroke icons matching the pillar style); replace the 🌎 brand emoji with a small inline SVG globe/island mark. ~1–2 hours of work.

**6. Label upcoming sector pages and differentiate card affordances.**
*Rationale:* Sets expectations ("this is a growing resource") instead of appearing inconsistent.
*Implementation:* On placeholder cards, add a small "Resumen — página completa próximamente" chip; on live cards, an arrow glyph → visual + `aria-label` distinction between "link to page" and "expand summary."

**7. Add scroll-spy highlighting to the sector sub-nav and a back-to-top button.**
*Rationale:* Orientation on long pages is a core scannability aid; the IntersectionObserver logic already exists in `correction.js` and can be shared.
*Implementation:* Toggle an `.active` class (existing `border-bottom` hover style) on sub-nav links; reuse the floating-button pattern for a back-to-top control that appears after ~2 viewports, positioned above the report FAB.

### Priority 3 — Content depth (informativeness)

**8. Ship the remaining sector pages using the Energía template, with per-sector photography sourced up front.**
*Rationale:* The hub-and-spoke architecture only pays off when spokes exist; Energía proves the template works.
*Implementation:* Prioritize by citizen impact: Agua (AAA loss-reduction story), Infraestructura/vivienda (flood-zone construction ban), Salud (cooling centers per municipality) first. Source 1–2 Unsplash-License-verified photos per sector before building each page (verify "Free to use under the Unsplash License" on every photo page — two premium images were already caught and discarded in this project).

**9. Add a glossary page (`glosario.html`) and per-page "last updated" dates.**
*Rationale:* Deep-linked visitors need standalone definitions; visible freshness builds trust in a document tracking a plan on 3-/5-year cycles.
*Implementation:* ~20 terms (COA, GEI, CEACC, marejada ciclónica, prosumidor, agrivoltaica…), each linkable by anchor so sector pages can reference `glosario.html#coa`. Add a `<time>` element in the footer, updated per deploy.

**10. Emotional framing pass on imagery and stats.**
*Rationale:* Climate communication research consistently favors "solutions + local relevance" over threat-only framing; the current site already leans hopeful (solar hero, participation section) — extend that deliberately.
*Implementation:* For each future sector page, pair one "risk" visual/stat with one "action underway" visual/stat; prefer photos of Puerto Rico specifically (people, recognizable places) over generic stock — a rooftop solar photo in a PR urbanización will outperform a generic panel field.

### Priority 4 — Technical polish

**11. Defer and lazy-initialize Chart.js.**
*Implementation:* Add `defer` to the CDN script tag, wrap `initCharts()` in an `IntersectionObserver` on the first chart card, and guard for `typeof Chart === 'undefined'` with a graceful fallback (the hidden data tables become visible), which also protects against future CDN version removals like the 4.4.4 incident.

**12. Add `sitemap.xml`, `robots.txt`, schema.org JSON-LD, and photographer-named photo credits.**
*Implementation:* Static files in repo root; `WebSite` + `Article` JSON-LD per page; update `.photo-credit` links to `Foto: <nombre> / Unsplash` pointing to the photographer's profile.

**13. Plan the English version.**
*Implementation:* Not urgent, but structure for it now: keep all copy in HTML (already the case), reserve `/en/` path, add `hreflang` pairs when it ships.

---

## Conclusion

The site's foundations are unusually strong for a civic project: rigorous sourcing, verified WCAG AA contrast in both themes, an accessible correction-reporting mechanism with AI transparency, a clean token-based design system, and a sub-100 KB first-party payload. The weaknesses are concentrated in three areas — a dead internal link, missing share/discovery metadata, and unoptimized hero imagery — all of which are hours, not days, of work.

**Deployment readiness:** After Priority 1 items (dead link, favicon/OG metadata, responsive images), the site is ready for its initial Netlify deployment as a public beta with the Energía sample page. Priorities 2–3 define the path from "polished sample" to "complete citizen resource," with the remaining 11 sector pages as the main content investment. Recommend deploying early and iterating publicly — the correction form exists precisely so citizens can participate in improving it.
