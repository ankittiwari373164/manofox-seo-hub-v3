const { connectDB, Traffic } = require('../lib/db');
const parseBody = require('../lib/parse-body');

module.exports = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST') return res.status(405).end();

    try {
        await connectDB();
        const body   = await parseBody(req);
        const { siteId, page, referrer, device } = body;
        const ua     = req.headers['user-agent'] || '';
        const isBot  = /bot|crawl|spider|google|bing|yahoo|UptimeRobot|pingdom/i.test(ua);
        if (!isBot && siteId) {
            await Traffic.create({ siteId, page, referrer, device });
        }
        res.json({ ok: true });
    } catch {
        res.json({ ok: false });
    }
};
