const express = require('express');
const logger = require('morgan');
const request = require('request');
const _ = require('lodash');
const app = express();
const targetStore = require("./target-stats-store.js");
const recordExpireMs = 6000 * 10;
const pjson = require('root-require')('package.json');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));

function getRequestOptions(req) {
    let options;
    options = {
        url: String(req.query.target),
        headers: {
            'User-Agent': pjson.name,
            'X-Forwarded-For': req.connection.remoteAddress
        }
    };
    return options;
}

/**
 * The getHttpStatusCodeTemplate function returns a string based on the httpStatusCode passed in
 * @param httpStatusCode
 * @returns {*} NXX
 */
function getHttpStatusCodeTemplate(statusCode) {
    const httpStatusCodeRegEx = /^[2-5][0-9][0-9]$/;
    if (httpStatusCodeRegEx.test(statusCode)) {
        const regexTemplate = /^([2-5])([0-9])([0-9])/gm;
        const str = String(statusCode);
        const subst = '$1XX';
        return str.replace(regexTemplate, subst);
    }
    return null;
}

app.get('/proxy/stats', function (req, res) {
    res.send(targetStore.getAll());
});

app.get('/proxy', function (req, res) {
    const start = new Date();
    const targetUrl = String(req.query.target);
    const remoteRequest = request
        .get(getRequestOptions(req))
        .on('response', function (response) {
            const elapsedTimeMs = (new Date() - start);
            let timeValues = [];
            let currentobject = targetStore.get(targetUrl);
            currentobject.count = _.sum([currentobject.count, 1]);
            timeValues.push(elapsedTimeMs);
            currentobject.avg_latency_ms > 0 || timeValues.push(elapsedTimeMs);
            currentobject.avg_latency_ms = _.mean(timeValues);
            const newCount = _.sum([Number(_.find(currentobject.http_status, getHttpStatusCodeTemplate(response.statusCode))[getHttpStatusCodeTemplate(response.statusCode)]), 1]);
            const currentHttpStatusCountIndex = _.findIndex(currentobject.http_status, getHttpStatusCodeTemplate(response.statusCode));
            Object.defineProperty(currentobject.http_status[currentHttpStatusCountIndex], getHttpStatusCodeTemplate(response.statusCode), {'value': String(newCount)});
            targetStore.set(targetUrl, currentobject, recordExpireMs);
        });
    req.pipe(remoteRequest).pipe(res);
});

app.use(function (err, req, res, next) {
    console.error(err.stack);
    res.status(500).send('Something broke!')
});
module.exports = app;
