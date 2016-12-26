/**
 * @author  reetsee.com
 * @date    20161007
 */
var path = require('path');
var ROOT_PATH = path.resolve(__dirname, '..', '..');

var basic = require("../basic");
var cipher = require("../cipher");
var settings = require(ROOT_PATH + "/conf/settings.secret");
var MemoryAdapter = require("./adapter/memory_adapter");
var MemcachedAdapter = require("./adapter/memcached_adapter");
var sessionConf = settings.session || {};

var sg = basic.safeGet;

console.log("Init session. Use " + sessionConf.storageEngine + " as storage engine.");
var adapter = undefined;
switch(sessionConf.storageEngine) {
case "memcached":
    adapter = new MemcachedAdapter(sessionConf.detail.serverLocations);
    break;
case "memory":
default:
    adapter = new MemoryAdapter();
    break;
}


function set(sessionKey, sessionData, ttl) {
    return adapter.set(sessionKey, sessionData, ttl);
}
exports.set = set;

function del(sessionKey) {
    return adapter.del(sessionKey);
}
exports.del = del;

function get(sessionKey, defaultData) {
    return adapter.get(sessionKey, defaultData);
}
exports.get = get;

function isValid(params) {
    var source = sg(params, ["source"], "unknown");
    if (source === "weibo") {
        var uid = sg(params, ["uid"], "");
        var access_token_hash = cipher.sha256(sg(params, ["access_token"], ""));
        return new Promise(function(resolve, reject) {
            get(source + "_" + uid).then(function(session_value_data) {
                session_value = session_value_data.data;
                resolve(session_value && access_token_hash
                    && session_value.constructor === String
                    && access_token_hash.constructor === String
                    && session_value.length !== 0
                    && access_token_hash.length !== 0
                    && session_value === access_token_hash
                );
            }).catch(function(session_value_data) {
                console.error(session_value_data);
                resolve(false);
            });
        });
    } else {
        return new Promise(function(resolve, reject) {
            resolve(false);
        });
    }
}
exports.isValid = isValid;
