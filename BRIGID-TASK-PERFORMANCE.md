# Brigid Task — Dashboard Performance Fix

Workspace: C:\Users\Carl Rebadomia\.openclaw\workspace\dashboard\
Push tool: node push-file.js (run from dashboard/)

## PROBLEM
Dashboard loads too slow. Root causes:
1. boot() renders ALL tabs at once — competitors, suppliers, charts, market, pricing, BTV, supplier intel — even tabs the user never opens
2. data/btv-products.js is 97KB loaded synchronously in <head> (blocks parsing)
3. data/data.js is 36KB + data/feed.js is 26KB — all loaded synchronously before paint
4. Multiple Supabase fetches fire in parallel at boot (loadFromSupabase, renderEthelFeed, initRealtime)
5. Chart.js renders two charts on boot even if not visible

## FIX STRATEGY: Render only the active tab on boot, lazy-load everything else

---

## TASK 1: Fix boot() in app.js

Replace the current boot() function with a lean version that ONLY renders the home/market tab.
Everything else renders on first tab click (lazy loading already partially exists via lazyState).

Find boot() and replace its body with:

```js
function boot() {
  // Only render what's visible on first load (market/home tab)
  setDates();
  updateGradCountdown();
  renderStats();          // Home stats bar — fast, uses static data
  renderSeasonalAlerts(); // Small widget
  renderCharts();         // Only if charts are on the active tab

  // Setup nav — all other tabs lazy-load on first click
  setupNav();
  setupMobile();
  setupSupplierTabs();

  // Ethel feed on home — single Supabase call, non-blocking
  renderEthelFeed();
  setInterval(renderEthelFeed, 60000);

  // Realtime — subscribe only (no heavy fetch)
  initRealtime();

  hideLoader();
}
```

The key change: REMOVE all these calls from boot() (they will lazy-load on tab click instead):
- renderProductsTable()
- renderCompetitors()
- renderInsights()
- renderProductOpportunities()
- renderCompetitorDeepDive()
- renderThreatMatrix()
- renderAdvantages()
- renderSuppliers()
- renderGroups()
- renderTemplate()
- setupFilters()
- renderSupplierIntelligence()
- initPricingCalculator()

---

## TASK 2: Wire lazy loading in setupNav()

The setupNav() already has a lazyLoadTab(page) call. Extend it so every tab renders on first activation.

Find lazyLoadTab() and make sure it handles ALL pages:

```js
async function lazyLoadTab(page) {
  // Already-handled lazy states
  const state = lazyState[page];
  if (state) {
    if (state.rendered) return;
    // load data file if needed, then render
    // existing logic handles feed/calendar/captions/catalog/btv
    // ... keep existing code ...
    return;
  }

  // New: pages that use static data.js (already loaded) but were deferred
  if (!window._rendered) window._rendered = {};
  if (window._rendered[page]) return;
  window._rendered[page] = true;

  if (page === 'market') {
    renderProductsTable();
    renderCompetitors();
    renderInsights();
    renderProductOpportunities();
  }
  if (page === 'competitors') {
    renderCompetitorDeepDive();
    renderThreatMatrix();
    renderAdvantages();
  }
  if (page === 'suppliers') {
    renderSuppliers();
    renderGroups();
    renderTemplate();
    setupFilters();
  }
  if (page === 'supplier-intel') {
    renderSupplierIntelligence();
    loadSupplierProducts();
    renderPriceTracker();
  }
  if (page === 'pricing') {
    initPricingCalculator();
  }
  if (page === 'feed') {
    // already handled by lazyState
  }
  if (page === 'competitor-feed') {
    loadCompetitorFeed();
  }
}
```

---

## TASK 3: Defer heavy script tags in index.html

Find these script tags in <head> and add `defer` attribute, or move to end of <body>:

CURRENT (blocking):
  <script src="data/data.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/..."></script>
  <script src="data/sb.js"></script>

CHANGE TO (non-blocking):
  <script src="data/data.js" defer></script>
  <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.min.js" defer></script>
  <script src="data/sb.js" defer></script>

IMPORTANT: app.js at end of body must also be defer or just stay at end of body (it already is).
chart.js already has defer — keep it.

Also: find `<script src="data/btv-products.js">` if it exists in index.html and add defer.
Find `<script src="data/feed.js">` and add defer.

---

## TASK 4: Add a visible skeleton/loading state

The user sees a blank white screen during load. Add a quick skeleton so it feels instant.

In index.html, right after <body>, add a loading splash that hides once boot() runs:

The hideLoader() function already exists. Make sure the loader element exists in HTML:
Find id="loader" or class="loader" — if it doesn't exist, add:
```html
<div id="loader" style="position:fixed;inset:0;background:#fff;display:flex;align-items:center;justify-content:center;z-index:9999;font-family:Inter,sans-serif;">
  <div style="text-align:center">
    <div style="font-size:13px;font-weight:700;letter-spacing:0.15em;color:#0A0A0A;margin-bottom:8px">PROJECT PERCY PH</div>
    <div style="font-size:11px;color:#6B7280;letter-spacing:0.1em">LOADING DASHBOARD...</div>
    <div style="width:120px;height:2px;background:#F0F0F0;margin:12px auto 0;border-radius:2px;overflow:hidden">
      <div style="width:40%;height:100%;background:#FF6B6B;border-radius:2px;animation:loadbar 1s ease-in-out infinite alternate"></div>
    </div>
  </div>
</div>
<style>
@keyframes loadbar { from { width: 20%; margin-left: 0; } to { width: 60%; margin-left: 40%; } }
</style>
```

Check if hideLoader() properly removes this loader. If not:
```js
function hideLoader() {
  const loader = document.getElementById('loader');
  if (loader) {
    loader.style.opacity = '0';
    loader.style.transition = 'opacity 0.3s';
    setTimeout(function() { loader.style.display = 'none'; }, 300);
  }
}
```

---

## TASK 5: Remove redundant Supabase calls at boot

In init(), find `await loadFromSupabase()` — this fires multiple Supabase fetches (market_stats, competitors, suppliers, product_opportunities) all at boot time.

Change it: only load market_stats on boot (the rest load lazily per tab):

```js
async function loadFromSupabase() {
  if (!SB_URL || !SB_KEY) return;
  try {
    // Only load market stats on boot — everything else loads per-tab
    const stats = await sbFetch('market_stats', 'order=updated_at.desc&limit=1');
    if (Array.isArray(stats) && stats.length > 0) {
      // overlay market stats if available
      console.log('[Supabase] Market stats loaded');
    }
  } catch(e) {
    console.warn('[Supabase] loadFromSupabase failed:', e.message);
  }
}
```

---

## EXPECTED RESULT
- First paint: < 1 second (only loader + sidebar render)
- Home tab interactive: < 2 seconds (stats + ethel feed)
- Other tabs: load on first click only
- BTV/Supplier pages: load images lazily from Supabase when tab opens

---

## PUSH
  node push-file.js "app.js" "app.js" "perf: lazy-load all tabs, boot renders home only"
  node push-file.js "index.html" "index.html" "perf: defer scripts, add loading skeleton"

## RULES
- Read app.js fully before touching it — it's 1965 lines
- Keep ALL existing functions — just defer WHEN they're called
- Do not break any existing tab functionality
- Test the logic mentally: clicking each tab must still work

When done, run:
openclaw system event --text "Brigid done: dashboard performance fixed — lazy loading all tabs, boot renders home only"
