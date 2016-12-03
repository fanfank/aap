/**
 * @author  reetsee.com
 * @date    20161016
 */
import React from 'react';

import $ from 'jquery';

import { Notification, Spin, Icon, Button, Alert, Collapse, Input, Form } from 'antd';

import { DatetimePicker } from "../../libs/widget/datetime-picker.jsx";

import * as basic from '../../libs/basic.jsx';
let sg = basic.safeGet;

let DEFAULT_LOG_LIST = [
"2016-10-16 11:00:00 this is record 0",
"2016-10-16 11:00:01 this is record 1",
"2016-10-16 11:00:21 this is record 2",
"2016-10-16 11:03:02 this is record 3",
"2016-10-16 11:03:05 this is record 4",
"2016-10-16 11:05:01 this is record 5",
"2016-10-16 11:06:10 this is record 6",
"2016-10-16 12:15:30 this is record 7",
"2016-10-16 12:30:35 this is record 8",
"2016-10-16 20:18:06 this is record 9",
"2016-10-16 21:00:00 this is record 10",
"2016-10-16 23:59:59 this is record 11",
"2016-10-17 00:00:00 this is record 12",
"2016-10-17 01:50:10 this is record 13",
"2016-10-17 08:31:34 this is record 14",
"2016-10-18 17:10:10 this is record 15",
"2016-10-18 18:20:50 this is record 16",
"2016-10-19 03:15:40 this is record 17",
"2016-10-19 03:15:40 this is record 18",
"2016-10-20 10:00:00 this is record 19",
];
let DEFAULT_ST = "2016-10-16 11:03:02";
let DEFAULT_ED = "2016-10-16 12:15:31";
let MAX_RUNE_NUM = 100 * 1024 / 2;

export let TimecatPageContent = React.createClass({
    getInitialState: function() {
        let content = DEFAULT_LOG_LIST.join("\n") + "\n";
        return {
            st: DEFAULT_ST,
            ed: DEFAULT_ED,
            runeAvailable: MAX_RUNE_NUM - content.length,
            logContent: content,
            logResult: null,
            collapseActiveKeys: ["logcontent"],
            loading: false,
        };
    },

    handleReset: function() {
        let d = this.getInitialState();
        this.setState(d);
    },

    handleLogContentChange: function(e) {
        let content = e.target.value;
        this.setState({
            runeAvailable: MAX_RUNE_NUM - content.length,
            logContent: content,
        });
    },

    handleSubmit: function() {
        if (this.state.logContent.length == 0) {
            Notification['error']({
                message: '提交的日志内容不能为空哟',
                duration: 3,
            });
            return;
        }

        this.setState({
            loading: true,
        });

        $.ajax({
            type: 'POST',
            url: '/timecat/v1/api/test',
            data: {
                ie: 'utf-8',
                st: this.state.st,
                ed: this.state.ed,
                logContent: this.state.logContent,
            },
            success: function(data, status) {
                this.setState({loading: false});
                if (basic.errnoOk(data, false) !== ''
                        || basic.statusOk(status, false) !== '') {
                    Notification['error']({
                        message: '调用失败，'
                            + 'status：' + status
                            + '，errno：' + sg(data, ['errno'], '-1') 
                            + '，errmsg：' + sg(data, ['errmsg'], '未知错误'),
                        duration: 5,
                    });
                    return;
                }

                Notification['success']({message: '成功', duration: 3,});
                this.setState({
                    collapseActiveKeys: ['logresult'],
                    logResult: sg(data, ['data'], 'Ooooops，没有内容'),
                });
            }.bind(this),
            error: function(xhr) {
                this.setState({loading: false});
                Notification['error']({
                    message: '调用接口失败：' + xhr.status + ' ' + xhr.statusText,
                    duration: 3,
                });
            }.bind(this),
        });
    },
    
    render: function() {
        let runeNumHint = null;
        if (this.state.runeAvailable >= 0) {
            runeNumHint = <Alert message={"还能输入 " + this.state.runeAvailable + " 个字符"} type="success" />;
        } else {
            runeNumHint = <Alert message={"已超出 " + (-1 * this.state.runeAvailable) + " 个字符"} type="error" />;
        }

        let dispResult = null;


        return (
			<div>
			<div>
                <span><b>timecat</b> 是一个对有序日志按时间进行二分定位并输出的工具</span>
                <br />
                <span style={{wordWrap: "break-word", wordBreak: "break-all",}}>项目地址：<a href="https://github.com/fanfank/timecat" target="_blank">https://github.com/fanfank/timecat</a></span>
                <span>下面是演示</span>
                <br />
                <hr />
            </div>
            <div>
                <br />
            </div>
            <Form inline onSubmit={this.handleSubmit}>
                <Form.Item label="起始时间：">
                    <DatetimePicker value={this.state.st} onChange={(v)=>{this.setState({st:v})}}/>
                </Form.Item>
                <Form.Item label="截止时间：">
                    <DatetimePicker value={this.state.ed} onChange={(v)=>{this.setState({ed:v})}}/>
                </Form.Item>
                <Form.Item>
                    <Button type="primary" onClick={this.handleSubmit}> 
                        <Icon type={this.state.loading ? "loading" : "search"}/>
                        {"搜索"}
                    </Button>
                </Form.Item>
                <Form.Item>
                    <Button type="ghost" onClick={this.handleReset} disabled={this.state.loading ? true : false}>
                        <Icon type="reload"/>
                        重置
                    </Button>
                </Form.Item>
                <div>
                    <br />
                </div>
                <Spin spinning={this.state.loading}>
                <Collapse 
                    activeKey={this.state.collapseActiveKeys} 
                    onChange={(ks)=>{this.setState({collapseActiveKeys: ks});}}
                    >

                    <Collapse.Panel header="日志内容-请确保日志整体有序" key="logcontent">
                        <div>
                            {runeNumHint}
                        </div>
                        <Input 
                            type="textarea" 
                            rows={20}
                            value={this.state.logContent} 
                            onChange={this.handleLogContentChange}
                            />
                    </Collapse.Panel>
                    <Collapse.Panel header="二分搜索结果" key="logresult">
                        <pre style={{whiteSpace: "pre-wrap", wordWrap: "break-word"}}>
                            {this.state.logResult ? this.state.logResult : "请先点击\"搜索\"按钮哦"}
                        </pre>
                    </Collapse.Panel>
                </Collapse>
                </Spin>
            </Form>
			</div>
        );
    },
});
