/**
 * @author  reetsee.com
 * @date    20160621
 */

exports.safeGet = function (data, fieldPath, defaultValue) {
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

exports.lz = function (content) {
    return content.length === 0;
};

exports.decode = function(jstr, defaultValue) {
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

exports.encode = function(jobj) {
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

exports.keys = function(obj) {
    let keys = [];
    for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
            keys.push(key);
        }
    }
    return keys;
};

exports.values = function(obj) {
    let values = [];
    for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
            values.push(obj[key]);
        }
    }
    return values;
};

exports.isVoid = function(t) {
    return t === undefined || t === null;
};

exports.jsonResp = function(res, data) {
    res.setHeader('Content-Type', 'application/json; charset=utf-8;');
    res.send(encode(data));
};
