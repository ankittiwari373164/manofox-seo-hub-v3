const { connectDB, Site, Seo, KeywordLog } = require('../lib/db');
const { fetchTrendingKeywords, detectEcomSubcategory } = require('../lib/keywords');

module.exports = async (req, res) => {
    // Health check for UptimeRobot
    if (req.method === 'GET' && !req.query.secret && !req.query.action) {
        return res.json({ status: 'ok', time: new Date().toISOString() });
    }

    const secret = process.env.CRON_SECRET || 'manofox-cron-2025';
    if (req.query.secret !== secret) return res.status(401).json({ error: 'Unauthorized' });

    try {
        await connectDB();
        const sites = await Site.find({});
        let totalPages = 0;
        const log = [];

        for (const site of sites) {
            const pages    = await Seo.find({ siteId: site.siteId });
            const category = site.category || 'default';

            for (const seoPage of pages) {
                // Detect ecommerce subcategory from page slug
                const effectiveCat = category === 'ecommerce'
                    ? detectEcomSubcategory(site.siteId, seoPage.page)
                    : category;

                // Pass existing fixedKeywords so user edits are preserved
                const { keywords, fixedKeywords, shortTailKeywords, longTailKeywords, source } =
                    await fetchTrendingKeywords(effectiveCat, seoPage.page, seoPage.fixedKeywords);

                await Seo.updateOne(
                    { siteId: site.siteId, page: seoPage.page },
                    { $set: {
                        keywords,
                        fixedKeywords,       // preserved from DB if user edited
                        shortTailKeywords,   // refreshed from Google News
                        longTailKeywords,    // refreshed from Google News
                        updatedAt: new Date()
                    }}
                );

                await KeywordLog.create({
                    siteId: site.siteId,
                    page:   seoPage.page,
                    keywords: '[' + seoPage.page + '] SHORT: ' + shortTailKeywords + ' | LONG: ' + longTailKeywords,
                    source
                });

                totalPages++;
                log.push('✅ ' + site.name + '/' + seoPage.page + ' [' + effectiveCat + '] (' + source + ')');
            }
        }

        return res.json({ ok: true, updated: totalPages, sites: sites.length, log });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};
