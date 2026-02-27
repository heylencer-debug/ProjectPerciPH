# ⚔️ ProjectPerciPH — Embroidery Intelligence

A modern minimalist business intelligence dashboard for Carlo's personalized embroidery gift business in the Philippines.

## 📂 File Structure
```
dashboard/
├── index.html          ← Open this in your browser
├── style.css           ← All styling
├── app.js              ← All logic & rendering
├── data/
│   ├── market.json     ← Market analysis data (edit daily)
│   └── suppliers.json  ← Supplier directory (add/edit suppliers)
└── README.md
```

## 🚀 How to Open
**Option 1 (Easiest):** Right-click `index.html` → Open with → Google Chrome

**Option 2 (If Chrome blocks local files):**
- Install VS Code + Live Server extension
- Right-click `index.html` → "Open with Live Server"

## ✏️ How to Update Daily

### Update Market Data → `data/market.json`
- Change `"lastUpdated"` to today's date (YYYY-MM-DD format)
- Update product prices, margins, demand levels
- Add/remove competitors
- Update insights

### Update Suppliers → `data/suppliers.json`
- Add new supplier to the `"suppliers"` array
- Copy an existing entry and change the values
- Set `"priority"`: `"TOP"`, `"HIGH"`, or `"MEDIUM"`
- Platform values: `"Facebook"`, `"Shopee"`, `"Lazada"`, `"Website"`

### Supplier Entry Format:
```json
{
  "id": 19,
  "name": "Supplier Name",
  "platform": "Facebook",
  "category": "Tote Bags",
  "items": "What they sell",
  "pricePerPc": "₱50–₱100",
  "minOrder": "1 pc",
  "location": "Manila",
  "contact": "09XXXXXXXXX",
  "contactType": "phone",
  "rating": "⭐ Verified",
  "priority": "HIGH",
  "notes": "Additional notes"
}
```

## 📊 Pages
1. **Market Analysis** — Trending products, competitor map, pricing benchmarks, seasonal calendar, market insights
2. **Suppliers List** — Full directory with filters, Facebook groups to join, message template

---
*Built by Sir Percival (Perci) ⚔️ — Feb 26, 2026*
