# Brigid Task — ProjectPercyPH Dashboard UI Redesign v2

Workspace: C:\Users\Carl Rebadomia\.openclaw\workspace\dashboard\
Repo: heylencer-debug/ProjectPerciPH
Push tool: node push-file.js (run from dashboard/ directory)

---

## BRAND DIRECTION: Light / White / Chrome / Dopamine / GenZ Bold Minimalist

Carlo rejected the dark theme. This is a LIGHT dashboard.

### Color Palette
- Background: #FFFFFF (pure white) or #F8F8FA (off-white for page bg)
- Surface/cards: #FFFFFF with 1px border #E8E8EC
- Sidebar: #FFFFFF, right border 1px #E8E8EC
- Primary text: #0A0A0A (near-black)
- Secondary text: #6B7280
- Accent 1 (primary): #FF6B6B (coral — brand hero color)
- Accent 2: #0066FF (electric blue)
- Accent 3: #FFE600 (bright yellow — use sparingly as highlight)
- Accent 4: #C8D0D8 (chrome silver — for borders, secondary surfaces)
- Accent 5: #C084FC (lavender — tags, badges)
- Success: #00C97A (emerald green)
- Chrome effect: use linear-gradient(135deg, #C8D0D8, #E8EAED, #C8D0D8) on select hero elements (stat cards, header bar)

### Typography
- Font: Inter (load via Google Fonts CDN)
- Section headers: uppercase, font-weight 800-900, letter-spacing 0.08em, font-size 11-12px (label style)
- Page titles: bold, 28-36px
- Stat numbers: 48-56px, font-weight 900, color #0A0A0A
- Body: 14px, font-weight 400-500, color #374151
- Table headers: uppercase, 11px, font-weight 700, letter-spacing 0.1em, color #6B7280

### Cards
- Background: #FFFFFF
- Border: 1px solid #E8E8EC
- Border-radius: 8px
- No box-shadow (flat, clean)
- Padding: 20-24px

### Buttons
- Primary: background #FF6B6B, color #FFFFFF, font-weight 700, border-radius 6px, no border
- Secondary: background transparent, border 1.5px solid #0A0A0A, color #0A0A0A, font-weight 600
- Accent: background #FFE600, color #0A0A0A, font-weight 700

### Filter Pills / Badges
- Default: border 1.5px solid #E8E8EC, background #F8F8FA, color #374151, border-radius 6px, font-size 12px, font-weight 600
- Active: border-color #FF6B6B, background #FFF5F5, color #FF6B6B
- Category badges inline: small, outlined, 4px radius

### Tables
- Header row: background #F8F8FA, uppercase text, 11px, #6B7280
- Body rows: white bg, 1px bottom border #F0F0F0
- Hover row: background #FAFAFA
- No outer border on table

### Sidebar
- Background: #FFFFFF
- Right border: 1px solid #E8E8EC
- Nav items: 14px, font-weight 500, color #374151, padding 10px 16px
- Active nav item: background #FFF5F5, color #FF6B6B, font-weight 700, left border 3px solid #FF6B6B
- Logo area: bold, brand name in #0A0A0A

### Stats Hero Cards (home page)
- White card, thin border
- Number: huge (48px+), bold, #0A0A0A
- Label: 11px uppercase, #6B7280
- Accent line: 3px top border in one of the dopamine colors (coral, blue, yellow, purple — rotate per card)

### Ethel Feed Table (home page)
- Section label: uppercase, 11px, #6B7280, letter-spacing
- Table: clean white, thin row borders
- Timestamp column: monospace font, #6B7280
- Action column: badge style (small outlined pill)
- Summary column: normal text

---

## AUDIT & FIX — Mobile + Web Broken UIs

Read index.html and style.css fully. Identify and fix ALL of these common issues:

### Mobile Fixes Required
1. Sidebar — on mobile (<768px) must collapse to a hamburger menu or hidden drawer. Currently likely overflows.
2. Cards grid — must stack to 1 column on mobile (grid-template-columns: 1fr)
3. Stats bar — must stack vertically on mobile
4. Tables — must be horizontally scrollable on mobile (overflow-x: auto wrapper)
5. BTV catalog grid — must go 2-col on tablet, 1-col on mobile
6. Supplier cards grid — same as above
7. Header/topbar — must not overflow on small screens
8. Filter pills — must wrap on mobile, not overflow horizontally
9. Any fixed widths on containers — replace with max-width + width: 100%

### Web (Desktop) Fixes
1. Any content that overflows the main panel (check sidebar + content area widths)
2. BTV grid image aspect ratios — images must not stretch or crop badly
3. Table columns that are too narrow or too wide
4. Any z-index issues (dropdowns, modals)
5. Font sizes that are too large or too small
6. Any hardcoded pixel widths that break at different viewport sizes

---

## FILES TO EDIT
1. style.css — FULL rewrite (light theme, mobile-responsive fixes)
2. index.html — structural fixes for mobile (add hamburger button, viewport meta if missing, table wrappers)
3. app.js — no major changes needed, but fix renderEthelFeed() if broken

---

## PUSH TO GITHUB
After all edits, push all changed files:
  node push-file.js "style.css" "style.css" "redesign: light GenZ bold minimalist UI + mobile fixes"
  node push-file.js "index.html" "index.html" "fix: mobile responsive structure + table wrappers"
  node push-file.js "app.js" "app.js" "fix: renderEthelFeed cleanup"

Run all push commands from: C:\Users\Carl Rebadomia\.openclaw\workspace\dashboard\

---

## RULES
- Read style.css, index.html, app.js FULLY before touching anything
- Preserve ALL existing IDs, class names, JS functions
- Light mode only — no dark mode
- Mobile-first thinking on all new CSS
- Report commit hashes + list every broken UI you found and fixed

When completely done, run:
openclaw system event --text "Brigid done: ProjectPercyPH light UI redesign + mobile audit complete. Pushed to GitHub."
