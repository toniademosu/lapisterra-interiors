# LapisTerra Group Website — Design Spec

**Date:** 2026-07-13
**Project:** Marketing + listings website for LapisTerra Group — interior design and real estate under one parent brand.
**Client:** Toni's mom's business. Completely separate from Abi & Ari Interiors.

## Goal

A cinematic, editorial one-page website in the style of the Sōl Haus reference video (full-bleed hero, oversized stacked headlines, scroll reveals, project carousel, marquee footer), branded with the LapisTerra identity, plus a dedicated Properties area for the real estate arm (sales + shortlets). Launches with polished placeholder content that is trivially replaceable.

## Decisions made during brainstorming

| Decision | Choice |
|---|---|
| Scope | One site covering interior design AND real estate |
| Real estate arm | Property listings/sales, shortlets she manages, staging & show homes |
| Listings management | Simple data file (`properties.json`), hand-edited; upgradeable later |
| Brand name on site | **LapisTerra Group** (parent), Interior Design + Real Estate as arms |
| Content at launch | Placeholders (brand-matched imagery, 6 sample listings) |
| Tech | Static HTML/CSS/vanilla JS, no frameworks; free static hosting |
| Structure | Option A: one-page experience + properties page + property detail template |

## Source materials

- Brand guideline PDF: `BrandGuideline For LapisTerra Interior.pdf` (35 pp) — rendered pages cached in scratchpad during brainstorming; re-render if needed for asset extraction
- Design reference: Sōl Haus website screen recording (33s) — hero, about, portfolio carousel, services cards, journal grid, contact + marquee footer

## Pages

```
index.html            Homepage — the full scroll experience
properties.html       All listings, For Sale / Shortlets filter
property.html         Detail template, reads ?id= from properties.json
assets/css/           styles
assets/js/            main.js (reveals, nav, carousel, marquee), properties.js
assets/img/           imagery, logo SVGs, brand pattern
assets/fonts/         Clash Display + Walkway (self-hosted)
data/properties.json  All listings
```

## Homepage sections (in order)

1. **Hero** — full-bleed warm interior photo, dark overlay (~45%), slim top nav (`About · Portfolio · Services · Properties · Journal` left-ish, `Contact` right, thin bottom border like reference). Stacked oversized Clash Display headline, 3 staggered lines: **"TIMELESS. / TAILORED. / TERRA."** (sub-note: brand tagline "Luxury in Every Detail" appears in the intro paragraph area). Small Walkway intro paragraph (from mission statement) + underlined "Get in touch →".
2. **About** — off-white `#ECEBE7` background. Eyebrow "ABOUT US", large headline (brand copy direction: "Where Earth Meets Elegance"), body text from brand story, "Learn more →", 2 images with scroll clip-reveal (large + small offset, like reference).
3. **Portfolio** — centered eyebrow + big headline "Impressions that Endure" style. Carousel: large image left, project title, one-line description, location + year, NN/NN counter, small secondary image with accent-palette caption, circular prev/next arrow buttons. 6 placeholder projects.
4. **Services** — dark section: photo background with terracotta-tinted overlay. Headline + short paragraph + "Get in touch →" left; numbered white cards right/below: 01 Interior Design · 02 Sourcing & Styling · 03 Project Supervision · 04 Staging & Show Homes · 05 Shortlet Management. (5 cards; grid 2×2+1 or asymmetric like reference.)
5. **Properties** (new, real estate arm) — eyebrow "REAL ESTATE", headline (direction: "Spaces Worth Owning"), 3 featured listing cards (photo, title, location, price, tag For Sale/Shortlet), "View all properties →" to properties.html.
6. **Journal** — off-white. Eyebrow "JOURNAL", headline "Notes from the Studio" style. Staggered 4-item teaser grid (image + title). No article pages at launch; teasers are non-clicking display items (no links, default cursor) so the site has no dead ends.
7. **Contact** — split: headline "Let's Begin a Conversation" + short paragraph left; form right (Name, Phone, Email, Message, underlined inputs, "Send request →"). Submits via Formspree (ID to be provided later — same pattern as Abi & Ari; use placeholder action until then).
8. **Footer** — cream/tan band: logo wordmark, menu links, socials (Instagram, etc. — placeholders), contact info placeholders. Below: full-width marquee of oversized low-contrast "GET IN TOUCH ✦" scrolling text. Brand pattern may texture this band subtly.

## Properties pages

- **properties.html** — slim page hero (small headline, breadcrumb back home), filter toggle (All / For Sale / Shortlets), responsive card grid rendered from `data/properties.json` by `properties.js`. Card: image, title, location, price (₦ or $ — copy at build; placeholders use $), beds/baths/sqm, tag.
- **property.html?id=slug** — gallery (main image + thumbnails), title, location, price, specs row, description, amenity list, "Enquire about this property →" (prefills property name into contact form message via query param or mailto fallback). Unknown/missing id → friendly "listing not found" state linking back.
- **properties.json entry:** `{ id, title, type: "sale"|"shortlet", location, price, currency, beds, baths, sqm, description, amenities[], images[], featured: bool }`. 6 placeholder listings (3 sale, 3 shortlet), clearly fake data, `images` pointing to placeholder assets.

## Visual system

- **Colors** (sample exact values from brand PDF swatch page at build — printed hex labels are partly mislabeled): terracotta brown (primary), tan `#CEA167`, off-white `#ECEBE7`, olive `#919D89`, deep navy, near-black `#121212`. Dark sections use near-black/terracotta overlays; light sections off-white/tan.
- **Typography:** Clash Display (display/headlines, uppercase, tight leading, huge sizes ~ clamp(3rem…9rem)); Walkway (body, eyebrows, nav, buttons — letterspaced uppercase for eyebrows). Self-hosted woff2 (Clash Display via Fontshare free license; Walkway is freeware).
- **Logo:** twin-building mark + LAPISTERRA wordmark with subtitle changed INTERIOR → GROUP (rebuilt as SVG from PDF logo geometry). Cream `#ECEBE7` version on dark, terracotta on light. Respect clear-space and misuse rules (no busy backgrounds, no recolor/stretch).
- **Brand pattern:** the logo-derived repeating motif, used sparingly (footer band texture, section divider accents) at low contrast.
- **Imagery:** warm, sunlit, textured interiors (terracotta/boucle/wood) matching brand imagery pages; placeholder images clearly organized in `assets/img/placeholder/` for later swap.

## Motion

- IntersectionObserver scroll reveals: fade+translate for text blocks, clip-path/scale reveals for images (staggered).
- Carousel: JS-driven, translate + fade between slides, arrows + counter update; wraps around.
- Footer marquee: CSS `@keyframes` infinite horizontal scroll, `prefers-reduced-motion` respected globally (all animation gated).
- Sticky/slim nav: transparent over hero → solid off-white with terracotta text after scroll; hamburger + full-screen overlay menu on mobile.

## Responsive

Breakpoints ~1024/768/480. Headlines scale via `clamp()`. Portfolio carousel stacks (image above text). Services cards 1-col on mobile. Property grid 3→2→1 cols. Nav → hamburger under 768px.

## Error handling

- `properties.js` fetch failure → graceful message ("Listings are being updated — contact us") in grid area.
- Unknown property id → not-found state.
- Form: client-side required validation + honeypot field; Formspree handles delivery; success/error inline messages.

## Testing / verification

- Open site locally (python http.server or `open`), walk every section, verify reveals, carousel wrap, filter states, property detail for each of 6 listings, bad-id state, form validation, reduced-motion, and mobile layouts (responsive dev tools at 375/768/1280).
- No console errors; Lighthouse quick pass for obvious perf issues (image sizes).

## Out of scope (deliberately)

- Journal article pages, per-project portfolio pages (add when real content exists)
- Admin dashboard / database (upgrade path documented above)
- Booking/payments for shortlets (enquiry only)
- Multi-language, blog CMS, SEO beyond sensible meta tags/OG images
