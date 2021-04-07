const express = require('express');
const app = express();
const helmet = require('helmet');
const userRoutes = require('./routes/user');
// const morgan = require('morgan');

// app.use(morgan('dev'));

app.use(helmet());
app.use((req, res, next) => {
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'GET');
        return res.status(200).json({});
    }
    next();
})


app.use('/users', userRoutes);

app.use((req, res, next) => {
    const error = new Error('Not Found');
    error.number = 404;
    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.number || 500).json({
        error: {
            message: error.message
        }
    });
});

module.exports = app;