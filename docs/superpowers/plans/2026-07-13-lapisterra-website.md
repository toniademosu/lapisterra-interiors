# LapisTerra Group Website Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the LapisTerra Group static website — a cinematic one-page home (hero, about, portfolio carousel, services, featured properties, journal, contact + marquee footer) plus a filterable properties page and a property detail template fed by `data/properties.json`.

**Architecture:** Pure static site: three HTML pages, three CSS files split by responsibility, ES-module JS with a pure data layer (`properties-data.js`, unit-tested via `node --test`) and thin page scripts. All listing content in one JSON file. Scroll animation via IntersectionObserver; no external libraries, no build step.

**Tech Stack:** HTML5, CSS3 (custom properties, clamp, grid), vanilla ES modules, `node --test` for the data layer, `python3 -m http.server` for local serving, `sips` for image processing.

## Global Constraints

- Repo root: `/Users/toniademosu/HTML/LapisTerra` (git repo exists, `main` branch)
- Brand colors (sampled from brand PDF, canonical): terracotta `#754436`, sand `#D3C7AD`, gold-tan accent `#CEA167`, cream `#ECEBE7`, olive `#6C6751`, navy `#28374A`, ink `#121212`
- Fonts: **Clash Display** (headlines) + **Walkway** (body); self-hosted; graceful system fallbacks. NO external CDN/font requests at runtime.
- Site name everywhere: **LapisTerra Group** (subtitle GROUP, not INTERIOR). Wordmark letters: LAPISTERRA.
- Currency in placeholder listings: `$`. Shortlet prices are per night.
- All animation wrapped in `@media (prefers-reduced-motion: no-preference)` or gated via the `.reveal`/`.in` classes only.
- Commits: NO Co-Authored-By signature (user preference).
- Brand PDF page renders available at `/private/tmp/claude-501/-Users-toniademosu/8757be3a-5bc1-4f11-8b20-a6b0609bcbf7/scratchpad/pages/pNN.png` (2880×1620). If missing, re-render: copy of PDF at `.../scratchpad/brand.pdf`, render script `.../scratchpad/render.swift`.
- Journal teasers are non-clicking display items (no links). No dead links anywhere.

---

### Task 1: Scaffold, fonts, design tokens, base stylesheet

**Files:**
- Create: `.gitignore`, `README.md`, `assets/css/base.css`, `assets/fonts/` (font files), `index.html` (minimal shell, extended in Task 4)

**Interfaces:**
- Produces: CSS custom properties (`--terra`, `--sand`, `--gold`, `--cream`, `--olive`, `--navy`, `--ink`, `--font-display`, `--font-body`), classes `.eyebrow`, `.line-link`, `.container`, font-face families `"Clash Display"` and `"Walkway"`. All later tasks use these names.

- [ ] **Step 1: Create .gitignore and README**

`.gitignore`:
```
.DS_Store
```

`README.md`:
```markdown
# LapisTerra Group — Website

Static site for LapisTerra Group (interior design + real estate).

- Serve locally: `python3 -m http.server 8080` then open http://localhost:8080
- Test data layer: `node --test tests/`
- Listings live in `data/properties.json` — add/edit entries there.
- Placeholder content is marked; swap images in `assets/img/` and JSON entries as real content arrives.
```

- [ ] **Step 2: Download fonts**

```bash
cd /Users/toniademosu/HTML/LapisTerra && mkdir -p assets/fonts
# Clash Display (Fontshare, free license)
curl -sL "https://api.fontshare.com/v2/fonts/download/clash-display" -o /tmp/clash.zip && unzip -o /tmp/clash.zip -d /tmp/clash
find /tmp/clash -name "ClashDisplay-Medium.woff2" -exec cp {} assets/fonts/ \;
find /tmp/clash -name "ClashDisplay-Semibold.woff2" -exec cp {} assets/fonts/ \;
# Walkway (freeware)
curl -sL "https://dl.dafont.com/dl/?f=walkway" -o /tmp/walkway.zip && unzip -o /tmp/walkway.zip -d /tmp/walkway
cp "/tmp/walkway/Walkway SemiBold.ttf" "/tmp/walkway/Walkway Bold.ttf" assets/fonts/ 2>/dev/null || ls /tmp/walkway
```

If either download fails (network/licensing page), proceed WITHOUT the file — the fallback stacks below keep the site working; note the gap in the final report.

- [ ] **Step 3: Write `assets/css/base.css`**

```css
/* ---------- fonts ---------- */
@font-face{font-family:"Clash Display";src:url("../fonts/ClashDisplay-Medium.woff2") format("woff2");font-weight:500;font-display:swap}
@font-face{font-family:"Clash Display";src:url("../fonts/ClashDisplay-Semibold.woff2") format("woff2");font-weight:600;font-display:swap}
@font-face{font-family:"Walkway";src:url("../fonts/Walkway SemiBold.ttf") format("truetype");font-weight:400;font-display:swap}
@font-face{font-family:"Walkway";src:url("../fonts/Walkway Bold.ttf") format("truetype");font-weight:700;font-display:swap}

/* ---------- tokens ---------- */
:root{
  --terra:#754436;--terra-dark:#543126;--sand:#D3C7AD;--gold:#CEA167;
  --cream:#ECEBE7;--olive:#6C6751;--navy:#28374A;--ink:#121212;
  --font-display:"Clash Display","Avenir Next Condensed","Arial Narrow",sans-serif;
  --font-body:"Walkway","Century Gothic","Futura","Trebuchet MS",sans-serif;
  --pad:clamp(1.25rem,4vw,4rem);
  --h-hero:clamp(3.2rem,9.5vw,8.5rem);
  --h-section:clamp(2.4rem,6vw,5.5rem);
}
*{margin:0;padding:0;box-sizing:border-box}
html{scroll-behavior:smooth}
body{font-family:var(--font-body);color:var(--ink);background:var(--cream);line-height:1.6;-webkit-font-smoothing:antialiased}
img{max-width:100%;display:block}
a{color:inherit;text-decoration:none}

.container{max-width:1400px;margin-inline:auto;padding-inline:var(--pad)}
.eyebrow{font-size:.78rem;letter-spacing:.22em;text-transform:uppercase;opacity:.65}
h1,h2,h3{font-family:var(--font-display);font-weight:500;text-transform:uppercase;line-height:1.02;letter-spacing:.01em}

/* underlined arrow link, as in reference */
.line-link{display:inline-flex;align-items:center;gap:2.5rem;padding-bottom:.45rem;border-bottom:1px solid currentColor;font-size:.85rem;letter-spacing:.18em;text-transform:uppercase;transition:gap .3s ease}
.line-link:hover{gap:3.2rem}

/* scroll reveal primitives (JS adds .in) */
@media (prefers-reduced-motion: no-preference){
  .reveal{opacity:0;transform:translateY(28px);transition:opacity .8s ease,transform .8s ease}
  .reveal.in{opacity:1;transform:none}
  .reveal-img{clip-path:inset(0 0 100% 0);transition:clip-path 1s cubic-bezier(.6,.05,.2,1)}
  .reveal-img.in{clip-path:inset(0 0 0 0)}
}
```

- [ ] **Step 4: Minimal `index.html` shell to verify fonts/tokens render**

```html
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>LapisTerra Group — Interior Design &amp; Real Estate</title>
<meta name="description" content="LapisTerra Group creates timeless interiors and curates exceptional properties. Interior design, staging, sales and shortlets.">
<link rel="stylesheet" href="assets/css/base.css">
</head>
<body>
<main class="container"><h1>Timeless. Tailored. Terra.</h1><p class="eyebrow">LapisTerra Group</p><a class="line-link" href="#">Get in touch <span aria-hidden="true">→</span></a></main>
</body>
</html>
```

- [ ] **Step 5: Verify**

```bash
cd /Users/toniademosu/HTML/LapisTerra && python3 -m http.server 8080 &
curl -s http://localhost:8080/ | grep -q "Timeless" && echo PAGE_OK
ls assets/fonts/
```
Expected: `PAGE_OK`, font files listed (or noted missing). Open http://localhost:8080 — headline renders in Clash Display (condensed geometric caps), tokens applied.

- [ ] **Step 6: Commit**

```bash
git add -A && git commit -m "feat: scaffold, brand tokens, fonts, base stylesheet"
```

---

### Task 2: Placeholder imagery from the brand PDF

**Files:**
- Create: `assets/img/placeholder/hero.jpg`, `about-1.jpg`, `about-2.jpg`, `services-bg.jpg`, `p1.jpg` … `p5.jpg` (interiors reused across portfolio/journal/listings)

**Interfaces:**
- Produces: exactly these filenames; later tasks reference them verbatim.

- [ ] **Step 1: Crop watermark and convert the five interior renders**

Source renders (2880×1620, small logo watermark bottom-left, x<250/y>1430): pages p01 (boucle sofa), p24 (wood bedroom), p25 (tan armchair), p26 (paneled room + terracotta chair), p32 (cream living room). p01's centered logo overlay is acceptable only for `services-bg.jpg` (dark overlay hides it) — do NOT use p01 elsewhere.

```bash
S=/private/tmp/claude-501/-Users-toniademosu/8757be3a-5bc1-4f11-8b20-a6b0609bcbf7/scratchpad/pages
cd /Users/toniademosu/HTML/LapisTerra && mkdir -p assets/img/placeholder && cd assets/img/placeholder
for f in p24:hero p26:p1 p25:p2 p32:p3 p24:p4 p25:about-1 p32:about-2 p26:p5 p01:services-bg; do
  src="${f%%:*}"; dst="${f##*:}"
  cp "$S/$src.png" tmp.png
  sips -c 1400 2500 --cropOffset 20 300 tmp.png >/dev/null   # top-right region: excludes watermark
  sips -s format jpeg -s formatOptions 78 --resampleWidth 1800 tmp.png --out "$dst.jpg" >/dev/null
done
rm tmp.png && ls -lh
```

- [ ] **Step 2: Verify**

```bash
sips -g pixelWidth -g pixelHeight assets/img/placeholder/hero.jpg
du -sh assets/img/placeholder
```
Expected: width 1800, total under ~2.5 MB. Open two of the JPEGs — no watermark visible.

- [ ] **Step 3: Commit**

```bash
git add -A && git commit -m "feat: brand-matched placeholder imagery"
```

---

### Task 3: Logo SVGs

**Files:**
- Create: `assets/img/logo-mark.svg` (terracotta), `assets/img/logo-mark-cream.svg`, plus inline lockup markup pattern used by nav/footer

**Interfaces:**
- Produces: the two SVG files; the HTML lockup pattern `<a class="brand">…</a>` (SVG mark + LAPISTERRA / GROUP text) used in Tasks 4, 9, 10, 11.

- [ ] **Step 1: Write `assets/img/logo-mark.svg`**

Geometric recreation of the twin-building mark (left building with roof peak + inner stroke, right building with notch), single color via `currentColor`-style fill parameter:

```xml
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none" stroke="#754436" stroke-width="7">
  <path d="M10 92 V38 L34 14 V92"/>
  <path d="M26 92 V44 L34 36 V92" stroke-width="0"/>
  <path d="M24 92 V46 L34 36"/>
  <path d="M48 92 V30 L58 40 V70 H70 V40 L58 28"/>
  <path d="M84 92 V40 L58 14"/>
  <path d="M10 92 H90" stroke-width="0"/>
</svg>
```

Then `logo-mark-cream.svg`: identical with `stroke="#ECEBE7"`.

This is a stylized approximation — flag in the final report that the real vector can be swapped in from the designer's files later; visually it must read as two line-drawn buildings forming a house silhouette. Adjust paths by eye against brand PDF p08 render until close.

- [ ] **Step 2: Brand lockup HTML pattern (used by all pages)**

```html
<a class="brand" href="index.html" aria-label="LapisTerra Group home">
  <img src="assets/img/logo-mark-cream.svg" alt="" width="34" height="34">
  <span class="brand-text">LAPISTERRA<small>GROUP</small></span>
</a>
```

```css
.brand{display:inline-flex;align-items:center;gap:.6rem}
.brand-text{font-family:var(--font-display);font-weight:600;letter-spacing:.14em;font-size:1.05rem;display:flex;flex-direction:column;line-height:1}
.brand-text small{font-family:var(--font-body);font-size:.55rem;letter-spacing:.55em;opacity:.8;margin-top:.25rem}
```

- [ ] **Step 3: Verify** — open both SVGs directly in browser (`http://localhost:8080/assets/img/logo-mark.svg`); mark reads as the twin-building silhouette, no rendering errors.

- [ ] **Step 4: Commit** — `git add -A && git commit -m "feat: logo mark SVGs and brand lockup"`

---

### Task 4: Home skeleton, sticky nav, hero

**Files:**
- Modify: `index.html` (replace shell with full skeleton: nav + hero + empty section stubs with ids `about,portfolio,services,properties,journal,contact`)
- Create: `assets/css/home.css`, `assets/js/main.js`

**Interfaces:**
- Consumes: tokens/classes from Task 1, brand lockup from Task 3, `hero.jpg` from Task 2.
- Produces: `initNav()`, `initReveals()` in `main.js` (module, self-executing); section ids used by nav links; `.section-dark`/`.section-light` conventions.

- [ ] **Step 1: index.html structure**

```html
<body>
<header class="nav" id="top">
  <div class="nav-inner">
    <!-- brand lockup (Task 3) -->
    <nav class="nav-links" id="navLinks">
      <a href="#about">About</a><a href="#portfolio">Portfolio</a><a href="#services">Services</a>
      <a href="#properties">Properties</a><a href="#journal">Journal</a>
    </nav>
    <a class="nav-contact" href="#contact">Contact</a>
    <button class="nav-burger" id="navBurger" aria-label="Menu" aria-expanded="false"><span></span><span></span></button>
  </div>
</header>

<section class="hero">
  <img class="hero-bg" src="assets/img/placeholder/hero.jpg" alt="Warm contemporary interior by LapisTerra">
  <div class="hero-content container">
    <h1 class="hero-title">
      <span class="reveal">Timeless.</span>
      <span class="reveal">Tailored.</span>
      <span class="reveal">Terra.</span>
    </h1>
    <div class="hero-intro reveal">
      <p>LapisTerra Group crafts interiors with soul and curates properties worth calling home — luxury in every detail, from concept to keys.</p>
      <a class="line-link" href="#contact">Get in touch <span aria-hidden="true">→</span></a>
    </div>
  </div>
</section>

<section id="about" class="section-light"></section>
<section id="portfolio" class="section-light"></section>
<section id="services" class="section-dark"></section>
<section id="properties" class="section-light"></section>
<section id="journal" class="section-light"></section>
<section id="contact" class="section-light"></section>
<footer class="footer"></footer>
<script type="module" src="assets/js/main.js"></script>
</body>
```
(Keep the Task 1 `<head>`, add `<link rel="stylesheet" href="assets/css/home.css">` after base.css.)

- [ ] **Step 2: home.css — nav + hero**

```css
/* nav: transparent over hero → cream when scrolled (JS toggles .scrolled) */
.nav{position:fixed;inset:0 0 auto 0;z-index:50;color:var(--cream);transition:background .35s ease,color .35s ease}
.nav-inner{display:flex;align-items:center;gap:2.5rem;padding:1.1rem var(--pad);border-bottom:1px solid color-mix(in srgb,currentColor 35%,transparent)}
.nav-links{display:flex;gap:2.2rem;margin-inline:auto}
.nav-links a,.nav-contact{font-size:.8rem;letter-spacing:.18em;text-transform:uppercase;opacity:.9}
.nav-links a:hover,.nav-contact:hover{opacity:1}
.nav.scrolled{background:var(--cream);color:var(--terra)}
.nav.scrolled .brand img{content:url("../img/logo-mark.svg")}
.nav-burger{display:none}

/* hero */
.hero{position:relative;min-height:100svh;display:flex;align-items:center;color:var(--cream)}
.hero-bg{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
.hero::after{content:"";position:absolute;inset:0;background:linear-gradient(180deg,rgba(18,18,18,.55),rgba(84,49,38,.45))}
.hero-content{position:relative;z-index:1;width:100%;padding-top:6rem}
.hero-title{font-size:var(--h-hero);display:flex;flex-direction:column}
.hero-title span:nth-child(2){align-self:center}
.hero-title span:nth-child(3){align-self:flex-end;margin-right:8vw}
.hero-intro{max-width:340px;margin:2.5rem 0 0 52%;display:grid;gap:1.6rem;font-size:.95rem}
@media (max-width:768px){
  .nav-links,.nav-contact{display:none}
  .nav-burger{display:flex;flex-direction:column;gap:6px;background:none;border:0;margin-left:auto;cursor:pointer}
  .nav-burger span{width:26px;height:2px;background:currentColor;transition:transform .3s}
  .nav.open{background:var(--terra-dark)}
  .nav.open .nav-links{display:flex;position:fixed;inset:0;background:var(--terra-dark);flex-direction:column;justify-content:center;align-items:center;gap:2rem;font-size:1.2rem}
  .nav.open .nav-burger span:first-child{transform:translateY(4px) rotate(45deg)}
  .nav.open .nav-burger span:last-child{transform:translateY(-4px) rotate(-45deg)}
  .hero-intro{margin-left:0}
}
```

- [ ] **Step 3: main.js**

```js
function initNav(){
  const nav=document.querySelector('.nav');
  const burger=document.getElementById('navBurger');
  addEventListener('scroll',()=>nav.classList.toggle('scrolled',scrollY>40),{passive:true});
  burger?.addEventListener('click',()=>{
    const open=nav.classList.toggle('open');
    burger.setAttribute('aria-expanded',String(open));
  });
  document.getElementById('navLinks')?.addEventListener('click',()=>nav.classList.remove('open'));
}
function initReveals(){
  const io=new IntersectionObserver(es=>es.forEach(e=>{
    if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);}
  }),{threshold:.15});
  document.querySelectorAll('.reveal,.reveal-img').forEach(el=>io.observe(el));
}
initNav();initReveals();
export {initNav,initReveals};
```

- [ ] **Step 4: Verify** — reload localhost: full-viewport hero with staggered 3-line headline (left/center/right), overlay tint, fixed nav turns cream with terracotta text after scrolling, burger menu works at 375px width, headline lines fade in.

- [ ] **Step 5: Commit** — `git add -A && git commit -m "feat: home skeleton, sticky nav, hero"`

---

### Task 5: About section

**Files:**
- Modify: `index.html` (fill `#about`), `assets/css/home.css`

**Interfaces:** Consumes `.reveal`, `.reveal-img`, `.eyebrow`, `.line-link`, `about-1.jpg`, `about-2.jpg`.

- [ ] **Step 1: Markup**

```html
<section id="about" class="section-light about container">
  <div class="about-copy">
    <p class="eyebrow reveal">About us</p>
    <h2 class="reveal">Where Earth<br>Meets Elegance</h2>
    <p class="reveal">Every space tells a story. At LapisTerra Group we believe exceptional interiors begin with understanding the people who live and work within them — we create environments that reflect identity, elevate everyday living, and inspire meaningful experiences.</p>
    <a class="line-link reveal" href="#contact">Learn more <span aria-hidden="true">→</span></a>
  </div>
  <div class="about-media">
    <img class="reveal-img" src="assets/img/placeholder/about-1.jpg" alt="Sunlit armchair in a warm plaster room">
    <img class="reveal-img" src="assets/img/placeholder/about-2.jpg" alt="Cream living room with terracotta accents">
  </div>
</section>
```

- [ ] **Step 2: CSS**

```css
.about{display:grid;grid-template-columns:minmax(300px,460px) 1fr;gap:4rem;padding-block:clamp(5rem,12vw,10rem)}
.about-copy{display:grid;gap:2rem;align-content:center}
.about-copy h2{font-size:var(--h-section);color:var(--terra-dark)}
.about-media{display:grid;grid-template-columns:1.6fr 1fr;gap:1.5rem;align-items:start}
.about-media img:last-child{margin-top:4rem}
@media (max-width:900px){.about{grid-template-columns:1fr}.about-media img:last-child{margin-top:0}}
```

- [ ] **Step 3: Verify** — section shows copy left / two offset images right; images wipe-reveal on scroll; stacks on mobile.
- [ ] **Step 4: Commit** — `git commit -am "feat: about section"`

---

### Task 6: Portfolio carousel

**Files:**
- Modify: `index.html` (fill `#portfolio`), `assets/css/home.css`, `assets/js/main.js` (add `initCarousel()`)

**Interfaces:** Produces `initCarousel()` operating on `.carousel` DOM: slides `.slide`, buttons `#prevSlide/#nextSlide`, counter `#slideCount`.

- [ ] **Step 1: Markup — 6 placeholder projects**

```html
<section id="portfolio" class="portfolio container">
  <p class="eyebrow reveal" style="text-align:center">Portfolio</p>
  <h2 class="reveal" style="text-align:center">Impressions<br>That Endure</h2>
  <div class="carousel" id="carousel">
    <!-- slide template ×6; only image/title/meta/desc vary -->
    <article class="slide is-active">
      <img src="assets/img/placeholder/p1.jpg" alt="Amber Residence living space">
      <div class="slide-body">
        <p class="slide-meta">Lagos, 2025</p>
        <h3>Amber Residence</h3>
        <p>Warm wood panelling and sculptural seating shape a family home of quiet luxury.</p>
        <p class="slide-note">Accent palette: terracotta, walnut, soft cream</p>
      </div>
    </article>
    <!-- slides 2–6: p2.jpg "Sandline Loft" (Abuja, 2025) · p3.jpg "Cream Court" (Lagos, 2024) · p4.jpg "Haven Suite" (Accra, 2024) · p5.jpg "Terra Lounge" (Lagos, 2023) · p1.jpg "Atrium House" (Ikoyi, 2023) — same structure, class="slide" -->
  </div>
  <div class="carousel-ctrl">
    <span id="slideCount">01/06</span>
    <button id="prevSlide" aria-label="Previous project">←</button>
    <button id="nextSlide" aria-label="Next project">→</button>
  </div>
</section>
```

- [ ] **Step 2: CSS**

```css
.portfolio{padding-block:clamp(4rem,10vw,8rem);display:grid;gap:3rem}
.portfolio h2{font-size:var(--h-section);color:var(--terra-dark)}
.carousel{position:relative;min-height:480px}
.slide{position:absolute;inset:0;display:grid;grid-template-columns:1.2fr 1fr;gap:3rem;opacity:0;transition:opacity .6s ease;pointer-events:none}
.slide.is-active{opacity:1;pointer-events:auto;position:relative}
.slide img{width:100%;height:480px;object-fit:cover}
.slide-body{display:grid;gap:1.2rem;align-content:center}
.slide-body h3{font-size:clamp(1.6rem,3vw,2.6rem);color:var(--terra-dark)}
.slide-meta{font-size:.8rem;letter-spacing:.15em;text-transform:uppercase;opacity:.6}
.slide-note{font-size:.85rem;opacity:.7}
.carousel-ctrl{display:flex;align-items:center;gap:1rem;justify-content:flex-end}
.carousel-ctrl button{width:52px;height:52px;border-radius:50%;border:1px solid var(--terra);background:none;color:var(--terra);font-size:1.1rem;cursor:pointer;transition:background .3s,color .3s}
.carousel-ctrl button:hover{background:var(--terra);color:var(--cream)}
@media (max-width:900px){.slide{grid-template-columns:1fr}.slide img{height:300px}}
```

- [ ] **Step 3: JS**

```js
function initCarousel(){
  const slides=[...document.querySelectorAll('.slide')];
  if(!slides.length)return;
  const count=document.getElementById('slideCount');
  let i=0;
  const show=n=>{
    slides[i].classList.remove('is-active');
    i=(n+slides.length)%slides.length;
    slides[i].classList.add('is-active');
    count.textContent=`${String(i+1).padStart(2,'0')}/${String(slides.length).padStart(2,'0')}`;
  };
  document.getElementById('prevSlide').addEventListener('click',()=>show(i-1));
  document.getElementById('nextSlide').addEventListener('click',()=>show(i+1));
}
```
Call `initCarousel()` alongside the other inits; add to exports.

- [ ] **Step 4: Verify** — arrows cycle all 6 slides both directions with wrap-around; counter matches; mobile stacks image over text.
- [ ] **Step 5: Commit** — `git commit -am "feat: portfolio carousel"`

---

### Task 7: Services section

**Files:**
- Modify: `index.html` (fill `#services`), `assets/css/home.css`

**Interfaces:** Consumes `services-bg.jpg`. Static markup only.

- [ ] **Step 1: Markup — 5 numbered cards**

```html
<section id="services" class="services">
  <img class="services-bg" src="assets/img/placeholder/services-bg.jpg" alt="">
  <div class="services-inner container">
    <div class="services-copy">
      <p class="eyebrow reveal">Services</p>
      <h2 class="reveal">Design That<br>Delivers</h2>
      <p class="reveal">From bespoke interiors to properties ready for market — we craft, stage, manage and sell spaces with clarity and care.</p>
      <a class="line-link reveal" href="#contact">Get in touch <span aria-hidden="true">→</span></a>
    </div>
    <div class="services-grid">
      <article class="svc reveal"><span>01</span><h3>Interior Design</h3><p>Full-scope residential and commercial design, concept to installation.</p></article>
      <article class="svc reveal"><span>02</span><h3>Sourcing &amp; Styling</h3><p>Premium furniture, materials and finishing touches, curated per project.</p></article>
      <article class="svc reveal"><span>03</span><h3>Project Supervision</h3><p>On-site coordination that keeps craftsmanship and timelines honest.</p></article>
      <article class="svc reveal"><span>04</span><h3>Staging &amp; Show Homes</h3><p>Interiors that help developments and listings sell faster, for more.</p></article>
      <article class="svc reveal"><span>05</span><h3>Shortlet Management</h3><p>Design-led furnished apartments, managed end-to-end for owners and guests.</p></article>
    </div>
  </div>
</section>
```

- [ ] **Step 2: CSS**

```css
.services{position:relative;color:var(--cream);padding-block:clamp(4rem,10vw,8rem)}
.services-bg{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
.services::before{content:"";position:absolute;inset:0;background:linear-gradient(120deg,rgba(18,18,18,.82),rgba(84,49,38,.72))}
.services-inner{position:relative;display:grid;grid-template-columns:minmax(280px,400px) 1fr;gap:4rem}
.services-copy{display:grid;gap:1.8rem;align-content:start}
.services-copy h2{font-size:var(--h-section)}
.services-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:1.5rem}
.svc{background:var(--cream);color:var(--ink);padding:2rem;display:grid;gap:1rem;align-content:start}
.svc span{font-size:.8rem;opacity:.55}
.svc h3{font-size:1.35rem;color:var(--terra-dark)}
.svc p{font-size:.9rem;opacity:.8}
.svc:last-child{grid-column:1/-1}
@media (max-width:900px){.services-inner{grid-template-columns:1fr}.services-grid{grid-template-columns:1fr}}
```

- [ ] **Step 3: Verify** — dark tinted photo band, copy left, 2×2+full-width-5th white cards; watermark from p01 not noticeable under overlay.
- [ ] **Step 4: Commit** — `git commit -am "feat: services section"`

---

### Task 8: Properties data layer + featured section

**Files:**
- Create: `data/properties.json`, `assets/js/properties-data.js`, `tests/properties-data.test.mjs`
- Modify: `index.html` (fill `#properties`), `assets/css/home.css`, `assets/js/main.js`

**Interfaces:**
- Produces: `loadProperties(url) -> Promise<Property[]>`, `filterByType(list, "all"|"sale"|"shortlet") -> Property[]`, `findById(list, id) -> Property|null`, `featured(list) -> Property[]` (max 3), `formatPrice(property) -> string` ("$450,000" / "$180 / night"), `cardHTML(property) -> string`. Tasks 9–10 import these exact names from `./properties-data.js`.
- Property shape: `{id:string, title, type:"sale"|"shortlet", location, price:number, currency:"$", beds:number, baths:number, sqm:number, description, amenities:string[], images:string[], featured:boolean}`

- [ ] **Step 1: Write failing tests `tests/properties-data.test.mjs`**

```js
import test from 'node:test';
import assert from 'node:assert/strict';
import {filterByType,findById,featured,formatPrice,cardHTML} from '../assets/js/properties-data.js';

const fx=[
  {id:'a',title:'A',type:'sale',price:450000,currency:'$',featured:true,location:'Lagos',beds:4,baths:4,sqm:320,images:['x.jpg'],amenities:[],description:''},
  {id:'b',title:'B',type:'shortlet',price:180,currency:'$',featured:true,location:'Lagos',beds:2,baths:2,sqm:95,images:['y.jpg'],amenities:[],description:''},
  {id:'c',title:'C',type:'sale',price:900000,currency:'$',featured:false,location:'Abuja',beds:5,baths:5,sqm:500,images:['z.jpg'],amenities:[],description:''},
  {id:'d',title:'D',type:'shortlet',price:120,currency:'$',featured:true,location:'Accra',beds:1,baths:1,sqm:60,images:['w.jpg'],amenities:[],description:''},
  {id:'e',title:'E',type:'sale',price:300000,currency:'$',featured:true,location:'Lagos',beds:3,baths:3,sqm:210,images:['v.jpg'],amenities:[],description:''},
];

test('filterByType all returns everything',()=>assert.equal(filterByType(fx,'all').length,5));
test('filterByType sale',()=>assert.deepEqual(filterByType(fx,'sale').map(p=>p.id),['a','c','e']));
test('findById hit',()=>assert.equal(findById(fx,'c').title,'C'));
test('findById miss returns null',()=>assert.equal(findById(fx,'zzz'),null));
test('featured caps at 3',()=>assert.equal(featured(fx).length,3));
test('formatPrice sale',()=>assert.equal(formatPrice(fx[0]),'$450,000'));
test('formatPrice shortlet per night',()=>assert.equal(formatPrice(fx[1]),'$180 / night'));
test('cardHTML contains link and title',()=>{
  const html=cardHTML(fx[0]);
  assert.match(html,/property\.html\?id=a/);
  assert.match(html,/A/);
});
```

- [ ] **Step 2: Run to verify failure** — `node --test tests/` → FAIL (module not found).

- [ ] **Step 3: Implement `assets/js/properties-data.js`**

```js
export async function loadProperties(url='data/properties.json'){
  const res=await fetch(url);
  if(!res.ok)throw new Error(`properties load failed: ${res.status}`);
  return res.json();
}
export function filterByType(list,type){return type==='all'?list:list.filter(p=>p.type===type);}
export function findById(list,id){return list.find(p=>p.id===id)??null;}
export function featured(list){return list.filter(p=>p.featured).slice(0,3);}
export function formatPrice(p){
  const s=`${p.currency}${p.price.toLocaleString('en-US')}`;
  return p.type==='shortlet'?`${s} / night`:s;
}
export function cardHTML(p){
  return `<a class="prop-card reveal" href="property.html?id=${encodeURIComponent(p.id)}">
    <img src="${p.images[0]}" alt="${p.title}">
    <span class="prop-tag">${p.type==='sale'?'For Sale':'Shortlet'}</span>
    <span class="prop-body"><strong>${p.title}</strong><em>${p.location}</em><b>${formatPrice(p)}</b></span>
  </a>`;
}
```

- [ ] **Step 4: Run tests** — `node --test tests/` → all 8 PASS.

- [ ] **Step 5: Write `data/properties.json` — 6 clearly-fake listings (3 sale, 3 shortlet)**

```json
[
  {"id":"terra-villa","title":"Terra Villa","type":"sale","location":"Ikoyi, Lagos","price":850000,"currency":"$","beds":5,"baths":5,"sqm":480,"featured":true,
   "description":"PLACEHOLDER LISTING — A light-filled five-bedroom villa with warm stone finishes, double-height living and a private courtyard garden.",
   "amenities":["Private courtyard","Home office","Walk-in closets","Smart lighting","2-car garage"],
   "images":["assets/img/placeholder/p1.jpg","assets/img/placeholder/p3.jpg","assets/img/placeholder/about-2.jpg"]},
  {"id":"sandline-penthouse","title":"Sandline Penthouse","type":"sale","location":"Victoria Island, Lagos","price":1200000,"currency":"$","beds":4,"baths":4,"sqm":390,"featured":true,
   "description":"PLACEHOLDER LISTING — Panoramic penthouse with tan-and-cream interiors by LapisTerra, staged and ready.",
   "amenities":["Skyline terrace","Concierge","Gym & pool","Staged interiors"],
   "images":["assets/img/placeholder/p2.jpg","assets/img/placeholder/p4.jpg"]},
  {"id":"olive-court","title":"Olive Court Townhome","type":"sale","location":"Maitama, Abuja","price":620000,"currency":"$","beds":4,"baths":3,"sqm":310,"featured":false,
   "description":"PLACEHOLDER LISTING — Townhome with olive-toned joinery, terrazzo baths and a show-home finish.",
   "amenities":["Gated estate","Garden","Boys' quarters"],
   "images":["assets/img/placeholder/p5.jpg","assets/img/placeholder/p1.jpg"]},
  {"id":"amber-suite","title":"The Amber Suite","type":"shortlet","location":"Ikate, Lagos","price":180,"currency":"$","beds":2,"baths":2,"sqm":110,"featured":true,
   "description":"PLACEHOLDER LISTING — Two-bedroom design shortlet in boucle, walnut and brass. Managed by LapisTerra.",
   "amenities":["Fast Wi-Fi","Housekeeping","Netflix","24h power","Secure parking"],
   "images":["assets/img/placeholder/p3.jpg","assets/img/placeholder/about-1.jpg"]},
  {"id":"haven-loft","title":"Haven Loft","type":"shortlet","location":"Wuse II, Abuja","price":140,"currency":"$","beds":1,"baths":1,"sqm":75,"featured":false,
   "description":"PLACEHOLDER LISTING — Warm one-bed loft with sculptural seating and a sunlit reading corner.",
   "amenities":["Workspace","Housekeeping","Smart TV"],
   "images":["assets/img/placeholder/p4.jpg","assets/img/placeholder/p2.jpg"]},
  {"id":"terra-nest","title":"Terra Nest Studio","type":"shortlet","location":"Osu, Accra","price":95,"currency":"$","beds":1,"baths":1,"sqm":55,"featured":false,
   "description":"PLACEHOLDER LISTING — Compact studio in terracotta and cream, minutes from the beach.",
   "amenities":["Kitchenette","Wi-Fi","Weekly rates"],
   "images":["assets/img/placeholder/about-1.jpg","assets/img/placeholder/p5.jpg"]}
]
```

- [ ] **Step 6: Featured section on home**

`index.html`:
```html
<section id="properties" class="props container">
  <p class="eyebrow reveal">Real Estate</p>
  <h2 class="reveal">Spaces Worth<br>Owning</h2>
  <div class="props-grid" id="featuredGrid"><p class="props-fallback">Listings are being updated — <a href="#contact">contact us</a> for current availability.</p></div>
  <a class="line-link reveal" href="properties.html">View all properties <span aria-hidden="true">→</span></a>
</section>
```

`main.js` additions:
```js
import {loadProperties,featured,cardHTML} from './properties-data.js';
async function initFeatured(){
  const grid=document.getElementById('featuredGrid');
  if(!grid)return;
  try{
    const list=await loadProperties();
    grid.innerHTML=featured(list).map(cardHTML).join('');
    initReveals();
  }catch{/* fallback message already in DOM */}
}
initFeatured();
```

`home.css`:
```css
.props{padding-block:clamp(4rem,10vw,8rem);display:grid;gap:2.5rem}
.props h2{font-size:var(--h-section);color:var(--terra-dark)}
.props-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:1.5rem}
.prop-card{position:relative;display:grid;gap:0}
.prop-card img{height:340px;width:100%;object-fit:cover}
.prop-tag{position:absolute;top:1rem;left:1rem;background:var(--cream);color:var(--terra-dark);font-size:.7rem;letter-spacing:.18em;text-transform:uppercase;padding:.4rem .8rem}
.prop-body{display:grid;gap:.2rem;padding:1.2rem 0}
.prop-body strong{font-family:var(--font-display);text-transform:uppercase;font-size:1.15rem;color:var(--terra-dark)}
.prop-body em{font-style:normal;font-size:.85rem;opacity:.65}
.prop-body b{font-size:.95rem;color:var(--terra)}
@media (max-width:900px){.props-grid{grid-template-columns:1fr}}
```

- [ ] **Step 7: Verify** — `node --test tests/` passes; homepage shows 3 featured cards (Terra Villa, Sandline Penthouse, The Amber Suite) with tags/prices; cards link to `property.html?id=…`; temporarily rename `data/properties.json` → fallback message shows → rename back.

- [ ] **Step 8: Commit** — `git add -A && git commit -m "feat: properties data layer with tests, featured section"`

---

### Task 9: Properties listing page

**Files:**
- Create: `properties.html`, `assets/css/properties.css`, `assets/js/properties-page.js`

**Interfaces:** Consumes `loadProperties`, `filterByType`, `cardHTML`. Filter buttons carry `data-type="all|sale|shortlet"`.

- [ ] **Step 1: properties.html**

Full page: same `<head>` pattern (title "Properties — LapisTerra Group") + base.css, properties.css; solid-cream nav variant (`class="nav scrolled page-nav"` — always scrolled state, no hero); main:

```html
<main class="container props-page">
  <p class="eyebrow">Real Estate</p>
  <h1>Properties</h1>
  <div class="filter" role="group" aria-label="Filter listings">
    <button data-type="all" class="is-on">All</button>
    <button data-type="sale">For Sale</button>
    <button data-type="shortlet">Shortlets</button>
  </div>
  <div class="props-grid" id="grid"><p>Listings are being updated — <a href="index.html#contact">contact us</a>.</p></div>
</main>
<script type="module" src="assets/js/properties-page.js"></script>
```
Reuse footer markup from index (Task 11 finalizes it; until then a minimal footer with brand lockup is fine — Task 11 syncs all pages).

- [ ] **Step 2: properties.css**

```css
.page-nav{position:sticky}
.props-page{padding-block:8rem 5rem;display:grid;gap:2rem}
.props-page h1{font-size:var(--h-section);color:var(--terra-dark)}
.filter{display:flex;gap:.6rem}
.filter button{border:1px solid var(--terra);background:none;color:var(--terra);padding:.55rem 1.3rem;font:inherit;font-size:.78rem;letter-spacing:.15em;text-transform:uppercase;cursor:pointer;transition:background .25s,color .25s}
.filter button.is-on,.filter button:hover{background:var(--terra);color:var(--cream)}
.props-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:1.5rem}
@media (max-width:900px){.props-grid{grid-template-columns:1fr}}
```
(`.prop-card` styles move from home.css into properties.css? NO — keep them in base.css instead so both pages share them: relocate `.prop-card`, `.prop-tag`, `.prop-body` rules into base.css during this task.)

- [ ] **Step 3: properties-page.js**

```js
import {loadProperties,filterByType,cardHTML} from './properties-data.js';
const grid=document.getElementById('grid');
let all=[];
function render(type){grid.innerHTML=filterByType(all,type).map(cardHTML).join('')||'<p>No listings in this category right now.</p>';}
document.querySelector('.filter').addEventListener('click',e=>{
  const btn=e.target.closest('button');if(!btn)return;
  document.querySelectorAll('.filter button').forEach(b=>b.classList.toggle('is-on',b===btn));
  render(btn.dataset.type);
});
try{all=await loadProperties();render('all');}catch{/* fallback in DOM */}
```
Note: `.reveal` class inside `cardHTML` needs no observer here — add `.reveal{opacity:1}` override is WRONG; instead import and call `initReveals` from `main.js`? main.js runs homepage init. Correct approach: `cardHTML` stays generic; on this page add `document.querySelectorAll('.reveal').forEach(el=>el.classList.add('in'))` after each `render()` call.

- [ ] **Step 4: Verify** — `/properties.html` shows all 6 cards; For Sale → 3; Shortlets → 3; active button styled; every card links to detail page; mobile 1-col.
- [ ] **Step 5: Commit** — `git add -A && git commit -m "feat: properties listing page with filter"`

---

### Task 10: Property detail page

**Files:**
- Create: `property.html`, `assets/js/property-detail.js`
- Modify: `assets/css/properties.css`

**Interfaces:** Consumes `loadProperties`, `findById`, `formatPrice`. Reads `?id=`.

- [ ] **Step 1: property.html**

Same head/nav/footer pattern (title set by JS). Main:

```html
<main class="container detail" id="detail">
  <p>Loading listing…</p>
</main>
<script type="module" src="assets/js/property-detail.js"></script>
```

- [ ] **Step 2: property-detail.js**

```js
import {loadProperties,findById,formatPrice} from './properties-data.js';
const root=document.getElementById('detail');
const id=new URLSearchParams(location.search).get('id');
function notFound(){
  root.innerHTML=`<div class="detail-missing"><h1>Listing not found</h1>
  <p>This property may have been sold or taken off the market.</p>
  <a class="line-link" href="properties.html">Back to properties <span aria-hidden="true">→</span></a></div>`;
}
try{
  const p=findById(await loadProperties(),id);
  if(!p){notFound();}
  else{
    document.title=`${p.title} — LapisTerra Group`;
    root.innerHTML=`
      <p class="eyebrow">${p.type==='sale'?'For Sale':'Shortlet'} · ${p.location}</p>
      <h1>${p.title}</h1>
      <div class="detail-gallery">
        <img id="mainImg" src="${p.images[0]}" alt="${p.title}">
        <div class="thumbs">${p.images.map((s,i)=>`<img data-src="${s}" ${i===0?'class="is-on"':''} src="${s}" alt="View ${i+1} of ${p.title}">`).join('')}</div>
      </div>
      <div class="detail-cols">
        <div>
          <p class="detail-price">${formatPrice(p)}</p>
          <p class="detail-specs">${p.beds} beds · ${p.baths} baths · ${p.sqm} m²</p>
          <p>${p.description}</p>
          <ul class="detail-amenities">${p.amenities.map(a=>`<li>${a}</li>`).join('')}</ul>
        </div>
        <div class="detail-cta">
          <p>Interested in this property?</p>
          <a class="line-link" href="index.html#contact">Enquire now <span aria-hidden="true">→</span></a>
        </div>
      </div>`;
    document.querySelector('.thumbs').addEventListener('click',e=>{
      const t=e.target.closest('img');if(!t)return;
      document.getElementById('mainImg').src=t.dataset.src;
      document.querySelectorAll('.thumbs img').forEach(x=>x.classList.toggle('is-on',x===t));
    });
  }
}catch{notFound();}
```

- [ ] **Step 3: CSS additions (properties.css)**

```css
.detail{padding-block:8rem 5rem;display:grid;gap:2rem}
.detail h1{font-size:var(--h-section);color:var(--terra-dark)}
.detail-gallery img#mainImg{width:100%;height:520px;object-fit:cover}
.thumbs{display:flex;gap:.8rem;margin-top:.8rem}
.thumbs img{width:110px;height:76px;object-fit:cover;cursor:pointer;opacity:.55;transition:opacity .25s}
.thumbs img.is-on,.thumbs img:hover{opacity:1}
.detail-cols{display:grid;grid-template-columns:1.6fr 1fr;gap:3rem}
.detail-price{font-family:var(--font-display);font-size:2rem;color:var(--terra)}
.detail-specs{letter-spacing:.1em;text-transform:uppercase;font-size:.8rem;opacity:.65;margin:.5rem 0 1.2rem}
.detail-amenities{list-style:none;display:flex;flex-wrap:wrap;gap:.6rem;margin-top:1.5rem}
.detail-amenities li{border:1px solid var(--sand);padding:.35rem .9rem;font-size:.8rem}
.detail-cta{align-self:start;background:var(--cream);border:1px solid var(--sand);padding:2rem;display:grid;gap:1.4rem}
.detail-missing{padding-block:4rem;display:grid;gap:1.5rem;justify-items:start}
@media (max-width:900px){.detail-cols{grid-template-columns:1fr}.detail-gallery img#mainImg{height:320px}}
```

- [ ] **Step 4: Verify** — visit `property.html?id=terra-villa` (title, gallery, thumbs switch main image, price `$850,000`, amenities); `?id=amber-suite` shows `$180 / night`; `?id=bogus` and missing `?id` show not-found state; all 6 ids resolve.
- [ ] **Step 5: Commit** — `git add -A && git commit -m "feat: property detail page"`

---

### Task 11: Journal, contact form, footer + marquee (all pages)

**Files:**
- Modify: `index.html` (fill `#journal`, `#contact`, `.footer`), `assets/css/home.css`, `assets/css/base.css` (footer shared), `properties.html`, `property.html` (paste identical footer)

**Interfaces:** Footer markup identical across the three pages. Form posts to Formspree placeholder `https://formspree.io/f/FORM_ID` (real ID pending from user — keep literal `FORM_ID` and note it in README + final report).

- [ ] **Step 1: Journal markup + CSS**

```html
<section id="journal" class="journal container">
  <p class="eyebrow reveal" style="text-align:center">Journal</p>
  <h2 class="reveal" style="text-align:center">Notes From<br>The Studio</h2>
  <div class="journal-grid">
    <figure class="reveal"><img src="assets/img/placeholder/about-1.jpg" alt=""><figcaption>Textures of Stillness</figcaption></figure>
    <figure class="reveal"><img src="assets/img/placeholder/p4.jpg" alt=""><figcaption>Light as a Material</figcaption></figure>
    <figure class="reveal"><img src="assets/img/placeholder/p3.jpg" alt=""><figcaption>The Beauty of Restraint</figcaption></figure>
    <figure class="reveal"><img src="assets/img/placeholder/p5.jpg" alt=""><figcaption>Spaces That Breathe</figcaption></figure>
  </div>
</section>
```

```css
.journal{padding-block:clamp(4rem,10vw,8rem);display:grid;gap:3rem}
.journal h2{font-size:var(--h-section);color:var(--terra-dark)}
.journal-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:1.5rem;align-items:start}
.journal-grid figure:nth-child(2){margin-top:3rem}
.journal-grid figure:nth-child(4){margin-top:5rem}
.journal-grid img{height:300px;width:100%;object-fit:cover}
.journal-grid figcaption{font-family:var(--font-display);text-transform:uppercase;font-size:1rem;color:var(--terra-dark);margin-top:.9rem}
@media (max-width:900px){.journal-grid{grid-template-columns:repeat(2,1fr)}.journal-grid figure{margin-top:0!important}}
```

- [ ] **Step 2: Contact markup + CSS + validation JS**

```html
<section id="contact" class="contact container">
  <div class="contact-copy">
    <p class="eyebrow reveal">Contact us</p>
    <h2 class="reveal">Let&rsquo;s Begin a<br>Conversation</h2>
    <p class="reveal">Tell us about your space, your property, or your plans — we&rsquo;ll guide you through the next steps with care and intention.</p>
  </div>
  <form class="contact-form reveal" action="https://formspree.io/f/FORM_ID" method="POST" novalidate>
    <input type="text" name="_gotcha" style="display:none" tabindex="-1" autocomplete="off">
    <label>Name<input name="name" type="text" required></label>
    <div class="form-row">
      <label>Phone<input name="phone" type="tel"></label>
      <label>Email<input name="email" type="email" required></label>
    </div>
    <label>Message<textarea name="message" rows="4" required></textarea></label>
    <button class="line-link" type="submit">Send request <span aria-hidden="true">→</span></button>
    <p class="form-msg" role="status" aria-live="polite"></p>
  </form>
</section>
```

```css
.contact{display:grid;grid-template-columns:minmax(280px,420px) 1fr;gap:4rem;padding-block:clamp(4rem,10vw,8rem)}
.contact h2{font-size:var(--h-section);color:var(--terra-dark)}
.contact-copy{display:grid;gap:1.6rem;align-content:start}
.contact-form{display:grid;gap:1.8rem;align-content:start}
.contact-form label{display:grid;gap:.4rem;font-size:.8rem;letter-spacing:.12em;text-transform:uppercase;opacity:.85}
.contact-form input,.contact-form textarea{border:0;border-bottom:1px solid var(--olive);background:none;padding:.6rem 0;font:inherit;font-size:1rem}
.contact-form input:focus,.contact-form textarea:focus{outline:none;border-bottom-color:var(--terra)}
.contact-form textarea{border:1px solid var(--olive);padding:.8rem}
.form-row{display:grid;grid-template-columns:1fr 1fr;gap:1.5rem}
.contact-form button{background:none;border:0;border-bottom:1px solid currentColor;cursor:pointer;justify-self:start;color:var(--terra-dark)}
@media (max-width:900px){.contact{grid-template-columns:1fr}.form-row{grid-template-columns:1fr}}
```

`main.js` addition (`initForm()`):
```js
function initForm(){
  const form=document.querySelector('.contact-form');
  if(!form)return;
  form.addEventListener('submit',async e=>{
    e.preventDefault();
    const msg=form.querySelector('.form-msg');
    if(!form.reportValidity())return;
    try{
      const res=await fetch(form.action,{method:'POST',body:new FormData(form),headers:{Accept:'application/json'}});
      msg.textContent=res.ok?'Thank you — we’ll be in touch shortly.':'Something went wrong. Please email us directly.';
      if(res.ok)form.reset();
    }catch{msg.textContent='Something went wrong. Please email us directly.';}
  });
}
```

- [ ] **Step 3: Footer + marquee in base.css (shared), markup pasted into all three pages**

```html
<footer class="footer">
  <div class="footer-grid container">
    <!-- brand lockup (cream) -->
    <nav><p class="eyebrow">Menu</p><a href="index.html#about">About</a><a href="index.html#portfolio">Portfolio</a><a href="index.html#services">Services</a><a href="properties.html">Properties</a><a href="index.html#contact">Contact</a></nav>
    <div><p class="eyebrow">Follow us</p><a href="https://instagram.com" rel="noopener" target="_blank">Instagram</a></div>
    <div><p class="eyebrow">Contact</p><p>hello@lapisterra.group<br>+000 000 0000<br>Lagos, Nigeria</p></div>
  </div>
  <div class="marquee" aria-hidden="true"><div class="marquee-track">
    <span>Get in touch ✦ Get in touch ✦ Get in touch ✦ Get in touch ✦ </span>
    <span>Get in touch ✦ Get in touch ✦ Get in touch ✦ Get in touch ✦ </span>
  </div></div>
</footer>
```

```css
.footer{background:var(--terra-dark);color:var(--cream);padding-top:4rem;overflow:hidden}
.footer-grid{display:grid;grid-template-columns:1.4fr 1fr 1fr 1.2fr;gap:2.5rem;padding-bottom:3.5rem}
.footer-grid nav,.footer-grid div{display:grid;gap:.5rem;align-content:start;font-size:.9rem}
.footer-grid a:hover{color:var(--gold)}
.marquee{border-top:1px solid color-mix(in srgb,var(--cream) 25%,transparent);padding-block:1.2rem}
.marquee-track{display:flex;white-space:nowrap;font-family:var(--font-display);text-transform:uppercase;font-size:clamp(2.5rem,7vw,5.5rem);color:color-mix(in srgb,var(--cream) 30%,transparent)}
@media (prefers-reduced-motion: no-preference){
  .marquee-track{animation:marquee 22s linear infinite}
  @keyframes marquee{to{transform:translateX(-50%)}}
}
@media (max-width:900px){.footer-grid{grid-template-columns:1fr 1fr}}
```
Contact-info values are placeholders — flag in final report.

- [ ] **Step 4: Verify** — journal staggered grid (no pointer cursor on figures); form blocks empty submit, shows validity errors, fake-ID submit shows the error message path (expected until real Formspree ID); footer identical on all 3 pages; marquee scrolls seamlessly and is static when macOS Reduce Motion is on.
- [ ] **Step 5: Commit** — `git add -A && git commit -m "feat: journal, contact form, shared footer with marquee"`

---

### Task 12: Responsive/a11y polish + full walkthrough

**Files:**
- Modify: any of the above as findings dictate

- [ ] **Step 1: OG/meta on all pages** — add to each `<head>`: `<meta property="og:title" …>`, `<meta property="og:description" …>`, `<meta property="og:image" content="assets/img/placeholder/hero.jpg">`.
- [ ] **Step 2: Walkthrough checklist (desktop 1280 + responsive 768/375):**
  - Hero: headline stagger, nav transition, burger menu open/close/navigate
  - Every section reveals once, no layout shift; images no overflow-x anywhere (`document.body.scrollWidth === innerWidth` in console)
  - Carousel wraps both directions; counter correct
  - Featured cards → detail pages; properties filter; all 6 details; bogus id not-found
  - Form validation; marquee; reduced-motion (System Settings → Accessibility → toggle, or DevTools emulation)
  - No console errors on any page; `node --test tests/` green
- [ ] **Step 3: Fix all findings, commit** — `git add -A && git commit -m "polish: responsive and accessibility pass"`
- [ ] **Step 4: Final report to user** — list: font download status, logo approximation caveat, Formspree FORM_ID needed, placeholder contact info/socials, image-swap instructions.

---

## Self-review notes

- Spec coverage: hero/about/portfolio/services(5 cards incl. staging + shortlets)/featured properties/journal(non-clicking)/contact/marquee footer → Tasks 4–11; properties grid+filter → Task 9; detail+not-found+enquire → Task 10; data file+schema+6 listings → Task 8; motion/reduced-motion → Tasks 1, 11; responsive → per-task + Task 12; error handling (fetch fail, bad id, form) → Tasks 8–11; placeholder imagery → Task 2; logo GROUP variant → Task 3; Formspree placeholder → Task 11. Journal pages, portfolio pages, admin, payments: out of scope per spec.
- Type consistency: `loadProperties/filterByType/findById/featured/formatPrice/cardHTML` used identically in Tasks 8/9/10; `.prop-card` styles shared via base.css (moved in Task 9); footer markup duplicated by design (static site, no templating).
