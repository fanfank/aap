/**
 * @author  reetsee.com
 * @date    20160924
 */

import $ from "jquery";
import React from "react";

import localeDict from "../../../i18n/base.jsx";
import * as basic from "../../../basic.jsx";

import secret from "./weibo.secret.jsx";

import "./weibo.css";

let sg = basic.safeGet;
let pl = sg(localeDict, ["libs/oauth/owidget/weibo/weibo"], {}); // page locale

let oauth2AuthorizeUrl = "https://api.weibo.com/oauth2/authorize";

let WeiboWidget = React.createClass({
    getInitialState: function() {
        return {};
    },
    
    handleClicked: function() {
        let queryString = $.param({
            "display": "default",
            "client_id": secret["appKey"],
            "redirect_uri": secret["redirect"],
            "state": secret["state"], // 注意csrf攻击
            "forcelogin": false,
        });
        this.props.onClick(oauth2AuthorizeUrl + "?" + queryString);
    },

    render: function() {
        return (
            <div className="weibo-login-wrapper" onClick={this.handleClicked} >
                <div className="weibo-svg-wrapper">
				    <svg className="weibo-icon"><use xlinkHref="#icon-weibo"></use></svg>
                </div>
                <div className="weibo-title-wrapper">
                    <span>
                        {sg(pl, ["title"], "Use Weibo")}
                    </span>
                </div>
            </div>
        );
    },
});

export default WeiboWidget;
