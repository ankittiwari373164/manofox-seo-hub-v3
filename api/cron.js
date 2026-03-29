const { connectDB, Site, Seo, KeywordLog, CronLog } = require('../lib/db');
const { fetchTrendingKeywords, detectEcomSubcategory } = require('../lib/keywords');

module.exports = async (req, res) => {
    // Health / ping — no auth needed (for UptimeRobot)
    if (req.method === 'GET' && !req.query.secret && !req.query.action) {
        return res.json({ status: 'ok', time: new Date().toISOString(), service: 'Manofox SEO Hub v4' });
    }

    const secret = process.env.CRON_SECRET || 'manofox-cron-2025';
    if (req.query.secret !== secret) return res.status(401).json({ error: 'Unauthorized' });

    try {
        await connectDB();
        const sites = await Site.find({});
        let totalPages = 0, errors = 0;
        const log = [];

        for (const site of sites) {
            const pages    = await Seo.find({ siteId: site.siteId });
            const category = site.category || 'default';

            for (const seoPage of pages) {
                try {
                    const effCat = category === 'ecommerce'
                        ? detectEcomSubcategory(site.siteId, seoPage.page)
                        : category;

                    // Preserve user's fixed keywords — only refresh auto keywords
                    const { keywords, fixedKeywords, shortTailKeywords, longTailKeywords, source } =
                        await fetchTrendingKeywords(effCat, seoPage.page, seoPage.fixedKeywords);

                    await Seo.updateOne(
                        { siteId: site.siteId, page: seoPage.page },
                        { $set: { keywords, fixedKeywords, shortTailKeywords, longTailKeywords, updatedAt: new Date() } }
                    );

                    await KeywordLog.create({
                        siteId: site.siteId, page: seoPage.page,
                        keywords: '[' + seoPage.page + '] SHORT: ' + shortTailKeywords + ' | LONG: ' + longTailKeywords,
                        source
                    });

                    totalPages++;
                    log.push('✅ ' + site.name + '/' + seoPage.page + ' [' + effCat + '] (' + source + ')');
                } catch (err) {
                    errors++;
                    log.push('❌ ' + site.name + '/' + seoPage.page + ': ' + err.message);
                }
            }
        }

        // Record this cron run so dashboard can show "last updated X minutes ago"
        await CronLog.create({ runAt: new Date(), pagesUpdated: totalPages, sitesUpdated: sites.length, errors });

        return res.json({ ok: true, updated: totalPages, sites: sites.length, errors, log });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};
