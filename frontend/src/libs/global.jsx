/**
 * @author  reetsee.com
 * @date    20160924
 */
import $ from "jquery";
class G {
    constructor() {
        this.gdata = {
            "user": {
                "username": undefined,
            },
        };
        //$.ajax({
        //    type: "GET",
        //    url: "/api/user/get_cas_user",
        //    data: {},
        //    success: function(retData, status) {
        //        if (retData && retData["data"] && retData["data"]["username"]) {
        //            console.log("username is: " + retData["data"]["username"]);
        //            this.gdata["user"]["username"] = retData["data"]["username"];

        //            $.ajaxSetup({
        //                beforeSend: function(xhr) {
        //                    xhr.setRequestHeader('X-Op-User', retData["data"]["username"]);
        //                }
        //            });
        //        }
        //    }.bind(this),
        //    error: function() {}.bind(this)
        //});
    }

    isLogined() {
        return this.gdata["user"]["username"] != undefined;
    }
    
    getUserName(defaultUserName) {
        return this.gdata["user"]["username"] || defaultUserName;
    }
}

let Global = new G();
export default Global;
