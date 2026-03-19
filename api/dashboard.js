const { connectDB, Site, Seo, Traffic, KeywordLog } = require('../lib/db');
const { fetchTrendingKeywords } = require('../lib/keywords');
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

    // ── GET ────────────────────────────────────────────────────────────────────
    if (req.method === 'GET') {
        if (action === 'sites') {
            const sites = await Site.find({}).sort({ lastSeen: -1 });
            const siteStats = await Promise.all(sites.map(async (site) => {
                const visits7d = await Traffic.countDocuments({
                    siteId: site.siteId,
                    date: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
                });
                const seoData = await Seo.findOne({ siteId: site.siteId, page: 'home' });
                return { ...site.toObject(), visits7d, seoData };
            }));
            const totalVisits = await Traffic.countDocuments({
                date: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
            });
            return res.json({ sites: siteStats, totalVisits });
        }

        if (action === 'site' && siteId) {
            const days      = parseInt(req.query.days) || 7;
            const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
            const site      = await Site.findOne({ siteId });
            if (!site) return res.status(404).json({ error: 'Not found' });

            const [seoPages, totalVisits, dailyStats, deviceStats, referrerStats, pageStats, keywordHistory] = await Promise.all([
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
                KeywordLog.find({ siteId }).sort({ date: -1 }).limit(10)
            ]);

            const hubUrl = process.env.HUB_URL || 'https://' + req.headers.host;
            return res.json({ site, seoPages, totalVisits, dailyStats, deviceStats, referrerStats, pageStats, keywordHistory, selectedDays: days, hubUrl });
        }
    }

    // ── POST ───────────────────────────────────────────────────────────────────
    if (req.method === 'POST') {
        const body = await parseBody(req);

        if (action === 'create-site') {
            const { name, domain, category } = body;
            const newSiteId = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
            const existing  = await Site.findOne({ siteId: newSiteId });
            if (existing) return res.status(400).json({ error: 'Site ID already exists' });
            await Site.create({ siteId: newSiteId, name, domain, category });
            const { keywords, fixedKeywords, trendingKeywords } = await fetchTrendingKeywords(category, 'home');
            await Seo.create({ siteId: newSiteId, page: 'home', title: name, description: 'Welcome to ' + name, keywords, fixedKeywords, trendingKeywords });
            return res.json({ ok: true, siteId: newSiteId });
        }

        if (action === 'update-seo' && siteId) {
            const { page, title, description, keywords, robots } = body;
            await Seo.findOneAndUpdate(
                { siteId, page: page || 'home' },
                { title, description, keywords, robots, updatedAt: new Date() },
                { upsert: true }
            );
            return res.json({ ok: true });
        }

        if (action === 'add-page' && siteId) {
            const { page } = body;
            const site = await Site.findOne({ siteId });
            const category = site?.category || 'default';
            const { keywords, fixedKeywords, trendingKeywords } = await fetchTrendingKeywords(category, page);
            const pageTitle = (site?.name || siteId) + ' - ' + page.charAt(0).toUpperCase() + page.slice(1);
            await Seo.findOneAndUpdate(
                { siteId, page },
                { siteId, page, title: pageTitle, description: '', keywords, fixedKeywords, trendingKeywords, updatedAt: new Date() },
                { upsert: true }
            );
            return res.json({ ok: true });
        }

        if (action === 'force-update' && siteId) {
            const site  = await Site.findOne({ siteId });
            if (!site) return res.status(404).json({ error: 'Not found' });
            const pages = await Seo.find({ siteId });
            for (const p of pages) {
                const { keywords, fixedKeywords, trendingKeywords, source } = await fetchTrendingKeywords(site.category || 'default', p.page);
                await Seo.updateOne(
                    { siteId, page: p.page },
                    { $set: { keywords, fixedKeywords, trendingKeywords, updatedAt: new Date() } }
                );
                await KeywordLog.create({ siteId, page: p.page, keywords, source });
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

        if (action === 'cleanup' && siteId) {
            const result = await Seo.deleteMany({ siteId, page: { $regex: /^https?:\/\//i } });
            return res.json({ ok: true, deleted: result.deletedCount });
        }
    }

    res.status(400).json({ error: 'Unknown action' });
};
