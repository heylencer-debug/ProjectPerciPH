// ProjectPerciPH — Content Calendar & Captions Library
// Edit this file to update posts and captions

window.CALENDAR_DATA = {
  month: "March",
  year: 2026,
  monthNum: 3,

  holidays: [
    { date: 8,  name: "Women's Day 👩",    color: "#E94560", tip: "Post gift ideas for moms, sisters, besties" },
    { date: 28, name: "Maundy Thursday",   color: "#A78BFA", tip: "Pause heavy selling — post brand story instead" },
    { date: 29, name: "Good Friday 🙏",    color: "#A78BFA", tip: "Non-working holiday — skip selling posts" },
    { date: 31, name: "Easter Sunday 🐣",  color: "#34D399", tip: "Easter basket gift angle works well" }
  ],

  // Content pillar mapping for color coding
  pillars: {
    tease: { name: "Art of Gifting", color: "#7C3AED", icon: "🎁" },
    product: { name: "Art of Gifting", color: "#7C3AED", icon: "🎁" },
    giftinspo: { name: "Gift Inspo", color: "#EC4899", icon: "💡" },
    process: { name: "Craft & Process", color: "#0D9488", icon: "🧵" },
    engagement: { name: "Filipino Gift Culture", color: "#D97706", icon: "🇵🇭" },
    brand: { name: "Behind the Brand", color: "#3B82F6", icon: "👤" },
    promo: { name: "Promotional", color: "#DC2626", icon: "📢" }
  },

  posts: [
    // WEEK 1 — Tease & Introduce (Mar 2–8)
    {
      day: 2, platform: "Instagram", pillar: "tease", type: "Reel",
      time: "6:00 PM", status: "draft",
      caption: "Something's coming to Cebu 👀 Personalized gifts that actually mean something. Follow to be the first to know. 🧵⚔️\n\n#projectperciph #cebugifts #personalizedgifts #comingsoon #embroideryph",
      visualNote: "Dark background, single thread unspooling, no text overlay. Mysterious vibe.",
      cta: "Follow for the reveal"
    },
    {
      day: 3, platform: "Instagram", pillar: "process", type: "Carousel",
      time: "12:00 PM", status: "planned",
      caption: "Meet the palette 🎨 Every color you see here can be embroidered on your gift. Which one is yours?\n\nSwipe to see all →\n\n#embroiderythread #colorpalette #customgifts #personalizedph #projectperciph",
      visualNote: "Flat lay of thread spools arranged by color — cream, white, coral red, navy, gold, blush pink, forest green.",
      cta: "Comment your fave color combo 👇"
    },
    {
      day: 5, platform: "TikTok", pillar: "process", type: "Video",
      time: "7:00 PM", status: "planned",
      caption: "POV: Your name being embroidered 🧵✨ The process is oddly satisfying. Wait for the reveal at the end 👀\n\n#embroidery #embroideryprocess #satisfying #personalizedgifts #cebugifts #projectperciph",
      visualNote: "Close-up of embroidery machine stitching a name. Trending audio. End with full product reveal.",
      cta: "What name would YOU put on this?"
    },
    {
      day: 7, platform: "Instagram", pillar: "product", type: "Post",
      time: "9:00 AM", status: "planned",
      caption: "First reveal ✨ The tote bag that started it all.\n\nYour name. Your style. Made in Cebu.\n\n📦 DM us to order\n💌 Starts at ₱550\n\n#personalizedtote #customtotebag #cebugifts #giftideasph #projectperciph",
      visualNote: "Clean white flat lay. Navy tote with 'BDAY GIRL' in coral thread. Minimal styling — dried flowers, kraft tissue.",
      cta: "DM 'TOTE' to order"
    },
    {
      day: 8, platform: "Instagram", pillar: "giftinspo", type: "Carousel",
      time: "10:00 AM", status: "planned",
      caption: "Happy Women's Day 💕 To every woman who deserves a gift that has her name on it.\n\nSwipe for gift ideas for the special women in your life →\n\n#womensday #giftforher #personalizedgifts #cebugifts #projectperciph",
      visualNote: "Slide 1: Bold '💕' on cream. Slide 2-5: Each product with a 'For your Mama / Bestie / Boss / Sister' label.",
      cta: "Tag the woman who deserves this 👇"
    },

    // WEEK 2 — Birthday Gift Focus (Mar 9–15)
    {
      day: 9, platform: "Instagram", pillar: "giftinspo", type: "Reel",
      time: "6:00 PM", status: "planned",
      caption: "Birthday gifts that actually HIT different 🎂🧵\n\nForget flowers. Forget cake. Give them something with their name on it.\n\n📦 DM to order\n⏰ Ready in 3–5 days\n\n#birthdaygift #personalizedgift #giftideasph #cebugifts #projectperciph",
      visualNote: "Quick cuts: tote bag reveal, towel with monogram, cap with name. Trending birthday audio.",
      cta: "DM us the name + item"
    },
    {
      day: 10, platform: "Facebook", pillar: "product", type: "Post",
      time: "12:00 PM", status: "planned",
      caption: "🎁 Looking for the BEST birthday gift in Cebu?\n\nPersonalized embroidery — your name, their name, your initials — on premium tote bags, towels, caps, and polo shirts.\n\n✅ Ready in 3–5 days\n✅ Ships nationwide\n✅ Starts at ₱550\n\nDM or comment 'ORDER' below 👇\n\n#cebupersonalizedgifts #birthdaygiftcebu #projectperciph",
      visualNote: "Collage of 4 products, bold pricing text overlay.",
      cta: "Comment ORDER or DM"
    },
    {
      day: 11, platform: "TikTok", pillar: "product", type: "Video",
      time: "7:00 PM", status: "planned",
      caption: "POV: You give your bestie THIS for her birthday 🎂🧵 Watch her face when she sees her name on it 😭✨\n\n#birthdaygift #personalizedgifts #giftideas #embroidery #cebugifts #projectperciph",
      visualNote: "Unboxing style. Kraft box opens, tissue paper, towel set with 'NINA' in gold thread. Reaction overlay.",
      cta: "Comment a name to see it embroidered"
    },
    {
      day: 12, platform: "Instagram", pillar: "product", type: "Post",
      time: "9:00 AM", status: "planned",
      caption: "Transparent pricing because we believe you deserve to know 💚\n\n🛍️ Tote Bag — ₱550–₱750\n🧴 Towel Set — ₱650–₱900\n🧢 Cap — ₱600–₱800\n👔 Polo Shirt — ₱900–₱1,200\n\nAll custom embroidered with any name, initials, or short message.\n\n📦 DM to order · Ships nationwide\n\n#pricelist #customgifts #personalizedph #cebugifts #projectperciph",
      visualNote: "Clean pricing card design on cream background. Each item with its emoji.",
      cta: "DM 'PRICE' for full details"
    },
    {
      day: 14, platform: "Instagram", pillar: "giftinspo", type: "Post",
      time: "9:00 AM", status: "planned",
      caption: "Ran out of birthday gift ideas? Here's a sign 🎁\n\n→ Personalized tote bag ₱550\n→ Embroidered towel set ₱650\n→ Custom cap ₱600\n→ Monogrammed polo ₱900\n\nMade in Cebu. Shipped anywhere in the Philippines.\n\n#birthdaygiftph #personalizedgifts #giftforher #giftforhim #projectperciph",
      visualNote: "List-style graphic, minimal. Each item has an icon.",
      cta: "Double tap if you're gifting soon 💕"
    },
    {
      day: 15, platform: "TikTok", pillar: "process", type: "Video",
      time: "6:00 PM", status: "planned",
      caption: "Pack an order with me 📦🧵 From thread to doorstep — this is how we do it at @projectperciph\n\n#packingorders #smallbusiness #embroidery #cebubusiness #projectperciph",
      visualNote: "POV packing: lay out item, fold, wrap with tissue, place in kraft box, seal with wax stamp, add card. Aesthetic and clean.",
      cta: "This could be your order next 👀"
    },

    // WEEK 3 — Engagement + Authority (Mar 16–22)
    {
      day: 16, platform: "Instagram", pillar: "engagement", type: "Post",
      time: "12:00 PM", status: "planned",
      caption: "Block letters vs Script? 🧵\n\nWhich style would you choose for YOUR gift?\n\nLeft: BOLD BLOCK\nRight: Elegant Script\n\nVote in the comments 👇 A or B?\n\n#embroiderystyle #customgifts #personalizedph #projectperciph",
      visualNote: "Side by side: same tote, 'SOFIA' in block vs cursive. Clean white background.",
      cta: "Comment A or B"
    },
    {
      day: 17, platform: "TikTok", pillar: "process", type: "Video",
      time: "7:00 PM", status: "planned",
      caption: "Choosing thread colors is my favorite part 🎨🧵 Which combo do YOU think looks best?\n\n#embroidery #threadcolors #smallbusiness #behindthescenes #projectperciph",
      visualNote: "Satisfying close-up of pulling thread through needle, testing colors on fabric swatch.",
      cta: "Comment your fave color"
    },
    {
      day: 18, platform: "Facebook", pillar: "giftinspo", type: "Post",
      time: "12:00 PM", status: "planned",
      caption: "🎁 Gifts we shipped this week!\n\nEvery package is made with intention — your person's name, stitched by hand on premium blanks.\n\nOrdering for a birthday? Message us the name + item + date needed.\n\n✅ Rush orders available\n✅ Ships anywhere in PH\n\n#cebugifts #personalizedgifts #giftforher #giftforhim #projectperciph",
      visualNote: "Grid of 4 packed orders. Kraft boxes, wax seals, tags visible.",
      cta: "Message us to order"
    },
    {
      day: 19, platform: "Instagram", pillar: "product", type: "Reel",
      time: "6:00 PM", status: "planned",
      caption: "The towel set everyone's been asking about 🧴✨\n\nPremium cotton · Your name embroidered · Perfect for birthdays, bridal showers, weddings\n\nStarts at ₱650\n📦 DM to order\n\n#towelset #personalizedtowel #bridalgift #birthdaygift #projectperciph",
      visualNote: "Slow reveal of folded towel set in gift box. Warm lighting. Monogram 'MCA' visible.",
      cta: "DM 'TOWEL' to order"
    },
    {
      day: 21, platform: "Instagram", pillar: "engagement", type: "Post",
      time: "9:00 AM", status: "planned",
      caption: "Tag someone who has a birthday this month 🎂\n\nThey might just wake up to a surprise 👀✨\n\n#birthday #giftideas #cebugifts #tag #projectperciph",
      visualNote: "Minimal graphic: 'Birthday this month?' in bold. Coral accent.",
      cta: "Tag them below 👇"
    },
    {
      day: 22, platform: "TikTok", pillar: "brand", type: "Video",
      time: "7:00 PM", status: "planned",
      caption: "Why I started @projectperciph 🧵⚔️\n\nBecause the best gifts are the ones that say 'I know you' — not just 'I remembered.'\n\n#smallbusiness #whyistarted #personalizedgifts #cebubusiness #projectperciph",
      visualNote: "Talking to camera or text overlay on aesthetic b-roll. Brand origin story — 30 seconds max.",
      cta: "Follow for personalized gift inspo"
    },

    // WEEK 4 — Push for Sales (Mar 23–29)
    {
      day: 23, platform: "Instagram", pillar: "product", type: "Carousel",
      time: "9:00 AM", status: "planned",
      caption: "5 reasons personalized gifts hit different 🧵✨\n\nSwipe to see why your friends actually KEEP these →\n\n1. It has their name on it\n2. It's useful, not just pretty\n3. It was made for THEM\n4. It never goes out of style\n5. You remembered the details\n\n#personalizedgifts #giftgiving #meaningfulgifts #projectperciph",
      visualNote: "5 slides, each with one reason + product photo. Consistent cream/coral color scheme.",
      cta: "Save this for your next gift shopping 🔖"
    },
    {
      day: 24, platform: "Facebook", pillar: "promo", type: "Post",
      time: "12:00 PM", status: "planned",
      caption: "⚡ LIMITED SLOTS — March batch almost full!\n\nOnly accepting 10 more orders this month. If you've been thinking about it — now is the time.\n\n🛍️ Tote Bag ₱550+\n🧴 Towel ₱650+\n🧢 Cap ₱600+\n👔 Polo ₱900+\n\nDM or comment 'ORDER' 👇\n\n#limitedslots #personalizedgifts #cebugifts #projectperciph",
      visualNote: "Urgency-style post. Bold text: 'ONLY 10 SLOTS LEFT'. Red/coral design.",
      cta: "Comment ORDER to reserve"
    },
    {
      day: 25, platform: "TikTok", pillar: "product", type: "Video",
      time: "7:00 PM", status: "planned",
      caption: "How to order from @projectperciph in 3 steps 📲\n\n1️⃣ DM us your: Name + Item + Date needed\n2️⃣ We send proof for approval\n3️⃣ We ship to your door 📦\n\nThat easy. Starting ₱550.\n\n#howtoorder #personalizedgifts #cebugifts #embroidery #projectperciph",
      visualNote: "Screen recording style or split screen showing the DM flow. Keep it under 30s.",
      cta: "DM us NOW to start your order"
    },
    {
      day: 26, platform: "Instagram", pillar: "product", type: "Post",
      time: "9:00 AM", status: "planned",
      caption: "The cap that started 3 arguments about who gets it first 🧢✨\n\nYour name. Classic fit. Made to last.\n\nStarts at ₱600 · DM to order\n\n#customcap #embroideredcap #personalizedcap #streetstyle #projectperciph",
      visualNote: "Clean flat lay — black cap, 'CARLO' in white thread. Side and front angle shots.",
      cta: "DM 'CAP' + your name to order"
    },
    {
      day: 27, platform: "Instagram", pillar: "giftinspo", type: "Reel",
      time: "6:00 PM", status: "planned",
      caption: "Easter is Sunday 🐣 Surprise someone with a gift that has their name on it.\n\nPersonalized totes, towels, caps & polo shirts — ready in 3–5 days.\n\n📦 DM to order before Saturday to receive by Easter!\n\n#eastergift #personalizedgifts #giftideas #cebugifts #projectperciph",
      visualNote: "Pastel tones. Products with spring/Easter styling — dried flowers, soft lighting.",
      cta: "DM before Saturday for Easter delivery"
    },
    {
      day: 29, platform: "Instagram", pillar: "brand", type: "Post",
      time: "10:00 AM", status: "planned",
      caption: "Rest, reflect, remember 🙏\n\nWishing you and your loved ones a meaningful Holy Week.\n\nWe'll be back for orders on April 1 ✨\n\n#holyweek #goodfriday #projectperciph",
      visualNote: "Simple, respectful. Cream background, minimal text. No selling.",
      cta: "See you after Holy Week"
    },
    {
      day: 31, platform: "Instagram", pillar: "product", type: "Post",
      time: "9:00 AM", status: "planned",
      caption: "He is risen, and so are our orders 😂🐣✨\n\nApril batch now OPEN. Easter gifts still available!\n\n📦 DM to order\nStarts at ₱550\n\n#happyeaster #eastergift #personalizedgifts #cebugifts #projectperciph",
      visualNote: "Light and playful. Easter basket with embroidered items visible.",
      cta: "DM 'EASTER ORDER' to start"
    }
  ]
};

// ===========================
// CAPTIONS LIBRARY
// ===========================

window.CAPTIONS_DATA = {
  lastUpdated: "2026-02-26",
  captions: [
    // --- INSTAGRAM ---
    {
      id: 1, platform: "Instagram", pillar: "tease", week: 1,
      title: "The Teaser",
      caption: "Something's coming to Cebu 👀\n\nPersonalized gifts that actually mean something.\n\nFollow to be the first to know. 🧵⚔️",
      hashtags: "#projectperciph #cebugifts #personalizedgifts #comingsoon #embroideryph #customgifts",
      cta: "Hit follow 🔔"
    },
    {
      id: 2, platform: "Instagram", pillar: "process", week: 1,
      title: "Thread Colors Carousel",
      caption: "Meet the palette 🎨\n\nEvery color you see here can be embroidered on your gift.\n\nWhich one is yours?\nSwipe to see all →",
      hashtags: "#embroiderythread #colorpalette #customgifts #personalizedph #projectperciph #embroidery",
      cta: "Comment your fave color combo 👇"
    },
    {
      id: 3, platform: "Instagram", pillar: "product", week: 1,
      title: "First Product Reveal",
      caption: "First reveal ✨\n\nThe tote bag that started it all.\nYour name. Your style. Made in Cebu.\n\n📦 DM to order\n💌 Starts at ₱550",
      hashtags: "#personalizedtote #customtotebag #cebugifts #giftideasph #projectperciph #totebag",
      cta: "DM 'TOTE' to order 🛍️"
    },
    {
      id: 4, platform: "Instagram", pillar: "giftinspo", week: 1,
      title: "Women's Day Gift Carousel",
      caption: "Happy Women's Day 💕\n\nTo every woman who deserves a gift that has her name on it.\n\nSwipe for gift ideas for the special women in your life →",
      hashtags: "#womensday #giftforher #personalizedgifts #cebugifts #projectperciph #giftideas",
      cta: "Tag the woman who deserves this 👇"
    },
    {
      id: 5, platform: "Instagram", pillar: "giftinspo", week: 2,
      title: "Birthday Gifts Reel",
      caption: "Birthday gifts that actually HIT different 🎂🧵\n\nForget flowers. Forget cake.\nGive them something with their name on it.\n\n📦 DM to order · ⏰ Ready in 3–5 days",
      hashtags: "#birthdaygift #personalizedgift #giftideasph #cebugifts #projectperciph #bdaygift",
      cta: "DM us the name + item 🎁"
    },
    {
      id: 6, platform: "Instagram", pillar: "product", week: 2,
      title: "Transparent Pricing",
      caption: "Transparent pricing because you deserve to know 💚\n\n🛍️ Tote Bag — ₱550–₱750\n🧴 Towel Set — ₱650–₱900\n🧢 Cap — ₱600–₱800\n👔 Polo Shirt — ₱900–₱1,200\n\nAll custom embroidered. Ships nationwide.",
      hashtags: "#pricelist #customgifts #personalizedph #cebugifts #projectperciph #affordablegifts",
      cta: "DM 'PRICE' for full details 📋"
    },
    {
      id: 7, platform: "Instagram", pillar: "engagement", week: 3,
      title: "Block vs Script Poll",
      caption: "Block letters vs Script? 🧵\n\nWhich style would you choose for YOUR gift?\n\nLeft: BOLD BLOCK\nRight: Elegant Script\n\nVote in the comments 👇",
      hashtags: "#embroidery #embroideryfonts #customgifts #personalizedph #projectperciph #poll",
      cta: "Comment A (Block) or B (Script) 👇"
    },
    {
      id: 8, platform: "Instagram", pillar: "product", week: 3,
      title: "Towel Set Reveal",
      caption: "The towel set everyone's been asking about 🧴✨\n\nPremium cotton · Your name embroidered\nPerfect for birthdays, bridal showers, weddings\n\nStarts at ₱650 · 📦 DM to order",
      hashtags: "#towelset #personalizedtowel #bridalgift #birthdaygift #projectperciph #monogrammedgift",
      cta: "DM 'TOWEL' to order 🧴"
    },
    {
      id: 9, platform: "Instagram", pillar: "engagement", week: 3,
      title: "Tag a Birthday Friend",
      caption: "Tag someone who has a birthday this month 🎂\n\nThey might just wake up to a surprise 👀✨",
      hashtags: "#birthday #giftideas #cebugifts #tag #projectperciph #surprise",
      cta: "Tag them below 👇"
    },
    {
      id: 10, platform: "Instagram", pillar: "product", week: 4,
      title: "5 Reasons Carousel",
      caption: "5 reasons personalized gifts hit different 🧵✨\n\nSwipe to see why your friends actually KEEP these →\n\n1. It has their name on it\n2. It's useful, not just pretty\n3. It was made for THEM\n4. It never goes out of style\n5. You remembered the details",
      hashtags: "#personalizedgifts #giftgiving #meaningfulgifts #projectperciph #cebugifts #customgifts",
      cta: "Save this for your next gift shopping 🔖"
    },
    {
      id: 11, platform: "Instagram", pillar: "product", week: 4,
      title: "Cap Reveal",
      caption: "The cap that started 3 arguments about who gets it first 🧢✨\n\nYour name. Classic fit. Made to last.\n\nStarts at ₱600 · DM to order",
      hashtags: "#customcap #embroideredcap #personalizedcap #streetstyle #projectperciph #embroidery",
      cta: "DM 'CAP' + your name to order 🧢"
    },
    {
      id: 12, platform: "Instagram", pillar: "giftinspo", week: 4,
      title: "Easter Gift Push",
      caption: "Easter is Sunday 🐣\nSurprise someone with a gift that has their name on it.\n\nPersonalized totes, towels, caps & polo shirts.\nReady in 3–5 days.",
      hashtags: "#eastergift #personalizedgifts #giftideas #cebugifts #projectperciph #easter",
      cta: "DM before Saturday for Easter delivery 🐣"
    },

    // --- TIKTOK ---
    {
      id: 13, platform: "TikTok", pillar: "process", week: 1,
      title: "Embroidery Process (Satisfying)",
      caption: "POV: Your name being embroidered 🧵✨\n\nThe process is oddly satisfying. Wait for the reveal at the end 👀",
      hashtags: "#embroidery #embroideryprocess #satisfying #personalizedgifts #cebugifts #projectperciph",
      cta: "What name would YOU put on this?"
    },
    {
      id: 14, platform: "TikTok", pillar: "product", week: 2,
      title: "Birthday Gift Unboxing",
      caption: "POV: You give your bestie THIS for her birthday 🎂🧵\nWatch her face when she sees her name on it 😭✨",
      hashtags: "#birthdaygift #personalizedgifts #giftideas #embroidery #cebugifts #projectperciph",
      cta: "Comment a name to see it embroidered 👇"
    },
    {
      id: 15, platform: "TikTok", pillar: "brand", week: 2,
      title: "Packing Orders POV",
      caption: "Pack an order with me 📦🧵\nFrom thread to doorstep — this is how we do it at @projectperciph",
      hashtags: "#packingorders #smallbusiness #embroidery #cebubusiness #projectperciph #packwithme",
      cta: "This could be your order next 👀"
    },
    {
      id: 16, platform: "TikTok", pillar: "process", week: 3,
      title: "Thread Color Selection",
      caption: "Choosing thread colors is my favorite part 🎨🧵\nWhich combo do YOU think looks best?",
      hashtags: "#embroidery #threadcolors #smallbusiness #behindthescenes #projectperciph #satisfying",
      cta: "Comment your fave color 🎨"
    },
    {
      id: 17, platform: "TikTok", pillar: "brand", week: 3,
      title: "Why I Started",
      caption: "Why I started @projectperciph 🧵⚔️\n\nBecause the best gifts are the ones that say 'I know you' — not just 'I remembered.'",
      hashtags: "#smallbusiness #whyistarted #personalizedgifts #cebubusiness #projectperciph #storytime",
      cta: "Follow for personalized gift inspo ⚔️"
    },
    {
      id: 18, platform: "TikTok", pillar: "product", week: 4,
      title: "How to Order (3 Steps)",
      caption: "How to order from @projectperciph in 3 steps 📲\n\n1️⃣ DM: Name + Item + Date needed\n2️⃣ We send proof for approval\n3️⃣ We ship to your door 📦\n\nStarting ₱550.",
      hashtags: "#howtoorder #personalizedgifts #cebugifts #embroidery #projectperciph #easyorder",
      cta: "DM us NOW to start your order 📲"
    },
    {
      id: 19, platform: "TikTok", pillar: "process", week: 4,
      title: "Machine Close-Up ASMR",
      caption: "The sound of your gift being made 🧵🎵\n\n(Turn the volume up 🔊)\n\n@projectperciph — Cebu's personalized embroidery shop",
      hashtags: "#embroideryasmr #embroidery #satisfying #asmr #cebugifts #projectperciph",
      cta: "Name a song that matches this sound 🎵"
    },
    {
      id: 20, platform: "TikTok", pillar: "giftinspo", week: 4,
      title: "Gifts Under ₱1,000",
      caption: "Best gifts under ₱1,000 in the Philippines 🎁🧵\n\nAll personalized, all meaningful, all made in Cebu.\n\nWhich one are you getting first?",
      hashtags: "#giftsunder1000 #personalizedgifts #birthdaygift #cebugifts #projectperciph #budgetgifts",
      cta: "Comment the occasion you're gifting for 🎁"
    },

    // --- FACEBOOK ---
    {
      id: 21, platform: "Facebook", pillar: "product", week: 2,
      title: "FB Product + Pricing",
      caption: "🎁 Looking for the BEST birthday gift in Cebu?\n\nPersonalized embroidery — your name, their name, your initials — on premium tote bags, towels, caps, and polo shirts.\n\n✅ Ready in 3–5 days\n✅ Ships nationwide\n✅ Starts at ₱550\n\nDM or comment 'ORDER' below 👇",
      hashtags: "#cebupersonalizedgifts #birthdaygiftcebu #projectperciph #personalizedph #giftideas",
      cta: "Comment ORDER or DM to reserve 📦"
    },
    {
      id: 22, platform: "Facebook", pillar: "giftinspo", week: 3,
      title: "Orders Shipped This Week",
      caption: "🎁 Gifts we shipped this week!\n\nEvery package is made with intention — your person's name, stitched on premium blanks.\n\nOrdering for a birthday? Message us:\n📌 Name + item + date needed\n\n✅ Rush orders available\n✅ Ships anywhere in PH",
      hashtags: "#cebugifts #personalizedgifts #giftforher #giftforhim #projectperciph #shoplocal",
      cta: "Message us to order 💌"
    },
    {
      id: 23, platform: "Facebook", pillar: "promo", week: 4,
      title: "Limited Slots Urgency",
      caption: "⚡ LIMITED SLOTS — March batch almost full!\n\nOnly accepting 10 more orders this month.\n\n🛍️ Tote Bag ₱550+\n🧴 Towel ₱650+\n🧢 Cap ₱600+\n👔 Polo ₱900+\n\nDM or comment 'ORDER' 👇",
      hashtags: "#limitedslots #personalizedgifts #cebugifts #projectperciph #urgency #orderNow",
      cta: "Comment ORDER to reserve your slot 🔥"
    },
    {
      id: 24, platform: "Facebook", pillar: "giftinspo", week: 1,
      title: "Intro Post on Facebook",
      caption: "Hello Cebu! 👋\n\nWe're ProjectPerciPH — your go-to for personalized embroidery gifts.\n\n🧵 Tote bags, towels, caps, polo shirts — all with YOUR name on them.\n📍 Based in Cebu City\n📦 Ships nationwide\n\nLike the page and DM to order! 💌",
      hashtags: "#cebubusiness #personalizedgifts #embroideryph #projectperciph #cebugifts",
      cta: "Like + Follow for daily gift inspo 🎁"
    },
    {
      id: 25, platform: "Facebook", pillar: "engagement", week: 3,
      title: "Poll: What Would You Embroider?",
      caption: "Quick poll! If you could embroider ONE thing on a tote bag, what would it be?\n\nA. Your first name\nB. Your initials\nC. A short quote\nD. A nickname\n\nComment below 👇 (we might just make a sample of the most popular!)",
      hashtags: "#poll #personalizedgifts #cebugifts #projectperciph #embroidery #community",
      cta: "Comment A, B, C, or D 👇"
    },

    // --- BONUS / EVERGREEN ---
    {
      id: 26, platform: "Instagram", pillar: "product", week: 0,
      title: "Polo Shirt Reveal",
      caption: "The polo shirt upgrade nobody asked for but everyone needed 👔✨\n\nYour name. Embroidered. Professional.\n\nPerfect for: graduation gifts, office gifts, company giveaways.\n\nStarts at ₱900 · DM to order",
      hashtags: "#poloshirt #custompoloshirt #embroideredpolo #giftideasph #projectperciph #officegift",
      cta: "DM 'POLO' + name to order 👔"
    },
    {
      id: 27, platform: "Instagram", pillar: "giftinspo", week: 0,
      title: "Graduation Gift Angle",
      caption: "Graduation season is coming 🎓\n\nGive the grad something they'll actually keep. Their name, embroidered on something premium.\n\nCustom polo shirts from ₱900 · Totes from ₱550\n📦 DM to order",
      hashtags: "#graduationgift #grad2026 #personalizedgifts #cebugifts #projectperciph #giftforgrad",
      cta: "DM us the grad's name + item 🎓"
    },
    {
      id: 28, platform: "TikTok", pillar: "giftinspo", week: 0,
      title: "OFW Pasalubong Angle",
      caption: "OFWs: the best pasalubong is one with your family's names on it 🇵🇭🧵\n\nPersonalized embroidery gifts — we ship worldwide.\n\n@projectperciph",
      hashtags: "#ofw #pasalubong #personalizedgifts #philippinegifts #projectperciph #ofwlife",
      cta: "DM us from anywhere in the world 🌍"
    },
    {
      id: 29, platform: "Facebook", pillar: "product", week: 0,
      title: "Wedding / Bridal Angle",
      caption: "💍 Planning a wedding in Cebu?\n\nWe do personalized embroidery for:\n✅ Bridal party gifts (robes, towels)\n✅ Wedding giveaways\n✅ Bride + Groom tokens\n\nBulk orders welcome · DM for rates\n\n#cebuwedding #bridalshower #weddingfavors #personalizedweddinggifts #projectperciph",
      hashtags: "#cebuwedding #bridalshower #weddingfavors #personalizedweddinggifts #projectperciph",
      cta: "DM for bulk wedding rates 💍"
    },
    {
      id: 30, platform: "Instagram", pillar: "brand", week: 0,
      title: "Brand Story",
      caption: "Every stitch is intentional. ⚔️🧵\n\nWe started ProjectPerciPH because the best gifts don't come from a store shelf — they come from knowing someone well enough to put their name on something.\n\nCebu-made. Philippines-shipped. Made with care.",
      hashtags: "#brandstory #smallbusiness #personalizedgifts #cebubusiness #projectperciph #madeinthephilippines",
      cta: "Follow our journey 🧵⚔️"
    }
  ]
};
