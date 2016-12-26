/**
 * @author  reetsee.com
 * @date    20161225
 */
var basic = require("../../basic");
function MemoryAdapter() {
    this.storage = {};
    this.set = function(sessionKey, sessionData, ttl) {
        this.storage[sessionKey] = {
            expire_time: basic.ts() + ttl,
            data: sessionData,
        };
        return new Promise(function(resolve, reject) {
            resolve({errno: 0, errmsg: "success"});
        });
    };
    this.del = function(sessionKey) {
        delete this.storage[sessionKey];
        return new Promise(function(resolve, reject) {
            resolve({errno: 0, errmsg: "success"});
        });
    };
    this.get = function(sessionKey, defaultData) {
        return new Promise(function(resolve, reject) {
            var info = this.storage[sessionKey];
            if (!info || info["expire_time"] <= basic.ts()) {
                resolve({errno: 0, errmsg: "default", data: defaultData});
            }
            resolve({errno: 0, errmsg: "success", data: info["data"]});
        });
    };
}
module.exports = MemoryAdapter;
