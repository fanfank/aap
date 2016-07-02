/**
 * @author  reetsee.com
 * @date    20160620
 * @desc    input为json时，嵌套的控件代码在本文件中
 */
import React from 'react';

import { 
    Row, Col, Select, Spin, Form, Input, InputNumber, 
    DatePicker, Button, Checkbox } from 'antd';

import * as basic from '../../libs/basic.jsx';

import { FormSubInput } from './form-sub-input.jsx';

let CommonJsonFieldMixin = {
    getRemoteDataValue: function(props, field) {
        props = props || this.props;
        if (this._getRemoteDataValue) {
            return this._getRemoteDataValue(props, field);
        }

        const { display, remoteData } = props;
        field = field || display;
        return basic.safeGet(
            basic.decode(remoteData), 
            [field]
        );
    },

    getCurrentValue: function(props) {
        // submitData是子组件用来获取当前值的一个属性
        // 数据流的逻辑是子组件更新时通知父组件，父组件
        // 更新submitData然后重新render。
        // 重新render时子组件怎么知道自己当前值呢？就是
        // 通过submitData
        props = props || this.props;
        const { display, submitData: submit } = props;
        let submitParsed = basic.decode(submit);
        
        return basic.safeGet(submitParsed, [display]) 
            || this.getRemoteDataValue(props);
    },
};

export let JsonField = React.createClass({
    render: function() {
        let { hintData } = this.props;

        switch(typeof(hintData)) {
        case 'object':
            if (hintData.constructor == Array) {
                return <JsonArrayField {...this.props} />;
            } else if (hintData.constructor == Object) {
                return <JsonObjectField {...this.props} />;
            } else {
                console.warn('impossible here');
                return null;
            }
            break;

        case 'boolean':
            return <JsonBooleanField {...this.props} />;

        case 'number':
            // 需要判断到底是引用组件还是纯数字类型
            if (hintData == 0) {
                return <JsonNumberField {...this.props} />;
            } else {
                return <JsonSubInputWrapperField {...this.props} />;
            }

        case 'string':
            let intRepr = parseInt(hintData);
            if (intRepr && intRepr != 0) {
                return <JsonSubInputWrapperField {...this.props} />
            } else {
                return <JsonStringField {...this.props} />;
            }

        default:
            console.warn('Unexpeced json field type:' + typeof(hitData));
            return null;
            break;
        }
    },
});

// 布尔字段
let JsonBooleanField = React.createClass({
    mixins: [CommonJsonFieldMixin],
    render: function() {
        let { display, changeCallback } = this.props;

        return (
            <Form.Item
                labelCol={{span: 4}}
                wrapperCol={{span: 16, offset: 1}}
                label={''+display}>

                <Checkbox 
                    checked={this.getCurrentValue() || false}
                    onChange={(e) => {
                        changeCallback(display, e.target.checked);
                    }} />
            </Form.Item>
        );
    }
});

// 数字字段
let JsonNumberField = React.createClass({
    mixins: [CommonJsonFieldMixin],
    render: function() {
        let { display, changeCallback } = this.props;

        return (
            <Form.Item
                labelCol={{span: 4}}
                wrapperCol={{span: 16, offset: 1}}
                label={''+display}>

                <InputNumber 
                    value={this.getCurrentValue()}
                    onChange={(e) => {
                        changeCallback(display, e);
                    }}/>
            </Form.Item>
        );
    }
});

// 字符串字段
let JsonStringField = React.createClass({
    mixins: [CommonJsonFieldMixin],
    render: function() {
        let { display, changeCallback } = this.props;
        return (
            <Form.Item
                labelCol={{span: 4}}
                wrapperCol={{span: 16, offset: 1}}
                label={''+display}>

                <Input
                    value={this.getCurrentValue()}
                    onChange={(e) => {
                        changeCallback(display, e.target.value);
                    }}/>
            </Form.Item>
        );
    }
});

// 数组字段
let JsonArrayField = React.createClass({
    mixins: [CommonJsonFieldMixin],
    getInitialState: function() {
        return {
            submitValue: this.getCurrentValue() || [],
        };
    },

    componentWillReceiveProps: function(nextProps) {
        this.setState({
            submitValue: this.getCurrentValue(nextProps),
        });
    },

    update: function(key, value) {
        const { display, changeCallback } = this.props;
        const submitValue = this.state.submitValue;
        while (submitValue.length < key) {
            submitValue.push('');
        }
        submitValue[key] = value;
        this.setState({
            submitValue: submitValue
        });
        changeCallback(display, submitValue);
    },

    render: function() {
        let { display, hintData } = this.props;
        let fieldList = hintData.map((element, index) => {
            return (
                <JsonField 
                    remoteData={this.getRemoteDataValue()}
                    submitData={this.getCurrentValue()}
                    changeCallback={this.update}
                    hintData={element} 
                    key={index} 
                    display={index} />
            );
        });
        return (
            <Form.Item
                labelCol={{span: 4}}
                wrapperCol={{span: 16, offset: 1}}
                label={''+display}>
                
                {fieldList}
            </Form.Item>
        );
    }
});

// kv字段
let JsonObjectField = React.createClass({
    mixins: [CommonJsonFieldMixin],
    getInitialState: function() {
        return {
            submitValue: this.getCurrentValue() || {},
        };
    },

    componentWillReceiveProps: function(nextProps) {
        this.setState({
            submitValue: this.getCurrentValue(nextProps),
        });
    },

    update: function(key, value) {
        const { display, changeCallback } = this.props;
        const submitValue = this.state.submitValue;

        submitValue[key] = value;
        this.setState({
            submitValue: submitValue,
        });

        changeCallback(display, submitValue);
    },

    render: function() {
        let { display, hintData } = this.props;
        let inputList = basic.keys(hintData).map((key) => {
            let value = hintData[key];
            return (
                <JsonField 
                    remoteData={this.getRemoteDataValue()}
                    submitData={this.getCurrentValue()}
                    changeCallback={this.update}
                    key={key} 
                    display={key} 
                    hintData={value} />
            );
        });
        return (
            <Form.Item 
                labelCol={{span: 4}}
                wrapperCol={{span: 16, offset: 1}}
                label={''+display}>

                {inputList}
            </Form.Item>
        );
    }
});

let JsonSubInputWrapperField = React.createClass({
    mixins: [CommonJsonFieldMixin],
    getInitialState: function() {
        return {
            submitValue: this.getCurrentValue(),
        };
    },

    componentWillReceiveProps: function(nextProps) {
        this.setState({
            submitValue: this.getCurrentValue(nextProps),
        });
    },

    update: function(_, value) {
        const { display, changeCallback } = this.props;
        this.setState({
            submitValue: value
        });
        changeCallback(display, value);
    },

    render: function() {
        let { display, hintData } = this.props;
        return (
            <FormSubInput
                params={this.props.params}
                remoteData={this.props.submitData || this.props.remoteData}
                subInputId={display}
                subInputValue={this.getCurrentValue()}
                prefix={`__dummy_json_${display}_`}
                changeCallback={this.props.changeCallback}
                formSubInput={hintData} />
        );
    }
});
