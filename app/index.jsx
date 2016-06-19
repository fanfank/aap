/**
 * @author  reetsee.com
 * @date    20160616
 * @desc    Please customize this homepage according to your needs
 */
import React from "react"
import { render } from "react-dom"
import { Router, Route, browserHistory, IndexRoute, Link } from "react-router"
import { Spin, Menu } from "antd";

import { Form } from "./form/form.jsx";
import { Page } from "./page/page.jsx";
import { pageCtl } from "./page/controller.jsx";

import "./layout.css";

let App = React.createClass({
    getInitialState: function() {
        return {
            "pageList": undefined,
        };
    },

    getData: function() {
        pageCtl.getPageList().then(
            (pageList) => {
                this.setState({
                    "pageList": pageList,
                });
            },
            (error) => {
                console.log(JSON.stringify(error));
            }
        );
    },

    componentDidMount: function() {
        this.getData();
    },

    render: function() {
        const { pageList } = this.state;
        if (pageList == undefined) {
            return (
                <div style={{textAlign: "center", verticalAlign: "center", position: "fixed", top: "50%", left: "50%", marginTop: "-48px", marginLeft: "-48px"}}>
                    <Spin size={"large"} />
                    {this.props.children}
                </div>
            );
        } else {
            return (
                <div className="ant-layout-topaside">
                <div>
                <div className="ant-layout-header">
                <div className="ant-layout-wrapper">
                <Menu 
                    defaultSelectedKeys={["0"]}
                    selectedKeys={["0"]}
                    mode={"horizontal"} 
                    theme="dark"
                    style={{
                        lineHeight: '64px', 
                        fontSize: '15px'
                    }}>

                    <Menu.Item key={"0"}>
                        <Link to="/">Home</Link>
                    </Menu.Item>
                    {pageList.map((page) => {
                        return (
                            <Menu.Item key={page["id"]}>
                                <Link to={"/page/" + page["id"]}>{page["page_name"]}</Link>
                            </Menu.Item>
                        );
                    })}

                </Menu>
                </div>
                </div>
                {this.props.children}
                </div>
                </div>
            );
        }
    }
});

render((
    <Router history={browserHistory}>
        <Route path="/" component={App} />
        <Route path="/page/:page" component={Page}>
            <Route path="form/:form" component={Form} />
        </Route>
    </Router>
), document.getElementById("content"));
