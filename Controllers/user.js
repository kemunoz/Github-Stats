const express = require('express');
const fetch = require('node-fetch');

exports.stats = async (req, res, next) => {
    const forked = req.query.forked ? false : true;
    const { username } = req.params;
    var sortedLanguages,
        repos = [],
        languageCount = {};

    var starGazerCount = 0,
        forkCount = 0,
        totalSize = 0,
        averageSize = 0,
        repoCount = 30,
        page = 1;

    while (repoCount === 30) {
        let response = await fetch(`http://api.github.com/users/${username}/repos?per_page=30&page=${page}`);
        let json = await response.json();
        const result = json.filter(data => {
            if (!forked) return data.forks === 0;
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
    averageSize = Math.round(totalSize / repoCount);

    res.status(200).json({
        repoCount,
        starGazerCount,
        forkCount,
        languages: sortedLanguages.reverse(),
        average_size: averageSize
    });
};