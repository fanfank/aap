/**
 * @author  reetsee.com
 * @date    20160924
 */
import { Modal, Notification } from "antd";
import React from "react";

import localeDict from "../i18n/base.jsx";
import * as basic from "../basic.jsx";
import Global from "../global.jsx";

import WeiboWidget from "./owidget/weibo/weibo.jsx";

import "./oauth.css";

let sg = basic.safeGet;
let pl = sg(localeDict, ["libs/oauth/oauth"], {}); // page locale

let Oauth = React.createClass({
    getInitialState: function() {
        return {
            "iframeUrl": undefined,
        };
    },

    handleWidgetClicked: function(iframeUrl) {
        this.setState({"iframeUrl": iframeUrl});

        let postMessageCallback = function(ev) {
            window.removeEventListener("message", postMessageCallback);
            let data = ev.data;
            if (data["errno"] != 0) {
                Notification["error"]({
                    message: "登录失败",
                    description: data["errmsg"],
                    duration: 5,
                });
            } else {
                // write cookie
                basic.setCookie(
                    "session", 
                    data["data"]["source"] 
                        + "_" + data["data"]["uid"]
                        + "_" + data["data"]["access_token"],
                    data["data"]["expires_in"]
                );

                // refresh user info
                Global.refreshUserInfo(this.props.onLogined);
            }

            this.handleIframeModalCancel();
        }.bind(this);
        
        // NOTE: 'once' is not supported by some browsers,
        //       therefore we use removeEventListener
        window.addEventListener("message", postMessageCallback);
    },

    handleIframeModalCancel: function() {
        this.setState({"iframeUrl": undefined});
    },

    render: function() {
        let iframeModal = <div></div>;
        if (this.state.iframeUrl) {
            iframeModal = (
                <Modal
                    footer={null}
                    visible={true}
                    maskClosable={false}
                    onCancel={this.handleIframeModalCancel}
                    width={"700px"}
                    >
                    <iframe frameBorder="0" width={"600px"} height={"400px"} className="oauth-iframe" src={this.state.iframeUrl}></iframe>
                </Modal>
            );
        }

        return (
            <div style={{"textAlign": "center", "verticalAlign": "middle",}}>
                {iframeModal}
                <h2>{sg(pl, ["title"], "Login")}</h2>
                <WeiboWidget onClick={this.handleWidgetClicked} />
            </div>
        );
    },
});

export default Oauth;
