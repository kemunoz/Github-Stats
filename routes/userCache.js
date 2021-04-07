const NodeCache = require('node-cache');
const Nodecache = require('node-cache');
const myCache = new NodeCache({ delteOnExpire: true });


module.exports = cache = (req, res, next) => {
    const key = req.params.username;
    const cachedResponse = cache.get(key);
    if (cachedResponse) {
        res.status(200).send(cachedResponse);
    }

    res.originalSend = res.send;
    res.send = body => {
        res.originalSend(body);
        cache.set(key, body, duration);
    };
    next();

}