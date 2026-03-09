# Brigid Task — ProjectPercyPH Dashboard v2 (Items 1, 2, 5)

You are Brigid 🔥 — Project Percy PH's lead engineer.
Working directory: `C:\Users\Carl Rebadomia\.openclaw\workspace\dashboard`

Complete ALL 3 items. Do not stop until done. Commit after each item.

---

## GITHUB PUSH — USE NODE.JS ONLY
**IMPORTANT**: Do NOT use `git push` (hangs) or PowerShell `-Uri` flags (broken).
Use this Node.js script pattern to push files to GitHub:

```javascript
// push-file.js — reusable, run per file
const https = require('https');
const fs = require('fs');

const PAT = 'REDACTED_PAT';
const REPO = 'heylencer-debug/ProjectPerciPH';
const BRANCH = 'main';

async function pushFile(filePath, localPath, commitMsg) {
  const content = fs.readFileSync(localPath).toString('base64');
  
  // Get current SHA
  const sha = await new Promise((resolve) => {
    const req = https.request({
      hostname: 'api.github.com',
      path: `/repos/${REPO}/contents/${filePath}?ref=${BRANCH}`,
      method: 'GET',
      headers: { 'Authorization': `Bearer ${PAT}`, 'User-Agent': 'Brigid/1.0', 'Accept': 'application/vnd.github+json' }
    }, res => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => {
        try { resolve(JSON.parse(d).sha); } catch { resolve(null); }
      });
    });
    req.on('error', () => resolve(null));
    req.end();
  });

  const body = JSON.stringify({ message: commitMsg, content, branch: BRANCH, ...(sha ? { sha } : {}) });
  
  return new Promise((resolve, reject) => {
    const req = https.request({
      hostname: 'api.github.com',
      path: `/repos/${REPO}/contents/${filePath}`,
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${PAT}`,
        'User-Agent': 'Brigid/1.0',
        'Accept': 'application/vnd.github+json',
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(body)
      }
    }, res => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => {
        const r = JSON.parse(d);
        if (r.commit) { console.log(`✅ ${filePath} → ${r.commit.sha.slice(0,7)}`); resolve(r); }
        else { console.error(`❌ ${filePath}:`, d.slice(0,200)); reject(new Error(d)); }
      });
    });
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

module.exports = { pushFile };

// Run directly: node push-file.js
if (require.main === module) {
  const [,,filePath, localPath, msg] = process.argv;
  pushFile(filePath, localPath, msg || 'chore: update').catch(console.error);
}
```

Save this as `push-file.js` in the dashboard folder. Use it like:
```
node push-file.js index.html C:\Users\Carl Rebadomia\.openclaw\workspace\dashboard\index.html "feat: description"
```

---

## Supabase Setup
- URL: https://fhfqjcvwcxizbioftvdw.supabase.co
- Key: REDACTED_SUPABASE_KEY
- Access Token: sbp_930d9e5fe75da4d2415263ec1d37aaaa8b5aaab7
- Project ref: fhfqjcvwcxizbioftvdw

To create tables via Management API:
```javascript
const https = require('https');
function runSQL(sql) {
  const body = JSON.stringify({ query: sql });
  return new Promise((resolve, reject) => {
    const req = https.request({
      hostname: 'api.supabase.com',
      path: '/v1/projects/fhfqjcvwcxizbioftvdw/database/query',
      method: 'POST',
      headers: {
        'Authorization': 'Bearer sbp_930d9e5fe75da4d2415263ec1d37aaaa8b5aaab7',
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(body)
      }
    }, res => {
      let d = ''; res.on('data', c => d += c);
      res.on('end', () => { console.log(res.statusCode, d.slice(0,200)); resolve(d); });
    });
    req.on('error', reject); req.write(body); req.end();
  });
}
```

To read/write Supabase REST:
```javascript
const https = require('https');
const BASE = 'https://fhfqjcvwcxizbioftvdw.supabase.co';
const KEY = 'REDACTED_SUPABASE_KEY';

function sbRequest(method, table, body, query='') {
  return new Promise((resolve, reject) => {
    const bodyStr = body ? JSON.stringify(Array.isArray(body) ? body : [body]) : null;
    const req = https.request({
      hostname: 'fhfqjcvwcxizbioftvdw.supabase.co',
      path: `/rest/v1/${table}${query ? '?'+query : ''}`,
      method,
      headers: {
        'apikey': KEY, 'Authorization': `Bearer ${KEY}`,
        'Content-Type': 'application/json', 'Prefer': 'return=representation',
        ...(bodyStr ? {'Content-Length': Buffer.byteLength(bodyStr)} : {})
      }
    }, res => {
      let d = ''; res.on('data', c => d += c);
      res.on('end', () => { try { resolve(JSON.parse(d)); } catch { resolve(d); } });
    });
    req.on('error', reject);
    if (bodyStr) req.write(bodyStr);
    req.end();
  });
}
```

---

## ITEM 1 — Supabase Realtime

### index.html changes:
1. Add to `<head>` before `</head>`:
```html
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.min.js"></script>
<script>
  window.SUPABASE_CONFIG = {
    url: 'https://fhfqjcvwcxizbioftvdw.supabase.co',
    key: 'REDACTED_SUPABASE_KEY'
  };
</script>
```

### app.js changes:
2. Add `initRealtime()` function (before the closing of the file):
```javascript
function initRealtime() {
  if (typeof window === 'undefined' || !window.supabase || !window.SUPABASE_CONFIG) return;
  const client = window.supabase.createClient(window.SUPABASE_CONFIG.url, window.SUPABASE_CONFIG.key);

  // BTV products updated → refresh BTV page if active
  client.channel('btv').on('postgres_changes',
    { event: '*', schema: 'public', table: 'btv_products' }, () => {
      const p = document.getElementById('page-btv');
      if (p && p.classList.contains('active')) renderBtvCatalog();
    }).subscribe();

  // Intel feed updated → flash nav badge + refresh if active
  client.channel('intel').on('postgres_changes',
    { event: 'INSERT', schema: 'public', table: 'intel_feed' }, () => {
      const badge = document.querySelector('[data-page="supplier-intel"] .nav-badge');
      if (badge) { badge.textContent = 'NEW'; badge.style.background = '#E94560';
        setTimeout(() => { badge.textContent = 'Ethel'; badge.style.background = '#8B5CF6'; }, 5000); }
      const p = document.getElementById('page-supplier-intel');
      if (p && p.classList.contains('active')) renderSupplierIntelligence();
    }).subscribe();

  // Competitors/suppliers updated → refresh market page if active
  client.channel('market').on('postgres_changes',
    { event: '*', schema: 'public', table: 'competitors' }, () => {
      const p = document.getElementById('page-market');
      if (p && p.classList.contains('active')) renderCompetitors();
    }).subscribe();

  console.log('[Realtime] Dashboard subscribed ✅');
}
```

3. Call `initRealtime()` at the end of the `boot()` function (or `hideLoader()` call).

4. Enable Realtime on tables — create and run `enable-realtime.js`:
```javascript
const https = require('https');
const body = JSON.stringify({ query: `
  ALTER PUBLICATION supabase_realtime ADD TABLE btv_products;
  ALTER PUBLICATION supabase_realtime ADD TABLE intel_feed;
  ALTER PUBLICATION supabase_realtime ADD TABLE competitors;
  ALTER PUBLICATION supabase_realtime ADD TABLE suppliers;
  ALTER PUBLICATION supabase_realtime ADD TABLE social_feed;
  ALTER PUBLICATION supabase_realtime ADD TABLE market_stats;
  ALTER PUBLICATION supabase_realtime ADD TABLE product_opportunities;
  ALTER PUBLICATION supabase_realtime ADD TABLE competitor_prices;
` });
const req = https.request({
  hostname: 'api.supabase.com',
  path: '/v1/projects/fhfqjcvwcxizbioftvdw/database/query',
  method: 'POST',
  headers: { 'Authorization': 'Bearer sbp_930d9e5fe75da4d2415263ec1d37aaaa8b5aaab7', 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body) }
}, res => { let d=''; res.on('data',c=>d+=c); res.on('end',()=>console.log(res.statusCode, d)); });
req.on('error', console.error); req.write(body); req.end();
```
Run: `node enable-realtime.js`

### Push after Item 1:
```
node push-file.js index.html C:\Users\Carl Rebadomia\.openclaw\workspace\dashboard\index.html "feat: Supabase Realtime — live BTV, intel, market updates"
node push-file.js app.js C:\Users\Carl Rebadomia\.openclaw\workspace\dashboard\app.js "feat: Supabase Realtime — live BTV, intel, market updates"
```

---

## ITEM 2 — Kill Static JS Files, Move Data to Supabase

### Step A — Create tables
Write `create-market-tables.js` and run it:
```javascript
const https = require('https');
const sql = `
CREATE TABLE IF NOT EXISTS market_stats (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  icon text, value text, label text, sub text,
  trend text DEFAULT 'stable', sort_order integer DEFAULT 0,
  updated_at timestamptz DEFAULT now()
);
CREATE TABLE IF NOT EXISTS competitors (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL, handle text, platform text,
  followers text, product_overlap integer DEFAULT 0,
  market_reach integer DEFAULT 0, threat_level text DEFAULT 'medium',
  strengths text[], weaknesses text[], price_range text, url text,
  updated_at timestamptz DEFAULT now()
);
CREATE TABLE IF NOT EXISTS suppliers (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL, platform text, products text[],
  price_per_piece text, moq integer DEFAULT 0,
  location text DEFAULT 'Philippines', rating numeric DEFAULT 4.5,
  url text, is_promo_active boolean DEFAULT false,
  updated_at timestamptz DEFAULT now()
);
CREATE TABLE IF NOT EXISTS social_feed (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  account text NOT NULL, handle text, platform text,
  content text, hashtags text[], engagement text,
  post_date date, url text, category text DEFAULT 'competitor',
  insight text, is_hot boolean DEFAULT false,
  scraped_at timestamptz DEFAULT now()
);
CREATE TABLE IF NOT EXISTS product_opportunities (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  product text NOT NULL, source text,
  demand_level text DEFAULT 'Medium', suggested_price_range text,
  supplier_found boolean DEFAULT false, notes text,
  updated_at timestamptz DEFAULT now()
);
CREATE TABLE IF NOT EXISTS competitor_prices (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  competitor text NOT NULL, product text NOT NULL,
  category text, price numeric, platform text DEFAULT 'shopee',
  url text, our_price numeric, recorded_date date DEFAULT CURRENT_DATE,
  scraped_at timestamptz DEFAULT now()
);
`;
// Use runSQL pattern from above — run the SQL via Management API
```

### Step B — Seed from existing static files
Read `data/data.js` (contains window.MARKET_DATA, window.SUPPLIERS_DATA) and `data/feed.js`.
Extract the arrays and POST to Supabase tables using sbRequest().

Key data structures to extract:
- `MARKET_DATA.stats` → `market_stats`
- `MARKET_DATA.competitors` → `competitors`
- `SUPPLIERS_DATA.suppliers` → `suppliers`
- `MARKET_DATA.productOpportunities` → `product_opportunities`
- `feedPosts` array from `data/feed.js` → `social_feed`

### Step C — Update app.js boot() to load from Supabase
Add `loadFromSupabase()` async function that fetches market_stats, competitors, suppliers, product_opportunities from Supabase and merges into existing marketData/suppliersData globals (so existing render functions work unchanged).

Make `boot()` async and call `await loadFromSupabase()` first.

Add `window.SUPABASE_CONFIG` check — if Supabase unavailable, fall back to static data silently.

Also update the social feed lazy loader to fetch from `social_feed` Supabase table instead of the static `data/feed.js`.

### Push after Item 2:
```
node push-file.js app.js C:\Users\Carl Rebadomia\.openclaw\workspace\dashboard\app.js "feat: data migrated to Supabase — market, competitors, suppliers, feed"
node push-file.js index.html C:\Users\Carl Rebadomia\.openclaw\workspace\dashboard\index.html "feat: data migrated to Supabase"
```

---

## ITEM 5 — Competitor Price Tracker

### Step A — Seed competitor_prices with BTV reference data
Query btv_products from Supabase, insert top 20 priced items into competitor_prices as reference:
```javascript
// Query btv_products
const products = await sbRequest('GET', 'btv_products', null, 'order=price_min.desc&limit=20&price_min=gt.0');
// Insert into competitor_prices
for (const p of products) {
  await sbRequest('POST', 'competitor_prices', {
    competitor: 'Beyond The Vines',
    product: p.title,
    category: p.category,
    price: p.price_min,
    platform: 'website',
    url: p.product_url,
    our_price: Math.round(p.price_min * 0.65 * 100) / 100
  });
}
```

### Step B — Add Price Tracker section to Supplier Intelligence page
In `index.html`, find `id="page-supplier-intel"`. After the suppliers cards grid div, add:
```html
<div class="section-card" style="margin-top:24px">
  <div class="card-header">
    <h2 class="card-title">📊 Competitor Price Tracker</h2>
    <span class="card-sub">Ethel updates daily · Red = they're cheaper · Green = you have room</span>
  </div>
  <div style="display:flex;gap:10px;margin-bottom:16px;flex-wrap:wrap">
    <select id="price-cat-filter" class="filter-select" onchange="renderPriceTracker()">
      <option value="">All Categories</option>
      <option value="bag">Bags</option>
      <option value="tumbler">Tumblers</option>
      <option value="mirror">Mirrors</option>
      <option value="cap">Caps</option>
    </select>
    <select id="price-platform-filter" class="filter-select" onchange="renderPriceTracker()">
      <option value="">All Platforms</option>
      <option value="shopee">Shopee</option>
      <option value="lazada">Lazada</option>
      <option value="website">Website</option>
    </select>
  </div>
  <div class="table-wrap">
    <table class="data-table">
      <thead><tr><th>Competitor</th><th>Product</th><th>Category</th><th>Their Price</th><th>Our Price</th><th>Gap</th><th>Platform</th></tr></thead>
      <tbody id="price-tracker-body"><tr><td colspan="7" style="text-align:center;padding:24px;color:#94A3B8">Loading...</td></tr></tbody>
    </table>
  </div>
</div>
```

### Step C — Add renderPriceTracker() to app.js
```javascript
async function renderPriceTracker() {
  const tbody = document.getElementById('price-tracker-body');
  if (!tbody || !window.SUPABASE_CONFIG) return;
  const { url, key } = window.SUPABASE_CONFIG;
  const hdrs = { 'apikey': key, 'Authorization': 'Bearer ' + key };
  const cat = document.getElementById('price-cat-filter')?.value || '';
  const platform = document.getElementById('price-platform-filter')?.value || '';
  let q = 'order=competitor.asc,price.asc&limit=100';
  if (cat) q += `&category=eq.${cat}`;
  if (platform) q += `&platform=eq.${platform}`;
  try {
    const res = await fetch(`${url}/rest/v1/competitor_prices?${q}`, { headers: hdrs });
    const rows = await res.json();
    if (!rows.length) {
      tbody.innerHTML = '<tr><td colspan="7" style="text-align:center;padding:24px;color:#94A3B8">No price data yet — Ethel runs daily at 7AM PH</td></tr>';
      return;
    }
    tbody.innerHTML = rows.map(r => {
      const gap = r.our_price && r.price ? (r.our_price - r.price) : null;
      const gapStr = gap === null ? '—' : (gap >= 0 ? `<span style="color:#10B981">+S$${gap.toFixed(2)}</span>` : `<span style="color:#EF4444">-S$${Math.abs(gap).toFixed(2)}</span>`);
      return `<tr>
        <td><strong>${r.competitor}</strong></td>
        <td style="max-width:200px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis" title="${r.product}">${r.product}</td>
        <td><span class="badge">${r.category || '—'}</span></td>
        <td>S$${r.price?.toFixed(2) || '—'}</td>
        <td>${r.our_price ? 'S$' + r.our_price.toFixed(2) : '—'}</td>
        <td>${gapStr}</td>
        <td style="color:#64748B;font-size:12px">${r.platform || '—'}</td>
      </tr>`;
    }).join('');
  } catch(err) {
    tbody.innerHTML = `<tr><td colspan="7" style="color:#EF4444;padding:16px">Error: ${err.message}</td></tr>`;
  }
}
```

4. Call `renderPriceTracker()` when supplier-intel tab activates — find where `renderSupplierIntelligence()` is called in the lazy tab loader and add `renderPriceTracker()` right after it.

### Push after Item 5:
```
node push-file.js index.html C:\Users\Carl Rebadomia\.openclaw\workspace\dashboard\index.html "feat: competitor price tracker live"
node push-file.js app.js C:\Users\Carl Rebadomia\.openclaw\workspace\dashboard\app.js "feat: competitor price tracker live"
node push-file.js style.css C:\Users\Carl Rebadomia\.openclaw\workspace\dashboard\style.css "feat: competitor price tracker styles"
```

---

## FINAL — After all 3 items done

Notify completion:
```
openclaw system event --text "Done: ProjectPercyPH Dashboard — Realtime live, all data in Supabase, competitor price tracker built and pushed to GitHub Pages" --mode now
```
