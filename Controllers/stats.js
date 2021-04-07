const fetch = require('node-fetch');

exports.getStats = (username, forked) => {
    return new Promise(async (resolve, reject) => {
        let count = 100;
        let page = 1;
        let repos = [];
        while (count == 100) {
            let response = await fetch(`http://api.github.com/users/${username}/repos?per_page=100&page=${page}`);
            let json = await response.json();
            repos = [...repos, ...json];
            count = json.length;
            page++;
        }
        let response = repos.filter(data => {
            if (!forked) return !data.fork;
            return true;
        });
        repos.length != 0 ? resolve(response) : reject({ message: "USER DOES NOT EXIST OR HAS NO REPOS" });
    });
}

exports.calculateStats = (repos) => {
    var sortedLanguages;
    const languageCount = {};

    var starGazerCount = 0;
    var forkCount = 0;
    var totalSize = 0;
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
    let stats = {
        stats: {
            repo_count: repos.length,
            languages: sortedLanguages.reverse(),
            gazer_count: starGazerCount,
            fork_count: forkCount
        },
        totalSize
    }

    return stats;
};

exports.formatSizeString = (totalSize, repoCount) => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];

    let averageBytes = Math.floor(totalSize / repoCount) * 1000;
    let index = Math.floor(Math.log(averageBytes) / Math.log(1024));
    let averageSize = (averageBytes / Math.pow(1024, index));
    let sizeString = `${averageSize.toFixed(2)}` + sizes[index];
    return sizeString;
}