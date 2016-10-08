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

    let errorMessage = JSON.stringify(data);
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

export function mergeDict(base, tobeMerged) {
    // Caution: this function will change 'base'

    if (base.constructor != Object || tobeMerged.constructor != Object) {
        return base;
    }

    for (let k in tobeMerged) {
        if (!tobeMerged.hasOwnProperty(k)) {
            continue;
        }

        let v = tobeMerged[k];
        if (!base.hasOwnProperty(k)) {
            base[k] = v;
        }

        mergeDict(base[k], tobeMerged[k]);
    }

    return base;
}

/**
 * @author reetsee.com
 * @param
 * @return
 *         {
 *             "query": "xxx",
 *             "params": {
 *                 "a": "3",
 *                 "b": "2",
 *                 "c": "1"
 *             }
 *         }
 * @desc   解析URL中"#"号前的参数
 *         如return中为以下url的解析示例：
 *         http://abc.com/xxx?a=3&b=2&c=1#add-task?a=1&b=2&c=3
 */
export function getUrlParams(url) {
    url = url || window.location.href;
    var sharp_pos = url.indexOf("#");
    if (sharp_pos == -1) {
        sharp_pos = url.length;
    }

    var url_before_sharp = url.substring(0, sharp_pos);
    var last_bslash_pos = url_before_sharp.lastIndexOf("/");
    var qmark_pos = url_before_sharp.indexOf("?", last_bslash_pos);
    if (qmark_pos == -1) {
        return {
            "query": url_before_sharp.substring(last_bslash_pos + 1, qmark_pos),
            "params": {}
        };  
    }   

    var param_string = url_before_sharp.substring(qmark_pos + 1); 
    return {
        "query": url_before_sharp.substring(last_bslash_pos + 1, qmark_pos),
        "params": getParamFromString(param_string)
    };  
}

export function getParamFromString(param_string, decode_string) {
    if (decode_string) {
        param_string = decodeURIComponent(param_string);
    }

    var param_array = param_string.split("&");
    var url_params = {};
    for (var index in param_array) {
        var tuple = param_array[index].split("=");
        if (tuple[0] == undefined) {
            continue;
        }

        var left_brace_pos  = tuple[0].indexOf("[");
        var right_brace_pos = tuple[0].lastIndexOf("]");
        if (left_brace_pos != -1) {
            //only consider list
            key = tuple[0].substring(0, left_brace_pos);
            if (url_params[key] == undefined) {
                url_params[key] = [];
            }
            url_params[key].push(tuple[1]);
        } else {
            url_params[tuple[0]] = tuple[1];
        }
    }

    return url_params;
}

export function lstrip(s, chars) {
    if (s.constructor !== String) { return s; }

    if (!chars) { chars = " "; }

    let charDict = {};
    for (let i = 0; i < chars.length; ++i) {
        charDict[chars[i]] = true;
    }
    
    let lpos = 0;
    while (lpos < s.length && charDict[s[lpos]]) lpos++;
    return s.substr(lpos, s.length - lpos);
}

export function rstrip(s, chars) {
    if (s.constructor !== String) { return s; }
    if (!chars) { chars = " "; }

    let charDict = {};
    for (let i = 0; i < chars.length; ++i) {
        charDict[chars[i]] = true;
    }
    
    let rpos = s.length - 1;
    while (rpos >= 0 && charDict[s[rpos]]) rpos--;
    return s.substr(0, rpos + 1);
}

export function strip(s, chars) {
    return rstrip(lstrip(s));
}

export function setCookie(cname, cvalue, exsecs, path, domain) {
	exsecs = exsecs === 0 ? exsecs : exsecs || 3600 * 24;
    path = path ? path : "/";
    var d = new Date();
    d.setTime(d.getTime() + (exsecs*1000));
    var expires = "expires="+d.toUTCString();
    document.cookie = cname + "=" + cvalue 
            + "; " + expires
            + ((path) ? "; path=" + path : "")
            + ((domain) ? "; domain=" + domain : "");
}

export function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

export function delCookie(cname) {
	setCookie(cname, getCookie(cname), 0);
}

//export function setCookie(cname, cvalue, ex_in_secs) {
//	var cookieArray = safeGet(document, ["cookie"], "").split(";").map((e) => {
//        let kv = strip(e).split("=");
//        if (cname == kv[0]) { return ""; }
//        return kv.join("=");
//    }).filter((e) => e != "");
//    cookieArray.push(cname + "=" + cvalue);
//    console.log(cookieArray.join("; "));
//    document.cookie = cookieArray.join("; ");
//}
//
//export function getCookie(cname) {
//    var kvArray = safeGet(document, ["cookie"], "").split(";");
//    for (let i = 0; i < kvArray.length; ++i) {
//        let kv = strip(kvArray[i]).split("=");
//        if (kv[0] == cname) {
//            return kv[1];
//        }
//    }
//    return "";
//}
//
//export function delCookie(cname) {
//	var cookieArray = safeGet(document, ["cookie"], "").split(";").map((e) => {
//        let kv = strip(e).split("=");
//        if (cname == kv[0]) { return ""; }
//        return kv.join("=");
//    }).filter((e) => e != "");
//
//    if (cookieArray.length == 0) {
//        cookieArray.push("dummy=dummy");
//    }
//    
//    document.cookie = cookieArray.join("; ");
//}

export let hostPortPrefix = '';
