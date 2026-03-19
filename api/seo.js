module.exports = (req, res) => {
    const siteId = req.query.site || '';
    const hubUrl = process.env.HUB_URL || 'https://' + req.headers.host;

    res.setHeader('Content-Type', 'application/javascript');
    res.setHeader('Cache-Control', 'public, max-age=300');
    res.setHeader('Access-Control-Allow-Origin', '*');

    res.send(`/* Manofox SEO Hub v3.0 — Vercel */
(function() {
    var SITE_ID = ${JSON.stringify(siteId)};
    var HUB     = ${JSON.stringify(hubUrl)};
    if (!SITE_ID) return;

    var rawPath = window.location.pathname;
    var page    = rawPath.replace(/^\\//, '').replace(/\\/$/, '').replace(/\\.html?$/, '') || 'home';
    if (page === 'index' || page === '') page = 'home';

    fetch(HUB + '/api/seo/' + encodeURIComponent(SITE_ID) + '?page=' + encodeURIComponent(page))
        .then(function(r) { return r.ok ? r.json() : {}; })
        .then(function(seo) {
            if (seo.title) document.title = seo.title;
            function setMeta(nameOrProp, value, isProp) {
                if (!value) return;
                var attr = isProp ? 'property' : 'name';
                var el = document.querySelector('meta[' + attr + '="' + nameOrProp + '"]');
                if (!el) { el = document.createElement('meta'); el.setAttribute(attr, nameOrProp); document.head.appendChild(el); }
                el.setAttribute('content', value);
            }
            setMeta('description',    seo.description);
            setMeta('keywords',       seo.keywords);
            setMeta('robots',         seo.robots || 'index, follow');
            setMeta('og:title',       seo.ogTitle || seo.title, true);
            setMeta('og:description', seo.ogDescription || seo.description, true);
            setMeta('og:type',        'website', true);
        })
        .catch(function() {});

    try {
        var ref    = document.referrer || 'Direct';
        var device = /mobile|android|iphone|ipad/i.test(navigator.userAgent) ? 'Mobile' : 'Desktop';
        if (ref && ref.includes(window.location.hostname)) ref = 'Internal';
        fetch(HUB + '/api/track', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ siteId: SITE_ID, page: page, referrer: ref, device: device }),
            keepalive: true
        }).catch(function() {});
    } catch(e) {}
})();`);
};
