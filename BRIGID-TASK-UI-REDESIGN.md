You are Brigid, Project Percy PH's dashboard developer.
Workspace: C:\Users\Carl Rebadomia\.openclaw\workspace\dashboard\

## TASK: Redesign ProjectPercyPH dashboard to GenZ Bold Minimalist UI

## BRAND
Project Percy PH — personalized embroidery + engraving gifts, Cebu PH. GenZ aesthetic.

## UI DIRECTION: GenZ Bold Minimalist / Wireframe
- Background: #0A0A0A (near-black)
- Text: #F0F0F0 (off-white)
- Primary accent: #FF6B6B (electric coral)
- Secondary accent: #8B5CF6 (purple)
- Cards: #141414 background, 1px border rgba(255,255,255,0.08), border-radius 4px max
- NO box shadows, NO gradients on containers
- Typography: Inter (load via CDN), heavy contrast — big bold uppercase headers, small tight body text
- Borders: thin 1px #222 — wireframe skeleton feel
- Buttons: outlined (border 1px solid #FF6B6B, color #FF6B6B, bg transparent) secondary; filled (#FF6B6B bg, #000 text bold) primary
- Tables: borderless rows, thin bottom border #222 per row, uppercase column headers with letter-spacing
- Badges/pills: mono-style, tight padding, outlined, not bubbly
- Sidebar: #0A0A0A, thin right border #1A1A1A, nav items plain text, active = 3px left border #FF6B6B
- Stats numbers: HUGE (48-64px bold), tiny label below
- Spacing: generous — let things breathe
- NO: gradients, glow, skeuomorphism, emojis in UI, pastel colors, corporate blue

## SPECIFIC CHANGES

### style.css — Full Redesign
Rewrite to match the direction above. Keep all existing class names. Add new ones as needed.
Load Inter font: @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');

### index.html — Add Ethel Activity Feed to Home page
Find the home/overview section (id="home" or similar).
Add at the bottom of the home section:

```html
<section class="ethel-feed-section">
  <div class="section-header">
    <span class="section-label">AGENT ACTIVITY</span>
    <h2 class="section-title">ETHEL FEED</h2>
  </div>
  <table class="data-table" id="ethel-feed-table">
    <thead>
      <tr>
        <th>TIME</th>
        <th>ACTION</th>
        <th>SUMMARY</th>
      </tr>
    </thead>
    <tbody id="ethel-feed-body">
      <tr><td colspan="3" style="text-align:center;color:#666;padding:24px">Loading...</td></tr>
    </tbody>
  </table>
</section>
```

### app.js — Add renderEthelFeed()
Add this function (write it carefully, valid JS only):

async function renderEthelFeed() {
  const SB_URL = 'https://fhfqjcvwcxizbioftvdw.supabase.co';
  const SB_KEY = 'REDACTED_SUPABASE_KEY';
  try {
    const res = await fetch(SB_URL + '/rest/v1/agent_activity?agent=eq.ethel&order=created_at.desc&limit=20', {
      headers: { 'apikey': SB_KEY, 'Authorization': 'Bearer ' + SB_KEY }
    });
    const rows = await res.json();
    const tbody = document.getElementById('ethel-feed-body');
    if (!tbody || !Array.isArray(rows)) return;
    if (rows.length === 0) {
      tbody.innerHTML = '<tr><td colspan="3" style="text-align:center;color:#666;padding:24px">No Ethel activity yet.</td></tr>';
      return;
    }
    tbody.innerHTML = rows.map(function(r) {
      const ts = new Date(r.created_at).toLocaleString('en-PH', {timeZone: 'Asia/Manila'});
      const action = r.action || '—';
      const summary = r.summary || r.details || '—';
      return '<tr><td>' + ts + '</td><td>' + action + '</td><td>' + summary + '</td></tr>';
    }).join('');
  } catch(e) {
    console.error('Ethel feed error:', e);
  }
}

Call renderEthelFeed() inside the init() or boot() function.
Also set: setInterval(renderEthelFeed, 60000);

## PUSH TO GITHUB
After all edits, push using push-file.js (located at dashboard/push-file.js).
Run from C:\Users\Carl Rebadomia\.openclaw\workspace\dashboard\

Commands:
  node push-file.js "style.css" "style.css" "redesign: GenZ bold minimalist dark UI"
  node push-file.js "app.js" "app.js" "feat: Ethel activity feed on home page"
  node push-file.js "index.html" "index.html" "feat: Ethel feed section added to home"

## RULES
- Read style.css, index.html, app.js fully before editing
- Preserve all existing functionality — visual changes only + add Ethel feed
- Keep all existing IDs and class names
- Dark mode only
- Report the 3 commit hashes when done

When completely done, run:
openclaw system event --text "Brigid done: ProjectPercyPH redesigned to GenZ bold minimalist + Ethel feed live"
