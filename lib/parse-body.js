module.exports = function parseBody(req) {
    return new Promise((resolve) => {
        if (req.body) return resolve(req.body);
        let data = '';
        req.on('data', chunk => data += chunk);
        req.on('end', () => {
            try { resolve(JSON.parse(data)); }
            catch { resolve({}); }
        });
    });
};
