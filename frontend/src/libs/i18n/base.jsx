/**
 * @author  reetsee.com
 * @date    20160924
 */
let path = require("path");

import * as basic from "../basic.jsx";

import customDict from "./zh-cn.jsx";

let localeDict = {
    "page/avatar/avatar": {
        "login": "登录",
        "logout": "退出登录",
        "defaultUserName": "火星用户",
        "defaultAvatarUrl": "http://7xsgk1.com1.z0.glb.clouddn.com/touxiang.jpg",
    },
    "libs/oauth/owidget/weibo/weibo": {
        "title": "使用微博登录",
    },
    "libs/oauth/oauth": {
        "title": "登     录",
    },
    "custom/default-page-content/oauth/weibo/weibo-authorize-callback-page": {
        "defaultMsg": "出错啦",
        "ec2msg_0": "登录成功，自动跳转中...",
        "ec2msg_21330": "返回中...",
    }
};

basic.mergeDict(localeDict, customDict);

export default localeDict;
