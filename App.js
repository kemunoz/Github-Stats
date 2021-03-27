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
    let repoCount = 15;
    let page = 1;
    while (repoCount === 15) {
        let response = await fetch(`http://api.github.com/users/${username}/repos?per_page=30&page=${page}`);
        let json = await response.json();
        repoCount = json.length;
        repos = [...json, ...repos];
        page++;
    }

    repoCount = repos.length;
    res.status(200).json({
        message: "hello",
        repoCount
    });
})

module.exports = app;