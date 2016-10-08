/**
 * @author  reetsee.com
 * @date    20160924
 */
import $ from "jquery";
import * as basic from "./basic";

let sg = basic.safeGet;

class G {
    constructor() {
        this.gdata = {
            "user": {
                "uname": undefined,
            },
        };
        this.loginedEventList = [];
        
        this.refreshUserInfo();
    }

    registerLoginedEvent(cb) {
        for (let i = 0; i < this.loginedEventList.length; ++i) {
            if (this.loginedEventList[i] == cb) {
                return;
            }
        }
        this.loginedEventList.push(cb);
    }

    resetUser() {
        this.gdata["user"] = {
            "uname": undefined,
        };
        this.loginedEventList.forEach((cb) => {
            cb();
        });
    }

    isLogined() {
        return this.gdata["user"]["uname"] != undefined;
    }

    getUserInfo(defaultUserInfo) {
        return sg(this, ["gdata", "user"], defaultUserInfo);
    }
    
    getUserName(defaultUserName) {
        return sg(this, ["gdata", "user", "uname"], defaultUserName);
    }

    getUserAvatar(defaultUserAvatar) {
        return sg(this, ["gdata", "user", "avatar"], defaultUserAvatar);
    }

    refreshUserInfo(refreshSuccessCallback) {
        let session = basic.getCookie("session");
        if (!session || session == "") {
            this.resetUser();
            return;
        }

        // User session exists
        let srcUidAc = session.split("_");

        let source = srcUidAc[0];
        let uid = srcUidAc[1];
        let accessToken = srcUidAc[2];
        $.ajax({
            type: "GET",
            url: "/api/oauth/get_basic_user_info",
            data: {
                "source": source,
                "uid": uid,
                "access_token": accessToken,
            },
            success: function(retData, status) {
                if (sg(retData, ["errno"], -1) !== 0) {
                    basic.delCookie("session");
                    this.resetUser();
                    console.log(`get_basic_user_info failed, retData=[${JSON.stringify(retData)}], status=${status}`);
                    return;
                }

                //{
                //    "uid": 123,
                //    "uname": "xxx",
                //    "avatar": "http://xxx",
                //    "avatar_large": "http://xxx",
                //}
                this.gdata["user"] = {
                    "source": source,
                    "access_token": sg(retData, accessToken),
                    "uid": sg(retData, ["data", "uid"]),
                    "uname": sg(retData, ["data", "uname"]),
                    "avatar": sg(retData, ["data", "avatar"]),
                    "avatar_large": sg(retData, ["data", "avatar_large"]),
                };

                if (refreshSuccessCallback) {
                    refreshSuccessCallback();
                }
                this.loginedEventList.forEach((cb) => {
                    cb();
                });
            }.bind(this),
            error: function() {
                basic.delCookie("session");
                this.resetUser();
            }.bind(this)
        });
    }
}

let Global = new G();
export default Global;
