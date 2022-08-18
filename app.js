'use strict';
const express = require('express');
const path = require('path');
const logger = require('@lib/logger');
// const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const routes = require('@lib/routes');
const expressWinston = require('express-winston');
const app = express();
const {extractJwt} = require('@utils/jwt-utils');
const publicPath = require('./config/public');
const cors = require('cors');

function connectMongoose() {
    const mongoose = require('mongoose');
    mongoose.Promise = Promise;
    return mongoose.connect('mongodb://' + process.env.MONGODB_HOST + ':' + process.env.MONGODB_PORT + '/' + process.env.MONGODB_DB, {useNewUrlParser: true});
}

function initialize() {
    app.use(expressWinston.logger({ //middleware para logear errores
        winstonInstance: logger,
        expressFormat: true,
        colorize: false,
        meta: false,
        statusLevels: true
    }));
    app.use(cors());
    app.use(bodyParser.json());//parsea el body de las requests y lo hace mas de acceso mas facil
    app.use(bodyParser.urlencoded({extended: false})); 
    // app.use(cookieParser());
    app.use('/public', express.static(path.join(__dirname, 'public')));
    app.get(publicPath.regex('get'), extractJwt);
    app.put(publicPath.regex('put'), extractJwt);
    app.post(publicPath.regex('post'), extractJwt);
    app.delete(publicPath.regex('delete'), extractJwt);


    Object.keys(routes).forEach((key) => {
        app.use('/api', routes[key]); //agrega /api en todas las rutas
    });

    app.use(function(req, res, next) {
        let err = new Error('Not Found');
        err.status = 404;
        next(err);
    });

    app.use(function(err, req, res, next) {
        logger.error('handleError: ', err.message);
        if (res.headersSent) {
            return next(err);
        }
        let error = {};
        error.status = err.status;
        if (req.app.get('env') === 'development') {
            error.message = err.message;
            error.stack = err.stack;
        }
        return res.status(err.status || 500).json({
            error
        });
    });

    return app;
}


module.exports = {
    initialize
};
