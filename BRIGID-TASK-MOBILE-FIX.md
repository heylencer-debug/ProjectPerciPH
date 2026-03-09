# Brigid Task — Mobile UI Audit + Fix

Workspace: C:\Users\Carl Rebadomia\.openclaw\workspace\dashboard\
Push tool: node push-file.js (run from dashboard/)

## GOAL
Full mobile audit and fix for ProjectPercyPH dashboard.
Carlo says mobile UI is broken. Read style.css and index.html fully, then fix every issue.

---

## MANDATORY FIXES (do all of these):

### 1. Sidebar on mobile
- On mobile (<768px): sidebar must be HIDDEN by default (transform: translateX(-100%) or display:none)
- A hamburger button must be visible top-left of the header/topbar
- Tapping hamburger toggles sidebar open/close
- When sidebar is open on mobile, show a dark overlay behind it
- Add JS: hamburger click → add class 'sidebar-open' to body → sidebar slides in
- Check if hamburger button already exists in index.html — if yes, make sure JS is wired

### 2. Main content area
- On mobile: margin-left must be 0 (not offset by sidebar width)
- Width: 100%, no overflow
- Padding: 16px (not 24-32px on mobile)

### 3. Stats/numbers bar
- On mobile: wrap to 2-column grid (2 stat cards per row)
- At 400px: 1-column

### 4. All card grids (BTV catalog, supplier products, competitor feed)
- Tablet (768px): 2 columns
- Mobile (480px): 2 columns minimum (1 column if card is wide)
- Never overflow horizontally

### 5. Tables
- ALL tables must be wrapped in a div with overflow-x: auto
- Check index.html — find every <table> and ensure it has a wrapper div with class "table-wrap"
- Add to style.css: .table-wrap { overflow-x: auto; -webkit-overflow-scrolling: touch; width: 100%; }

### 6. Filter rows
- On mobile: filter pills and selects must WRAP (flex-wrap: wrap)
- No horizontal scroll on filter area

### 7. Page header
- On mobile: font sizes must scale down
- Page title: 24px on mobile (not 36px)
- No text overflow

### 8. Topbar/header bar
- On mobile: height auto, content wraps properly
- Logo/brand name visible, no overflow

### 9. BTV catalog grid
- Check current grid-template-columns — must be responsive
- Mobile: 2 columns (not 3-4)

### 10. Images in cards
- All card images: object-fit: cover, max-width: 100%, no overflow

### 11. Supplier tabs (new)
- Tab buttons must be full-width on mobile or scroll horizontally
- Tab content must be 100% width

### 12. Input/select elements
- On mobile: full width (width: 100%)
- Sufficient tap target size (min-height: 40px)

---

## CSS APPROACH
Add a comprehensive mobile section at the BOTTOM of style.css:

```css
/* ===== MOBILE RESPONSIVE — FINAL PASS ===== */

/* Hamburger button */
.hamburger-btn {
  display: none;
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
  flex-direction: column;
  gap: 5px;
}
.hamburger-btn span {
  display: block;
  width: 22px;
  height: 2px;
  background: #0A0A0A;
  border-radius: 2px;
}

/* Mobile overlay */
.sidebar-overlay {
  display: none;
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.4);
  z-index: 99;
}

@media (max-width: 768px) {
  /* Show hamburger */
  .hamburger-btn { display: flex; }

  /* Hide sidebar by default */
  .sidebar {
    position: fixed;
    left: 0; top: 0; bottom: 0;
    z-index: 100;
    transform: translateX(-100%);
    transition: transform 0.25s ease;
  }

  /* Sidebar open state */
  body.sidebar-open .sidebar { transform: translateX(0); }
  body.sidebar-open .sidebar-overlay { display: block; }

  /* Main content full width */
  .main-content, .content-area, main, [class*="main"] {
    margin-left: 0 !important;
    width: 100% !important;
    padding: 16px !important;
  }

  /* Stats wrap 2-col */
  .stats-bar, .stats-row, [class*="stats"] {
    grid-template-columns: repeat(2, 1fr) !important;
    display: grid !important;
    gap: 12px !important;
  }

  /* All grids 2-col */
  .btv-grid, .supplier-products-grid, .competitor-feed-grid,
  .suppliers-cards-grid, .opportunities-grid {
    grid-template-columns: repeat(2, 1fr) !important;
    gap: 10px !important;
  }

  /* Tables scrollable */
  table { min-width: 500px; }
  .table-wrap, [class*="table-wrap"] { overflow-x: auto; -webkit-overflow-scrolling: touch; }

  /* Filter rows wrap */
  .filter-row, .filter-pills, [class*="filter"] {
    flex-wrap: wrap !important;
  }

  /* Page headers scale */
  .page-title, [class*="page-title"] { font-size: 22px !important; }
  .section-title { font-size: 18px !important; }

  /* Full width inputs */
  select, input, .filter-select {
    width: 100%;
    min-height: 40px;
  }

  /* Stat numbers smaller */
  .stat-number, [class*="stat-number"] { font-size: 32px !important; }
}

@media (max-width: 400px) {
  .btv-grid, .supplier-products-grid {
    grid-template-columns: repeat(2, 1fr) !important;
  }
  .competitor-feed-grid { grid-template-columns: 1fr !important; }
  .stats-bar, .stats-row { grid-template-columns: repeat(2, 1fr) !important; }
}
```

---

## JS TO ADD in app.js

Add hamburger toggle logic (add near the top of init() or in a setupMobile() function):

```js
function setupMobile() {
  var hamburger = document.getElementById('hamburger-btn');
  var overlay = document.getElementById('sidebar-overlay');
  if (hamburger) {
    hamburger.addEventListener('click', function() {
      document.body.classList.toggle('sidebar-open');
    });
  }
  if (overlay) {
    overlay.addEventListener('click', function() {
      document.body.classList.remove('sidebar-open');
    });
  }
  // Close sidebar on nav item click (mobile)
  document.querySelectorAll('.nav-item').forEach(function(item) {
    item.addEventListener('click', function() {
      if (window.innerWidth <= 768) {
        document.body.classList.remove('sidebar-open');
      }
    });
  });
}
```

Call setupMobile() inside init() or boot().

---

## HTML CHANGES in index.html

1. Make sure viewport meta exists in <head>:
   <meta name="viewport" content="width=device-width, initial-scale=1.0">

2. Add hamburger button to the topbar/header (if not already there):
   <button id="hamburger-btn" class="hamburger-btn" aria-label="Menu">
     <span></span><span></span><span></span>
   </button>

3. Add overlay div just before </body>:
   <div id="sidebar-overlay" class="sidebar-overlay"></div>

4. Wrap ALL existing <table> elements with:
   <div class="table-wrap">...</div>
   (find every bare <table> tag and wrap it)

---

## PUSH TO GITHUB
  node push-file.js "style.css" "style.css" "fix: comprehensive mobile responsive overhaul"
  node push-file.js "index.html" "index.html" "fix: hamburger nav, table wrappers, viewport meta"
  node push-file.js "app.js" "app.js" "fix: setupMobile() hamburger toggle"

## RULES
- Read all files fully first
- Keep ALL existing styles — only add/override
- Test mentally: imagine opening on iPhone 13 (390px wide) and iPad (768px)
- Every grid must be usable on mobile

When done, run:
openclaw system event --text "Brigid done: full mobile fix complete on ProjectPercyPH dashboard"
