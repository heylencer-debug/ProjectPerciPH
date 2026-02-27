// ProjectPerciPH — Product Catalog & Pricing Data
// Edit this file to update your products, costs, and prices

window.CATALOG_DATA = {
  lastUpdated: "2026-02-26",
  currency: "PHP",

  products: [
    {
      id: 1,
      emoji: "🛍️",
      name: "Personalized Tote Bag",
      category: "Tote Bags",
      description: "Premium canvas tote with custom embroidery. Perfect for birthdays, souvenirs, and daily use.",
      variants: [
        { size: "Small",  materialCost: 120, embroideryCost: 30, packagingCost: 25, totalCost: 175, sellPrice: 550,  margin: 68 },
        { size: "Medium", materialCost: 150, embroideryCost: 35, packagingCost: 25, totalCost: 210, sellPrice: 650,  margin: 68 },
        { size: "Large",  materialCost: 190, embroideryCost: 40, packagingCost: 30, totalCost: 260, sellPrice: 750,  margin: 65 }
      ],
      basePrice: 550,
      maxPrice: 750,
      customOptions: [
        { label: "Name only (up to 10 chars)", addCost: 0 },
        { label: "Name + Tagline",              addCost: 50 },
        { label: "Monogram (3 initials)",        addCost: 30 },
        { label: "Logo/custom design",           addCost: 150 }
      ],
      leadTimeDays: "3–5",
      bestseller: true,
      demand: "High",
      demandScore: 9,
      tags: ["birthday", "souvenir", "everyday", "women"],
      bestSupplier: { name: "House of Canvas Ph", link: "https://facebook.com/houseofcanvasph" },
      orderChecklist: [
        "Source: House of Canvas Ph (₱30-55/pc)",
        "Embroidery: Name/monogram (simple)",
        "Packaging: Kraft box + tissue paper",
        "Retail: ₱550-750"
      ]
    },
    {
      id: 2,
      emoji: "🧴",
      name: "Monogrammed Towel Set",
      category: "Towels",
      description: "Soft premium cotton towel with embroidered name or monogram. Great for bridal, birthday, and wellness gifts.",
      variants: [
        { size: "Hand Towel",     materialCost: 150, embroideryCost: 40, packagingCost: 35, totalCost: 225, sellPrice: 650,  margin: 65 },
        { size: "Bath Towel",     materialCost: 250, embroideryCost: 45, packagingCost: 40, totalCost: 335, sellPrice: 850,  margin: 61 },
        { size: "Set (Hand+Bath)",materialCost: 380, embroideryCost: 60, packagingCost: 50, totalCost: 490, sellPrice: 1100, margin: 55 }
      ],
      basePrice: 650,
      maxPrice: 1100,
      customOptions: [
        { label: "Name only",     addCost: 0 },
        { label: "Monogram",      addCost: 30 },
        { label: "Initials",      addCost: 0 },
        { label: "Short message", addCost: 80 }
      ],
      leadTimeDays: "3–5",
      bestseller: true,
      demand: "Very High",
      demandScore: 10,
      tags: ["bridal", "birthday", "wedding", "wellness", "women"],
      bestSupplier: { name: "Lexan Cotton (Lazada)", link: "https://www.lazada.com.ph/tag/cotton-towel-handkerchief-unisex/" },
      orderChecklist: [
        "Source: Lexan/Lazada (₱62-96/pc)",
        "Embroidery: Name/monogram",
        "Packaging: Gift box + ribbon",
        "Retail: ₱650-1,100"
      ]
    },
    {
      id: 3,
      emoji: "🧢",
      name: "Embroidered Cap",
      category: "Caps",
      description: "Classic structured cap with embroidered name, initials, or short text. Unisex and streetwear-ready.",
      variants: [
        { size: "Standard", materialCost: 160, embroideryCost: 45, packagingCost: 20, totalCost: 225, sellPrice: 600, margin: 63 },
        { size: "Premium",  materialCost: 220, embroideryCost: 50, packagingCost: 25, totalCost: 295, sellPrice: 800, margin: 63 }
      ],
      basePrice: 600,
      maxPrice: 800,
      customOptions: [
        { label: "Name (front)",         addCost: 0 },
        { label: "Initials (front)",     addCost: 0 },
        { label: "Logo (front)",         addCost: 120 },
        { label: "Name + back text",     addCost: 60 }
      ],
      leadTimeDays: "3–5",
      bestseller: false,
      demand: "High",
      demandScore: 8,
      tags: ["birthday", "streetwear", "men", "unisex", "souvenir"],
      bestSupplier: { name: "Towel Republic PH", link: "https://facebook.com/TowelRepublicPH" },
      orderChecklist: [
        "Source: Towel Republic PH (₱220/pc w/ embroidery)",
        "Embroidery: Name/initials (front)",
        "Packaging: Poly bag + tag",
        "Retail: ₱600-800"
      ]
    },
    {
      id: 4,
      emoji: "👔",
      name: "Custom Embroidered Polo",
      category: "Polo Shirts",
      description: "Premium polo shirt with embroidered name, monogram, or company logo. Perfect for corporate, graduation, and events.",
      variants: [
        { size: "S–L",  materialCost: 280, embroideryCost: 60, packagingCost: 35, totalCost: 375, sellPrice: 900,  margin: 58 },
        { size: "XL–2XL", materialCost: 320, embroideryCost: 65, packagingCost: 40, totalCost: 425, sellPrice: 1050, margin: 60 },
        { size: "3XL+",   materialCost: 380, embroideryCost: 70, packagingCost: 40, totalCost: 490, sellPrice: 1200, margin: 59 }
      ],
      basePrice: 900,
      maxPrice: 1200,
      customOptions: [
        { label: "Name only",             addCost: 0 },
        { label: "Name + position title", addCost: 60 },
        { label: "Company logo",          addCost: 150 },
        { label: "Event logo",            addCost: 150 }
      ],
      leadTimeDays: "5–7",
      bestseller: false,
      demand: "Growing",
      demandScore: 7,
      tags: ["corporate", "graduation", "events", "men", "bulk"],
      bestSupplier: { name: "YJJ Merchandise & Co.", link: "https://facebook.com" },
      orderChecklist: [
        "Source: YJJ Merchandise (₱80-180/pc blank)",
        "Embroidery: Name/logo (chest)",
        "Packaging: Poly sleeve + hanger",
        "Retail: ₱900-1,200"
      ]
    },
    {
      id: 5,
      emoji: "🧣",
      name: "Embroidered Handkerchief",
      category: "Handkerchiefs",
      description: "Premium cotton handkerchief with custom embroidery. Highest margin item — perfect for souvenirs and bulk orders.",
      variants: [
        { size: "Standard", materialCost: 30, embroideryCost: 25, packagingCost: 10, totalCost: 65, sellPrice: 200, margin: 68 },
        { size: "Set of 3",  materialCost: 80, embroideryCost: 60, packagingCost: 25, totalCost: 165, sellPrice: 500, margin: 67 }
      ],
      basePrice: 200,
      maxPrice: 500,
      customOptions: [
        { label: "Initials only",     addCost: 0 },
        { label: "Name",              addCost: 0 },
        { label: "Monogram design",   addCost: 20 }
      ],
      leadTimeDays: "2–3",
      bestseller: false,
      demand: "Growing",
      demandScore: 7,
      tags: ["souvenir", "wedding", "corporate", "bulk"],
      bestSupplier: { name: "Lazada Handkerchief Wholesale", link: "https://www.lazada.com.ph/tag/handkerchief-wholesale/" },
      orderChecklist: [
        "Source: Lazada wholesale (₱8-15/pc)",
        "Embroidery: Initials/monogram",
        "Packaging: Simple sleeve",
        "Retail: ₱200-500"
      ]
    }
  ],

  competitorPricing: {
    columns: ["Product", "Your Price", "Stitched Lab", "Jmigs", "Keepsakes.ph", "UNIQLO Custom"],
    rows: [
      { product: "🛍️ Tote Bag",    yours: "₱550–₱750",  comp1: "₱800–₱1,200", comp2: "₱450–₱700", comp3: "₱750–₱1,100", comp4: "₱850+" },
      { product: "🧴 Towel Set",    yours: "₱650–₱1,100", comp1: "₱900–₱1,400", comp2: "₱600–₱900", comp3: "₱900–₱1,500", comp4: "N/A" },
      { product: "🧢 Cap",          yours: "₱600–₱800",  comp1: "₱700–₱1,000", comp2: "₱500–₱750", comp3: "₱700–₱1,000", comp4: "₱700+" },
      { product: "👔 Polo Shirt",   yours: "₱900–₱1,200", comp1: "₱1,100–₱1,500",comp2: "₱800–₱1,100",comp3: "₱1,000–₱1,400", comp4: "₱1,200+" }
    ],
    insight: "You're priced 15–30% below major competitors while maintaining premium packaging. This is your competitive edge — don't undervalue."
  },

  bundleIdeas: [
    { name: "Birthday Bestie Bundle 🎂", items: ["Tote Bag (M)", "Hand Towel"], bundlePrice: 1100, normalPrice: 1300, savings: 200, tag: "Popular" },
    { name: "Bridal Shower Set 💍",      items: ["Bath Towel Set", "Tote Bag (S)"], bundlePrice: 1500, normalPrice: 1750, savings: 250, tag: "Wedding" },
    { name: "Corporate Starter Pack 💼",  items: ["Polo Shirt", "Cap"], bundlePrice: 1400, normalPrice: 1600, savings: 200, tag: "B2B" },
    { name: "Full Gift Box ✨",           items: ["Tote Bag (M)", "Hand Towel", "Cap"], bundlePrice: 1800, normalPrice: 2100, savings: 300, tag: "Premium" }
  ]
};
