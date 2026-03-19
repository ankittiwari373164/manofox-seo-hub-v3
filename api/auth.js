const parseBody = require('../lib/parse-body');

module.exports = async (req, res) => {
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    if (req.method === 'OPTIONS') return res.status(200).end();

    if (req.method === 'POST') {
        const body    = await parseBody(req);
        const adminPass = process.env.ADMIN_PASSWORD || 'foxadmin2025';
        if (body.password === adminPass) {
            const exp   = Date.now() + 24 * 60 * 60 * 1000;
            const token = Buffer.from(adminPass + ':' + exp).toString('base64');
            res.setHeader('Set-Cookie', `mfox_admin=${token}; Path=/; HttpOnly; SameSite=Strict; Max-Age=86400`);
            return res.json({ ok: true });
        }
        return res.status(401).json({ error: 'Wrong password' });
    }
    if (req.method === 'DELETE') {
        res.setHeader('Set-Cookie', 'mfox_admin=; Path=/; Max-Age=0');
        return res.json({ ok: true });
    }
    res.status(405).end();
};
