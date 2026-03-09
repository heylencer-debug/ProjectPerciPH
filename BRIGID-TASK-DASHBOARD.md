# Brigid Task — ProjectPercyPH Dashboard: Items 1, 2, 5

You are Brigid 🔥 — Project Percy PH's lead engineer. Work in:
`C:\Users\Carl Rebadomia\.openclaw\workspace\dashboard`

Complete ALL 3 items below. Do not stop until all are done.

---

## Supabase Context
- URL: https://fhfqjcvwcxizbioftvdw.supabase.co
- Key: REDACTED_SUPABASE_KEY
- Access Token: sbp_930d9e5fe75da4d2415263ec1d37aaaa8b5aaab7
- Project ref: fhfqjcvwcxizbioftvdw
- Management API: POST https://api.supabase.com/v1/projects/fhfqjcvwcxizbioftvdw/database/query
  with header: Authorization: Bearer sbp_930d9e5fe75da4d2415263ec1d37aaaa8b5aaab7

## GitHub Push
Git push via terminal is broken. Push files via GitHub API:
- Repo: heylencer-debug/ProjectPerciPH
- PAT: REDACTED_PAT
- Use PowerShell Invoke-RestMethod PUT to: https://api.github.com/repos/heylencer-debug/ProjectPerciPH/contents/{path}
- Always get current SHA first, then PUT with sha in body

---

## ITEM 1 — Supabase Realtime

Add live Supabase Realtime so the BTV catalog and intel sections update without refresh.

### What to do:

1. In `index.html` `<head>`, add:
```html
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.min.js"></script>
```
Also add a config script before app.js loads:
```html
<script>
  window.SUPABASE_CONFIG = {
    url: 'https://fhfqjcvwcxizbioftvdw.supabase.co',
    key: 'REDACTED_SUPABASE_KEY'
  };
</script>
```

2. In `app.js`, add this function and call it at the end of `boot()`:
```javascript
function initRealtime() {
  if (!window.supabase || !window.SUPABASE_CONFIG) return;

  const client = window.supabase.createClient(
    window.SUPABASE_CONFIG.url,
    window.SUPABASE_CONFIG.key
  );

  // Watch btv_products — refresh BTV catalog if active
  client
    .channel('btv-products')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'btv_products' }, () => {
      if (document.getElementById('page-btv')?.classList.contains('active')) {
        renderBtvCatalog();
      }
    })
    .subscribe();

  // Watch intel_feed — refresh supplier intel page if active
  client
    .channel('intel-feed')
    .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'intel_feed' }, payload => {
      console.log('[Realtime] New intel:', payload.new);
      if (document.getElementById('page-supplier-intel')?.classList.contains('active')) {
        renderSupplierIntelligence();
      }
      // Flash the nav badge
      const badge = document.querySelector('[data-page="supplier-intel"] .nav-badge');
      if (badge) {
        badge.style.background = '#E94560';
        badge.textContent = 'NEW';
        setTimeout(() => { badge.style.background = '#8B5CF6'; badge.textContent = 'Ethel'; }, 5000);
      }
    })
    .subscribe();

  console.log('[Realtime] Dashboard channels subscribed ✅');
}
```

3. Enable Realtime on tables via Management API. Create `enable-realtime.js` in the dashboard folder:
```javascript
const https = require('https');
const SQL = `
ALTER PUBLICATION supabase_realtime ADD TABLE btv_products;
ALTER PUBLICATION supabase_realtime ADD TABLE intel_feed;
`;
const ACCESS_TOKEN = 'sbp_930d9e5fe75da4d2415263ec1d37aaaa8b5aaab7';
const PROJECT_REF = 'fhfqjcvwcxizbioftvdw';
const bodyStr = JSON.stringify({ query: SQL });
const req = https.request({
  hostname: 'api.supabase.com',
  path: `/v1/projects/${PROJECT_REF}/database/query`,
  method: 'POST',
  headers: { 'Authorization': 'Bearer ' + ACCESS_TOKEN, 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(bodyStr) }
}, res => { let d=''; res.on('data',c=>d+=c); res.on('end',()=>console.log(res.statusCode, d.slice(0,200))); });
req.on('error', console.error);
req.write(bodyStr);
req.end();
```
Run: `node enable-realtime.js`

### Commit: `feat: Supabase Realtime — BTV catalog and intel live updates`

---

## ITEM 2 — Kill Static JS Files, Move Data to Supabase

Currently market data, competitors, suppliers, social feed are in static `.js` files.
Move them to Supabase so agents can update them and the dashboard reads live.

### Step A — Create tables via Management API

Write and run a Node.js script `migrate-to-supabase.js` that creates these tables:

```sql
CREATE TABLE IF NOT EXISTS market_stats (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  icon text,
  value text,
  label text,
  sub text,
  trend text,
  sort_order integer DEFAULT 0,
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS competitors (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  handle text,
  platform text,
  followers text,
  product_overlap integer DEFAULT 0,
  market_reach integer DEFAULT 0,
  threat_level text DEFAULT 'medium',
  strengths text[],
  weaknesses text[],
  price_range text,
  notes text,
  url text,
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS suppliers (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  platform text,
  products text[],
  price_per_piece text,
  moq integer DEFAULT 0,
  location text DEFAULT 'Philippines',
  rating numeric DEFAULT 4.5,
  url text,
  is_promo_active boolean DEFAULT false,
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS social_feed (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  account text NOT NULL,
  handle text,
  platform text,
  content text,
  hashtags text[],
  engagement text,
  post_date date,
  url text,
  category text DEFAULT 'competitor',
  insight text,
  is_hot boolean DEFAULT false,
  scraped_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS product_opportunities (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  product text NOT NULL,
  source text,
  demand_level text DEFAULT 'Medium',
  suggested_price_range text,
  supplier_found boolean DEFAULT false,
  notes text,
  updated_at timestamptz DEFAULT now()
);
```

### Step B — Seed tables from existing static files

Read `data/data.js` and `data/market.json` to extract current data.
Insert into the Supabase tables using the REST API (use the supabase client pattern from PerciCommandCenter/supabase-client.js — copy that client pattern into a local seed script).

Seed all existing:
- Market stats → `market_stats`
- Competitors → `competitors`  
- Suppliers → `suppliers`
- Product opportunities → `product_opportunities`
- Social feed posts from `data/feed.js` → `social_feed`

### Step C — Update app.js to read from Supabase instead of static files

In `app.js`, find the `boot()` function and update data loading:

1. Replace `marketData = window.MARKET_DATA` with a Supabase fetch:
```javascript
async function loadFromSupabase() {
  if (!window.SUPABASE_CONFIG) return false;
  
  const base = window.SUPABASE_CONFIG.url;
  const key = window.SUPABASE_CONFIG.key;
  const hdrs = { 'apikey': key, 'Authorization': 'Bearer ' + key };

  try {
    const [statsRes, compRes, suppRes, oppRes] = await Promise.all([
      fetch(base + '/rest/v1/market_stats?order=sort_order', { headers: hdrs }),
      fetch(base + '/rest/v1/competitors?order=market_reach.desc', { headers: hdrs }),
      fetch(base + '/rest/v1/suppliers?order=rating.desc', { headers: hdrs }),
      fetch(base + '/rest/v1/product_opportunities?order=demand_level', { headers: hdrs })
    ]);

    const [stats, comps, supps, opps] = await Promise.all([
      statsRes.json(), compRes.json(), suppRes.json(), oppRes.json()
    ]);

    // Merge into existing marketData/suppliersData structure so existing render functions work
    if (stats.length) marketData.stats = stats;
    if (comps.length) marketData.competitors = comps;
    if (supps.length) suppliersData.suppliers = supps.map(s => ({
      name: s.name, platform: s.platform, products: s.products || [],
      pricePerPiece: s.price_per_piece, moq: s.moq, location: s.location,
      rating: s.rating, url: s.url, isPromoActive: s.is_promo_active
    }));
    if (opps.length) window.PRODUCT_OPPORTUNITIES = opps.map(o => ({
      product: o.product, source: o.source, demandLevel: o.demand_level,
      suggestedPriceRange: o.suggested_price_range, supplierFound: o.supplier_found
    }));

    return true;
  } catch (err) {
    console.warn('[Supabase] Data load failed, using static fallback:', err.message);
    return false;
  }
}
```

2. In `boot()`, call `loadFromSupabase()` first, then render:
```javascript
async function boot() {
  setDates();
  
  // Try Supabase first, fall back to static data
  await loadFromSupabase();
  
  // Rest of existing boot() code...
  updateGradCountdown();
  renderSeasonalAlerts();
  // etc.
}
```

Make boot() async if it isn't already.

### Step D — Add Supabase config to index.html
Add before `</head>`:
```html
<script>
  window.SUPABASE_CONFIG = {
    url: 'https://fhfqjcvwcxizbioftvdw.supabase.co',
    key: 'REDACTED_SUPABASE_KEY'
  };
</script>
```

### Commit: `feat: data migrated to Supabase — market stats, competitors, suppliers, feed live`

---

## ITEM 5 — Competitor Price Tracker

Add a live competitor price tracking view that Ethel updates daily.

### Step A — Create table via Management API
```sql
CREATE TABLE IF NOT EXISTS competitor_prices (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  competitor text NOT NULL,
  product text NOT NULL,
  category text,
  price numeric,
  platform text DEFAULT 'shopee',
  url text,
  our_price numeric,
  margin_gap numeric GENERATED ALWAYS AS (our_price - price) STORED,
  recorded_date date DEFAULT CURRENT_DATE,
  scraped_at timestamptz DEFAULT now()
);
```

### Step B — Seed with initial BTV prices (reference, not competitor)
Insert BTV product prices as reference data from the btv_products table:
```sql
INSERT INTO competitor_prices (competitor, product, category, price, platform, url, our_price)
SELECT 'Beyond The Vines', title, category, price_min, 'website', product_url,
  CASE 
    WHEN category = 'bag' THEN price_min * 0.6
    WHEN category = 'tumbler' THEN price_min * 0.7
    ELSE price_min * 0.65
  END
FROM btv_products
WHERE price_min > 0
LIMIT 20;
```

### Step C — Add Price Tracker section to Supplier Intelligence page

In `index.html`, find `id="page-supplier-intel"` and add a new section after the suppliers cards grid:
```html
<!-- COMPETITOR PRICE TRACKER -->
<div class="section-card" style="margin-top:24px">
  <div class="card-header">
    <h2 class="card-title">📊 Competitor Price Tracker</h2>
    <span class="card-sub">Updated daily by Ethel 🕵️ — alerts when competitors undercut your price</span>
  </div>
  <div class="price-tracker-filters" style="margin-bottom:16px;display:flex;gap:10px;flex-wrap:wrap">
    <select id="price-filter-cat" class="filter-select" onchange="renderPriceTracker()">
      <option value="">All Categories</option>
      <option value="bag">Bags</option>
      <option value="tumbler">Tumblers</option>
      <option value="pouch">Pouches</option>
      <option value="cap">Caps</option>
    </select>
    <select id="price-filter-platform" class="filter-select" onchange="renderPriceTracker()">
      <option value="">All Platforms</option>
      <option value="shopee">Shopee</option>
      <option value="lazada">Lazada</option>
      <option value="website">Website</option>
    </select>
  </div>
  <div class="table-wrap">
    <table class="data-table" id="price-tracker-table">
      <thead>
        <tr>
          <th>Competitor</th>
          <th>Product</th>
          <th>Category</th>
          <th>Their Price</th>
          <th>Our Price</th>
          <th>Gap</th>
          <th>Platform</th>
          <th>Date</th>
        </tr>
      </thead>
      <tbody id="price-tracker-body">
        <tr><td colspan="8" style="text-align:center;color:#94A3B8;padding:24px">Loading prices...</td></tr>
      </tbody>
    </table>
  </div>
</div>
```

### Step D — Add renderPriceTracker() to app.js
```javascript
async function renderPriceTracker() {
  const tbody = document.getElementById('price-tracker-body');
  if (!tbody || !window.SUPABASE_CONFIG) return;

  const base = window.SUPABASE_CONFIG.url;
  const key = window.SUPABASE_CONFIG.key;
  const hdrs = { 'apikey': key, 'Authorization': 'Bearer ' + key };

  const cat = document.getElementById('price-filter-cat')?.value || '';
  const platform = document.getElementById('price-filter-platform')?.value || '';

  let query = 'order=recorded_date.desc,competitor.asc';
  if (cat) query += `&category=eq.${cat}`;
  if (platform) query += `&platform=eq.${platform}`;

  try {
    const res = await fetch(`${base}/rest/v1/competitor_prices?${query}`, { headers: hdrs });
    const prices = await res.json();

    if (!prices.length) {
      tbody.innerHTML = '<tr><td colspan="8" style="text-align:center;color:#94A3B8;padding:24px">No price data yet — Ethel runs daily at 7AM</td></tr>';
      return;
    }

    tbody.innerHTML = prices.map(p => {
      const gap = p.our_price && p.price ? (p.our_price - p.price).toFixed(2) : '—';
      const gapNum = parseFloat(gap);
      const gapClass = isNaN(gapNum) ? '' : (gapNum < 0 ? 'style="color:#EF4444;font-weight:700"' : gapNum < 10 ? 'style="color:#F59E0B"' : 'style="color:#10B981"');
      const gapStr = isNaN(gapNum) ? '—' : (gapNum >= 0 ? `+S$${gap}` : `S$${gap}`);
      return `<tr>
        <td><strong>${escHtml(p.competitor)}</strong></td>
        <td>${escHtml(p.product)}</td>
        <td><span class="badge">${p.category || '—'}</span></td>
        <td>S$${p.price?.toFixed(2) || '—'}</td>
        <td>${p.our_price ? 'S$' + p.our_price.toFixed(2) : '—'}</td>
        <td ${gapClass}>${gapStr}</td>
        <td>${p.platform || '—'}</td>
        <td style="color:#94A3B8;font-size:11px">${p.recorded_date || '—'}</td>
      </tr>`;
    }).join('');
  } catch (err) {
    tbody.innerHTML = `<tr><td colspan="8" style="color:#EF4444;padding:16px">Error: ${err.message}</td></tr>`;
  }
}
```

5. Call `renderPriceTracker()` when the supplier-intel tab is activated (find where `renderSupplierIntelligence()` is called and add `renderPriceTracker()` after it).

### Commit: `feat: competitor price tracker — live Supabase table, Ethel writes daily`

---

## FINAL STEPS

After all 3 items are complete, push via GitHub API (PowerShell):
```powershell
$PAT = "REDACTED_PAT"
$REPO = "heylencer-debug/ProjectPerciPH"
$hdrs = @{ "Authorization"="Bearer $PAT"; "Accept"="application/vnd.github+json"; "X-GitHub-Api-Version"="2022-11-28" }

foreach ($file in @("index.html","app.js","style.css")) {
  $bytes = [System.IO.File]::ReadAllBytes("C:\Users\Carl Rebadomia\.openclaw\workspace\dashboard\$file")
  $b64 = [Convert]::ToBase64String($bytes)
  $cur = Invoke-RestMethod -Uri "https://api.github.com/repos/$REPO/contents/$file" -Headers $hdrs -ErrorAction SilentlyContinue
  $body = @{ message="feat: Supabase Realtime, data migration, price tracker"; content=$b64; branch="main" }
  if ($cur.sha) { $body.sha = $cur.sha }
  $r = Invoke-RestMethod -Uri "https://api.github.com/repos/$REPO/contents/$file" -Method PUT -Headers $hdrs -Body ($body | ConvertTo-Json -Depth 3)
  Write-Host "Pushed: $file → $($r.commit.sha.Substring(0,7))"
}
```

Then notify:
```
openclaw system event --text "Done: ProjectPercyPH — Realtime live, data in Supabase, competitor price tracker built and pushed to GitHub Pages" --mode now
```
