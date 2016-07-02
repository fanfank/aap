/**
 * @author  reetsee.com
 * @date    20160616
 */

export function statusOk(status, shouldAlert) {
    shouldAlert = shouldAlert || true;

    if (status === "success") {
        return "";
    }

    let errorMessage = "http status error: [" + status + "]";
    console.log(errorMessage);

    if (shouldAlert) {
        alert(errorMessage);
    }
    
    return errorMessage;
}

export function errnoOk(data, shouldAlert) {
    shouldAlert = shouldAlert || true;

    if (data["errno"] == 0) {
        return "";
    }

    let errorMessage = "errno not 0: [" + JSON.stringify(data) + "]";
    console.log(errorMessage);

    if (shouldAlert) {
        alert(errorMessage);
    }

    return errorMessage;
}

export function safeGet(data, fieldPath, defaultValue) {
    let targetFieldValue = data;
    for (let i = 0; i < fieldPath.length; ++i) {
        if (!targetFieldValue || typeof(targetFieldValue) !== "object") {
            return defaultValue;
        }
        targetFieldValue = targetFieldValue[fieldPath[i]];
    }
    if (targetFieldValue == undefined) {
        return defaultValue;
    }
    return targetFieldValue;
}

export function keys(obj) {
    let keys = [];
    for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
            keys.push(key);
        }
    }
    return keys;
}

export function decode(jstr, defaultValue) {
    if (!jstr) {
        return defaultValue;
    } else if (typeof(jstr) == "object") {
        return jstr;
    } else if (typeof(jstr) != "string") {
        return defaultValue;
    } else {
        return JSON.parse(jstr);
    }
}

export function encode(jobj) {
    if (!jobj) {
        return null;
    } else if (typeof(jobj) == "string") {
        return jobj;
    } else if (typeof(jobj) != "object") {
        return null;
    } else {
        return JSON.stringify(jobj);
    }
}

export function isVoid(t) {
    return t === undefined || t === null;
}

export let hostPortPrefix = '';
