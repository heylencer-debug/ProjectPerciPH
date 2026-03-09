// setup-supabase.js — create tables + seed competitor prices
const https = require('https');
const fs = require('fs');

const ACCESS_TOKEN = 'sbp_930d9e5fe75da4d2415263ec1d37aaaa8b5aaab7';
const PROJECT_REF = 'fhfqjcvwcxizbioftvdw';
const SB_URL = 'fhfqjcvwcxizbioftvdw.supabase.co';
const SB_KEY = 'REDACTED_SUPABASE_KEY';

function runSQL(sql) {
  const body = JSON.stringify({ query: sql });
  return new Promise((resolve, reject) => {
    const req = https.request({
      hostname: 'api.supabase.com',
      path: `/v1/projects/${PROJECT_REF}/database/query`,
      method: 'POST',
      headers: { 'Authorization': `Bearer ${ACCESS_TOKEN}`, 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body) }
    }, res => { let d = ''; res.on('data', c => d += c); res.on('end', () => { console.log(res.statusCode, d.slice(0,100)); resolve(d); }); });
    req.on('error', reject); req.write(body); req.end();
  });
}

function sbGet(table, query) {
  return new Promise((resolve, reject) => {
    const req = https.request({
      hostname: SB_URL,
      path: `/rest/v1/${table}${query ? '?' + query : ''}`,
      method: 'GET',
      headers: { 'apikey': SB_KEY, 'Authorization': `Bearer ${SB_KEY}` }
    }, res => { let d = ''; res.on('data', c => d += c); res.on('end', () => { try { resolve(JSON.parse(d)); } catch { resolve([]); } }); });
    req.on('error', reject); req.end();
  });
}

function sbPost(table, rows) {
  const body = JSON.stringify(Array.isArray(rows) ? rows : [rows]);
  return new Promise((resolve, reject) => {
    const req = https.request({
      hostname: SB_URL,
      path: `/rest/v1/${table}`,
      method: 'POST',
      headers: { 'apikey': SB_KEY, 'Authorization': `Bearer ${SB_KEY}`, 'Content-Type': 'application/json', 'Prefer': 'return=representation,resolution=merge-duplicates', 'Content-Length': Buffer.byteLength(body) }
    }, res => { let d = ''; res.on('data', c => d += c); res.on('end', () => resolve(d)); });
    req.on('error', reject); req.write(body); req.end();
  });
}

async function run() {
  // 1. Create tables
  console.log('Creating tables...');
  await runSQL(`
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
  `);

  // 2. Enable Realtime
  console.log('Enabling Realtime...');
  await runSQL(`
    ALTER PUBLICATION supabase_realtime ADD TABLE market_stats;
    ALTER PUBLICATION supabase_realtime ADD TABLE competitors;
    ALTER PUBLICATION supabase_realtime ADD TABLE suppliers;
    ALTER PUBLICATION supabase_realtime ADD TABLE social_feed;
    ALTER PUBLICATION supabase_realtime ADD TABLE product_opportunities;
    ALTER PUBLICATION supabase_realtime ADD TABLE competitor_prices;
  `);

  // 3. Seed competitor_prices from btv_products
  console.log('Seeding competitor prices from BTV...');
  const btv = await sbGet('btv_products', 'order=price_min.desc&limit=25&price_min=gt.0');
  if (btv && btv.length) {
    const rows = btv.map(p => ({
      competitor: 'Beyond The Vines',
      product: p.title,
      category: p.category,
      price: p.price_min,
      platform: 'website',
      url: p.product_url,
      our_price: Math.round(p.price_min * 0.65 * 100) / 100
    }));
    await sbPost('competitor_prices', rows);
    console.log(`Seeded ${rows.length} price entries`);
  }

  console.log('✅ Done');
}

run().catch(e => { console.error('FAIL:', e.message); process.exit(1); });
