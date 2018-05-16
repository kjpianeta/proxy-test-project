const expect = require('chai').expect;
const nock = require('nock');
const app = require('../app');
let request = require('supertest');
const util = require('util');
const _ = require('lodash');

/**
 * The getHttpStatusCodeTemplate function returns a template based on the httpStatusCode passed in
 * @param httpStatusCode
 * @returns {*} NXX
 */
function getHttpStatusCodeTemplate(httpStatusCode) {
    const httpStatusCodeRegEx = /^[2-5][0-9][0-9]$/;
    if (httpStatusCodeRegEx.test(httpStatusCode)) {
        const regexTemplate = /^([2-5])([0-9])([0-9])/gm;
        const str = String(httpStatusCode);
        const subst = '$1XX';
        const result = str.replace(regexTemplate, subst);
        return result;
    }
    return null;
}

describe('Test when upstream proxy request httpStatus returns 200', function () {
    const testHttpStatus = 200;
    const testHttpStatusCount = '1';
    before(function () {
        nock.cleanAll();
        nock('http://www.google.com')
            .get('/')
            .delay(1000)
            .reply(testHttpStatus, "Test status");
    });
    describe('Given client calls proxy', function () {
        it('When proxy call to target www.google.com returns httpStatus 200 after ~ 1000ms', function (done) {
            request(app).get('/proxy?target=http://www.google.com').then((response) => {
                expect(response.statusCode).to.equal(testHttpStatus);
                done();
            });
        });
        it('Then proxy reports target httpStatus 2XX increased by 1', function (done) {
            request(app).get('/proxy/stats').then((response) => {
                expect(response.statusCode).to.equal(200);
                console.log(util.inspect(response.body, false, null));
                const indexTargetRecord = _.findIndex(response.body, ['target', 'http://www.google.com']);
                const httpStatusCount = _.find(response.body[indexTargetRecord].http_status, getHttpStatusCodeTemplate(testHttpStatus))[getHttpStatusCodeTemplate(testHttpStatus)];
                console.log(httpStatusCount);
                expect(httpStatusCount).to.equal(testHttpStatusCount);
                done();
            });
        });
    });
});
describe('Test when upstream proxy request httpStatus returns 300', function () {
    const testHttpStatus = 300;
    const testHttpStatusCount = '1';
    before(function () {
        nock.cleanAll();
        nock('http://www.google.com')
            .get('/')
            .delay(1000)
            .reply(testHttpStatus, "Test status");
    });
    describe('Given client calls proxy', function () {
        it('When proxy call to target www.google.com returns httpStatus 300 after ~ 1000ms', function (done) {
            request(app).get('/proxy?target=http://www.google.com').then((response) => {
                expect(response.statusCode).to.equal(testHttpStatus);
                done();
            });
        });
        it('Then proxy reports target httpStatus 3XX increased by 1', function (done) {
            request(app).get('/proxy/stats').then((response) => {
                expect(response.statusCode).to.equal(200);
                console.log(util.inspect(response.body, false, null));
                const indexTargetRecord = _.findIndex(response.body, ['target', 'http://www.google.com']);
                const httpStatusCount = _.find(response.body[indexTargetRecord].http_status, getHttpStatusCodeTemplate(testHttpStatus))[getHttpStatusCodeTemplate(testHttpStatus)];
                console.log(httpStatusCount);
                expect(httpStatusCount).to.equal(testHttpStatusCount);
                done();
            });
        });
    });
});
describe('Test when upstream proxy request httpStatus returns 400', function () {
    const testHttpStatus = 400;
    const testHttpStatusCount = '1';
    before(function () {
        nock.cleanAll();
        nock('http://www.google.com')
            .get('/')
            .delay(1000)
            .reply(testHttpStatus, "Test status");
    });
    describe('Given client calls proxy', function () {
        it('When proxy call to target www.google.com returns httpStatus 400 after ~ 1000ms', function (done) {
            request(app).get('/proxy?target=http://www.google.com').then((response) => {
                expect(response.statusCode).to.equal(testHttpStatus);
                done();
            });
        });
        it('Then proxy reports target httpStatus 4XX increased by 1', function (done) {
            request(app).get('/proxy/stats').then((response) => {
                expect(response.statusCode).to.equal(200);
                console.log(util.inspect(response.body, false, null));
                const indexTargetRecord = _.findIndex(response.body, ['target', 'http://www.google.com']);
                const httpStatusCount = _.find(response.body[indexTargetRecord].http_status, getHttpStatusCodeTemplate(testHttpStatus))[getHttpStatusCodeTemplate(testHttpStatus)];
                console.log(httpStatusCount);
                expect(httpStatusCount).to.equal(testHttpStatusCount);
                done();
            });
        });
    });
});
describe('Test when upstream proxy request httpStatus returns 500', function () {
    const testHttpStatus = 500;
    const testHttpStatusCount = '1';
    before(function () {
        nock.cleanAll();
        nock('http://www.google.com')
            .get('/')
            .delay(1000)
            .reply(testHttpStatus, "Test status");
    });
    describe('Given client calls proxy', function () {
        it('When proxy call to target www.google.com returns httpStatus 500 after ~ 1000ms', function (done) {
            request(app).get('/proxy?target=http://www.google.com').then((response) => {
                expect(response.statusCode).to.equal(testHttpStatus);
                done();
            });
        });
        it('Then proxy reports target httpStatus 5XX increased by 1', function (done) {
            request(app).get('/proxy/stats').then((response) => {
                expect(response.statusCode).to.equal(200);
                console.log(util.inspect(response.body, false, null));
                const indexTargetRecord = _.findIndex(response.body, ['target', 'http://www.google.com']);
                const httpStatusCount = _.find(response.body[indexTargetRecord].http_status, getHttpStatusCodeTemplate(testHttpStatus))[getHttpStatusCodeTemplate(testHttpStatus)];
                console.log(httpStatusCount);
                expect(httpStatusCount).to.equal(testHttpStatusCount);
                done();
            });
        });
    });
});
