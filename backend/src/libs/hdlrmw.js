/**
 * @author  reetsee.com
 * @date    20161007
 */
var path = require('path');
var ROOT_PATH = path.resolve(__dirname, '..');

var basic = require("./basic");
var session = require("./session/session");

var validationConf = {};
try {
    settings = require(ROOT_PATH + "/conf/settings.secret");
    validationConf = basic.safeGet(settings, ["validation"], {});
} catch(e) {
    validationConf = {};
}

var sg = basic.safeGet;

function validateSession(req, res, next) {
    var vconf = sg(validationConf, ["conf"]);
    var needWriteValidation = sg(vconf, ["needWriteValidation"], false);
    if (!vconf || !needWriteValidation) {
        return null;
    }

    var cookies = req.cookies;
    var reqSession = sg(cookies, ["session"], "");
    if (!reqSession || reqSession.length == 0) {
        return "请先登录";
    }

    var tupleList = reqSession.split("_");
    if (tupleList.length < 3) {
        return "登录状态已失效，请重新登录";
    }

    var isAdmin = false;
    var adminIdList = sg(vconf, ["adminIdList"], []);
    for (var i = 0; i < adminIdList; ++i) {
        if (tupleList[1] == adminIdList[i]) {
            isAdmin = true;
            break;
        }
    }
    if (!isAdmin) {
        return "当前帐号非管理员帐号，无法继续操作";
    }

    var isValid = session.isValid({
        "source": tupleList[0],
        "uid": tupleList[1],
        "access_token": tupleList[2],
    });
    if (!isValid) {
        return "登录状态已失效，请重新登录";
    }

    return null;
} 
exports.validateSession = validateSession;
