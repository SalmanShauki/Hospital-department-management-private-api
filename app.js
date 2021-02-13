// Importing Modules
const express = require("express");
const bodyParser = require('body-parser'); // Parse incoming request bodies in a middleware before your handlers, available under the req.body property.
const errorHandler = require('errorhandler');
const morgan = require('morgan'); // HTTP request logger middleware for node.js
const helmet = require("helmet"); // Helmet helps you secure your Express apps by setting various HTTP headers
const cors = require('cors');
const fs = require('fs');
const methodOverride = require('method-override'); // Lets you use HTTP verbs such as PUT or DELETE in places where the client doesn't support it.
const config = require("./config/config");

const Logger = require('./utilities/Logger');
const db = require("./config/db");
const winston = require("winston/lib/winston/config");

const app = express();

const port = config.port;

// Following code is used to hide the technologies being used
app.disable('x-powered-by');
app.disable('server');

let env = process.env.NODE_ENV || 'development';

let logs = 'dev';

if (env !== 'development') {
    // Use winston on Production
    logs = {
        stream: {
            write: (message, encoding) => {
                winston.info(message);
            }
        }
    };
}

// Logging middleware
app.use(morgan(logs));
app.use(cors());
app.use(helmet());
app.use(methodOverride());

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// parse application/json
app.use((req, res, next) => {
    bodyParser.json({ type: 'application/json', limit: '50mb' })(req, res, err => {
        if (err) {
            res.status(400);
            res.setHeader('Response-Description', 'Invalid JSON request format. Please check the request body for valid JSON.');
            res.end();
        }
        else {
            next();
        }
    });
});

const getDurationInMilliseconds = (start) => {
    const NS_PER_SEC = 1e9;
    const NS_TO_MS = 1e6;
    const diff = process.hrtime(start);

    return (diff[0] * NS_PER_SEC + diff[1]) / NS_TO_MS;
};

app.use((req, res, next) => {
    Logger.log('info', `${req.method} ${req.originalUrl} [STARTED]`);
    const start = process.hrtime();

    res.on('finish', () => {
        const durationInMilliseconds = getDurationInMilliseconds(start);
        const durationInSeconds = (durationInMilliseconds / 1000).toFixed(2);
        Logger.log('info', `${req.method} ${req.originalUrl} [FINISHED] ${durationInSeconds.toLocaleString()} sec ${durationInMilliseconds.toLocaleString()} ms.`);
    });

    res.on('close', () => {
        const durationInMilliseconds = getDurationInMilliseconds(start);
        const durationInSeconds = (durationInMilliseconds / 1000).toFixed(2);
        Logger.log('info', `${req.method} ${req.originalUrl} [CLOSED] ${durationInSeconds.toLocaleString()} sec ${durationInMilliseconds.toLocaleString()} ms.`);
    });

    next();
});

// Increase the timeout to 10 mins
app.use((req, res, next) => {
    Logger.log('info', 'Setting up the socket timeout to 10 mins');
    req.socket.setTimeout(600000);
    next();
});

// Read all the controller files
fs.readdirSync('./controllers').forEach((file) => {
    if (file.substr(-3) === '.js') {
        let router = require('./controllers/' + file);
        router.controller(app);
    }
});

// error handling middleware should be loaded after loading the routes
if (app.get('env') === 'development') {
    // only use in development
    app.use(errorHandler());
}

let server = app.listen(port, () => console.log("App listening on port: " + port));

// Increasing the timeout to 10 mins
server.timeout = 600000;

module.exports = server;