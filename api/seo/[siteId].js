const { connectDB, Site, Seo } = require('../../lib/db');
const { fetchTrendingKeywords, getDefaultFixed, detectEcomSubcategory, CATEGORY_KEYWORDS, DEFAULT_PAGES } = require('../../lib/keywords');

module.exports = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    if (req.method === 'OPTIONS') return res.status(200).end();

    try {
        await connectDB();
        const siteId = req.query.siteId;
        if (!siteId) return res.status(400).json({ error: 'Missing siteId' });

        // Sanitize page slug
        let page = req.query.page || 'home';
        try {
            if (page.includes('://') || page.startsWith('http')) page = new URL(page).pathname;
            page = page.replace(/^\/+/, '').replace(/\/+$/, '').replace(/\.html?$/, '').split('/').pop() || 'home';
            if (page === 'index' || page === '') page = 'home';
        } catch { page = 'home'; }

        // Auto-register new site on first visit
        const siteExists = await Site.findOne({ siteId });
        if (!siteExists) {
            const referer = req.headers.referer || req.headers.origin || '';
            let domain = 'unknown', category = 'default';
            try {
                if (referer) {
                    domain = new URL(referer).hostname;
                    const d = domain.toLowerCase();
                    if (d.includes('shop')||d.includes('store')||d.includes('buy')||d.includes('mart')||d.includes('secure')||d.includes('ecom')) category='ecommerce';
                    else if (d.includes('class')||d.includes('edu')||d.includes('learn')||d.includes('coach')||d.includes('tutor')) category='education';
                    else if (d.includes('health')||d.includes('clinic')||d.includes('doctor')||d.includes('med')) category='healthcare';
                    else if (d.includes('tech')||d.includes('soft')||d.includes('digital')||d.includes('web')||d.includes('app')) category='technology';
                    else if (d.includes('food')||d.includes('restaurant')||d.includes('eat')||d.includes('kitchen')) category='restaurant';
                    else if (d.includes('property')||d.includes('realty')||d.includes('estate')) category='realestate';
                    else if (d.includes('market')||d.includes('seo')||d.includes('agency')||d.includes('brand')||d.includes('fox')) category='digitalmarketing';
                }
            } catch {}

            const siteName = siteId.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
            await Site.create({ siteId, name: siteName, domain, category, autoRegistered: true });

            // Auto-create all default pages with UNIQUE keywords per page
            const pages = DEFAULT_PAGES[category] || DEFAULT_PAGES.default;
            for (const pg of pages) {
                const effectiveCat = category === 'ecommerce' ? detectEcomSubcategory(siteId, pg) : category;
                const { keywords, fixedKeywords, shortTailKeywords, longTailKeywords } = await fetchTrendingKeywords(effectiveCat, pg);
                await Seo.create({
                    siteId, page: pg,
                    title: siteName + (pg === 'home' ? '' : ' - ' + pg.charAt(0).toUpperCase() + pg.slice(1).replace(/-/g,' ')),
                    description: 'Welcome to ' + siteName + '.',
                    keywords, fixedKeywords, shortTailKeywords, longTailKeywords
                });
            }
            console.log('Auto-registered: ' + siteId + ' (' + category + ') — ' + pages.length + ' pages');
        } else {
            await Site.updateOne({ siteId }, { lastSeen: new Date() });
        }

        // Auto-create page if it doesn't exist yet
        let seo = await Seo.findOne({ siteId, page });
        if (!seo) {
            const site = await Site.findOne({ siteId });
            const cat  = site?.category || 'default';
            const effectiveCat = cat === 'ecommerce' ? detectEcomSubcategory(siteId, page) : cat;
            const { keywords, fixedKeywords, shortTailKeywords, longTailKeywords } = await fetchTrendingKeywords(effectiveCat, page);
            const siteName = site?.name || siteId;
            seo = await Seo.create({
                siteId, page,
                title: siteName + ' - ' + page.charAt(0).toUpperCase() + page.slice(1).replace(/-/g,' '),
                description: 'Welcome to ' + siteName + '.',
                keywords, fixedKeywords, shortTailKeywords, longTailKeywords
            });
        }

        res.json(seo);
    } catch (err) {
        console.error('SEO API error:', err);
        res.status(500).json({ error: 'Server error' });
    }
};
