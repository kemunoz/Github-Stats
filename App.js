const express = require('express');
const app = express();
const morgan = require('morgan');
const helmet = require('helmet');
const userRoutes = require('./routes/user');


app.use(morgan('dev'));
app.use(helmet());


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