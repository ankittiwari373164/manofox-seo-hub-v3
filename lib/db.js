const mongoose = require('mongoose');

let isConnected = false;

async function connectDB() {
    if (isConnected) return;
    await mongoose.connect(process.env.MONGO_URI);
    isConnected = true;
}

// ── Site ─────────────────────────────────────────────────────────────────────
const SiteSchema = new mongoose.Schema({
    siteId:         { type: String, unique: true, required: true },
    name:           { type: String, required: true },
    domain:         String,
    category:       String,
    subcategory:    String,
    createdAt:      { type: Date, default: Date.now },
    lastSeen:       { type: Date, default: Date.now },
    autoRegistered: { type: Boolean, default: false }
});

// ── SEO (per page) ────────────────────────────────────────────────────────────
const SeoSchema = new mongoose.Schema({
    siteId:            String,
    page:              { type: String, default: 'home' },
    title:             String,
    description:       String,
    keywords:          String,   // combined: fixed + shortTail + longTail
    fixedKeywords:     String,   // 10 — user-editable, NEVER overwritten by cron
    shortTailKeywords: String,   // 5  — auto, 1-3 words, refreshed every 7h
    longTailKeywords:  String,   // 5  — auto, 4-8 words, refreshed every 7h
    robots:            { type: String, default: 'index, follow' },
    ogTitle:           String,
    ogDescription:     String,
    updatedAt:         { type: Date, default: Date.now }
});
SeoSchema.index({ siteId: 1, page: 1 }, { unique: true });

// ── Traffic ───────────────────────────────────────────────────────────────────
const TrafficSchema = new mongoose.Schema({
    siteId:   String,
    page:     String,
    referrer: String,
    device:   String,
    date:     { type: Date, default: Date.now }
});
TrafficSchema.index({ siteId: 1, date: -1 });
TrafficSchema.index({ date: -1 });

// ── Keyword update log ────────────────────────────────────────────────────────
const KeywordLogSchema = new mongoose.Schema({
    siteId:   String,
    page:     { type: String, default: 'home' },
    keywords: String,
    source:   String,
    date:     { type: Date, default: Date.now }
});
KeywordLogSchema.index({ siteId: 1, date: -1 });

// ── Cron run log (powers "last updated" badge on dashboard) ───────────────────
const CronLogSchema = new mongoose.Schema({
    runAt:         { type: Date, default: Date.now },
    pagesUpdated:  Number,
    sitesUpdated:  Number,
    errors:        { type: Number, default: 0 }
});

const Site       = mongoose.models.Site       || mongoose.model('Site',       SiteSchema);
const Seo        = mongoose.models.Seo        || mongoose.model('Seo',        SeoSchema);
const Traffic    = mongoose.models.Traffic    || mongoose.model('Traffic',    TrafficSchema);
const KeywordLog = mongoose.models.KeywordLog || mongoose.model('KeywordLog', KeywordLogSchema);
const CronLog    = mongoose.models.CronLog    || mongoose.model('CronLog',    CronLogSchema);

module.exports = { connectDB, Site, Seo, Traffic, KeywordLog, CronLog };
