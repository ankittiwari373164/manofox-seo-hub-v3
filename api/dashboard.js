const { connectDB, Site, Seo, Traffic, KeywordLog, CronLog } = require('../lib/db');
const { fetchTrendingKeywords, detectEcomSubcategory, DEFAULT_PAGES } = require('../lib/keywords');
const parseBody = require('../lib/parse-body');

function auth(req) {
    const cookie = req.headers.cookie || '';
    const match  = cookie.match(/mfox_admin=([^;]+)/);
    if (!match) return false;
    try {
        const [pass, exp] = Buffer.from(match[1], 'base64').toString().split(':');
        return pass === (process.env.ADMIN_PASSWORD || 'foxadmin2025') && Date.now() < parseInt(exp);
    } catch { return false; }
}

module.exports = async (req, res) => {
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    if (req.method === 'OPTIONS') return res.status(200).end();
    if (!auth(req)) return res.status(401).json({ error: 'Unauthorized' });

    await connectDB();
    const { action, siteId } = req.query;

    // ── GET ───────────────────────────────────────────────────────────────────
    if (req.method === 'GET') {

        // List all sites for dashboard home
        if (action === 'sites') {
            const sites      = await Site.find({}).sort({ lastSeen: -1 });
            const lastCron   = await CronLog.findOne({}).sort({ runAt: -1 });
            const cutoff7d   = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

            const siteStats  = await Promise.all(sites.map(async (s) => {
                const visits7d  = await Traffic.countDocuments({ siteId: s.siteId, date: { $gte: cutoff7d } });
                const seoPages  = await Seo.find({ siteId: s.siteId }, 'keywords');
                const kwCount   = seoPages.reduce((a, p) => a + ((p.keywords || '').split(',').filter(Boolean).length), 0);
                return { ...s.toObject(), visits7d, kwCount };
            }));

            const totalVisits = await Traffic.countDocuments({ date: { $gte: cutoff7d } });
            return res.json({ sites: siteStats, totalVisits, lastCronRun: lastCron?.runAt || null });
        }

        // Single site detail
        if (action === 'site' && siteId) {
            const days      = parseInt(req.query.days) || 7;
            const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
            const site      = await Site.findOne({ siteId });
            if (!site) return res.status(404).json({ error: 'Not found' });

            const [seoPages, totalVisits, dailyStats, deviceStats, referrerStats, pageStats, keywordHistory] =
                await Promise.all([
                    Seo.find({ siteId }),
                    Traffic.countDocuments({ siteId, date: { $gte: startDate } }),
                    Traffic.aggregate([
                        { $match: { siteId, date: { $gte: startDate } } },
                        { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$date' } }, count: { $sum: 1 } } },
                        { $sort: { _id: 1 } }
                    ]),
                    Traffic.aggregate([
                        { $match: { siteId, date: { $gte: startDate } } },
                        { $group: { _id: '$device', count: { $sum: 1 } } }
                    ]),
                    Traffic.aggregate([
                        { $match: { siteId, date: { $gte: startDate } } },
                        { $group: { _id: '$referrer', count: { $sum: 1 } } },
                        { $sort: { count: -1 } }, { $limit: 10 }
                    ]),
                    Traffic.aggregate([
                        { $match: { siteId, date: { $gte: startDate } } },
                        { $group: { _id: '$page', count: { $sum: 1 } } },
                        { $sort: { count: -1 } }, { $limit: 10 }
                    ]),
                    KeywordLog.find({ siteId }).sort({ date: -1 }).limit(20)
                ]);

            const hubUrl = process.env.HUB_URL || 'https://' + req.headers.host;
            return res.json({ site, seoPages, totalVisits, dailyStats, deviceStats, referrerStats, pageStats, keywordHistory, hubUrl });
        }
    }

    // ── POST ──────────────────────────────────────────────────────────────────
    if (req.method === 'POST') {
        const body = await parseBody(req);

        // Create new site + auto-populate all pages
        if (action === 'create-site') {
            const { name, domain, category } = body;
            const newSiteId = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
            const existing  = await Site.findOne({ siteId: newSiteId });
            if (existing) return res.status(400).json({ error: 'Site ID already exists — try a different name.' });

            await Site.create({ siteId: newSiteId, name, domain, category });

            const pages = DEFAULT_PAGES[category] || DEFAULT_PAGES.default;
            for (const pg of pages) {
                const effCat = category === 'ecommerce' ? detectEcomSubcategory(newSiteId, pg) : category;
                const { keywords, fixedKeywords, shortTailKeywords, longTailKeywords } =
                    await fetchTrendingKeywords(effCat, pg);
                const pgTitle = pg === 'home' ? name : name + ' - ' + pg.charAt(0).toUpperCase() + pg.slice(1).replace(/-/g,' ');
                await Seo.create({ siteId: newSiteId, page: pg, title: pgTitle, description: 'Welcome to ' + name + '.', keywords, fixedKeywords, shortTailKeywords, longTailKeywords });
            }
            return res.json({ ok: true, siteId: newSiteId });
        }

        // Update SEO fields for a page (preserves auto keywords)
        if (action === 'update-seo' && siteId) {
            const { page, title, description, robots, fixedKeywords } = body;
            const seoDoc    = await Seo.findOne({ siteId, page: page || 'home' });
            const updateData = { title, description, robots, updatedAt: new Date() };
            if (fixedKeywords !== undefined) {
                updateData.fixedKeywords = fixedKeywords;
                const st = seoDoc?.shortTailKeywords || '';
                const lt = seoDoc?.longTailKeywords  || '';
                updateData.keywords = [fixedKeywords, st, lt].filter(Boolean).join(', ');
            }
            await Seo.findOneAndUpdate({ siteId, page: page || 'home' }, updateData, { upsert: true });
            return res.json({ ok: true });
        }

        // Add a new page to a site
        if (action === 'add-page' && siteId) {
            const { page }  = body;
            const site      = await Site.findOne({ siteId });
            const category  = site?.category || 'default';
            const effCat    = category === 'ecommerce' ? detectEcomSubcategory(siteId, page) : category;
            const { keywords, fixedKeywords, shortTailKeywords, longTailKeywords } =
                await fetchTrendingKeywords(effCat, page);
            const pgTitle = (site?.name || siteId) + ' - ' + page.charAt(0).toUpperCase() + page.slice(1).replace(/-/g, ' ');
            await Seo.findOneAndUpdate(
                { siteId, page },
                { siteId, page, title: pgTitle, description: '', keywords, fixedKeywords, shortTailKeywords, longTailKeywords, updatedAt: new Date() },
                { upsert: true }
            );
            return res.json({ ok: true });
        }

        // Force-update keywords for one site
        if (action === 'force-update' && siteId) {
            const site  = await Site.findOne({ siteId });
            if (!site) return res.status(404).json({ error: 'Not found' });
            const pages = await Seo.find({ siteId });
            for (const p of pages) {
                const cat    = site.category || 'default';
                const effCat = cat === 'ecommerce' ? detectEcomSubcategory(siteId, p.page) : cat;
                const { keywords, fixedKeywords, shortTailKeywords, longTailKeywords, source } =
                    await fetchTrendingKeywords(effCat, p.page, p.fixedKeywords);
                await Seo.updateOne(
                    { siteId, page: p.page },
                    { $set: { keywords, fixedKeywords, shortTailKeywords, longTailKeywords, updatedAt: new Date() } }
                );
                await KeywordLog.create({
                    siteId, page: p.page,
                    keywords: '[' + p.page + '] SHORT: ' + shortTailKeywords + ' | LONG: ' + longTailKeywords,
                    source
                });
            }
            return res.json({ ok: true, pages: pages.length });
        }

        if (action === 'update-settings' && siteId) {
            const { name, domain, category } = body;
            await Site.updateOne({ siteId }, { name, domain, category });
            return res.json({ ok: true });
        }

        if (action === 'delete-site' && siteId) {
            await Promise.all([
                Site.deleteOne({ siteId }),
                Seo.deleteMany({ siteId }),
                Traffic.deleteMany({ siteId }),
                KeywordLog.deleteMany({ siteId })
            ]);
            return res.json({ ok: true });
        }
    }

    res.status(400).json({ error: 'Unknown action' });
};
