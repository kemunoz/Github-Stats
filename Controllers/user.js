const stats = require('./stats');

exports.stats = async (req, res, next) => {
    const { username } = req.params;
    const forked = req.query.forked === 'false' ? false : true;
    let repos;
    try {
        repos = await stats.getStats(username, forked);
        const response = stats.calculateStats(repos);
        const sizeString = stats.formatSizeString(response.totalSize, response.stats.repo_count);
        const userStats = { ...response.stats, average_size: sizeString };

        res.status(200).json(userStats);
    } catch (e) {
        console.log(e);
        res.status(404).send(e);
    }

};