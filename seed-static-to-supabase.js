// seed-static-to-supabase.js
// Reads existing static data files and seeds Supabase tables
const https = require('https');
const fs = require('fs');
const vm = require('vm');

const SB_URL = 'fhfqjcvwcxizbioftvdw.supabase.co';
const SB_KEY = 'REDACTED_SUPABASE_KEY';

function sbUpsert(table, rows) {
  if (!rows || !rows.length) { console.log(`  ⚠️  ${table}: no rows to insert`); return Promise.resolve(); }
  const body = JSON.stringify(rows);
  return new Promise((resolve, reject) => {
    const req = https.request({
      hostname: SB_URL,
      path: `/rest/v1/${table}`,
      method: 'POST',
      headers: {
        'apikey': SB_KEY, 'Authorization': `Bearer ${SB_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal,resolution=merge-duplicates',
        'Content-Length': Buffer.byteLength(body)
      }
    }, res => {
      let d = ''; res.on('data', c => d += c);
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          console.log(`  ✅ ${table}: ${rows.length} rows`);
          resolve();
        } else {
          console.error(`  ❌ ${table} (${res.statusCode}):`, d.slice(0, 200));
          resolve(); // don't fail entire script
        }
      });
    });
    req.on('error', e => { console.error(`  ❌ ${table} network:`, e.message); resolve(); });
    req.write(body); req.end();
  });
}

// Load static data files by eval-ing them in a sandbox
function loadDataJS() {
  const sandbox = { window: {} };
  const dataJs = fs.readFileSync('data/data.js', 'utf-8');
  vm.runInNewContext(dataJs, sandbox);
  return {
    market: sandbox.window.MARKET_DATA || sandbox.MARKET_DATA,
    suppliers: sandbox.window.SUPPLIERS_DATA || sandbox.SUPPLIERS_DATA
  };
}

function loadFeedJS() {
  const sandbox = { window: {} };
  const feedJs = fs.readFileSync('data/feed.js', 'utf-8');
  vm.runInNewContext(feedJs, sandbox);
  return sandbox.window.FEED_DATA || sandbox.FEED_DATA;
}

async function run() {
  console.log('Loading static data files...');
  const { market, suppliers } = loadDataJS();
  const feed = loadFeedJS();

  if (!market) { console.error('Could not load MARKET_DATA from data/data.js'); process.exit(1); }
  if (!suppliers) { console.error('Could not load SUPPLIERS_DATA from data/data.js'); process.exit(1); }

  console.log(`Market stats: ${market.stats?.length}, Competitors: ${market.competitors?.length}`);
  console.log(`Suppliers: ${suppliers.suppliers?.length}`);
  console.log(`Feed posts: ${feed?.feedPosts?.length}`);

  // 1. market_stats
  const stats = (market.stats || []).map((s, i) => ({
    icon: s.icon, value: s.value, label: s.label,
    sub: s.sub, trend: s.trend, sort_order: i
  }));
  await sbUpsert('market_stats', stats);

  // 2. competitors
  const comps = (market.competitors || []).map(c => ({
    name: c.name, handle: c.handle || null, platform: c.platform || 'Instagram',
    followers: c.followers || null, product_overlap: c.overlap || c.productOverlap || 0,
    market_reach: c.reach || c.marketReach || 0, threat_level: c.threat || c.threatLevel || 'medium',
    strengths: c.strengths || [], weaknesses: c.weaknesses || [],
    price_range: c.priceRange || c.price_range || null, url: c.url || null
  }));
  await sbUpsert('competitors', comps);

  // 3. suppliers — field names differ from what we expected
  const supps = (suppliers.suppliers || []).map(s => ({
    name: s.name,
    platform: s.platform || 'Facebook',
    products: s.items ? s.items.split(',').map(i => i.trim()) : (s.category ? [s.category] : []),
    price_per_piece: s.pricePerPc || s.pricePerPiece || null,
    moq: parseInt(s.minOrder) || 0,
    location: s.location || 'Philippines',
    rating: 4.5,
    url: s.contact || null,
    is_promo_active: false,
    notes: s.notes || null
  }));
  await sbUpsert('suppliers', supps);

  // 4. product_opportunities — from trendingProducts
  const opps = (market.trendingProducts || []).map(p => ({
    product: p.name || p.product,
    source: 'Market analysis',
    demand_level: p.demand || p.demandLevel || 'Medium',
    suggested_price_range: p.priceRange || p.suggestedPriceRange || null,
    supplier_found: false,
    notes: p.notes || null
  }));
  await sbUpsert('product_opportunities', opps);

  // 5. social_feed
  const posts = (feed?.feedPosts || []).map(p => ({
    account: p.account, handle: p.handle || null, platform: p.platform,
    content: p.content || null,
    hashtags: Array.isArray(p.hashtags) ? p.hashtags : [],
    engagement: p.engagement || null,
    post_date: p.date || null, url: p.url || null,
    category: p.category || 'competitor',
    insight: p.insight || null, is_hot: p.isHot || false
  }));
  await sbUpsert('social_feed', posts);

  console.log('\n✅ All static data seeded to Supabase!');
}

run().catch(e => { console.error('FATAL:', e.message); process.exit(1); });
