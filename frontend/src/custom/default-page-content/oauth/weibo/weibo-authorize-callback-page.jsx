/**
 * @author  reetsee.com
 * @date    20160925
 */
import $ from 'jquery';
import React from "react";

import * as basic from "../../../../libs/basic.jsx";
import localeDict from "../../../../libs/i18n/base.jsx";

let sg = basic.safeGet;
let pl = sg(localeDict, ["custom/default-page-content/oauth/weibo/weibo-authorize-callback-page"], {});

export let WeiboAuthorizeCallbackPage = React.createClass({
    getInitialState: function() {
        let urlParams = basic.getUrlParams();

        let state = sg(urlParams, ["params", "state"], "");
        let code  = sg(urlParams, ["params", "code"], "");

        return {
            "state": state,
            "code": code,
            "error_code": sg(urlParams, ["params", "error_code"], code == "" ? -1 : 0),
            "error_description": decodeURI(sg(urlParams, ["params", "error_description"], "")),
        };
    },
    
    syncLoginedStatus: function() {
        $.ajax({
            type: "POST",
            url: "/api/oauth/weibo_authorize",
            data: this.state,
            success: function(data, status) {
                const message = this.state;
                message["errno"] = sg(data, ["errno"], -1);
                message["errmsg"] = sg(data, ["errmsg"], "Sync logined status failed");
                message["data"] = sg(data, ["data"], {});
                window.top.postMessage(message, "*");
            }.bind(this),
            error: function() {
                const message = this.state;
                message["errno"] = -1;
                message["errmsg"] = "Sync logined status failed";
                window.top.postMessage(message, "*");
            }.bind(this)
        });
    },

    render: function() {
        let desc = sg(pl, ["ec2msg_" + this.state.error_code], null);
        if (!desc) {
            desc = sg(pl, ["defaultMsg"], "") + ": " + this.state.error_description;
        }

        if (this.state.error_code != "0" && this.state.error_code != 0) {
            window.top.postMessage(this.state, "*");
        } else {
            this.syncLoginedStatus();
        }
        
        return (
            <div>
                <div style={{margin: "auto", textAlign: "center", verticalAlign: "middle"}}>
                    <span>
                    {desc}
                    </span>
                </div>
            </div>
        );
    },
});
