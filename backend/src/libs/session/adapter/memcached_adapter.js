/**
 * @author  reetsee.com
 * @date    20161225
 */
var Memcached = require("memcached");
var basic = require("../../basic");
function MemcachedAdapter(serverLocations) {
    this.memcached = new Memcached(serverLocations);
    this.set = function(sessionKey, sessionData, ttl) {
        sessionData = basic.encode(sessionData);
        return new Promise(function(resolve, reject) {
            this.memcached.set(sessionKey, sessionData, ttl, function(err) {
                    if (err) {
                        reject({
                            errno: -1,
                            errmsg: "failed",
                            data: err,
                        });
                        return;
                    }
                    resolve({errno: 0, "errmsg": "success"});
                }
            );
        }.bind(this));
    };
    this.del = function(sessionKey) {
        return new Promise(function(resolve, reject) {
            this.memcached.del(sessionKey, function(err) {
                if (err) {
                    reject({
                        errno: -1,
                        errmsg: "failed",
                        data: err,
                    });
                }
                resolve({
                    errno: 0,
                    errmsg: "success",
                });
            });
        }.bind(this));
    };
    this.get = function(sessionKey, defaultData) {
        return new Promise(function(resolve, reject) {
            this.memcached.get(sessionKey, function(err, data) {
                if (err) {
                    reject({
                        errno: -1,
                        errmsg: "failed",
                        err: err,
                        data: defaultData,
                    });
                }

                if (!data || data.length == 0) {
                    resolve({
                        errno: 0,
                        errmsg: "default",
                        data: defaultData,
                    });
                } else {
                    resolve({
                        errno: 0,
                        errmsg: "success",
                        data: data,
                    });
                }
            });
        }.bind(this));
    };
}
module.exports = MemcachedAdapter;
