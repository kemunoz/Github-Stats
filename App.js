const express = require('express');
const app = express();
const morgan = require('morgan');
const helmet = require('helmet');
const fetch = require('node-fetch');

app.use(morgan('dev'));
app.use(helmet());


app.use('/:username', async (req, res, next) => {
    const { username } = req.params;
    let repos = [];
    let repoCount = 30;
    let page = 1;
    let starGazerCount = 0;
    let forkCount = 0;
    let languageCount = {};
    let totalSize = 0;
    let averageSize = 0;
    while (repoCount === 30) {
        let response = await fetch(`http://api.github.com/users/${username}/repos?per_page=30&page=${page}`);
        let json = await response.json();
        repoCount = json.length;
        repos = [...repos, ...json];
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

    const sortedLanguages = Object.keys(languageCount).sort((a, b) => languageCount[a] - languageCount[b]);
    repoCount = repos.length;
    averageSize = totalSize / repoCount;
    res.status(200).json({
        repoCount,
        starGazerCount,
        forkCount,
        languages: sortedLanguages.reverse(),
        average_size: averageSize
    });
})

module.exports = app;