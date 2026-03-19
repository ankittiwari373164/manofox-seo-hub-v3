const { connectDB, Site, Seo, KeywordLog } = require('../lib/db');
const { fetchTrendingKeywords } = require('../lib/keywords');

module.exports = async (req, res) => {
    // Health check for UptimeRobot
    if (req.method === 'GET' && !req.query.action) {
        return res.json({ status: 'ok', time: new Date().toISOString() });
    }

    // Cron trigger — called by UptimeRobot every 7 hours via GET /api/cron?secret=xxx
    if (req.query.action === 'update' || req.query.secret) {
        const secret = process.env.CRON_SECRET || 'manofox-cron-2025';
        if (req.query.secret !== secret) return res.status(401).json({ error: 'Unauthorized' });

        try {
            await connectDB();
            const sites = await Site.find({});
            let totalPages = 0;
            const log = [];

            for (const site of sites) {
                const pages = await Seo.find({ siteId: site.siteId });
                const category = site.category || 'default';
                for (const seoPage of pages) {
                    const { keywords, fixedKeywords, trendingKeywords, source } = await fetchTrendingKeywords(category, seoPage.page);
                    await Seo.updateOne(
                        { siteId: site.siteId, page: seoPage.page },
                        { $set: { keywords, fixedKeywords, trendingKeywords, updatedAt: new Date() } }
                    );
                    await KeywordLog.create({
                        siteId: site.siteId, page: seoPage.page,
                        keywords: '[' + seoPage.page + '] ' + keywords,
                        source
                    });
                    totalPages++;
                    log.push(site.name + '/' + seoPage.page + ' (' + source + ')');
                }
            }

            return res.json({ ok: true, updated: totalPages, log });
        } catch (err) {
            return res.status(500).json({ error: err.message });
        }
    }

    res.json({ status: 'ok' });
};
