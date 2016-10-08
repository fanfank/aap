/**
 * @author  reetsee.com
 * @date    20160925
 */
var request = require("request");
var path = require("path");
var ROOT_PATH = path.resolve(__dirname, '..');

var basic = require(ROOT_PATH + '/libs/basic');
var session = require(ROOT_PATH + "/libs/session");
var oauthConf = require(ROOT_PATH + "/conf/oauth.secret");

var sg = basic.safeGet;
var lz = basic.lz;
var jr = basic.jsonResp;

var ACCESS_METHOD_GET  = ['GET'];
var ACCESS_METHOD_POST = ['POST'];
var ACCESS_METHOD_GET_POST = ['GET', 'POST'];
var ACCESS_METHOD_ALL = ['GET', 'POST', 'OPTIONS'];

exports.entrance = function(req, res, next) {
    var ifaceDict = {
        'weibo_authorize': [ACCESS_METHOD_POST, weiboAuthorize],
        "get_basic_user_info": [ACCESS_METHOD_GET_POST, getBasicUserInfo],
        "logout": [ACCESS_METHOD_GET_POST, logout],
    };

    var iface = req.params.iface;
    if (!ifaceDict[iface]) {
        res.status(404).send('iface ' + iface + ' not found');
        return;
    }
    if (ifaceDict[iface][0].indexOf(req.method) < 0) {
        res.status(403).send(
            'iface ' + iface 
            + ' is not allowed to access with method ' 
            + req.method
        );
        return;
    }

    ifaceDict[iface][1](req, res);
}

function weiboAuthorize(req, res) {
    state = req.body.state;
    code = req.body.code;
    error_code = req.body.error_code;
    error_description = req.body.error_description;

    if (error_code != 0 && error_code != "0") {
        jr(res, {
            errno: error_code,
            errmsg: "Request invalid: " + error_description,
        });
        return;
    }
    
    // Fill user session
    var formData = {
        client_id: oauthConf.weiboOauthConf.appKey,
        client_secret: oauthConf.weiboOauthConf.appSecret,
        grant_type: "authorization_code",
        code: code,
        redirect_uri: oauthConf.weiboOauthConf.redirect_uri,
    };

    request.post(
        {
            url: "https://api.weibo.com/oauth2/access_token",
            form: formData,
        },
        function(error, response, body) {
 			//{
 			//    "access_token": "ACCESS_TOKEN",
 			//    "expires_in": 1234,
 			//    "remind_in":"798114",
 			//    "uid":"12341234"
 			//}

            var data = basic.decode(body, {});

            var access_token = sg(data, ["access_token"], "");
            if (error || response.statusCode != 200 || !access_token || access_token.length == 0) {
                jr(res, {
                    errno: -1,
                    errmsg: "Get access token failed, "
                        + "error=[" + error + "], "
                        + "status=[" + response.statusCode+ "], "
                        + "body=[" + body + "]",
                });
                return;
            }

            // 设置session
            session.set("weibo_" + data["uid"], data, sg(data, ["expires_in"], 24 * 3600));

            // 设置cookie
            // 待前端执行

            jr(res, {
                errno: 0,
                errmsg: "success",
                data: {
                    "source": "weibo",
                    "access_token": access_token,
                    "expires_in": sg(data, ["expires_in"]),
                    "uid": sg(data, ["uid"]),
                },
            });
            return;
        }
    );
    return;
}

function logout(req, res) {
    source = req.body.source || "";
    uid = req.body.uid || "";
    session.del(source + "_" + uid);
    jr(res, {
        errno: 0,
        errmsg: "success",
    });
}

function getBasicUserInfo(req, res) {
    source = req.query.source || req.body.source;
    if (!source) {
        jr(res, {
            errno: -1,
            errmsg: "invalid params",
            data: {
                source: source,
            }
        });
        return;
    }

    if (source == "weibo") {
        var uid = req.query.uid || req.body.uid;
        var access_token = req.query.access_token || req.body.access_token;
        if (!uid || !access_token || !session.isValid({source:source, uid:uid, access_token:access_token})) {
            jr(res, {
                errno: -1,
                errmsg: "invalid params or session expired",
                data: {
                    uid: uid,
                    access_token: access_token || "",
                }
            });
            return;
        }

        var formData = {
            uid: uid,
            access_token: access_token,
        };

        request.get(
            {
                url: "https://api.weibo.com/2/users/show.json",
                qs: formData,
            },
            function(error, response, body) {
                var data = basic.decode(body, {"error_code": -1, "error": "unknown failure"});

                var errno = sg(data, ["error_code"], 0);
                if (error || response.statusCode != 200 || errno != 0) {
                    jr(res, {
                        errno: -1,
                        errmsg: "Get weibo user info failed, "
                            + "error=[" + error + "], "
                            + "status=[" + response.statusCode+ "], "
                            + "body=[" + body + "]",
                    });
                    return;
                }

                jr(res, {
                    errno: 0,
                    errmsg: "success",
                    data: {
                        uid: sg(data, ["id"], uid),
                        uname: sg(data, ["screen_name"]) || sg(data, ["name"], ""),
                        avatar: sg(data, ["profile_image_url"]),
                        avatar_large: sg(data, ["avatar_large"]),
                    },
                });
                return;
            }
        );
        return;
    } else {
        jr(res, {
            errno: -2,
            errmsg: "invalid source: [" + source + "]",
        });
        return;
    }
}
