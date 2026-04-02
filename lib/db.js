const mongoose = require('mongoose');

let isConnected = false;

async function connectDB() {
    if (isConnected) return;
    await mongoose.connect(process.env.MONGO_URI);
    isConnected = true;
}

const SiteSchema = new mongoose.Schema({
    siteId:         { type: String, unique: true, required: true },
    name:           { type: String, required: true },
    domain:         String,
    category:       String,
    subcategory:    String,
    createdAt:      { type: Date, default: Date.now },
    lastSeen:       { type: Date, default: Date.now },
    autoRegistered: { type: Boolean, default: false },
    clientToken:    { type: String, default: '' },
    clientRemark:   { type: String, default: '' }
});

const SeoSchema = new mongoose.Schema({
    siteId:            String,
    page:              { type: String, default: 'home' },
    title:             String,
    description:       String,
    keywords:          String,
    fixedKeywords:     String,
    shortTailKeywords: String,
    longTailKeywords:  String,
    robots:            { type: String, default: 'index, follow' },
    ogTitle:           String,
    ogDescription:     String,
    updatedAt:         { type: Date, default: Date.now }
});
SeoSchema.index({ siteId: 1, page: 1 }, { unique: true });

const TrafficSchema = new mongoose.Schema({
    siteId:   String,
    page:     String,
    referrer: String,
    device:   String,
    date:     { type: Date, default: Date.now }
});
TrafficSchema.index({ siteId: 1, date: -1 });
TrafficSchema.index({ date: -1 });

const ManualStatSchema = new mongoose.Schema({
    siteId:      { type: String, required: true },
    date:        { type: String, required: true },
    views:       { type: Number, default: 0 },
    sessions:    { type: Number, default: 0 },
    newUsers:    { type: Number, default: 0 },
    bounceRate:  { type: String, default: '' },
    topPage:     { type: String, default: '' },
    topReferrer: { type: String, default: '' },
    remark:      { type: String, default: '' },
    createdAt:   { type: Date, default: Date.now },
    updatedAt:   { type: Date, default: Date.now }
});
ManualStatSchema.index({ siteId: 1, date: -1 });

const KeywordLogSchema = new mongoose.Schema({
    siteId:   String,
    page:     { type: String, default: 'home' },
    keywords: String,
    source:   String,
    date:     { type: Date, default: Date.now }
});
KeywordLogSchema.index({ siteId: 1, date: -1 });

const CronLogSchema = new mongoose.Schema({
    runAt:         { type: Date, default: Date.now },
    pagesUpdated:  Number,
    sitesUpdated:  Number,
    errors:        { type: Number, default: 0 }
});

const Site       = mongoose.models.Site       || mongoose.model('Site',       SiteSchema);
const Seo        = mongoose.models.Seo        || mongoose.model('Seo',        SeoSchema);
const Traffic    = mongoose.models.Traffic    || mongoose.model('Traffic',    TrafficSchema);
const ManualStat = mongoose.models.ManualStat || mongoose.model('ManualStat', ManualStatSchema);
const KeywordLog = mongoose.models.KeywordLog || mongoose.model('KeywordLog', KeywordLogSchema);
const CronLog    = mongoose.models.CronLog    || mongoose.model('CronLog',    CronLogSchema);

module.exports = { connectDB, Site, Seo, Traffic, ManualStat, KeywordLog, CronLog };
