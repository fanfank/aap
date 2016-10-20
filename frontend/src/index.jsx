/**
 * @author  reetsee.com
 * @date    20160616
 * @desc    Please customize this homepage according to your needs
 */
import React from "react"
import { render } from "react-dom"
import { Router, Route, browserHistory, IndexRoute, Link } from "react-router"
import { QueueAnim, Button, Spin, Menu } from "antd";

import { Form } from "./form/form.jsx";
import { Page } from "./page/page.jsx";
import { pageCtl } from "./page/controller.jsx";

import "./layout.css";

let _gLastPage = undefined;

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
        return (
            <div style={{
                    textAlign: "center",
                    verticalAlign: "center",
                    position: "fixed",
                    top: "35%",
                    left: "10%",
                    right: "10%",
                    marginTop: "-48px",
                    marginLeft: "-48px",
                }}>

                <QueueAnim delay={500} style={{ height: 150 }}>
                    <div key='a'>
                        <h1
                            style={{
                                fontSize: '55px',
                                fontWeight: 600,
                                lineHeight: 1.1,
                            }}
                            >欢迎来到 AAP</h1>
                        <br/>
                        <br/>
                    </div>
                    <div key = 'b'>
                        <Link to="/page/page_admin">
                        <Button 
                            style={{
                                heigth: "500%",
                            }}
                            size="large"
                            type="primary" icon="caret-circle-o-right">立即探索</Button>
                        </Link>
                    </div>
                </QueueAnim>
            </div>
        );
    }
});

render((
    <Router history={browserHistory}>
        <Route 
            path="/" 
            component={App} 
            onEnter={({params})=>{
                let nextPath = "/";
                if (_gLastPage !== undefined) {
                    _czc.push(["_trackPageview", nextPath, _gLastPage]);
                }
                if (window.location.origin) {
                    _gLastPage = window.location.origin + nextPath;
                } else {
                    _gLastPage = null;
                }
            }}
			/>
        <Route 
            path="/page/:page" 
            component={Page}
            onEnter={({params})=>{
                let nextPath = "/page/" + params.page;
                if (_gLastPage !== undefined) {
                    _czc.push(["_trackPageview", nextPath, _gLastPage]);
                }
                if (window.location.origin) {
                    _gLastPage = window.location.origin + nextPath;
                } else {
                    _gLastPage = null;
                }
            }}
            >
            <Route path="form/:form" component={Form} />
        </Route>
    </Router>
), document.getElementById("content"));
