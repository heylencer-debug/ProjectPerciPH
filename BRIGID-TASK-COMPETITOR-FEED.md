# Brigid Task — Competitor Social Media Feed UI

Workspace: C:\Users\Carl Rebadomia\.openclaw\workspace\dashboard\
Push tool: node push-file.js (run from dashboard/)

---

## GOAL
Add a "Competitor Feed" page to the ProjectPercyPH dashboard.
Shows competitor social media post previews pulled live from Supabase.
All images served from Supabase Storage — no local files.

---

## SUPABASE CONFIG
URL: https://fhfqjcvwcxizbioftvdw.supabase.co
Key: REDACTED_SUPABASE_KEY

---

## TASK 1: Add Competitor Feed page to index.html

Add a new nav item to the sidebar:
<div class="nav-item" data-page="competitor-feed">Competitor Feed</div>

Add a new page section (hidden by default):
<section id="page-competitor-feed" class="page-section" style="display:none">

  <!-- Page header -->
  <div class="page-header">
    <div class="page-label">MARKET INTELLIGENCE</div>
    <h1 class="page-title">COMPETITOR FEED</h1>
    <p class="page-subtitle">Live social posts from competing brands — powered by Ethel</p>
  </div>

  <!-- Stats bar -->
  <div class="stats-bar" id="cf-stats-bar">
    <div class="stat-card">
      <div class="stat-number" id="cf-total-posts">—</div>
      <div class="stat-label">TOTAL POSTS</div>
    </div>
    <div class="stat-card">
      <div class="stat-number" id="cf-competitors-count">—</div>
      <div class="stat-label">COMPETITORS</div>
    </div>
    <div class="stat-card">
      <div class="stat-number" id="cf-avg-engagement">—</div>
      <div class="stat-label">AVG ENGAGEMENT</div>
    </div>
    <div class="stat-card">
      <div class="stat-number" id="cf-last-scraped">—</div>
      <div class="stat-label">LAST SCRAPED</div>
    </div>
  </div>

  <!-- Filters -->
  <div class="filter-row" style="margin-bottom:24px;display:flex;gap:10px;flex-wrap:wrap;align-items:center">
    <select id="cf-competitor-filter" class="filter-select">
      <option value="">All Competitors</option>
    </select>
    <select id="cf-platform-filter" class="filter-select">
      <option value="">All Platforms</option>
      <option value="instagram">Instagram</option>
      <option value="tiktok">TikTok</option>
      <option value="shopee">Shopee</option>
    </select>
    <button class="btn-primary" onclick="loadCompetitorFeed()">Refresh</button>
  </div>

  <!-- Post grid -->
  <div id="competitor-feed-grid" class="competitor-feed-grid">
    <p style="color:#6B7280;text-align:center;padding:48px">Loading competitor posts...</p>
  </div>

  <!-- Load more -->
  <div style="text-align:center;margin-top:24px">
    <button class="btn-secondary" id="cf-load-more" onclick="loadMoreCompetitorPosts()" style="display:none">Load More</button>
  </div>

</section>

---

## TASK 2: Add CSS for competitor feed

Add to style.css:

.competitor-feed-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
  margin-top: 8px;
}

.competitor-post-card {
  background: #FFFFFF;
  border: 1px solid #E8E8EC;
  border-radius: 8px;
  overflow: hidden;
  transition: border-color 0.2s;
}

.competitor-post-card:hover {
  border-color: #FF6B6B;
}

.post-image-wrap {
  width: 100%;
  aspect-ratio: 1 / 1;
  overflow: hidden;
  background: #F8F8FA;
  position: relative;
}

.post-image-wrap img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.post-image-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  color: #C8D0D8;
  background: #F8F8FA;
}

.post-meta {
  padding: 14px;
}

.post-competitor-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.post-competitor-name {
  font-size: 12px;
  font-weight: 700;
  color: #0A0A0A;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.post-platform-badge {
  font-size: 10px;
  font-weight: 700;
  padding: 3px 8px;
  border-radius: 4px;
  border: 1.5px solid;
}

.platform-instagram { border-color: #E1306C; color: #E1306C; }
.platform-tiktok { border-color: #010101; color: #010101; }
.platform-shopee { border-color: #EE4D2D; color: #EE4D2D; }

.post-caption {
  font-size: 13px;
  color: #374151;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  margin-bottom: 10px;
}

.post-stats {
  display: flex;
  gap: 12px;
  font-size: 12px;
  color: #6B7280;
}

.post-stat { display: flex; align-items: center; gap: 4px; }

.post-date {
  font-size: 11px;
  color: #9CA3AF;
  margin-top: 8px;
}

.filter-select {
  padding: 8px 12px;
  border: 1.5px solid #E8E8EC;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 500;
  color: #374151;
  background: #FFFFFF;
  cursor: pointer;
}

.filter-select:focus {
  outline: none;
  border-color: #FF6B6B;
}

@media (max-width: 768px) {
  .competitor-feed-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
  }
}

@media (max-width: 480px) {
  .competitor-feed-grid {
    grid-template-columns: 1fr;
  }
}

---

## TASK 3: Add JS functions to app.js

Add these functions. Write clean vanilla JS, no template literal issues:

// ===== COMPETITOR FEED =====
var CF_OFFSET = 0;
var CF_LIMIT = 24;

async function loadCompetitorFeed() {
  CF_OFFSET = 0;
  var grid = document.getElementById('competitor-feed-grid');
  grid.innerHTML = '<p style="color:#6B7280;text-align:center;padding:48px">Loading...</p>';
  await fetchCompetitorPosts(true);
  await updateCFStats();
  populateCFFilters();
}

async function fetchCompetitorPosts(reset) {
  var SB_URL = 'https://fhfqjcvwcxizbioftvdw.supabase.co';
  var SB_KEY = 'REDACTED_SUPABASE_KEY';
  var competitor = document.getElementById('cf-competitor-filter') ? document.getElementById('cf-competitor-filter').value : '';
  var platform = document.getElementById('cf-platform-filter') ? document.getElementById('cf-platform-filter').value : '';
  var url = SB_URL + '/rest/v1/competitor_posts?order=scraped_at.desc&limit=' + CF_LIMIT + '&offset=' + CF_OFFSET;
  if (competitor) url += '&competitor=eq.' + encodeURIComponent(competitor);
  if (platform) url += '&platform=eq.' + encodeURIComponent(platform);
  try {
    var res = await fetch(url, { headers: { 'apikey': SB_KEY, 'Authorization': 'Bearer ' + SB_KEY } });
    var posts = await res.json();
    var grid = document.getElementById('competitor-feed-grid');
    if (!Array.isArray(posts)) { grid.innerHTML = '<p style="color:#6B7280;text-align:center;padding:48px">No posts yet. Ethel is scraping...</p>'; return; }
    if (posts.length === 0 && reset) { grid.innerHTML = '<p style="color:#6B7280;text-align:center;padding:48px">No posts yet. Ethel is scraping...</p>'; return; }
    var html = posts.map(function(p) { return renderCompetitorPostCard(p); }).join('');
    if (reset) { grid.innerHTML = html; } else { grid.innerHTML += html; }
    var loadMoreBtn = document.getElementById('cf-load-more');
    if (loadMoreBtn) loadMoreBtn.style.display = posts.length < CF_LIMIT ? 'none' : 'inline-block';
    CF_OFFSET += posts.length;
  } catch(e) {
    console.error('Competitor feed error:', e);
  }
}

function renderCompetitorPostCard(p) {
  var platformClass = 'platform-' + (p.platform || 'instagram');
  var platformLabel = (p.platform || 'instagram').toUpperCase();
  var imageHtml = p.image_url
    ? '<img src="' + p.image_url + '" alt="post" loading="lazy" onerror="this.parentNode.innerHTML=\'<div class=post-image-placeholder>📷</div>\'">'
    : '<div class="post-image-placeholder">📷</div>';
  var caption = p.caption ? p.caption.substring(0, 120) + (p.caption.length > 120 ? '...' : '') : '—';
  var date = p.posted_at ? new Date(p.posted_at).toLocaleDateString('en-PH') : (p.scraped_at ? new Date(p.scraped_at).toLocaleDateString('en-PH') : '—');
  var postLink = p.post_url ? 'href="' + p.post_url + '" target="_blank"' : '';
  return '<div class="competitor-post-card">'
    + '<div class="post-image-wrap">'
    + (p.post_url ? '<a ' + postLink + '>' : '')
    + imageHtml
    + (p.post_url ? '</a>' : '')
    + '</div>'
    + '<div class="post-meta">'
    + '<div class="post-competitor-row">'
    + '<span class="post-competitor-name">' + (p.competitor || '—') + '</span>'
    + '<span class="post-platform-badge ' + platformClass + '">' + platformLabel + '</span>'
    + '</div>'
    + '<div class="post-caption">' + caption + '</div>'
    + '<div class="post-stats">'
    + '<span class="post-stat">❤️ ' + (p.likes || 0).toLocaleString() + '</span>'
    + '<span class="post-stat">💬 ' + (p.comments || 0).toLocaleString() + '</span>'
    + (p.views ? '<span class="post-stat">👁 ' + p.views.toLocaleString() + '</span>' : '')
    + '</div>'
    + '<div class="post-date">' + date + '</div>'
    + '</div>'
    + '</div>';
}

async function loadMoreCompetitorPosts() {
  await fetchCompetitorPosts(false);
}

async function updateCFStats() {
  var SB_URL = 'https://fhfqjcvwcxizbioftvdw.supabase.co';
  var SB_KEY = 'REDACTED_SUPABASE_KEY';
  try {
    var res = await fetch(SB_URL + '/rest/v1/competitor_posts?select=competitor,platform,likes,scraped_at', {
      headers: { 'apikey': SB_KEY, 'Authorization': 'Bearer ' + SB_KEY, 'Prefer': 'count=exact' }
    });
    var posts = await res.json();
    if (!Array.isArray(posts)) return;
    var total = document.getElementById('cf-total-posts');
    var compCount = document.getElementById('cf-competitors-count');
    var avgEng = document.getElementById('cf-avg-engagement');
    var lastScraped = document.getElementById('cf-last-scraped');
    if (total) total.textContent = posts.length;
    if (compCount) compCount.textContent = new Set(posts.map(function(p) { return p.competitor; })).size;
    if (avgEng) {
      var totalLikes = posts.reduce(function(a, p) { return a + (p.likes || 0); }, 0);
      avgEng.textContent = posts.length ? Math.round(totalLikes / posts.length).toLocaleString() : '—';
    }
    if (lastScraped && posts.length) {
      var latest = posts.sort(function(a,b) { return new Date(b.scraped_at) - new Date(a.scraped_at); })[0];
      lastScraped.textContent = new Date(latest.scraped_at).toLocaleDateString('en-PH');
    }
  } catch(e) { console.error('CF stats error:', e); }
}

async function populateCFFilters() {
  var SB_URL = 'https://fhfqjcvwcxizbioftvdw.supabase.co';
  var SB_KEY = 'REDACTED_SUPABASE_KEY';
  try {
    var res = await fetch(SB_URL + '/rest/v1/competitor_posts?select=competitor', {
      headers: { 'apikey': SB_KEY, 'Authorization': 'Bearer ' + SB_KEY }
    });
    var posts = await res.json();
    if (!Array.isArray(posts)) return;
    var competitors = Array.from(new Set(posts.map(function(p) { return p.competitor; }))).filter(Boolean);
    var sel = document.getElementById('cf-competitor-filter');
    if (!sel) return;
    sel.innerHTML = '<option value="">All Competitors</option>'
      + competitors.map(function(c) { return '<option value="' + c + '">' + c + '</option>'; }).join('');
  } catch(e) {}
}

Also add Realtime subscription for competitor_posts inside initRealtime() if it exists:
  channel competitor_posts → on INSERT → prepend new card to grid + update stats

Also wire up the nav: in the setupNav() or equivalent function, add 'competitor-feed' as a page that calls loadCompetitorFeed() on first activation.

---

## PUSH TO GITHUB
Push these files after editing:
  node push-file.js "index.html" "index.html" "feat: competitor social feed page"
  node push-file.js "style.css" "style.css" "feat: competitor post card styles"
  node push-file.js "app.js" "app.js" "feat: competitor feed JS - Supabase Storage + realtime"

---

## RULES
- Read all 3 files fully before editing
- Keep all existing IDs, class names, functions
- Cards must show the actual image from Supabase Storage URL
- Graceful fallback if image fails to load (show 📷 placeholder)
- Mobile responsive grid (2-col tablet, 1-col mobile)

When completely done, run:
openclaw system event --text "Brigid done: competitor social feed page live on ProjectPercyPH dashboard"
