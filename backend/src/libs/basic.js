/**
 * @author  reetsee.com
 * @date    20160621
 */

function safeGet(data, fieldPath, defaultValue) {
    var targetFieldValue = data;
    for (var i = 0; i < fieldPath.length; ++i) {
        if (!targetFieldValue || typeof(targetFieldValue) !== "object") {
            return defaultValue;
        }
        targetFieldValue = targetFieldValue[fieldPath[i]];
    }
    if (targetFieldValue == undefined) {
        return defaultValue;
    }
    return targetFieldValue;
};
exports.safeGet = safeGet;

function lz(content) {
    return content.length === 0;
};
exports.lz = lz;

function decode(jstr, defaultValue) {
    if (!jstr) {
        return defaultValue;
    } else if (typeof(jstr) == "object") {
        return jstr;
    } else if (typeof(jstr) != "string") {
        return defaultValue;
    } else {
        return JSON.parse(jstr);
    }
};
exports.decode = decode;

function encode(jobj) {
    if (!jobj) {
        return null;
    } else if (typeof(jobj) == "string") {
        return jobj;
    } else if (typeof(jobj) != "object") {
        return null;
    } else {
        return JSON.stringify(jobj);
    }
};
exports.encode = encode;

function keys(obj) {
    var keys = [];
    for (var key in obj) {
        if (obj.hasOwnProperty(key)) {
            keys.push(key);
        }
    }
    return keys;
};
exports.keys = keys;

function values(obj) {
    var values = [];
    for (var key in obj) {
        if (obj.hasOwnProperty(key)) {
            values.push(obj[key]);
        }
    }
    return values;
};
exports.values = values;

function isVoid(t) {
    return t === undefined || t === null;
};
exports.isVoid = isVoid;

function jsonResp(res, data) {
    res.json(data);
};
exports.jsonResp = jsonResp;

function ts() {
    return Math.floor(Date.now() / 1000);
};
exports.ts = ts;

function buildFieldDict(r, fieldList) {
    var resDict = {};
    fieldList.forEach(function(field) {
        var val = safeGet(r, [field]);
        if (!isVoid(val)) {
            resDict[field] = val;
        }
    });
    return resDict;
};
exports.buildFieldDict = buildFieldDict;

