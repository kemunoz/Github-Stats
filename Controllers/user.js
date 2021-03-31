const fetch = require('node-fetch');

exports.stats = async (req, res, next) => {
    const { username } = req.params;
    const forked = req.query.forked === 'false' ? false : true;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    var sortedLanguages,
        repos = [],
        languageCount = {},
        sizeString,
        i;

    var starGazerCount = 0,
        forkCount = 0,
        totalSize = 0,
        averageSize,
        averageBytes,
        repoCount = 30,
        page = 1;

    while (repoCount === 30) {
        let response = await fetch(`http://api.github.com/users/${username}/repos?per_page=30&page=${page}`);
        let json = await response.json();
        if (!json.length) {
            res.status(404).json({
                message: 'Not Found'
            });
        }
        const result = json.filter(data => {
            if (!forked) return !data.fork;
            return true;
        });
        repos = [...repos, ...result];
        repoCount = json.length;
        page++;
    }

    repos.forEach(repo => {
        starGazerCount += repo.stargazers_count;
        forkCount += repo.forks_count;
        totalSize += repo.size;
        if (repo.language) {
            if (languageCount[repo.language]) {
                let count = languageCount[repo.language];
                count++;
                languageCount[repo.language] = count;
            } else {
                languageCount[repo.language] = 1;

            }
        }
    });

    sortedLanguages = Object.keys(languageCount).sort((a, b) => languageCount[a] - languageCount[b]);
    repoCount = repos.length;
    // Calculate average size of repos
    averageBytes = Math.floor(totalSize / repoCount) * 1000;
    i = Math.floor(Math.log(averageBytes) / Math.log(1024));
    averageSize = (averageBytes / Math.pow(1024, i));
    sizeString = `${averageSize.toFixed(2)}` + sizes[i];

    res.status(200).json({
        repoCount,
        starGazerCount,
        forkCount,
        languages: sortedLanguages.reverse(),
        average_size: sizeString
    });
};