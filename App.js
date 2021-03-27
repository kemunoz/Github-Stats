const express = require('express');
const app = express();
const morgan = require('morgan');
const helmet = require('helmet');

app.use(morgan('dev'));
app.use(helmet());


app.use('/:username', async (req, res, next) => {
    const { username } = req.params;
    let response = fetch(`https://api.github.com/users/${username}/repos`)
    let json = await response.json();


    res.status(200).json({
        message: "hello"
    });
    next();
})

module.exports = app;