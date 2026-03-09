# Brigid Task — Fix Supabase Key + Product-Specific Supplier Listings

Workspace: C:\Users\Carl Rebadomia\.openclaw\workspace\dashboard\
Push tool: node push-file.js (run from dashboard/)

---

## CRITICAL FIX: Wrong Supabase key in dashboard

The dashboard is using the SERVICE ROLE SECRET key — browsers block this.
Replace it everywhere with the ANON public key.

WRONG key (find and replace ALL occurrences):
  REDACTED_SUPABASE_KEY

CORRECT anon key (use this instead):
  eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZoZnFqY3Z3Y3hpemJpb2Z0dmR3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIzNTcxMzgsImV4cCI6MjA4NzkzMzEzOH0.g8K40DjhvxE7u4JdHICqKc1dMxS4eZdMhfA11M8ZMBc

Also check for:
  REDACTED_SUPABASE_KEY (split key) — replace with anon key above
  Any hardcoded SB_KEY or SB_HDRS or sbFetch that uses the secret key

Search app.js and index.html for ALL occurrences of 'sb_secret' and replace with the anon key.
Also check data/sb.js if it exists.

Supabase URL stays the same: https://fhfqjcvwcxizbioftvdw.supabase.co

---

## NEW FEATURE: Product-Specific Supplier Listings

Carlo wants to see: "I'm looking at a Pocket Puffy Bag — show me the exact listings on Alibaba, Shopee, Temu, Shein where I can source this specific product."

### Add a new section to the Supplier Intelligence page: "SOURCE BY PRODUCT"

This shows a grid of REFERENCE PRODUCTS (BTV/competitor products we want to source).
Each card = one product type. Clicking it shows supplier listings for that exact product.

#### Reference Products to show (hardcode these — they're our target products):
1. Pocket Puffy Bag
2. Dumpling Bag / Cloud Bag
3. Colourblock Pouch
4. Micro Dumpling Bag
5. Glazed Poofy Bag
6. Leather Flat Pouch
7. Canvas Tote Bag
8. Crossbody Mini Bag
9. Bamboo Tumbler
10. Stainless Tumbler
11. Glass Cup with Straw
12. Classic Twill Cap
13. Vintage Distressed Cap
14. Bucket Hat
15. Compact Pocket Mirror
16. Leather Keychain
17. Zip Wallet
18. Patch Iron-On Set

#### HTML structure — add as a new tab "Source by Product" in supplier tabs:

```html
<button class="supplier-tab" data-tab="source-by-product">Source by Product</button>
```

```html
<div id="supplier-tab-source-by-product" class="supplier-tab-content" style="display:none">

  <p style="font-size:13px;color:#6B7280;margin-bottom:20px">
    Click a product to find supplier listings across Alibaba, Shopee, Temu and Shein.
  </p>

  <!-- Reference product grid -->
  <div id="reference-products-grid" class="reference-products-grid">
    <!-- Populated by JS -->
  </div>

  <!-- Supplier listings panel (shown after clicking a product) -->
  <div id="source-listings-panel" style="display:none;margin-top:28px">
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px">
      <h3 id="source-panel-title" style="font-size:18px;font-weight:800;color:#0A0A0A"></h3>
      <button onclick="document.getElementById('source-listings-panel').style.display='none'" class="btn-secondary" style="padding:6px 14px;font-size:12px">Close</button>
    </div>
    <div id="source-listings-grid" class="supplier-products-grid">
      <p style="color:#6B7280;text-align:center;padding:32px">Loading listings...</p>
    </div>
  </div>

</div>
```

#### JS functions to add to app.js:

The reference products list:
```js
var REFERENCE_PRODUCTS = [
  { name: 'Pocket Puffy Bag', emoji: '👜', category: 'bag', keywords: ['puffy bag', 'poofy bag', 'bubble pouch', 'puffy pouch'] },
  { name: 'Dumpling Bag', emoji: '🥟', category: 'bag', keywords: ['dumpling bag', 'cloud bag', 'half moon bag'] },
  { name: 'Colourblock Pouch', emoji: '🎨', category: 'bag', keywords: ['colourblock pouch', 'color block pouch', 'nylon pouch wholesale'] },
  { name: 'Micro Dumpling Bag', emoji: '🛍️', category: 'bag', keywords: ['micro bag', 'mini dumpling bag', 'mini cloud bag'] },
  { name: 'Glazed Poofy Bag', emoji: '✨', category: 'bag', keywords: ['glazed bag', 'shiny poofy bag', 'glossy pouch bag'] },
  { name: 'Leather Flat Pouch', emoji: '🗂️', category: 'bag', keywords: ['leather flat pouch', 'leather clutch blank', 'flat leather bag'] },
  { name: 'Canvas Tote Bag', emoji: '🛒', category: 'bag', keywords: ['blank canvas tote', 'canvas tote wholesale', 'cotton tote bag blank'] },
  { name: 'Crossbody Mini Bag', emoji: '👝', category: 'bag', keywords: ['mini crossbody bag', 'crossbody bag blank', 'small shoulder bag wholesale'] },
  { name: 'Bamboo Tumbler', emoji: '🎋', category: 'tumbler', keywords: ['bamboo tumbler', 'bamboo cup wholesale', 'eco tumbler blank'] },
  { name: 'Stainless Tumbler', emoji: '🥤', category: 'tumbler', keywords: ['blank stainless tumbler', 'engravable tumbler', 'steel cup wholesale'] },
  { name: 'Glass Cup with Straw', emoji: '🧃', category: 'tumbler', keywords: ['glass cup straw wholesale', 'glass tumbler blank', 'iridescent glass cup'] },
  { name: 'Classic Twill Cap', emoji: '🧢', category: 'cap', keywords: ['blank twill cap', 'embroidery baseball cap blank', '6 panel cap wholesale'] },
  { name: 'Vintage Distressed Cap', emoji: '🎩', category: 'cap', keywords: ['vintage washed cap blank', 'distressed cap wholesale', 'dad hat blank'] },
  { name: 'Bucket Hat', emoji: '🪣', category: 'cap', keywords: ['blank bucket hat wholesale', 'bucket hat blank embroidery', 'plain bucket hat'] },
  { name: 'Compact Pocket Mirror', emoji: '🪞', category: 'accessory', keywords: ['blank compact mirror', 'pocket mirror wholesale', 'engravable mirror'] },
  { name: 'Leather Keychain', emoji: '🔑', category: 'accessory', keywords: ['blank leather keychain', 'engravable key fob', 'leather keyring wholesale'] },
  { name: 'Zip Wallet', emoji: '👛', category: 'wallet', keywords: ['blank zip wallet wholesale', 'blank leather wallet', 'zip pouch wallet blank'] },
  { name: 'Patch Iron-On Set', emoji: '🎯', category: 'patch', keywords: ['custom iron on patch wholesale', 'embroidery patch blank', 'sew on patch OEM'] }
];
```

Function to render reference product cards:
```js
function renderReferenceProducts() {
  var grid = document.getElementById('reference-products-grid');
  if (!grid) return;
  grid.innerHTML = REFERENCE_PRODUCTS.map(function(p) {
    return '<div class="reference-product-card" onclick="loadSourceListings(' + JSON.stringify(p).replace(/"/g, '&quot;') + ')">'
      + '<div class="ref-emoji">' + p.emoji + '</div>'
      + '<div class="ref-name">' + p.name + '</div>'
      + '<div class="ref-category">' + p.category.toUpperCase() + '</div>'
      + '</div>';
  }).join('');
}
```

Function to load supplier listings for a specific product:
```js
async function loadSourceListings(product) {
  var panel = document.getElementById('source-listings-panel');
  var title = document.getElementById('source-panel-title');
  var grid = document.getElementById('source-listings-grid');
  if (!panel || !grid) return;
  title.textContent = product.emoji + ' ' + product.name + ' — Supplier Listings';
  panel.style.display = 'block';
  grid.innerHTML = '<p style="color:#6B7280;text-align:center;padding:32px">Searching Supabase...</p>';
  panel.scrollIntoView({ behavior: 'smooth', block: 'start' });

  var SB_URL = 'https://fhfqjcvwcxizbioftvdw.supabase.co';
  var SB_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZoZnFqY3Z3Y3hpemJpb2Z0dmR3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIzNTcxMzgsImV4cCI6MjA4NzkzMzEzOH0.g8K40DjhvxE7u4JdHICqKc1dMxS4eZdMhfA11M8ZMBc';

  // Search supplier_products by category + keyword match
  try {
    var url = SB_URL + '/rest/v1/supplier_products?category=eq.' + encodeURIComponent(product.category) + '&order=scraped_at.desc&limit=32';
    var res = await fetch(url, { headers: { 'apikey': SB_KEY, 'Authorization': 'Bearer ' + SB_KEY } });
    var all = await res.json();
    if (!Array.isArray(all) || all.length === 0) {
      grid.innerHTML = '<p style="color:#6B7280;text-align:center;padding:32px">No listings yet for this product. Ethel will scrape more at 8AM.</p>';
      return;
    }
    // Filter by keywords
    var keywords = product.keywords.map(function(k) { return k.toLowerCase(); });
    var filtered = all.filter(function(p) {
      var name = (p.product_name || '').toLowerCase();
      return keywords.some(function(k) { return name.includes(k.split(' ')[0]) || name.includes(k.split(' ')[1] || ''); });
    });
    var products = filtered.length > 0 ? filtered : all.slice(0, 16);
    grid.innerHTML = products.map(function(p) { return renderSupplierProductCard(p); }).join('');
  } catch(e) {
    grid.innerHTML = '<p style="color:#DC2626;text-align:center;padding:32px">Error loading listings. Check console.</p>';
    console.error(e);
  }
}
```

Also call renderReferenceProducts() when the 'source-by-product' tab is clicked.

#### CSS for reference product cards (add to style.css):
```css
.reference-products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 12px;
  margin-bottom: 8px;
}

.reference-product-card {
  background: #FFFFFF;
  border: 1.5px solid #E8E8EC;
  border-radius: 8px;
  padding: 16px 12px;
  text-align: center;
  cursor: pointer;
  transition: border-color 0.15s, transform 0.15s;
}

.reference-product-card:hover {
  border-color: #FF6B6B;
  transform: translateY(-2px);
}

.ref-emoji {
  font-size: 28px;
  margin-bottom: 8px;
}

.ref-name {
  font-size: 12px;
  font-weight: 700;
  color: #0A0A0A;
  line-height: 1.3;
  margin-bottom: 4px;
}

.ref-category {
  font-size: 10px;
  font-weight: 600;
  color: #FF6B6B;
  letter-spacing: 0.08em;
}

@media (max-width: 768px) {
  .reference-products-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 8px;
  }
  .ref-emoji { font-size: 22px; }
  .ref-name { font-size: 11px; }
}

@media (max-width: 400px) {
  .reference-products-grid { grid-template-columns: repeat(2, 1fr); }
}
```

---

## PUSH
After all changes:
  node push-file.js "app.js" "app.js" "fix: anon key + source-by-product feature"
  node push-file.js "index.html" "index.html" "feat: source by product tab"
  node push-file.js "style.css" "style.css" "feat: reference product card styles"

## RULES
- The anon key fix is CRITICAL — do it first, find every occurrence of the secret key
- Also check data/sb.js if it exists
- Keep all existing functions
- renderReferenceProducts() must be called when source-by-product tab activates

When done, run:
openclaw system event --text "Brigid done: Supabase anon key fixed + source-by-product listings feature live"
