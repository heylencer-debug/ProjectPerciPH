// ===== DASHBOARD APP =====
let marketData = null;
let suppliersData = null;
let pricingChart = null;
let seasonChart = null;

// ===== INIT =====
async function init() {
  // Use embedded globals (works with file://) or fallback to fetch (works on server)
  if (window.MARKET_DATA && window.SUPPLIERS_DATA) {
    marketData = window.MARKET_DATA;
    suppliersData = window.SUPPLIERS_DATA;
    boot();
  } else {
    try {
      const [mRes, sRes] = await Promise.all([
        fetch('data/market.json'),
        fetch('data/suppliers.json')
      ]);
      marketData = await mRes.json();
      suppliersData = await sRes.json();
      boot();
    } catch (err) {
      console.error('Failed to load data:', err);
      document.querySelector('.main').innerHTML = `<div style="padding:60px 40px;font-family:Inter,sans-serif;">
        <div style="color:#E94560;font-size:22px;font-weight:700;margin-bottom:12px">⚠️ Data load error</div>
        <p style="color:#4A5568">Could not load data files. Try opening via Chrome directly.</p>
      </div>`;
    }
  }
}

function boot() {
  setDates();
  updateGradCountdown();
  renderSeasonalAlerts();
  renderStats();
  renderProductsTable();
  renderCompetitors();
  renderInsights();
  renderCharts();
  renderSuppliers();
  renderGroups();
  renderTemplate();
  if (window.FEED_DATA)        { renderFeed(); renderCompetitorProfiles(); }
  if (window.CALENDAR_DATA)    { renderCalendar(); renderCalendarTable(); }
  if (window.CAPTIONS_DATA)    { renderCaptions(); setupCaptionFilters(); }
  if (window.CATALOG_DATA)     { renderCatalog(); renderCompetitorPricing(); renderBundles(); renderRecommendations(); }
  if (window.COMPETITOR_DETAIL){ renderCompetitorDeepDive(); renderThreatMatrix(); renderAdvantages(); }
  if (window.PRICING_DATA)     { initPricingCalculator(); }
  // Ethel Intelligence
  if (window.PRODUCT_OPPORTUNITIES) { renderProductOpportunities(); }
  if (window.SUPPLIERS)        { renderSupplierIntelligence(); }
  setupNav();
  setupFilters();
  setupFeedFilters();
}

// ===== DATES =====
function setDates() {
  const d = marketData.lastUpdated;
  document.getElementById('sidebar-date').textContent = formatDate(d);
  document.getElementById('header-date').textContent = formatDate(d);
}
function formatDate(d) {
  const date = new Date(d);
  return date.toLocaleDateString('en-PH', { year: 'numeric', month: 'long', day: 'numeric' });
}

// ===== NAV =====
function setupNav() {
  document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', e => {
      e.preventDefault();
      const page = item.dataset.page;
      document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
      item.classList.add('active');
      document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
      document.getElementById('page-' + page).classList.add('active');
      const titles = {
        market:         ['Market Analysis',         'Philippines Embroidery Gift Market — Live Research Data'],
        competitors:    ['Competitor Deep-Dive',    'Know your competition — Intel that keeps you ahead'],
        suppliers:      ['Suppliers List',          'Wholesale & retail sources for embroidery blanks — Feb 2026'],
        'supplier-intel': ['Supplier Intelligence', 'Curated supplier data from Ethel 🕵️ — Intelligence Agent'],
        feed:           ['Social Feed',             'Competitor posts, viral trends & market signals — updated daily'],
        calendar:       ['Content Calendar',        'March 2026 posting schedule — 30 planned posts across all platforms'],
        captions:       ['Captions Library',        '30 ready-to-use captions for Instagram, TikTok & Facebook'],
        pricing:        ['Pricing Calculator',      'Calculate costs, margins & competitive pricing in real-time'],
        catalog:        ['Product Catalog',         'Your SKUs, pricing tiers, margins & competitor comparison']
      };
      document.getElementById('page-title').textContent = titles[page][0];
      document.getElementById('page-sub').textContent = titles[page][1];
      if (page === 'suppliers') document.getElementById('header-date').textContent = formatDate(suppliersData.lastUpdated);
      else document.getElementById('header-date').textContent = formatDate(marketData.lastUpdated);
    });
  });
}

// ===== STATS =====
function renderStats() {
  const grid = document.getElementById('stats-grid');
  grid.innerHTML = marketData.stats.map(s => `
    <div class="stat-card">
      <span class="stat-icon">${s.icon}</span>
      <div class="stat-value">${s.value}</div>
      <div class="stat-label">${s.label}</div>
      <div class="stat-sub">${s.sub}</div>
      <span class="stat-trend trend-${s.trend}">
        ${s.trend === 'up' ? '↑ Growing' : s.trend === 'down' ? '↓ Declining' : '→ Stable'}
      </span>
    </div>
  `).join('');
}

// ===== PRODUCTS TABLE =====
function renderProductsTable() {
  const tbody = document.getElementById('products-body');
  tbody.innerHTML = marketData.trendingProducts.map(p => {
    const demandClass = { 'Very High': 'veryhigh', 'High': 'high', 'Growing': 'growing', 'Emerging': 'emerging' }[p.demand] || 'medium';
    const trendClass = { rising: 'trend-rising', stable: 'trend-stable', falling: 'trend-falling' }[p.trend];
    const trendIcon = { rising: '↑ Rising', stable: '→ Stable', falling: '↓ Falling' }[p.trend];
    const barWidth = Math.min(p.margin, 100);
    return `<tr>
      <td><strong style="color:#E94560">${p.rank}</strong></td>
      <td><strong>${p.emoji} ${p.product}</strong></td>
      <td><span class="badge badge-${demandClass}">${p.demand}</span></td>
      <td style="font-weight:600;color:#1A1A2E">${p.priceRange}</td>
      <td>
        <div class="margin-bar">
          <div class="margin-fill" style="width:${barWidth}px"></div>
          <span class="margin-text">${p.margin}%</span>
        </div>
      </td>
      <td><span class="${trendClass}" style="font-size:12px;font-weight:600">${trendIcon}</span></td>
    </tr>`;
  }).join('');
}

// ===== COMPETITORS =====
function renderCompetitors() {
  const grid = document.getElementById('competitors-grid');
  const colors = { High: 'badge-veryhigh', Medium: 'badge-high', Low: 'badge-low' };
  grid.innerHTML = marketData.competitors.map(c => `
    <div class="competitor-card">
      <div class="comp-name">${c.name}</div>
      <div class="comp-platform">📍 ${c.platform}${c.followers !== '—' ? ' · ' + c.followers : ''}</div>
      <div class="comp-focus"><strong>Focus:</strong> ${c.focus}</div>
      <div class="comp-weakness">⚠️ ${c.weakness}</div>
      <span class="badge ${colors[c.threat] || 'badge-medium'}">Threat: ${c.threat}</span>
    </div>
  `).join('');
}

// ===== INSIGHTS =====
function renderInsights() {
  const grid = document.getElementById('insights-grid');
  grid.innerHTML = marketData.insights.map(i => `
    <div class="insight-card insight-${i.type}">
      <div class="insight-icon">${i.icon}</div>
      <div class="insight-title">${i.title}</div>
      <div class="insight-body">${i.body}</div>
    </div>
  `).join('');
}

// ===== CHARTS =====
function renderCharts() {
  // Pricing Chart
  const pb = marketData.pricingBenchmarks;
  const pCtx = document.getElementById('pricingChart').getContext('2d');
  if (pricingChart) pricingChart.destroy();
  pricingChart = new Chart(pCtx, {
    type: 'bar',
    data: {
      labels: pb.labels,
      datasets: [
        { label: 'Competitor Avg (₱)', data: pb.competitorAvg, backgroundColor: 'rgba(233,69,96,0.15)', borderColor: '#E94560', borderWidth: 2, borderRadius: 6 },
        { label: 'Your Price (₱)', data: pb.yourSuggestedPrice, backgroundColor: 'rgba(59,130,246,0.15)', borderColor: '#3B82F6', borderWidth: 2, borderRadius: 6 },
        { label: 'Material Cost (₱)', data: pb.materialCost, backgroundColor: 'rgba(34,197,94,0.15)', borderColor: '#22C55E', borderWidth: 2, borderRadius: 6 }
      ]
    },
    options: {
      responsive: true, maintainAspectRatio: true,
      plugins: { legend: { position: 'bottom', labels: { font: { family: 'Inter', size: 11 }, padding: 12 } } },
      scales: {
        y: { beginAtZero: true, grid: { color: '#F0F2F5' }, ticks: { callback: v => '₱' + v, font: { family: 'Inter', size: 11 } } },
        x: { grid: { display: false }, ticks: { font: { family: 'Inter', size: 11 } } }
      }
    }
  });

  // Seasonal Chart
  const sd = marketData.seasonalDemand;
  const sCtx = document.getElementById('seasonChart').getContext('2d');
  if (seasonChart) seasonChart.destroy();
  const bgColors = sd.map(m => {
    if (m.level === 5) return 'rgba(233,69,96,0.85)';
    if (m.level === 4) return 'rgba(249,115,22,0.75)';
    if (m.level === 3) return 'rgba(234,179,8,0.7)';
    return 'rgba(148,163,184,0.5)';
  });
  seasonChart = new Chart(sCtx, {
    type: 'bar',
    data: {
      labels: sd.map(m => m.month),
      datasets: [{
        label: 'Demand Level',
        data: sd.map(m => m.level),
        backgroundColor: bgColors,
        borderRadius: 6, borderSkipped: false
      }]
    },
    options: {
      responsive: true, maintainAspectRatio: true,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: ctx => {
              const item = sd[ctx.dataIndex];
              const names = ['', 'Low', 'Medium', 'High', 'Very High', '🔥 Peak'];
              return ` ${names[item.level]} — ${item.label}`;
            }
          }
        }
      },
      scales: {
        y: { beginAtZero: true, max: 5.5, display: false },
        x: { grid: { display: false }, ticks: { font: { family: 'Inter', size: 11 } } }
      }
    }
  });
}

// ===== SUPPLIERS TABLE =====
let filteredSuppliers = [];
function renderSuppliers(list) {
  const suppliers = list || suppliersData.suppliers;
  filteredSuppliers = suppliers;
  const tbody = document.getElementById('suppliers-body');
  document.getElementById('supplier-count').textContent = suppliers.length;

  const platClass = { Facebook: 'plat-facebook', Shopee: 'plat-shopee', Lazada: 'plat-lazada', Website: 'plat-website' };
  const priClass = { TOP: 'pri-top', HIGH: 'pri-high', MEDIUM: 'pri-medium' };

  const getAction = s => {
    if (s.platform === 'Facebook') return `<button class="action-btn btn-message" onclick="openContact('${escHtml(s.contact)}','${s.contactType}')">💬 Message</button>`;
    if (s.platform === 'Shopee') return `<a href="https://shopee.ph" target="_blank" class="action-btn btn-view">🛒 View</a>`;
    if (s.platform === 'Lazada') return `<a href="${escHtml(s.contact.startsWith('http') ? s.contact : 'https://' + s.contact)}" target="_blank" class="action-btn btn-view">🛒 View</a>`;
    return `<a href="${escHtml(s.contact)}" target="_blank" class="action-btn btn-visit">🌐 Visit</a>`;
  };

  tbody.innerHTML = suppliers.map((s, i) => `
    <tr onclick="selectRow(this)">
      <td><strong style="color:#A0AEC0">${i + 1}</strong></td>
      <td>
        <div style="font-weight:700;color:#1A1A2E;font-size:13px">${s.name}</div>
        ${s.priority === 'TOP' ? '<span class="badge pri-top" style="margin-top:4px;display:inline-flex">⭐ Top Pick</span>' : ''}
      </td>
      <td><span class="badge ${platClass[s.platform] || ''}">${s.platform}</span></td>
      <td style="font-size:12px;color:#4A5568">${s.category}</td>
      <td class="items-cell">${s.items}</td>
      <td style="font-weight:700;color:#E94560;white-space:nowrap">${s.pricePerPc}</td>
      <td style="font-size:12px;white-space:nowrap">${s.minOrder}</td>
      <td style="font-size:12px;color:#718096">${s.location}</td>
      <td style="font-size:12px">${s.rating}</td>
      <td>${getAction(s)}</td>
    </tr>
  `).join('');
}

function escHtml(str) {
  return (str || '').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
function openContact(contact, type) {
  if (type === 'phone') {
    if (confirm(`Call/message ${contact}?`)) window.open(`tel:${contact.replace(/[^0-9+]/g, '')}`);
  } else if (type === 'facebook') {
    window.open(`https://${contact.startsWith('http') ? contact.replace(/^https?:\/\//, '') : contact}`, '_blank');
  } else {
    window.open(`https://${contact}`, '_blank');
  }
}
function selectRow(row) {
  document.querySelectorAll('.suppliers-table tbody tr').forEach(r => r.classList.remove('selected'));
  row.classList.add('selected');
}

// ===== FILTERS =====
function setupFilters() {
  const search = document.getElementById('supplier-search');
  const catFilter = document.getElementById('filter-category');
  const platFilter = document.getElementById('filter-platform');
  const doFilter = () => {
    const q = search.value.toLowerCase();
    const cat = catFilter.value.toLowerCase();
    const plat = platFilter.value.toLowerCase();
    const filtered = suppliersData.suppliers.filter(s => {
      const matchQ = !q || [s.name, s.items, s.location, s.category].some(f => f.toLowerCase().includes(q));
      const matchCat = !cat || s.category.toLowerCase().includes(cat);
      const matchPlat = !plat || s.platform.toLowerCase() === plat;
      return matchQ && matchCat && matchPlat;
    });
    renderSuppliers(filtered);
  };
  search.addEventListener('input', doFilter);
  catFilter.addEventListener('change', doFilter);
  platFilter.addEventListener('change', doFilter);
}

// ===== GROUPS =====
function renderGroups() {
  const grid = document.getElementById('groups-grid');
  const priColors = { TOP: '#FEF2F2', HIGH: '#FFF7ED', MEDIUM: '#F8F9FF' };
  grid.innerHTML = suppliersData.facebookGroups.map(g => `
    <div class="group-card" style="background:${priColors[g.priority] || '#F8F9FF'}">
      <div class="group-name">👥 ${g.name}</div>
      <div class="group-members">${g.members} members</div>
      <div class="group-focus">${g.focus}</div>
    </div>
  `).join('');
}

// ===== TEMPLATE =====
function renderTemplate() {
  document.getElementById('msg-template').value = suppliersData.messageTemplate;
}
function copyTemplate() {
  const ta = document.getElementById('msg-template');
  ta.select();
  document.execCommand('copy');
  const btn = document.getElementById('copy-btn');
  const ok = document.getElementById('copy-success');
  btn.textContent = '✅ Copied!';
  ok.style.display = 'block';
  setTimeout(() => { btn.textContent = '📋 Copy Message'; ok.style.display = 'none'; }, 2500);
}

// ===== FEED =====
let activeFeedFilter = 'all';
let activePlatformFilter = 'all';

function renderFeed() {
  if (!window.FEED_DATA) return;
  const posts = window.FEED_DATA.feedPosts;
  const filtered = posts.filter(p => {
    const matchCat = activeFeedFilter === 'all' || p.category === activeFeedFilter;
    const matchPlat = activePlatformFilter === 'all' || p.platform === activePlatformFilter;
    return matchCat && matchPlat;
  });
  document.getElementById('feed-post-count').textContent = filtered.length;
  document.getElementById('feed-badge').textContent = posts.length;

  const platIcon = { TikTok: '🎵', Facebook: '👥', Instagram: '📸' };
  const platAvatarClass = { TikTok: 'avatar-tiktok', Facebook: 'avatar-facebook', Instagram: 'avatar-instagram' };
  const platBadgeClass = { TikTok: 'plat-tiktok', Facebook: 'plat-facebook', Instagram: 'plat-instagram' };

  const container = document.getElementById('feed-posts');
  if (filtered.length === 0) {
    container.innerHTML = `<div style="text-align:center;padding:40px;color:#A0AEC0;font-size:14px">No posts match this filter.</div>`;
    return;
  }
  container.innerHTML = filtered.map(p => {
    const tags = (p.hashtags || []).slice(0, 5).map(h => `<span class="post-hashtag">${h}</span>`).join('');
    const media = buildMediaPreview(p);
    return `
    <div class="post-card ${p.isHot ? 'is-hot' : ''}">
      <div class="post-header">
        <div class="post-avatar ${platAvatarClass[p.platform] || ''}">${platIcon[p.platform] || '📱'}</div>
        <div class="post-meta">
          <div class="post-account">${p.account}</div>
          <div class="post-handle">${p.handle} · ${p.daysAgo}</div>
        </div>
        <div class="post-badges">
          ${p.isHot ? '<span class="post-hot-badge">🔥 HOT</span>' : ''}
          <span class="badge ${platBadgeClass[p.platform] || 'badge-medium'}">${p.platform}</span>
        </div>
      </div>
      ${media}
      <div class="post-body">
        <div class="post-content">${p.content}</div>
        <div class="post-hashtags">${tags}</div>
        ${p.insight ? `<div class="post-insight">${p.insight}</div>` : ''}
      </div>
      <div class="post-footer">
        <div class="post-stats">
          <span class="post-stat">👁️ ${p.engagement}</span>
          <span class="post-stat">📅 ${p.date}</span>
        </div>
        <a href="${p.url}" target="_blank" class="post-view-btn">View Post ↗</a>
      </div>
    </div>`;
  }).join('');

  // Attach expand handlers for TikTok embeds
  document.querySelectorAll('.post-media[data-tiktok-id]').forEach(el => {
    el.addEventListener('click', function() {
      if (this.classList.contains('expanded')) return;
      this.classList.add('expanded');
      const id = this.dataset.tiktokId;
      const iframe = this.querySelector('iframe.tiktok-embed-frame');
      if (iframe && !iframe.src) {
        iframe.src = `https://www.tiktok.com/embed/v2/${id}`;
      }
    });
  });
}

function buildMediaPreview(p) {
  if (p.mediaType === 'tiktok' && p.mediaId) {
    const bg = p.thumbnail
      ? `style="background-image:url('${p.thumbnail}')" `
      : '';
    return `
    <div class="post-media tiktok-preview bg-tiktok" data-tiktok-id="${p.mediaId}" title="Click to play video">
      <div class="media-bg" ${bg}></div>
      <div class="media-overlay">
        <div class="media-play-btn">▶</div>
        <div class="media-label">Click to play TikTok</div>
      </div>
      <div class="media-platform-watermark">🎵 TikTok</div>
      <iframe class="tiktok-embed-frame" allowfullscreen allow="autoplay"></iframe>
    </div>`;
  }
  if (p.mediaType === 'instagram_reel' && p.mediaId) {
    return `
    <div class="post-media photo-preview bg-instagram" style="cursor:default">
      <div class="media-bg"></div>
      <div class="media-overlay">
        <a href="${p.url}" target="_blank" style="text-decoration:none">
          <div class="media-play-btn">▶</div>
        </a>
        <div class="media-label">View on Instagram</div>
      </div>
      <div class="media-platform-watermark">📸 Instagram Reel</div>
    </div>`;
  }
  if (p.mediaType === 'instagram') {
    return `
    <div class="post-media photo-preview bg-instagram" style="cursor:default">
      <div class="media-bg"></div>
      <div class="media-overlay">
        <a href="${p.url}" target="_blank" style="text-decoration:none">
          <div class="media-play-btn" style="font-size:22px">📸</div>
        </a>
        <div class="media-label">View Profile on Instagram</div>
      </div>
      <div class="media-platform-watermark">📸 Instagram</div>
    </div>`;
  }
  if (p.mediaType === 'facebook') {
    return `
    <div class="post-media photo-preview bg-facebook" style="cursor:default">
      <div class="media-bg"></div>
      <div class="media-overlay">
        <a href="${p.url}" target="_blank" style="text-decoration:none">
          <div class="media-play-btn" style="font-size:22px">👥</div>
        </a>
        <div class="media-label">View on Facebook</div>
      </div>
      <div class="media-platform-watermark">👥 Facebook</div>
    </div>`;
  }
  // Fallback: no media
  return '';
}

function renderCompetitorProfiles() {
  if (!window.FEED_DATA) return;
  const profiles = window.FEED_DATA.competitorProfiles;
  const catClass = { 'Direct Competitor': 'cat-direct', 'Indirect Competitor': 'cat-indirect', 'Big Brand': 'cat-big', 'Emerging Competitor': 'cat-emerging' };
  const platEmoji = { TikTok: '🎵', Facebook: '👥', Instagram: '📸' };

  document.getElementById('competitor-profiles').innerHTML = profiles.map(p => `
    <div class="profile-item">
      <div class="profile-name">${p.name}</div>
      <span class="profile-category ${catClass[p.category] || ''}">${p.category}</span>
      <div class="profile-platforms">
        ${p.platforms.map(pl => `<a href="${pl.url}" target="_blank" class="profile-platform-link">${platEmoji[pl.platform] || ''} ${pl.platform}</a>`).join('')}
      </div>
      <div class="profile-freq">📅 Posts: ${p.postFrequency}</div>
    </div>
  `).join('');
}

function setupFeedFilters() {
  document.querySelectorAll('.feed-filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.feed-filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeFeedFilter = btn.dataset.filter;
      renderFeed();
    });
  });
  document.querySelectorAll('.platform-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.platform-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activePlatformFilter = btn.dataset.platform;
      renderFeed();
    });
  });
}

// ===== CONTENT CALENDAR =====
function renderCalendar() {
  const cd = window.CALENDAR_DATA;
  document.getElementById('cal-month-title').textContent = cd.month + ' ' + cd.year;
  const grid = document.getElementById('cal-grid');

  // Day labels
  const days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  let html = days.map(d => `<div class="cal-day-label">${d}</div>`).join('');

  // Get first day of month & total days
  const firstDay = new Date(cd.year, cd.monthNum - 1, 1).getDay();
  const totalDays = new Date(cd.year, cd.monthNum, 0).getDate();

  // Build lookup maps
  const postsByDay = {};
  cd.posts.forEach(p => {
    if (!postsByDay[p.day]) postsByDay[p.day] = [];
    postsByDay[p.day].push(p);
  });
  const holidaysByDay = {};
  cd.holidays.forEach(h => { holidaysByDay[h.date] = h; });

  // Empty cells before day 1
  for (let i = 0; i < firstDay; i++) html += `<div class="cal-cell empty"></div>`;

  // Day cells
  for (let d = 1; d <= totalDays; d++) {
    const posts = postsByDay[d] || [];
    const holiday = holidaysByDay[d];
    const hasHoliday = !!holiday;
    const hasPosts = posts.length > 0;
    let cls = 'cal-cell';
    if (hasHoliday) cls += ' has-holiday';
    else if (hasPosts) cls += ' has-posts';

    const pips = posts.map(p => {
      const pc = { Instagram: 'pip-instagram', TikTok: 'pip-tiktok', Facebook: 'pip-facebook' }[p.platform] || '';
      const icon = { Instagram: '📸', TikTok: '🎵', Facebook: '👥' }[p.platform] || '';
      return `<div class="cal-post-pip ${pc}">${icon} ${p.type || ''}</div>`;
    }).join('');

    html += `<div class="${cls}">
      <div class="cal-date">${d}</div>
      ${hasHoliday ? `<div class="cal-holiday-tag">${holiday.name}</div>` : ''}
      ${pips}
    </div>`;
  }

  grid.innerHTML = html;
}

function renderCalendarTable() {
  const cd = window.CALENDAR_DATA;
  const platIcon = { Instagram: '📸', TikTok: '🎵', Facebook: '👥' };
  const platBadge = { Instagram: 'cp-instagram', TikTok: 'cp-tiktok', Facebook: 'cp-facebook' };
  const pillarColors = { tease:'pillar-tease', process:'pillar-process', product:'pillar-product',
    giftinspo:'pillar-giftinspo', engagement:'pillar-engagement', brand:'pillar-brand', promo:'pillar-promo' };

  const tbody = document.getElementById('cal-body');
  let rows = '';
  cd.posts.forEach((p, i) => {
    const rowId = 'calrow-' + i;
    const preview = (p.caption || '').split('\n')[0].substring(0, 60) + '…';
    rows += `<tr class="cal-table-row" onclick="toggleCalRow(${i})" style="cursor:pointer">
      <td><strong style="color:#E94560">Mar ${p.day}</strong><br><small style="color:#A0AEC0">${p.time}</small></td>
      <td><span class="caption-platform ${platBadge[p.platform]}">${platIcon[p.platform]} ${p.platform}</span></td>
      <td style="font-size:12px;color:#4A5568">${p.type || '—'}</td>
      <td style="font-size:12px;color:#718096">${p.time}</td>
      <td><span class="caption-pillar-tag ${pillarColors[p.pillar] || ''}">${p.pillar}</span></td>
      <td style="font-size:12.5px;color:#4A5568">${preview}</td>
      <td style="font-size:12px;color:#718096;max-width:200px">${(p.visualNote||'').substring(0,60)}${p.visualNote&&p.visualNote.length>60?'…':''}</td>
    </tr>
    <tr id="${rowId}" class="cal-caption-expand">
      <td colspan="7" style="padding:0">
        <div style="padding:14px 20px 16px">
          <div class="cal-caption-box">${(p.caption||'').replace(/\n/g,'<br>')}</div>
          ${p.visualNote ? `<div class="cal-visual-note">${p.visualNote}</div>` : ''}
          ${p.cta ? `<div><span class="cal-cta-tag">CTA: ${p.cta}</span></div>` : ''}
        </div>
      </td>
    </tr>`;
  });
  tbody.innerHTML = rows;
}

function toggleCalRow(i) {
  const el = document.getElementById('calrow-' + i);
  if (el) el.classList.toggle('open');
}

// ===== CAPTIONS LIBRARY =====
function renderCaptions(list) {
  const captions = list || window.CAPTIONS_DATA.captions;
  document.getElementById('caption-count').textContent = captions.length;
  const grid = document.getElementById('captions-grid');
  const platBadge = { Instagram: 'cp-instagram', TikTok: 'cp-tiktok', Facebook: 'cp-facebook' };
  const platIcon  = { Instagram: '📸', TikTok: '🎵', Facebook: '👥' };
  const pillarCls = { tease:'pillar-tease', process:'pillar-process', product:'pillar-product',
    giftinspo:'pillar-giftinspo', engagement:'pillar-engagement', brand:'pillar-brand', promo:'pillar-promo' };

  grid.innerHTML = captions.map(c => `
    <div class="caption-card">
      <div class="caption-header">
        <div class="caption-title">#${c.id} — ${c.title}</div>
        <div class="caption-badges">
          <span class="caption-platform ${platBadge[c.platform]}">${platIcon[c.platform]} ${c.platform}</span>
          <span class="caption-pillar-tag ${pillarCls[c.pillar] || ''}">${c.pillar}</span>
        </div>
      </div>
      <div class="caption-body">
        <div class="caption-text">${escHtml(c.caption)}</div>
        <div class="caption-hashtags">${escHtml(c.hashtags)}</div>
        <div class="caption-cta">${escHtml(c.cta)}</div>
      </div>
      <div class="caption-footer">
        <button class="caption-copy-btn" onclick="copyCaption(${c.id}, this)">📋 Copy Caption</button>
        <button class="caption-copy-btn" style="background:#3B82F6" onclick="copyHashtags(${c.id}, this)">📋 Copy Hashtags</button>
      </div>
    </div>
  `).join('');
}

function copyCaption(id, btn) {
  const c = window.CAPTIONS_DATA.captions.find(x => x.id === id);
  if (!c) return;
  const text = c.caption + '\n\n' + c.hashtags + '\n\n' + c.cta;
  navigator.clipboard.writeText(text).then(() => {
    const orig = btn.textContent;
    btn.textContent = '✅ Copied!';
    btn.classList.add('copied');
    setTimeout(() => { btn.textContent = orig; btn.classList.remove('copied'); }, 2000);
  });
}
function copyHashtags(id, btn) {
  const c = window.CAPTIONS_DATA.captions.find(x => x.id === id);
  if (!c) return;
  navigator.clipboard.writeText(c.hashtags).then(() => {
    const orig = btn.textContent;
    btn.textContent = '✅ Copied!';
    btn.classList.add('copied');
    setTimeout(() => { btn.textContent = orig; btn.classList.remove('copied'); }, 2000);
  });
}

function setupCaptionFilters() {
  const search = document.getElementById('caption-search');
  const platF  = document.getElementById('caption-platform');
  const pillarF = document.getElementById('caption-pillar');
  const doFilter = () => {
    const q = search.value.toLowerCase();
    const plat = platF.value;
    const pil  = pillarF.value;
    const filtered = window.CAPTIONS_DATA.captions.filter(c => {
      const matchQ = !q || [c.title, c.caption, c.hashtags, c.cta].some(f => f.toLowerCase().includes(q));
      const matchP = !plat || c.platform === plat;
      const matchPil = !pil || c.pillar === pil;
      return matchQ && matchP && matchPil;
    });
    renderCaptions(filtered);
  };
  search.addEventListener('input', doFilter);
  platF.addEventListener('change', doFilter);
  pillarF.addEventListener('change', doFilter);
}

// ===== PRODUCT CATALOG =====
function renderCatalog() {
  const cd = window.CATALOG_DATA;
  const grid = document.getElementById('catalog-grid');
  const demandClass = { 'Very High': 'demand-very-high', 'High': 'demand-high', 'Growing': 'demand-growing' };
  
  grid.innerHTML = cd.products.map(p => {
    const variantRows = p.variants.map(v => `
      <div class="variant-row">
        <span class="variant-size">${v.size}</span>
        <span class="variant-cost">₱${v.materialCost}</span>
        <span class="variant-cost">+₱${v.embroideryCost}</span>
        <span class="variant-price">₱${v.sellPrice}</span>
        <span class="variant-margin">${v.margin}%</span>
      </div>`).join('');
    const optionRows = p.customOptions.map(o => `
      <div class="option-item">
        <span class="option-label">${o.label}</span>
        <span class="option-add ${o.addCost === 0 ? 'free' : ''}">${o.addCost === 0 ? 'Included' : '+₱' + o.addCost}</span>
      </div>`).join('');
    const tags = p.tags.map(t => `<span class="catalog-tag">${t}</span>`).join('');
    const checklistItems = (p.orderChecklist || []).map(c => `<div class="checklist-item">${c}</div>`).join('');
    
    return `
    <div class="catalog-card">
      <div class="catalog-card-header">
        <span class="catalog-emoji">${p.emoji}</span>
        <div>
          <div class="catalog-name">${p.name}</div>
          <div class="catalog-desc">${p.description}</div>
        </div>
        <div style="margin-left:auto;display:flex;flex-direction:column;gap:6px;align-items:flex-end">
          ${p.bestseller ? '<span class="catalog-bestseller">⭐ Bestseller</span>' : ''}
          ${p.demand ? `<span class="demand-badge ${demandClass[p.demand] || ''}">${p.demand} Demand</span>` : ''}
        </div>
      </div>
      <div class="catalog-body">
        <div class="catalog-variants">
          <div class="catalog-variants-title">Variants — Cost / Sell Price / Margin</div>
          <div class="variant-row header">
            <span>Size</span><span>Material</span><span>Embroidery</span><span>Sell Price</span><span>Margin</span>
          </div>
          ${variantRows}
        </div>
        <div class="catalog-options">
          <div class="catalog-options-title">Customization Options</div>
          ${optionRows}
        </div>
        ${p.bestSupplier ? `
        <div style="margin-top:12px;padding:10px 14px;background:#EFF6FF;border-radius:8px;display:flex;align-items:center;justify-content:space-between">
          <span style="font-size:12px;color:#1D4ED8;font-weight:600">🏪 Best Supplier: ${p.bestSupplier.name}</span>
          <a href="${p.bestSupplier.link}" target="_blank" style="font-size:11px;color:#3B82F6;text-decoration:none;font-weight:600">Open →</a>
        </div>` : ''}
        ${checklistItems ? `
        <div class="order-checklist">
          <div class="checklist-title">📋 Order Checklist</div>
          ${checklistItems}
        </div>` : ''}
        <div class="catalog-tags">${tags}</div>
      </div>
    </div>`;
  }).join('');
}

function renderCompetitorPricing() {
  const cp = window.CATALOG_DATA.competitorPricing;
  document.getElementById('comp-insight').textContent = cp.insight;
  const head = document.getElementById('comp-pricing-head');
  head.innerHTML = cp.columns.map((c, i) => `<th${i===1?' class="comp-your"':''}>${c}</th>`).join('');
  const body = document.getElementById('comp-pricing-body');
  body.innerHTML = cp.rows.map(r => `
    <tr>
      <td><strong>${r.product}</strong></td>
      <td class="comp-your">${r.yours}</td>
      <td>${r.comp1}</td>
      <td>${r.comp2}</td>
      <td>${r.comp3}</td>
      <td>${r.comp4}</td>
    </tr>`).join('');
}

function renderBundles() {
  const bundles = window.CATALOG_DATA.bundleIdeas;
  document.getElementById('bundles-grid').innerHTML = bundles.map(b => `
    <div class="bundle-card">
      <div class="bundle-name">${b.name}</div>
      <div class="bundle-items">${b.items.join(' + ')}</div>
      <div class="bundle-pricing">
        <span class="bundle-price">₱${b.bundlePrice.toLocaleString()}</span>
        <span class="bundle-normal">₱${b.normalPrice.toLocaleString()}</span>
      </div>
      <div style="display:flex;gap:8px;align-items:center">
        <span class="bundle-savings">Save ₱${b.savings}</span>
        <span class="bundle-tag">${b.tag}</span>
      </div>
    </div>`).join('');
}

// ===== V2: GRADUATION COUNTDOWN =====
function updateGradCountdown() {
  const el = document.getElementById('grad-countdown');
  if (!el) return;
  const now = new Date();
  const gradStart = new Date(2026, 2, 1); // March 1, 2026
  const diff = gradStart - now;
  const days = Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  el.textContent = days === 0 ? 'NOW!' : days === 1 ? '1 day' : `${days} days`;
}

// ===== V2: SEASONAL ALERTS =====
function renderSeasonalAlerts() {
  if (!window.SEASONAL_ALERTS) return;
  const container = document.getElementById('seasonal-alerts');
  if (!container) return;
  
  const alertIcons = { hot: '🔥', coming: '⚡', rising: '📈' };
  
  container.innerHTML = window.SEASONAL_ALERTS.alerts.map(a => `
    <div class="seasonal-alert urgency-${a.urgency}">
      <span class="alert-icon">${alertIcons[a.urgency] || '📢'}</span>
      <div class="alert-content">
        <div class="alert-header">
          <span class="alert-name">${a.name}</span>
          <span class="alert-urgency">${a.urgencyLabel}</span>
        </div>
        <div class="alert-desc">${a.description}</div>
        <div class="alert-action">${a.action}</div>
      </div>
    </div>
  `).join('');
}

// ===== V2: COMPETITOR DEEP-DIVE =====
function renderCompetitorDeepDive() {
  const data = window.COMPETITOR_DETAIL;
  if (!data) return;
  const grid = document.getElementById('competitor-detail-grid');
  if (!grid) return;
  
  grid.innerHTML = data.competitors.map(c => {
    const threatClass = c.threat.toLowerCase();
    const advantages = c.yourAdvantages.map(a => `<li class="comp-adv-item">${a}</li>`).join('');
    
    return `
    <div class="competitor-detail-card">
      <div class="comp-detail-header">
        <span class="comp-detail-name">${c.name}</span>
        <span class="comp-detail-platform">${c.platformIcon} ${c.platform}</span>
      </div>
      <div class="comp-detail-body">
        <div class="comp-detail-row">
          <span class="comp-detail-label">Followers</span>
          <span class="comp-detail-value">${c.followers}</span>
        </div>
        <div class="comp-detail-row">
          <span class="comp-detail-label">Focus</span>
          <span class="comp-detail-value">${c.focus}</span>
        </div>
        <div class="comp-detail-row">
          <span class="comp-detail-label">Weakness</span>
          <span class="comp-detail-value" style="color:#DC2626">⚠️ ${c.weakness}</span>
        </div>
        <div class="comp-detail-row">
          <span class="comp-detail-label">Threat</span>
          <span class="comp-detail-threat threat-${threatClass}">${c.threat}</span>
        </div>
        <div class="comp-detail-advantages">
          <div class="comp-adv-title">✓ Your Advantages</div>
          <ul class="comp-adv-list">${advantages}</ul>
        </div>
      </div>
    </div>`;
  }).join('');
}

function renderThreatMatrix() {
  const data = window.COMPETITOR_DETAIL;
  if (!data) return;
  const matrix = document.getElementById('threat-matrix');
  const legend = document.getElementById('matrix-legend');
  if (!matrix || !legend) return;
  
  // Add dots for each competitor
  const dots = data.competitors.map(c => {
    const x = (c.marketReach / 100) * 100;
    const y = 100 - (c.productOverlap / 100) * 100;
    const threatClass = c.threat.toLowerCase();
    return `<div class="matrix-dot threat-${threatClass}" 
                 style="left:${x}%;top:${y}%"
                 title="${c.name}: ${c.marketReach}% reach, ${c.productOverlap}% overlap"></div>`;
  }).join('');
  
  matrix.insertAdjacentHTML('beforeend', dots);
  
  // Render legend
  legend.innerHTML = data.competitors.map(c => {
    const threatClass = c.threat.toLowerCase();
    const dotColor = { high: '#DC2626', medium: '#F59E0B', low: '#22C55E' }[threatClass] || '#718096';
    return `
    <div class="matrix-legend-item">
      <span class="legend-dot" style="background:${dotColor}"></span>
      <span class="legend-name">${c.name}</span>
      <span class="legend-threat threat-${threatClass}">${c.threat}</span>
    </div>`;
  }).join('');
}

function renderAdvantages() {
  const data = window.COMPETITOR_DETAIL;
  if (!data) return;
  const list = document.getElementById('advantages-list');
  if (!list) return;
  
  list.innerHTML = data.yourEdges.map(edge => {
    const icon = edge.charAt(0);
    const text = edge.substring(2).trim();
    return `
    <div class="advantage-item">
      <span class="advantage-icon">${icon}</span>
      <span class="advantage-text">${text}</span>
    </div>`;
  }).join('');
}

// ===== V2: PRICING CALCULATOR =====
function initPricingCalculator() {
  const itemSelect = document.getElementById('calc-item');
  const qtyInput = document.getElementById('calc-qty');
  const complexitySelect = document.getElementById('calc-complexity');
  
  if (!itemSelect || !qtyInput || !complexitySelect) return;
  
  const calculate = () => {
    const data = window.PRICING_DATA;
    const itemKey = itemSelect.value;
    const qty = Math.max(1, parseInt(qtyInput.value) || 1);
    const complexity = complexitySelect.value;
    
    const item = data.items[itemKey];
    if (!item) return;
    
    const multiplier = item.complexityMultiplier[complexity] || 1;
    const laborCost = item.baseLabor * multiplier;
    const unitCost = item.materialCost + laborCost;
    
    // Apply bulk discount
    let discount = 1;
    if (qty >= 20) discount = item.bulkDiscounts[20];
    else if (qty >= 10) discount = item.bulkDiscounts[10];
    else if (qty >= 5) discount = item.bulkDiscounts[5];
    
    const basePrice = item.suggestedPrice * multiplier;
    const unitPrice = Math.round(basePrice * discount);
    const totalCost = unitCost * qty;
    const totalRevenue = unitPrice * qty;
    const totalProfit = totalRevenue - totalCost;
    const margin = Math.round((totalProfit / totalRevenue) * 100);
    
    // Render results
    document.getElementById('calc-results').innerHTML = `
      <div class="calc-result-item">
        <div class="calc-result-label">Unit Cost</div>
        <div class="calc-result-value">₱${unitCost.toLocaleString()}</div>
      </div>
      <div class="calc-result-item">
        <div class="calc-result-label">Suggested Price</div>
        <div class="calc-result-value highlight">₱${unitPrice.toLocaleString()}</div>
      </div>
      <div class="calc-result-item">
        <div class="calc-result-label">Est. Profit (${qty}pc)</div>
        <div class="calc-result-value profit">₱${totalProfit.toLocaleString()}</div>
      </div>
      <div class="calc-result-item">
        <div class="calc-result-label">Margin</div>
        <div class="calc-result-value profit">${margin}%</div>
      </div>
    `;
    
    // Render price comparison
    const compAvg = item.competitorAvg * multiplier;
    const savings = Math.round(compAvg - unitPrice);
    const savingsPercent = Math.round((savings / compAvg) * 100);
    const maxPrice = compAvg * 1.1;
    const yoursWidth = Math.min(100, (unitPrice / maxPrice) * 100);
    const compWidth = Math.min(100, (compAvg / maxPrice) * 100);
    
    document.getElementById('price-comparison').innerHTML = `
      <div class="price-bar-wrap">
        <div class="price-bar-label">
          <span>Your Price</span>
          <span style="color:#22C55E">₱${unitPrice.toLocaleString()}</span>
        </div>
        <div class="price-bar">
          <div class="price-bar-fill yours" style="width:${yoursWidth}%"></div>
        </div>
      </div>
      <div class="price-bar-wrap">
        <div class="price-bar-label">
          <span>Competitor Avg</span>
          <span style="color:#E94560">₱${Math.round(compAvg).toLocaleString()}</span>
        </div>
        <div class="price-bar">
          <div class="price-bar-fill competitor" style="width:${compWidth}%"></div>
        </div>
      </div>
      <div class="price-savings">
        <div class="price-savings-text">💰 You're ₱${savings} cheaper (${savingsPercent}% below competitor avg)</div>
      </div>
    `;
    
    // Render bulk tiers
    document.getElementById('bulk-tiers').innerHTML = [1, 5, 10, 20].map((tierQty, i) => {
      const tierDiscount = tierQty >= 20 ? item.bulkDiscounts[20] : 
                           tierQty >= 10 ? item.bulkDiscounts[10] :
                           tierQty >= 5 ? item.bulkDiscounts[5] : 1;
      const tierPrice = Math.round(basePrice * tierDiscount);
      const discountPct = tierDiscount < 1 ? Math.round((1 - tierDiscount) * 100) : 0;
      const isBest = i === 3;
      
      return `
      <div class="bulk-tier ${isBest ? 'best' : ''}">
        <div class="bulk-qty">${tierQty}${tierQty >= 20 ? '+' : ''}</div>
        <div class="bulk-label">${tierQty === 1 ? 'piece' : 'pieces'}</div>
        <div class="bulk-price">₱${tierPrice}/pc</div>
        ${discountPct > 0 ? `<div class="bulk-discount">-${discountPct}%</div>` : ''}
      </div>`;
    }).join('');
  };
  
  itemSelect.addEventListener('change', calculate);
  qtyInput.addEventListener('input', calculate);
  complexitySelect.addEventListener('change', calculate);
  
  calculate(); // Initial calculation
}

// ===== V2: PRODUCT RECOMMENDATIONS =====
function renderRecommendations() {
  const data = window.CATALOG_DATA;
  if (!data) return;
  const container = document.getElementById('rec-products');
  if (!container) return;
  
  // Score products by margin + demand
  const scored = data.products.map(p => {
    const avgMargin = p.variants.reduce((sum, v) => sum + v.margin, 0) / p.variants.length;
    const demandScore = p.bestseller ? 10 : 5;
    return { ...p, score: avgMargin + demandScore, avgMargin };
  }).sort((a, b) => b.score - a.score).slice(0, 3);
  
  container.innerHTML = scored.map((p, i) => `
    <div class="rec-product">
      <span class="rec-product-rank">#${i + 1}</span>
      <div class="rec-product-name">${p.emoji} ${p.name}</div>
      <div class="rec-product-stats">
        <span class="rec-product-stat">Margin: <strong>${Math.round(p.avgMargin)}%</strong></span>
        <span class="rec-product-stat">Price: <strong>₱${p.basePrice}–₱${p.maxPrice}</strong></span>
        ${p.bestseller ? '<span class="rec-product-stat" style="color:#E94560">⭐ Bestseller</span>' : ''}
      </div>
    </div>
  `).join('');
}

// ===== V2: CALENDAR UPGRADES =====
let selectedCalDay = null;

function renderCalendar() {
  const cd = window.CALENDAR_DATA;
  document.getElementById('cal-month-title').textContent = cd.month + ' ' + cd.year;
  const grid = document.getElementById('cal-grid');
  
  const days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  let html = days.map(d => `<div class="cal-day-label">${d}</div>`).join('');
  
  const firstDay = new Date(cd.year, cd.monthNum - 1, 1).getDay();
  const totalDays = new Date(cd.year, cd.monthNum, 0).getDate();
  
  const postsByDay = {};
  cd.posts.forEach(p => {
    if (!postsByDay[p.day]) postsByDay[p.day] = [];
    postsByDay[p.day].push(p);
  });
  const holidaysByDay = {};
  cd.holidays.forEach(h => { holidaysByDay[h.date] = h; });
  
  // Pillar color mapping
  const pillarColors = {
    'tease': 'pillar-art-gifting',
    'product': 'pillar-art-gifting',
    'giftinspo': 'pillar-inspo',
    'process': 'pillar-craft',
    'engagement': 'pillar-filipino',
    'brand': 'pillar-brand',
    'promo': 'pillar-promo'
  };
  
  for (let i = 0; i < firstDay; i++) html += `<div class="cal-cell empty"></div>`;
  
  for (let d = 1; d <= totalDays; d++) {
    const posts = postsByDay[d] || [];
    const holiday = holidaysByDay[d];
    const hasHoliday = !!holiday;
    const hasPosts = posts.length > 0;
    let cls = 'cal-cell';
    if (hasHoliday) cls += ' has-holiday';
    else if (hasPosts) cls += ' has-posts';
    
    const pips = posts.slice(0, 3).map(p => {
      const pillarClass = pillarColors[p.pillar] || 'pillar-brand';
      const icon = { Instagram: '📸', TikTok: '🎵', Facebook: '👥' }[p.platform] || '📱';
      return `<div class="cal-pillar-pip ${pillarClass}">${icon} ${p.pillar}</div>`;
    }).join('');
    
    html += `<div class="${cls}" onclick="selectCalDay(${d})" data-day="${d}">
      <div class="cal-date">${d}</div>
      ${hasHoliday ? `<div class="cal-holiday-tag">${holiday.name}</div>` : ''}
      ${pips}
    </div>`;
  }
  
  grid.innerHTML = html;
}

function selectCalDay(day) {
  const cd = window.CALENDAR_DATA;
  const posts = cd.posts.filter(p => p.day === day);
  const panel = document.getElementById('cal-side-panel');
  const panelDay = document.getElementById('cal-panel-day');
  const panelStatus = document.getElementById('cal-panel-status');
  const panelContent = document.getElementById('cal-panel-content');
  
  // Update selected state
  document.querySelectorAll('.cal-cell').forEach(c => c.classList.remove('selected'));
  const cell = document.querySelector(`.cal-cell[data-day="${day}"]`);
  if (cell) cell.classList.add('selected');
  
  panelDay.textContent = `${cd.month} ${day}`;
  
  if (posts.length === 0) {
    panelStatus.textContent = 'No posts';
    panelStatus.className = 'cal-panel-status';
    panelContent.innerHTML = `<p class="cal-panel-hint">No content scheduled for this day</p>`;
    return;
  }
  
  const status = posts[0].status || 'planned';
  panelStatus.textContent = status.charAt(0).toUpperCase() + status.slice(1);
  panelStatus.className = `cal-panel-status ${status}`;
  
  panelContent.innerHTML = posts.map(p => `
    <div class="cal-panel-section">
      <div class="cal-panel-label">${p.platform} · ${p.type}</div>
      <div class="cal-panel-text" style="margin-bottom:8px"><strong>${p.time}</strong> · ${p.pillar}</div>
    </div>
    <div class="cal-panel-section">
      <div class="cal-panel-label">Caption</div>
      <div class="cal-panel-caption">${escHtml(p.caption || '')}</div>
    </div>
    ${p.visualNote ? `
    <div class="cal-panel-section">
      <div class="cal-panel-label">Visual Note</div>
      <div class="cal-panel-visual">${escHtml(p.visualNote)}</div>
    </div>` : ''}
    ${p.cta ? `
    <div class="cal-panel-section">
      <div class="cal-panel-label">CTA</div>
      <div class="cal-panel-text" style="color:#E94560;font-weight:600">➡️ ${escHtml(p.cta)}</div>
    </div>` : ''}
  `).join('<hr style="margin:16px 0;border:none;border-top:1px dashed #E8ECF0">');
}

function renderCalendarTable() {
  const cd = window.CALENDAR_DATA;
  const platIcon = { Instagram: '📸', TikTok: '🎵', Facebook: '👥' };
  const platBadge = { Instagram: 'cp-instagram', TikTok: 'cp-tiktok', Facebook: 'cp-facebook' };
  const pillarColors = { tease:'pillar-tease', process:'pillar-process', product:'pillar-product',
    giftinspo:'pillar-giftinspo', engagement:'pillar-engagement', brand:'pillar-brand', promo:'pillar-promo' };
  const statusClass = { draft: 'status-draft', ready: 'status-ready', posted: 'status-posted', planned: 'status-planned' };
  
  const tbody = document.getElementById('cal-body');
  let rows = '';
  cd.posts.forEach((p, i) => {
    const rowId = 'calrow-' + i;
    const preview = (p.caption || '').split('\n')[0].substring(0, 50) + '…';
    const status = p.status || 'planned';
    rows += `<tr class="cal-table-row" onclick="toggleCalRow(${i})" style="cursor:pointer">
      <td><strong style="color:#E94560">${cd.month.substring(0,3)} ${p.day}</strong></td>
      <td><span class="caption-platform ${platBadge[p.platform]}">${platIcon[p.platform]} ${p.platform}</span></td>
      <td style="font-size:12px;color:#4A5568">${p.type || '—'}</td>
      <td style="font-size:12px;color:#718096">${p.time}</td>
      <td><span class="caption-pillar-tag ${pillarColors[p.pillar] || ''}">${p.pillar}</span></td>
      <td><span class="status-badge ${statusClass[status]}">${status}</span></td>
      <td style="font-size:12.5px;color:#4A5568;max-width:250px">${preview}</td>
    </tr>
    <tr id="${rowId}" class="cal-caption-expand">
      <td colspan="7" style="padding:0">
        <div style="padding:14px 20px 16px">
          <div class="cal-caption-box">${(p.caption||'').replace(/\n/g,'<br>')}</div>
          ${p.visualNote ? `<div class="cal-visual-note">${p.visualNote}</div>` : ''}
          ${p.cta ? `<div><span class="cal-cta-tag">CTA: ${p.cta}</span></div>` : ''}
        </div>
      </td>
    </tr>`;
  });
  tbody.innerHTML = rows;
}

// ===== ETHEL INTELLIGENCE SECTIONS =====

function renderProductOpportunities() {
  if (!window.PRODUCT_OPPORTUNITIES || window.PRODUCT_OPPORTUNITIES.length === 0) {
    document.getElementById('opportunities-grid').innerHTML = '<p style="color:#64748B;text-align:center;padding:40px">No opportunities discovered yet. Ethel is analyzing...</p>';
    return;
  }
  
  const demandBadge = {
    'High': '<span style="background:#10B981;color:#fff;padding:4px 10px;border-radius:6px;font-size:11px;font-weight:600">HIGH DEMAND</span>',
    'Medium': '<span style="background:#F59E0B;color:#fff;padding:4px 10px;border-radius:6px;font-size:11px;font-weight:600">MEDIUM</span>',
    'Low': '<span style="background:#64748B;color:#fff;padding:4px 10px;border-radius:6px;font-size:11px;font-weight:600">LOW</span>'
  };
  
  const grid = document.getElementById('opportunities-grid');
  grid.innerHTML = window.PRODUCT_OPPORTUNITIES.map(opp => `
    <div class="opportunity-card">
      <div style="display:flex;justify-content:space-between;align-items:start;margin-bottom:10px">
        <h3 style="font-size:16px;font-weight:700;color:#1E293B;margin:0">${opp.product}</h3>
        ${demandBadge[opp.demandLevel] || ''}
      </div>
      <div style="font-size:13px;color:#64748B;margin-bottom:8px">Source: ${opp.source}</div>
      <div style="font-size:14px;color:#475569;margin-bottom:8px"><strong>Suggested Price:</strong> ${opp.suggestedPriceRange}</div>
      <div style="font-size:13px;color:${opp.supplierFound ? '#10B981' : '#DC2626'};font-weight:600">
        ${opp.supplierFound ? '✅ Supplier found' : '⚠️ Supplier needed'}
      </div>
    </div>
  `).join('');
}

function renderSupplierIntelligence() {
  if (!window.SUPPLIERS || window.SUPPLIERS.length === 0) {
    document.getElementById('suppliers-cards-grid').innerHTML = '<p style="color:#64748B;text-align:center;padding:40px">No suppliers found yet. Ethel is searching...</p>';
    return;
  }
  
  // Update stats bar
  const suppliers = window.SUPPLIERS;
  const totalSuppliers = suppliers.length;
  const avgPrice = 'Calculating...'; // Could calculate from price ranges
  const lowestMOQ = Math.min(...suppliers.map(s => s.moq || Infinity));
  const activePromos = suppliers.filter(s => s.isPromoActive).length;
  
  document.getElementById('total-suppliers').textContent = totalSuppliers;
  document.getElementById('avg-price').textContent = avgPrice;
  document.getElementById('lowest-moq').textContent = lowestMOQ === Infinity ? '—' : lowestMOQ;
  document.getElementById('active-promos').textContent = activePromos;
  document.getElementById('ethel-updated').textContent = 'Just now';
  
  // Render supplier cards
  const platformBadge = {
    'Shopee': '<span style="background:#EE4D2D;color:#fff;padding:3px 8px;border-radius:4px;font-size:11px;font-weight:600">Shopee</span>',
    'Lazada': '<span style="background:#0F156D;color:#fff;padding:3px 8px;border-radius:4px;font-size:11px;font-weight:600">Lazada</span>',
    'Direct': '<span style="background:#8B5CF6;color:#fff;padding:3px 8px;border-radius:4px;font-size:11px;font-weight:600">Direct</span>'
  };
  
  const grid = document.getElementById('suppliers-cards-grid');
  grid.innerHTML = suppliers.map(sup => `
    <div class="supplier-intel-card" data-products="${(sup.products || []).join(',')}">
      ${sup.isPromoActive ? '<div class="promo-banner">🔥 PROMO ACTIVE</div>' : ''}
      <div style="display:flex;justify-content:space-between;align-items:start;margin-bottom:10px">
        <h3 style="font-size:16px;font-weight:700;color:#1E293B;margin:0">${sup.name}</h3>
        ${platformBadge[sup.platform] || ''}
      </div>
      <div style="margin-bottom:10px">
        ${(sup.products || []).map(p => `<span style="background:#F1F5F9;color:#475569;padding:3px 8px;border-radius:4px;font-size:11px;margin-right:6px;display:inline-block;margin-bottom:4px">${p}</span>`).join('')}
      </div>
      <div style="font-size:13px;color:#64748B;margin-bottom:6px"><strong>Price/pc:</strong> ${sup.pricePerPiece}</div>
      <div style="font-size:13px;color:#64748B;margin-bottom:6px"><strong>MOQ:</strong> ${sup.moq}</div>
      <div style="font-size:13px;color:#64748B;margin-bottom:10px"><strong>Location:</strong> ${sup.location}</div>
      <div style="display:flex;justify-content:space-between;align-items:center">
        <div style="color:#F59E0B;font-size:14px">★ ${sup.rating}</div>
        <a href="${sup.url}" target="_blank" class="view-store-btn">View Store →</a>
      </div>
    </div>
  `).join('');
  
  // Setup filter buttons
  document.querySelectorAll('.filter-pill').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-pill').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      document.querySelectorAll('.supplier-intel-card').forEach(card => {
        if (filter === 'all' || card.dataset.products.includes(filter)) {
          card.style.display = 'block';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

// ===== NAV UPDATES =====
// Override setupNav to include new pages
