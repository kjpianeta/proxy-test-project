const _ = require('lodash');
const default_expiration = 6000 * 10;

function getTargetStatsObject(targetURL) {
    result = {
        "target": targetURL,
        "count": 0,
        "http_status": [
            {
                "2XX": "0"
            },
            {
                "3XX": "0"
            },
            {
                "4XX": "0"
            },
            {
                "5XX": "0"
            }
        ],
        "avg_latency_ms": 0.00
    };
    return result;
}

/**
 * This is the constructor which exposes:
 * set
 * get
 * delete
 *
 */
const targetStatsStore = function targetStatsStore() {
    const targets = {};
    /**
     * The set function stores the target object to targets.
     * @param key target URL
     * @param data targetStatsObject
     * @param expire Milliseconds from now to expire object from targets
     */
    this.set = function (key, data, expire) {
        expire = expire || default_expiration;
        this.delete(key);

        targets[key] = {
            data: data,
            timer: setTimeout(function () {
                this.delete(key)
            }.bind(this), expire)
        };
    };
    /**
     * This get function returns a targetStatsObject using the targetUrl as the key.
     * If the requested key isn't found, it returns a new targetStatsObject but doesn't
     * add it to targets.
     * @param key targetUrl
     * @returns {*} targetStatsObject
     */
    this.get = function (key) {
        if (typeof(targets[key]) !== "undefined" && targets[key] !== null &&
            typeof(targets[key].data) !== "undefined" && targets[key].data !== null
        ) {
            return targets[key].data;
        }
        return getTargetStatsObject(key);
    };
    /**
     *This delete function removes a targetStatsObject using the targetUrl as the key.
     * It also deletes the expiration timer for the targetStatsObject.
     * @param key targetUrl
     */
    this.delete = function (key) {
        if (typeof(targets[key]) !== "undefined" && targets[key] !== null &&
            typeof(targets[key].timer) !== "undefined" && targets[key].timer !== null
        ) {
            clearTimeout(targets[key].timer);
            delete targets[key];
        }
    };
    /**
     *  This function returns an array of targetStatsObject
     * @returns {Array}
     */
    this.getAll = function () {
        return _.map(targets, 'data');
    };

    /**
     * Make sure this module can't be instantiated externally.
     */
    if (targetStatsStore.caller !== targetStatsStore.getInstance) {
        throw new Error("This object cannot be instantiated externally");
    }
};

/**
 * Making sure it doesn't exist on init
 * @type {null}
 */
targetStatsStore.instance = null;

/**
 * Invoking the constructor.
 * @returns {null}
 */
targetStatsStore.getInstance = function () {
    if (this.instance === null) {
        this.instance = new targetStatsStore();
    }
    return this.instance;
};

/**
 * Defines the interface and makes it public
 * @type {targetStatsStore}
 */
module.exports = targetStatsStore.getInstance();