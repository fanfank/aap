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
        return {
            "imgUrl": undefined,
            "showModal": false,
        };  
    },  

    componentWillMount: function() {
        this.fetch();
    },  

    handleMenuItemClick: function(item) {
        let key = item["key"];
        let keyPath = item["keyPath"];
        this.setState({"showModal": true});
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

        let oauthStyle = {

        };

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
                    <Oauth />
        		</Modal>
            );
        }

        return (
            <Dropdown overlay={menu} trigger={['click']}>
            <div className="avatar-wrapper">
                {modal}
                <div className="avatar-picture-block">
                    <img width="32px" height="32px" className="avatar-picture" src={this.state.imgUrl}/>
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

    setAvatar: function(avatar) {
        this.setState({
            "imgUrl": avatar,
        });
    },

    fetch: function(props) {
        props = props || this.props;
        let thisIns = this;
        let uname = Global.getUserName(DEFAULT_USER_NAME);
        let defaultAvatarUrl = sg(pl, ["defaultAvatarUrl"], "");

        //TODO
        this.setAvatar(defaultAvatarUrl);
    },
});
