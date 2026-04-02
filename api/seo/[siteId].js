/**
 * /api/seo/[siteId].js
 *
 * KEY CHANGE: When a page is requested that doesn't exist yet,
 * it is NOW auto-created with proper keywords for that SPECIFIC slug.
 * No more fake default pages dumped on site creation.
 *
 * For sites registered via dashboard (not auto-registered),
 * pages are created LAZILY on first real visit — so dashboard
 * only shows pages that have actually been visited.
 */

const { connectDB, Site, Seo } = require('../../lib/db');
const {
    fetchTrendingKeywords,
    detectEcomSubcategory,
    DEFAULT_PAGES
} = require('../../lib/keywords');

// ── SITE-SPECIFIC PAGE TITLES (for known sites) ───────────────────────────────
// When a real page is visited for the first time, use a proper title
// instead of the generic "SiteName - PageSlug" format.
const SITE_PAGE_TITLES = {
    'rime': {
        'home'         : 'RIME - Rattan Institute of Management and Engineering | Rohtak',
        'about'        : 'About RIME | Our Story, Vision & Engineering Excellence',
        'admission'    : 'Admission 2026 | B.Tech MBA MCA BCA | RIME Rohtak',
        'contact'      : 'Contact RIME | Reach Us | Rattan Institute Rohtak Haryana',
        'gallery'      : 'Gallery | Campus Life & Events | RIME Rohtak',
        'lab'          : 'Laboratories | State-of-the-Art Labs | RIME Rohtak',
        'library'      : 'Library | Digital & Physical Resources | RIME Rohtak',
        'pool'         : 'Swimming Pool | Sports Facilities | RIME Rohtak',
        'program'      : 'Programs & Courses | B.Tech MBA MCA | RIME Rohtak',
        'playground'   : 'Sports & Playground | Campus Facilities | RIME Rohtak',
        'seminar-hall' : 'Seminar Hall | Events & Conferences | RIME Rohtak',
        'login'        : 'Student Login | Portal Access | RIME Rohtak',
    }
};

// ── SITE-SPECIFIC DESCRIPTIONS ────────────────────────────────────────────────
const SITE_PAGE_DESCRIPTIONS = {
    'rime': {
        'home'         : 'RIME is a premier MDU affiliated engineering and management college in Rohtak, Haryana. Offering B.Tech, MBA, MCA, and BCA with excellent placements.',
        'about'        : 'Learn about Rattan Institute of Management and Engineering — our history, vision, mission, and commitment to quality education in Haryana.',
        'admission'    : 'Apply for admission to B.Tech, MBA, MCA, or BCA programs at RIME Rohtak. MDU affiliated, AICTE approved. Admissions open for 2026-27.',
        'contact'      : 'Contact Rattan Institute of Management and Engineering, Rohtak. Get address, phone, email, and directions to our campus.',
        'gallery'      : 'Explore photos and videos of RIME campus, classrooms, labs, events, fests, and student life in Rohtak, Haryana.',
        'lab'          : 'RIME has state-of-the-art computer labs, electronics labs, and engineering workshops to support hands-on learning.',
        'library'      : 'RIME library offers thousands of books, journals, digital resources, and e-learning materials for engineering and management students.',
        'pool'         : 'RIME provides excellent sports facilities including a swimming pool, sports ground, and fitness center for students.',
        'program'      : 'Explore B.Tech, MBA, MCA, and BCA programs at RIME Rohtak. MDU affiliated with strong placement record and experienced faculty.',
        'playground'   : 'RIME campus sports facilities include playground, cricket ground, basketball, and indoor games for holistic development.',
        'seminar-hall' : 'RIME seminar hall hosts guest lectures, industry workshops, cultural events, and academic conferences throughout the year.',
        'login'        : 'Student and faculty login portal for Rattan Institute of Management and Engineering, Rohtak.',
    }
};

module.exports = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    if (req.method === 'OPTIONS') return res.status(200).end();

    try {
        await connectDB();
        const siteId = req.query.siteId;
        if (!siteId) return res.status(400).json({ error: 'Missing siteId' });

        // ── Sanitize page slug ────────────────────────────────────────────────
        let page = req.query.page || 'home';
        try {
            if (page.includes('://') || page.startsWith('http')) {
                page = new URL(page).pathname;
            }
            // Clean the path: remove leading slash, trailing slash, .html
            page = page.replace(/^\/+/, '').replace(/\/+$/, '').replace(/\.html?$/, '');
            // For nested paths like 'services/detail' → keep as 'services-detail'
            page = page.replace(/\//g, '-');
            if (!page || page === 'index') page = 'home';
        } catch { page = 'home'; }

        // ── Check if site exists ──────────────────────────────────────────────
        let site = await Site.findOne({ siteId });

        if (!site) {
            // ── AUTO-REGISTER new site (first time this siteId is seen) ──────
            const referer = req.headers.referer || req.headers.origin || '';
            let domain = 'unknown', category = 'default';

            try {
                if (referer) {
                    domain = new URL(referer).hostname;
                    const d = domain.toLowerCase();
                    if      (d.includes('rime') || d.includes('institute') || d.includes('college') || d.includes('edu') || d.includes('class') || d.includes('learn') || d.includes('coach')) category = 'education';
                    else if (d.includes('shop') || d.includes('store')  || d.includes('buy') || d.includes('mart')) category = 'ecommerce';
                    else if (d.includes('health') || d.includes('clinic') || d.includes('doctor')) category = 'healthcare';
                    else if (d.includes('tech') || d.includes('soft')  || d.includes('digital') || d.includes('web') || d.includes('app')) category = 'technology';
                    else if (d.includes('food') || d.includes('restaurant')) category = 'restaurant';
                    else if (d.includes('property') || d.includes('realty') || d.includes('estate')) category = 'realestate';
                    else if (d.includes('market') || d.includes('seo')  || d.includes('agency')) category = 'digitalmarketing';
                }
            } catch {}

            const siteName = siteId.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
            site = await Site.create({ siteId, name: siteName, domain, category, autoRegistered: true });

            // ── IMPORTANT: Do NOT create default pages here. ──────────────────
            // Pages will be created LAZILY as real visitors visit them.
            // This ensures dashboard only shows pages that actually exist.
            console.log(`Auto-registered: ${siteId} (${category}) — pages will be created on visit`);

        } else {
            // Update last seen
            await Site.updateOne({ siteId }, { lastSeen: new Date() });
        }

        // ── Get or create SEO for this specific page ──────────────────────────
        let seo = await Seo.findOne({ siteId, page });

        if (!seo) {
            // ── CREATE page with REAL keywords for this exact slug ────────────
            const category = site?.category || 'default';
            const effectiveCat = category === 'ecommerce'
                ? detectEcomSubcategory(siteId, page)
                : category;

            const { keywords, fixedKeywords, shortTailKeywords, longTailKeywords } =
                await fetchTrendingKeywords(effectiveCat, page);

            // Use site-specific title if available, else generate one
            const siteTitles = SITE_PAGE_TITLES[siteId] || {};
            const siteDescs  = SITE_PAGE_DESCRIPTIONS[siteId] || {};
            const siteName   = site?.name || siteId;

            const title = siteTitles[page]
                || siteName + ' - ' + page.charAt(0).toUpperCase() + page.slice(1).replace(/-/g, ' ');
            const description = siteDescs[page]
                || 'Welcome to ' + siteName + '.';

            seo = await Seo.create({
                siteId, page,
                title,
                description,
                keywords,
                fixedKeywords,
                shortTailKeywords,
                longTailKeywords
            });

            console.log(`Auto-created page: ${siteId}/${page}`);
        }

        return res.json(seo);

    } catch (err) {
        console.error('SEO API error:', err);
        return res.status(500).json({ error: 'Server error' });
    }
};
