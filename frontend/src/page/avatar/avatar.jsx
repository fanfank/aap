/**
 * @author	reetsee.com
 * @date	20160924
 */
import React from "react";
import { Link } from "react-router";

import { Modal, Menu, Dropdown, Icon } from "antd";

import $ from "jquery";
import * as basic from "../../libs/basic.jsx";
import Global from "../../libs/global.jsx";
import Oauth from "../../libs/oauth/oauth.jsx";
import localeDict from "../../libs/i18n/base.jsx";

import "./avatar.css";

let sg = basic.safeGet;
let pl = sg(localeDict, ["page/avatar/avatar"], {}); // page locale

let DEFAULT_USER_NAME = sg(pl, ["defaultUserName"], "Anonymous");

export let Avatar = React.createClass({
    getInitialState: function() {
        Global.registerLoginedEvent(() => {
            if (this.mounted) { this.setState({"showModal": false}); }
        });

        return {
            "showModal": false,
        };  
    },

    componentWillMount: function() {
        this.mounted = true;
    },
    componentWillUnmount: function() {
        this.mounted = false;
    },

    handleMenuItemClick: function(item) {
        let key = item["key"];
        let keyPath = item["keyPath"];
        if (key === "login") {
            this.setState({"showModal": true});
        } else {
            $.ajax({
                type: "POST",
                url: "/api/oauth/logout",
                data: Global.getUserInfo(),
                success: function() {},
            });
            basic.delCookie("session");
            Global.resetUser();
            Global.refreshUserInfo();
            this.setState({"showModal": false});
        }
    },

    render: function() {
        let menu = null;  
        if (Global.isLogined()) {
            //<Menu.Divider />
            menu = ( 
                <Menu onClick={this.handleMenuItemClick}>
                    <Menu.Item key="logout">
                        <span >{sg(pl, ["logout"], "Logout")}</span>
                    </Menu.Item>
                </Menu>
            );

        } else {
            menu = (
                <Menu onClick={this.handleMenuItemClick}>
                    <Menu.Item key="login">
                        {sg(pl, ["login"], "Login")}
                    </Menu.Item>
                </Menu>
            );
        }

        let oauthStyle = {};

        let modal = <div></div>;
        if (!Global.isLogined()) {
            modal = (
        		<Modal
                    width={250}
                    footer={null}
				    visible={this.state.showModal}
        		    onCancel={() => {this.setState({"showModal": false})}}
                    style={oauthStyle}
        		    >
                    <Oauth onLogined={() => this.setState({})} />
        		</Modal>
            );
        }

        return (
            <Dropdown overlay={menu} trigger={['click']}>
            <div className="avatar-wrapper">
                {modal}
                <div className="avatar-picture-block">
                    <img width="32px" height="32px" className="avatar-picture" src={Global.getUserAvatar(sg(pl, ["defaultAvatarUrl"], ""))} />
                </div>
                <div className="avatar-uname-block">
                <span>
                    {Global.getUserName(DEFAULT_USER_NAME)}
                </span>
                </div>
            </div>
            </Dropdown>
        );  
    },
});
