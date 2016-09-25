/**
 * @author  reetsee.com
 * @date    20160924
 */
import { Modal } from "antd";
import React from "react";

import localeDict from "../i18n/base.jsx";
import * as basic from "../basic.jsx";

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
