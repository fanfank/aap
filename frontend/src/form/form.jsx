/**
 * @author  reetsee.com
 * @date    20160619
 */
import React from 'react';
import { Link, browserHistory } from 'react-router'

import { Notification, message, Modal, Form, Spin, Button } from 'antd';

import { FormInput } from './form-input/form-input.jsx';

import $ from 'jquery';
import * as basic from '../libs/basic.jsx';

import { formCtl } from './controller.jsx';

let FormComp = React.createClass({
    getInitialState: function() {
        return {
            formData: undefined,
            remoteData: undefined, // 需要填充的数据
            posting: false,
        };
    },

    getData: function(props) {
        // 获取表单的各项配置数据
        props = props || this.props;
        let formId = props.params.form;
        formCtl.getFormById(formId).then(
            (formData) => { // 成功
                if (!this._isMounted) {
                    this.setState({
                        formData: formData
                    });
                }
            },
            (error) => { // 失败
                console.log(error);
            }
        );

        // 获取表单需要填充的内容
        let query = props.location.query;
        if (query && query.type) {
            // 需要获取填充的内容
            formCtl.getRemoteData(query).then(
                (remoteData) => {
                    if (!this._isMounted) {
                        console.log(remoteData);
                        this.setState({
                            remoteData: remoteData,
                        });
                    }
                },
                (error) => {
                    this.setState({
                        remoteData: null,
                    })
                    console.log(error);
                }
            );
        }
    },

    componentWillMount: function() {
        this._isMounted = true;
        this.getData();
    },

    componentWillUnmount: function() {
        this._isMounted = false;
    },

    submit: function(e, postApi) {
        this.setState({
            posting: true,
        });
        e.preventDefault();

        postApi = postApi || this.state.formData['post_api'];
        let hideLoadingMessage = message.loading('提交中...', 0);
        let thisForm = this;

        let contentType = basic.safeGet(
            this.state.formData, 
            ['content_type'], 
            'application/x-www-form-urlencoded;charset=utf-8'
        );
        let shouldPostJson = contentType.indexOf('json') >= 0 ? true : false;

        let postData = {};
        const fieldsValue = this.props.form.getFieldsValue();
        basic.keys(fieldsValue).forEach((key) => {
            if (!shouldPostJson && typeof(fieldsValue[key]) == 'object'
                        && !basic.isVoid(fieldsValue[key])) {

                postData[key] = JSON.stringify(fieldsValue[key]);

            } else {
                postData[key] = fieldsValue[key];
            }
        });
        if (shouldPostJson) {
            postData = JSON.stringify(postData);
        }
        console.log('postApi:' + postApi);
        console.log(postData);

        // 提交数据
        $.ajax({
            type: 'POST',
            url: basic.hostPortPrefix + postApi,
            contentType: contentType,
            data: postData,
            success: function(retData, status) {
                thisForm.setState({
                    posting: false,
                });
                hideLoadingMessage();

                let errno = basic.safeGet(retData, ['errno']);
                if (basic.statusOk(status) !== ''
                        || (!basic.isVoid(errno) 
                            && basic.errnoOk(retData) !== '')) {

                    let description = 'Post data failed, status=' + status;
                    console.log(description);
                    console.log(postData);
                    Notification['error']({
                        message: '失败',
                        description: description,
                        duration: 2,
                    });
                    return;
                }
                
                const refreshContentFunc = basic.safeGet(
                    thisForm, 
                    ['props', 'page', 'refreshContent']
                );
                refreshContentFunc && refreshContentFunc();

                Notification['success']({
                    message: '成功',
                    duration: 2,
                });

                thisForm.cancel(); // 关闭表单
            },
            error: function(jqXHR, textStatus, errorThrown) {
                thisForm.setState({
                    posting: false,
                });
                hideLoadingMessage();
                Notification['error']({
                    message: '提交失败',
                    duration: 2,
                });
            },
        });
    },

    cancel: function(e) {
        browserHistory.push('/page/' + this.props.params.page);
    },

    getSubmitButton: function(text, clickCb) {
        let buttonAttrs = {};
        if (this.state.posting) {
            buttonAttrs = {
                disabled: true,
            };
        } else {
            buttonAttrs = {
                onClick: clickCb,
            };
        }

        return (
            <Button 
                key="submit" 
                className={'ant-btn ant-btn-lg ant-btn-primary'}
                type="primary"
                {...buttonAttrs}>
                
                {text}
            </Button>
        );
    },

    getCancelButton: function(text, clickCb) {
        let buttonAttrs = {};
        if (this.state.posting) {
            buttonAttrs = {
                disabled: true,
            };
        } else {
            buttonAttrs = {
                onClick: clickCb,
            };
        }

        return (
            <Button
                key="cancel"
                className={'ant-btn ant-btn-lg'} 
                {...buttonAttrs}>

                {text}
            </Button>
        );
    },

    render: function() {
        const { formData: data, remoteData, posting } = this.state;
        const componentsContent = basic.decode(
            basic.safeGet(data, ['components'])
        );
        let query = this.props.location.query;

        if (data == undefined || data['id'] != this.props.params.form) {
            return (
                <Modal visible={true}>
                <Spin size="large" />
                {this.props.children}
                </Modal>
            );
        } else {
            // 设置按钮样式
            let modalFooter = {footer: []};
            let postApi = basic.safeGet(query, ['post_api']);
            switch(basic.safeGet(query, ['type'])) {
            case 'view':
                modalFooter['footer'] = [];
                break;
            case 'edit':
                modalFooter = {
                    footer: [
                        this.getSubmitButton(
                            '修改', (e) => {this.submit(e, postApi);}
                        ),
                        this.getCancelButton('取消', this.cancel),
                    ],
                };
                break;
            case 'duplicate':
                modalFooter = {
                    footer: [
                        this.getSubmitButton(
                            '复制', (e) => {this.submit(e, postApi);}
                        ),
                        this.getCancelButton('取消', this.cancel),
                    ],
                };
                break;
            default:
                modalFooter = {
                    footer: [
                        this.getSubmitButton('提交', this.submit),
                        this.getCancelButton('取消', this.cancel),
                    ],
                };
                break;
            }

            return (
                <Modal visible={true}
                    onOk={this.submit}
                    onCancel={this.cancel}
                    maskClosable={true}
                    width="50%"
                    {...modalFooter}>

                <Spin spinning={posting} tip="提交中...">
                <Form horizontal form={this.props.form} >
                    {componentsContent['form_item'].map(
                        (formItemId, index) => {
                            return (
                                <FormItem 
                                    key={index}
                                    params={this.props.params}
                                    form={this.props.form} 
                                    formItem={formItemId} 
                                    labelCol={{span: 6}}
                                    wrapperCol={{span: 14}}
                                    remoteData={basic.safeGet(
                                        remoteData,
                                        ['data']
                                    )}
                                />
                            );
                        }
                    )}
                </Form>
                </Spin>
                {this.props.children}
                </Modal>
            );
        }
    }
});
FormComp = Form.create()(FormComp);
export { FormComp as Form };
