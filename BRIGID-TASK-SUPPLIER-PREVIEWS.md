# Brigid Task — Supplier Product Previews UI

Workspace: C:\Users\Carl Rebadomia\.openclaw\workspace\dashboard\
Push tool: node push-file.js (run from dashboard/)

## SUPABASE CONFIG
URL: https://fhfqjcvwcxizbioftvdw.supabase.co
Key: REDACTED_SUPABASE_KEY

---

## GOAL
Redesign the Supplier Intelligence page to show actual product listing preview photos
from the `supplier_products` Supabase table (images served from Supabase Storage).

The page should feel like a sourcing catalog — visual product cards with images,
organized by category, filterable by platform and category.

---

## TASK 1: Redesign Supplier Intelligence page in index.html

The page already exists. REPLACE the current supplier cards section with TWO tabs:

### Tab 1: "PRODUCT CATALOG" (default active)
Shows individual product listings with preview photos — pulled from `supplier_products` table.
Layout: masonry-style or grid of product cards (similar to Shopee/Lazada listing style).

```html
<!-- Add inside the supplier intelligence page section -->
<div class="supplier-tabs">
  <button class="supplier-tab active" data-tab="products">Product Catalog</button>
  <button class="supplier-tab" data-tab="suppliers">Supplier Directory</button>
</div>

<!-- PRODUCT CATALOG TAB -->
<div id="supplier-tab-products" class="supplier-tab-content">

  <!-- Filter row -->
  <div class="filter-row" style="margin-bottom:20px;display:flex;gap:10px;flex-wrap:wrap">
    <select id="sp-category-filter" class="filter-select" onchange="loadSupplierProducts()">
      <option value="">All Categories</option>
      <option value="bag">Bags & Pouches</option>
      <option value="tumbler">Tumblers</option>
      <option value="cap">Caps & Hats</option>
      <option value="wallet">Wallets</option>
      <option value="accessory">Accessories</option>
      <option value="patch">Patches</option>
    </select>
    <select id="sp-platform-filter" class="filter-select" onchange="loadSupplierProducts()">
      <option value="">All Platforms</option>
      <option value="alibaba">Alibaba</option>
      <option value="shopee">Shopee</option>
      <option value="temu">Temu</option>
      <option value="shein">Shein</option>
    </select>
    <select id="sp-customization-filter" class="filter-select" onchange="loadSupplierProducts()">
      <option value="">All Customizations</option>
      <option value="embroidery">Embroidery</option>
      <option value="engraving">Engraving</option>
      <option value="patch">Patch</option>
      <option value="sublimation">Sublimation</option>
    </select>
    <button class="btn-primary" onclick="loadSupplierProducts()">Refresh</button>
  </div>

  <!-- Stats row -->
  <div style="display:flex;gap:24px;margin-bottom:20px">
    <span style="font-size:13px;color:#6B7280">Showing <strong id="sp-count">—</strong> products</span>
  </div>

  <!-- Product grid -->
  <div id="supplier-products-grid" class="supplier-products-grid">
    <p style="color:#6B7280;text-align:center;padding:48px">Loading products...</p>
  </div>

  <div style="text-align:center;margin-top:24px">
    <button class="btn-secondary" id="sp-load-more" onclick="loadMoreSupplierProducts()" style="display:none">Load More</button>
  </div>
</div>

<!-- SUPPLIER DIRECTORY TAB -->
<div id="supplier-tab-suppliers" class="supplier-tab-content" style="display:none">
  <!-- existing supplier cards content stays here — move it inside this div -->
</div>
```

---

## TASK 2: Add CSS to style.css

.supplier-tabs {
  display: flex;
  gap: 0;
  margin-bottom: 24px;
  border-bottom: 1.5px solid #E8E8EC;
}

.supplier-tab {
  padding: 10px 20px;
  font-size: 13px;
  font-weight: 600;
  color: #6B7280;
  background: transparent;
  border: none;
  border-bottom: 2.5px solid transparent;
  margin-bottom: -1.5px;
  cursor: pointer;
  transition: all 0.15s;
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

.supplier-tab:hover { color: #0A0A0A; }

.supplier-tab.active {
  color: #FF6B6B;
  border-bottom-color: #FF6B6B;
}

.supplier-products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 14px;
}

.supplier-product-card {
  background: #FFFFFF;
  border: 1px solid #E8E8EC;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  transition: border-color 0.2s, transform 0.15s;
}

.supplier-product-card:hover {
  border-color: #FF6B6B;
  transform: translateY(-2px);
}

.sp-image-wrap {
  width: 100%;
  aspect-ratio: 1 / 1;
  overflow: hidden;
  background: #F8F8FA;
}

.sp-image-wrap img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 0.3s;
}

.supplier-product-card:hover .sp-image-wrap img {
  transform: scale(1.04);
}

.sp-image-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 36px;
  color: #C8D0D8;
}

.sp-info {
  padding: 10px 12px 12px;
}

.sp-platform-badge {
  font-size: 9px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  padding: 2px 6px;
  border-radius: 3px;
  border: 1.5px solid;
  display: inline-block;
  margin-bottom: 6px;
}

.sp-platform-alibaba { border-color: #FF6A00; color: #FF6A00; }
.sp-platform-shopee { border-color: #EE4D2D; color: #EE4D2D; }
.sp-platform-temu { border-color: #FF6B6B; color: #FF6B6B; }
.sp-platform-shein { border-color: #C084FC; color: #C084FC; }

.sp-name {
  font-size: 13px;
  font-weight: 600;
  color: #0A0A0A;
  line-height: 1.4;
  margin-bottom: 4px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.sp-price {
  font-size: 14px;
  font-weight: 700;
  color: #FF6B6B;
  margin-bottom: 2px;
}

.sp-moq {
  font-size: 11px;
  color: #6B7280;
  margin-bottom: 4px;
}

.sp-customization {
  font-size: 10px;
  font-weight: 600;
  color: #00C97A;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.sp-view-btn {
  display: block;
  text-align: center;
  margin-top: 8px;
  padding: 6px;
  font-size: 11px;
  font-weight: 600;
  color: #6B7280;
  border: 1px solid #E8E8EC;
  border-radius: 4px;
  text-decoration: none;
  transition: all 0.15s;
}

.sp-view-btn:hover {
  border-color: #FF6B6B;
  color: #FF6B6B;
}

@media (max-width: 768px) {
  .supplier-products-grid { grid-template-columns: repeat(2, 1fr); gap: 10px; }
}

@media (max-width: 400px) {
  .supplier-products-grid { grid-template-columns: repeat(2, 1fr); gap: 8px; }
  .sp-info { padding: 8px; }
}

---

## TASK 3: Add JS functions to app.js

Add these functions (clean vanilla JS, no backtick template literals — use string concatenation):

var SP_OFFSET = 0;
var SP_LIMIT = 32;

async function loadSupplierProducts() {
  SP_OFFSET = 0;
  var grid = document.getElementById('supplier-products-grid');
  if (grid) grid.innerHTML = '<p style="color:#6B7280;text-align:center;padding:48px">Loading...</p>';
  await fetchSupplierProducts(true);
}

async function fetchSupplierProducts(reset) {
  var SB_URL = 'https://fhfqjcvwcxizbioftvdw.supabase.co';
  var SB_KEY = 'REDACTED_SUPABASE_KEY';
  var category = document.getElementById('sp-category-filter') ? document.getElementById('sp-category-filter').value : '';
  var platform = document.getElementById('sp-platform-filter') ? document.getElementById('sp-platform-filter').value : '';
  var customization = document.getElementById('sp-customization-filter') ? document.getElementById('sp-customization-filter').value : '';
  var url = SB_URL + '/rest/v1/supplier_products?order=scraped_at.desc&limit=' + SP_LIMIT + '&offset=' + SP_OFFSET;
  if (category) url += '&category=eq.' + encodeURIComponent(category);
  if (platform) url += '&platform=eq.' + encodeURIComponent(platform);
  if (customization) url += '&customization=eq.' + encodeURIComponent(customization);
  try {
    var res = await fetch(url, { headers: { 'apikey': SB_KEY, 'Authorization': 'Bearer ' + SB_KEY } });
    var products = await res.json();
    var grid = document.getElementById('supplier-products-grid');
    var countEl = document.getElementById('sp-count');
    if (!Array.isArray(products)) {
      if (grid) grid.innerHTML = '<p style="color:#6B7280;text-align:center;padding:48px">No products yet. Ethel is scraping...</p>';
      return;
    }
    if (products.length === 0 && reset) {
      if (grid) grid.innerHTML = '<p style="color:#6B7280;text-align:center;padding:48px">No products yet. Check back after Ethel runs at 8AM.</p>';
      if (countEl) countEl.textContent = '0';
      return;
    }
    var html = products.map(function(p) { return renderSupplierProductCard(p); }).join('');
    if (reset) { if (grid) grid.innerHTML = html; } else { if (grid) grid.innerHTML += html; }
    if (countEl) countEl.textContent = (SP_OFFSET + products.length).toString();
    var btn = document.getElementById('sp-load-more');
    if (btn) btn.style.display = products.length < SP_LIMIT ? 'none' : 'inline-block';
    SP_OFFSET += products.length;
  } catch(e) { console.error('Supplier products error:', e); }
}

function renderSupplierProductCard(p) {
  var platformClass = 'sp-platform-' + (p.platform || 'alibaba');
  var platformLabel = (p.platform || '').toUpperCase();
  var imageHtml = p.image_url
    ? '<img src="' + p.image_url + '" alt="' + (p.product_name || '') + '" loading="lazy" onerror="this.parentNode.innerHTML=\'<div class=sp-image-placeholder>🛍️</div>\'">'
    : '<div class="sp-image-placeholder">🛍️</div>';
  var viewBtn = p.product_url
    ? '<a href="' + p.product_url + '" target="_blank" class="sp-view-btn">View Listing →</a>'
    : '';
  return '<div class="supplier-product-card">'
    + '<div class="sp-image-wrap">' + imageHtml + '</div>'
    + '<div class="sp-info">'
    + '<span class="sp-platform-badge ' + platformClass + '">' + platformLabel + '</span>'
    + '<div class="sp-name">' + (p.product_name || '—') + '</div>'
    + '<div class="sp-price">' + (p.price || '—') + '</div>'
    + (p.moq ? '<div class="sp-moq">MOQ: ' + p.moq + '</div>' : '')
    + (p.customization ? '<div class="sp-customization">✓ ' + p.customization + '</div>' : '')
    + viewBtn
    + '</div>'
    + '</div>';
}

async function loadMoreSupplierProducts() {
  await fetchSupplierProducts(false);
}

function setupSupplierTabs() {
  document.querySelectorAll('.supplier-tab').forEach(function(tab) {
    tab.addEventListener('click', function() {
      document.querySelectorAll('.supplier-tab').forEach(function(t) { t.classList.remove('active'); });
      document.querySelectorAll('.supplier-tab-content').forEach(function(c) { c.style.display = 'none'; });
      tab.classList.add('active');
      var target = document.getElementById('supplier-tab-' + tab.dataset.tab);
      if (target) target.style.display = 'block';
      if (tab.dataset.tab === 'products') loadSupplierProducts();
    });
  });
}

Call loadSupplierProducts() when the supplier intelligence page activates.
Call setupSupplierTabs() inside init() or boot().

Also add Realtime subscription for supplier_products INSERT inside initRealtime() — prepend new card to grid.

---

## IMPORTANT: Move existing supplier directory content
The existing supplier cards grid (id="suppliers-cards-grid") and its filter pills must be moved
inside the new <div id="supplier-tab-suppliers"> div. Do not delete them.

---

## PUSH TO GITHUB
After all edits:
  node push-file.js "index.html" "index.html" "feat: supplier product catalog with image previews"
  node push-file.js "style.css" "style.css" "feat: supplier product card styles"
  node push-file.js "app.js" "app.js" "feat: supplier products JS - Supabase Storage images"

## RULES
- Read all 3 files fully before editing
- Keep all existing functionality
- Product images from Supabase Storage URLs — lazy loaded
- Graceful fallback (🛍️ emoji) if image fails
- Mobile: 2-col grid minimum

When completely done, run:
openclaw system event --text "Brigid done: supplier product catalog with image previews live on ProjectPercyPH"
