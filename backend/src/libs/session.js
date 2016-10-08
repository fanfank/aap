/**
 * @author  reetsee.com
 * @date    20161007
 */
var basic = require("./basic");

var sg = basic.safeGet;

var sessionStorage = {}; // 前期使用内存替代redis

function set(sessionKey, sessionData, ttl) {
    var info = {
        expire_time: basic.ts() + ttl,
        data: sessionData,
    };
    sessionStorage[sessionKey] = info;
}
exports.set = set;

function del(sessionKey) {
    delete sessionStorage[sessionKey];
}
exports.del = del;

function get(sessionKey, defaultData) {
    var info = sessionStorage[sessionKey];

    if (!info || info["expire_time"] <= basic.ts()) {
        return defaultData;
    }
    return info["data"];
}
exports.get = get;

function isValid(params) {
    var source = sg(params, ["source"], "unknown");
    if (source === "weibo") {
        var uid = sg(params, ["uid"], "");
        var access_token = sg(params, ["access_token"], "");
        var sdata = get(source + "_" + uid);

        var real_token = sg(sdata, ["access_token"], "");
        return real_token.constructor === String 
                && access_token.constructor === String
                && real_token.length !== 0
                && access_token.length !== 0
                && real_token === access_token;
    } else {
        return false;
    }
}
exports.isValid = isValid;
