/**
 * @author  reetsee.com
 * @date    20160620
 * @desc    嵌套到一级input内的N(N>=2)级input相关的代码
 */
import React from 'react';

import { 
    Row, Col, Spin, Select, Form, Input, InputNumber, 
    DatePicker, Button } from 'antd';

import * as basic from '../../libs/basic.jsx';

import { JsonField } from './json-field.jsx';
import { formSubInputCtl } from './controller.jsx';

var CommonSubInputMixin = { // 子input在初始时要通知父控件的函数
    formSubInputLayout: {
        labelCol: { span: 4 },
        wrapperCol: { span: 16, offset: 1 },
    },

    getRemoteDataValue: function(props, field) {
        props = props || this.props;
        const { remoteData, formSubInputData: data } = props;
        field = field || props.subInputId;
        return basic.safeGet(basic.decode(remoteData), [field]);
    },

    getCurrentValue: function(props, shouldDecode) {
        props = props || this.props;
        const { remoteData, subInputId } = props;

        const remoteDataValue = getRemoteDataValue(props);

        return (
            props.subInputValue
                || remoteDataValue
                || props.formSubInputData['default']
        );
    },

    shouldComponentUpdate: function(nextProps, nextState) {
        if (this._shouldComponentUpdate()) {
            return this._shouldComponentUpdate(nextProps, nextState);
        }

        const oldProps = this.props;

        if (nextState != this.state 
                || nextProps.subInputId != oldProps.subInputId
                || nextProps.subInputValue != oldProps.subInputValue
                || nextProps.remoteData != oldProps.remoteData
                || nextProps.formSubInputData != oldProps.formSubInputData
                || nextProps.changeCallback != oldProps.changeCallback) {
            return true;
        } else {
            return false;
        }
    },
    
    componentDidMount: function() {
        if (this._componentDidMount) {
            this._componentDidMount();
            return;
        }

        // 这样控件的默认值才可以被正确设置到父控件中
        // NOTE: 其实这种初始化方式会造成Callback泛滥
        //    从而使得表单加载速度在空间增多时变得很慢
        
        this.props.changeCallback(
            this.props.subInputId,
            this.getCurrentValue()
        );
    },
    
    getExtraMessage: function(props) {
        props = props || this.props;
        const { formSubInputData: data } = props;
        return basic.safeGet(data, ['help_message']);
    },
};

export let FormSubInput = React.createClass({
    getInitialState: function() {
        return {
            formSubInputData: undefined,
        };
    },

    getData: function(props) {
        props = props || this.props;
        let formSubInputId = props.formSubInput;
        formSubInputCtl.getFormSubInputById(formSubInputId).then(
            (formSubInputData) => { // 成功
                this._isMounted && this.setState({
                    formSubInputData: formSubInputData,
                });
            },
            (error) => { // 失败
                console.log(error);
            }
        );
    },

    componentDidMount: function() {
        this._isMounted = true;
        this.getData();
    },
    
    componentWillReceiveProps: function(nextProps) {
        if (this.props != nextProps) {
            this.getData(nextProps);
        }
    },

    componentWillUnmount: function() {
        this._isMounted = false;
    },

    render: function() {
        const { formSubInputData: data } = this.state;

        if (data == undefined || data['id'] != this.props.formSubInput) {
            return (
                <Spin size="small" />
            );
        } else {

            // 如果当前组件是由一个relation组件创建的，
            // 那么可能没有设置subInputId，
            // 则subInputId这个props需要fallback到data['pname']
            let subInputId = this.props.subInputId;
            if (!subInputId && subInputId !== 0) {
                subInputId = data['pname'];
            }

            switch(data['type']) {
            case 'string':
                return (
                    <StringFormSubInput 
                        {...this.props} 
                        subInputId={subInputId}
                        formSubInputData={data} 
                    />
                );
            case 'number':
                return (
                    <NumberFormSubInput 
                        {...this.props} 
                        subInputId={subInputId}
                        formSubInputData={data} 
                    />
                );
            case 'datetime':
                return (
                    <DatetimeFormSubInput 
                        {...this.props} 
                        subInputId={subInputId}
                        formSubInputData={data} 
                    />);
            case 'textarea':
                return (
                    <TextareaFormSubInput 
                        {...this.props} 
                        subInputId={subInputId}
                        formSubInputData={data} 
                    />);
            case 'select':
                return (
                    <SelectFormSubInput 
                        {...this.props} 
                        subInputId={subInputId}
                        formSubInputData={data} 
                    />);
            case 'relation':
                return (
                    <RelationFormSubInput
                        {...this.props}
                        subInputId={subInputId}
                        formSubInputData={data}
                    />);
            case 'mutablelist':
                return (
                    <MutablelistFormSubInput 
                        {...this.props} 
                        subInputId={subInputId}
                        formSubInputData={data} 
                    />);
            case 'mutabledict':
                return (
                    <MutabledictFormSubInput 
                        {...this.props} 
                        subInputId={subInputId}
                        formSubInputData={data} 
                    />);
            case 'json':
                return (
                    <JsonFormSubInput 
                        {...this.props} 
                        subInputId={subInputId}
                        formSubInputData={data} 
                    />
                );
            default: 
                alert('Unknown input: ' + JSON.stringify(data));
                return null;
            }
        }
    }
});

// 普通子输入框
let StringFormSubInput = React.createClass({
    mixins: [CommonSubInputMixin],
    render: function() {
        const { 
            formSubInputData: data, 
            prefix, changeCallback,
            subInputId, subInputValue,
            noLabel
        } = this.props;

        return (
            <Form.Item
                {...this.formSubInputLayout}
                extra={this.getExtraMessage()}
                label={!noLabel && data['display']}>
                
                <Input
                    name={prefix + data['pname']}
                    defaultValue={this.getCurrentValue() || ''}
                    onChange={(e) => {
                        changeCallback(subInputId, e.target.value);
                    }}
                    {...data['assignedAttrs']} />
            </Form.Item>
        );
    }
});

// 数字子输入框
let NumberFormSubInput = React.createClass({
    mixins: [CommonSubInputMixin],
    render: function() {
        const { 
            formSubInputData: data, 
            prefix, changeCallback,
            subInputId, subInputValue,
            noLabel
        } = this.props;

        return (
            <Form.Item
                {...this.formSubInputLayout}
                extra={this.getExtraMessage()}
                label={!noLabel && data['display']}>

                <InputNumber
                    name={prefix + data['pname']}
                    defaultValue={this.getCurrentValue() || 0}
                    onChange={(e) => {
                        changeCallback(subInputId, e);
                    }}
                    {...data["assignedAttrs"]} />
            </Form.Item>
        );
    }
});

// 日期时间子输入框
let DatetimeFormSubInput = React.createClass({
    mixins: [CommonSubInputMixin],
    render: function() {
        const { 
            formSubInputData: data, 
            prefix, changeCallback,
            subInputId, subInputValue,
            noLabel
        } = this.props;
        const detailContent = basic.decode(data['detail']);

        return (
            <Form.Item
                extra={this.getExtraMessage()}
                label={!noLabel && data['display']}>

                <DatePicker
                    name={prefix + data['pname']}
                    defaultValue={this.getCurrentValue() || new Date()}
                    showTime format={detailContent['format'] || 'yyyy-MM-dd HH:mm:ss'}
                    onChange={(e) => {
                        changeCallback(subInputId, e.target.value);
                    }}
                    {...data['assignedAttrs']} />
            </Form.Item>
        );
    }
});

// 段落子输入框
let TextareaFormSubInput = React.createClass({
    mixins: [CommonSubInputMixin],
    render: function() {
        const { 
            formSubInputData: data, 
            prefix, changeCallback,
            subInputId, subInputValue,
            noLabel
        } = this.props;

        return (
            <Form.Item
                extra={this.getExtraMessage()}
                label={!noLabel && data['display']}>

                <Input
                    name={prefix + data['pname']}
                    defaultValue={this.getCurrentValue() || ''}
                    type="textarea"
                    onChange={(e) => {
                        changeCallback(subInputId, e.target.value);
                    }}
                    {...data['assignedAttrs']} />
            </Form.Item>
        );
    }
});

// 下拉列表子输入
let SelectFormSubInput = React.createClass({
    mixins: [CommonSubInputMixin],
    getInitialState: function() {
        const { formSubInputData: data } = this.props;
        const detailContent = basic.decode(data['detail']);

        return {
            optionList: basic.safeGet(detailContent, ['option_list']) || [],
            selectedValue: this.getCurrentValue(),
        };
    },

    componentWillMount: function() {
        formSubInputCtl.getSelectOptionList(this, 'formSubInputData');
    },

    componentWillReceiveProps: function(nextProps) {
        if (nextProps!= this.props) {
            this.setState({
                selectedValue: this.getCurrentValue(nextProps),
            })
        }
    },

    handleChange: function(value, option) {
        console.log(value);
        const { subInputId } = this.props;
        this.props.changeCallback(subInputId, value);
        this.setState({
            selectedValue: value,
        });
    },

    render: function() {
        const { 
            formSubInputData: data, 
            prefix, changeCallback,
            subInputId, subInputValue,
            noLabel
        } = this.props;

        const detailContent = basic.decode(data['detail']);
        const { optionList } = this.state;

        return (
            <Form.Item
                {...this.formSubInputLayout}
                extra={this.getExtraMessage()}
                label={!noLabel && data['display']}>

                <Select
                    tags={basic.safeGet(detailContent, ['multi'], false)}
                    onSelect={this.handleChange}
                    value={this.getCurrentValue()}
                    {...data['assignedAttrs']}>

                    {optionList.map((option) => {
                        return (
                            <Select.Option key={option['value']} value={option['value']}>{option['display']}</Select.Option>
                        );
                    })} 
                </Select>
            </Form.Item>
        );
    }
});

// 根据选择值改变其它表单输入的控件
let RelationFormSubInput = React.createClass({
    mixins: [CommonSubInputMixin],
    getInitialState: function() {
        const { formSubInputData: data } = this.props;
        const detailContent = basic.decode(data['detail']);

        return {
            relationList: basic.safeGet(detailContent, ['relation_list']) || [],
            selectedValue: this.getCurrentValue(),
        };
    },

    componentWillReceiveProps: function(nextProps) {
        if (nextProps!= this.props) {
            this.setState({
                selectedValue: this.getCurrentValue(nextProps),
            })
        }
    },

    componentWillMount: function() {
        formSubInputCtl.getRelationList(this, 'formSubInputData');
    },

    handleChange: function(value, option) {
        console.log(value);
        const { subInputId } = this.props;
        this.props.changeCallback(subInputId, value);
        this.setState({
            selectedValue: value,
        });
    },

    render: function() {
        const {
            formSubInputData: data,
            prefix, changeCallback,
            subInputId, subInputValue,
            noLabel
        } = this.props;
        const detailContent = basic.decode(data['detail']);

        const { relationList, selectedValue } = this.state;
        
        let targetRelationList = relationList.filter((relation) => {
            return relation['value'] == selectedValue;
        });

        // 下面的subInputId留空，因为relation中关联的其它组件
        // 与当前组件是平级的，所以关联组件的值变化应该汇报
        // 给这一层组件的父组件，而附件并没有指定这些关联组件
        // 的subInputId，因此让关联组件在值变化时将subInputId
        // fallback到关联组件的pname
        const relatedInputList = [];
        targetRelationList.forEach((relation) => {
            relation['form_input'].forEach((relatedInput) => {
                const index = relatedInputList.length;
                relatedInputList.push(
                    <FormSubInput 
                        key={index}
                        remoteData={this.props.remoteData}
                        params={this.props.params}
                        prefix={`${prefix}_relation_${data['pname']}_`}
                        changeCallback={this.props.changeCallback}
                        formSubInput={relatedInput}
                    />
                );
            })
        });

        return (
            <div>
            <Form.Item 
                extra={this.getExtraMessage()}
                label={!noLabel && data['display']}>

                <Select
                    tags={basic.safeGet(detailContent, ['multi'], false)}
                    onSelect={this.handleChange}
                    value={this.getCurrentValue()}
                    {...data['assignedAttrs']}>

                    {relationList.map((relation) => {
                        return (
                            <Select.Option key={relation['value']} value={relation['value']}>{relation['display']}</Select.Option>
                        );
                    })}
                </Select>
            </Form.Item>

            {relatedInputList}

            </div>
        );
    },
});

// 可动态添加的子列表类型
let MutablelistFormSubInput = React.createClass({
    mixins: [CommonSubInputMixin],
    getInitialState: function() {
        // subInputList使用uuid会造成Mutablelist的组件不断重复render
        // 因为当前组件render子组件时key使用的是subInputList中
        // 每一个元素的id值

        let subInputList = this.computeSubInputList(this.props);
        return {
            subInputList: subInputList
        };
    },

    computeSubInputList: function(props) {
        props = props || this.props;
        let valueList = this.getCurrentValue(props);
        if (valueList) {
            valueList = basic.decode(valueList);
            let subInputList = valueList.map((value, index) => {
                return {
                    id: index,
                    value: value,
                };
            });
            return subInputList;
        } else {
            return [];
        }
    },

    componentWillReceiveProps: function(nextProps) {
        if (nextProps.subInputValue != this.props.subInputValue) {
            let subInputList = this.computeSubInputList(nextProps);
            this.setState({
                subInputList: subInputList,
            });
        }
    },

    add: function() {
        let newList = this.state.subInputList.concat({
            id: this.state.subInputList.length,
            value: this.props.formSubInputData['default'],
        });
        this.setState({
            subInputList: newList
        });
    },

    remove: function(targetId) {
        let newList = this.state.subInputList.filter((subInput) => {
            return subInput['id'] != targetId;
        });

        // 维护新的list中每一个元素的id
        for (let i = 0; i < newList.length; ++i) {
            newList[i]['id'] = i;
        }

        this.setState(
            {
                subInputList: newList,
            },
            () => {
                this.update('', '');
            }
        );
    },

    update: function(targetId, targetValue) {
        const { formSubInputData: data } = this.props;

        let newList = [];
        let valueList = [];
        this.state.subInputList.forEach((subInput) => {
            let newInput = {
                id: subInput['id'],
                value: subInput['value'],
            };

            if (newInput['id'] == parseInt(targetId)) {
                newInput['value'] = targetValue;
            }

            valueList.push(newInput['value']);

            newList.push(newInput);
        });

        // 通知父组件更新值
        this.props.changeCallback(
            this.props.subInputId,
            valueList // 不需要JSON序列化
        );
        
        this.setState({
            subInputList: newList
        });
    },

    render: function() {
        const { formSubInputData: data, noLabel, prefix } = this.props;
        const detailContent = basic.decode(data['detail']);
        const thisInput = this;

        const subInputs = this.state.subInputList.map((subInput) => {
            return (
                <Form.Item key={subInput['id']}>
                    <Row>
                    <Col span={18}>
                    <FormSubInput 
                        noLabel={noLabel}
                        params={this.props.params}
                        subInputId={subInput['id']}
                        subInputValue={subInput['value']}
                        prefix={`${prefix}_${data['pname']}_${subInput['id']}_`}
                        changeCallback={thisInput.update}
                        formSubInput={detailContent['sub_input']} />
                    </Col>

                    <Col span={4} offset={2}>
                    <Button onClick={() => thisInput.remove(subInput['id'])}>删除</Button>
                    </Col>
                    </Row>
                </Form.Item>
            );
        });

        return (
            <Form.Item
                extra={this.getExtraMessage()}
                label={!noLabel && data['display']}>

                {subInputs}
                <Button onClick={thisInput.add}>添加</Button>

            </Form.Item>
        );
    }
});

// 可动态添加的子字典类型
let MutabledictFormSubInput = React.createClass({
    mixins: [CommonSubInputMixin],
    getInitialState: function() {
        let subInputList = this.computeSubInputList(this.props);
        return {
            subInputList: subInputList
        };
    },

    computeSubInputList: function(props) {
        props = props || this.props;
        let kvDict = this.getCurrentValue(props);
        if (kvDict) {
            kvDict = basic.decode(kvDict, {});
            let subInputList = basic.keys(kvDict).map((key, index) => {
                return {
                    id: index,
                    key: key,
                    value: kvDict[key],
                }
            });
            return subInputList;
        } else {
            return [];
        }
    },

    componentWillReceiveProps: function(nextProps) {
        if (nextProps.subInputValue != this.props.subInputValue) {
            let subInputList = this.computeSubInputList(nextProps);
            this.setState({
                subInputList: subInputList,
            });
        }
    },

    add: function() {
        const { formSubInputData: data } = this.props;
        const defaultContent = basic.decode(data['default'], {});

        let newList = this.state.subInputList.concat({
            id: this.state.subInputList.length,
            key: defaultContent['key'],
            value: defaultContent['value'],
        });
        this.setState({
            subInputList: newList
        });
    },

    remove: function(targetId) {
        let newList = this.state.subInputList.filter((subInput) => {
            return subInput['id'] != targetId;
        });

        // 维护newList中的id
        for (let i = 0; i < newList.length; ++i) {
            newList[i]['id'] = i;
        }

        this.setState(
            {
                subInputList: newList,
            },
            () => {
                this.updateKey('', '');
                this.updateValue('', '');
            }
        );
    },

    _update: function(targetId, targetContent, targetField) {
        const { formSubInputData: data } = this.props; 

        let newList = [];
        let kvDict = {};
        this.state.subInputList.forEach((subInput, index, arr) => {
            let newInput = {
                id: subInput['id'],
                key: subInput['key'],
                value: subInput['value'],
            };

            if (newInput['id'] == parseInt(targetId)) {
                newInput[targetField] = targetContent;
            }

            kvDict[newInput['key']] = newInput['value'];

            newList.push(newInput);
        });
        
        // 通知父组件更新
        this.props.changeCallback(
            this.props.subInputId,
            kvDict // 不需要JSON序列化
        );

        this.setState({
            subInputList: newList
        });
    },

    updateKey: function(targetId, targetKey) {
        this._update(targetId, targetKey, 'key');
    },

    updateValue: function(targetId, targetValue) {
        this._update(targetId, targetValue, 'value');
    },

    render: function() {
        const { formSubInputData: data, noLabel, prefix } = this.props;
        const detailContent = basic.decode(data['detail']);
        const thisInput = this;

        const subInputs = this.state.subInputList.map((subInput) => {
            return (
                <Form.Item key={subInput['id']}>
                    <FormSubInput
                        noLabel={noLabel}
                        params={this.props.params}
                        subInputId={subInput['id']}
                        subInputValue={subInput['key']}
                        prefix={`${prefix}_key_${data['pname']}_${subInput['id']}_`}
                        changeCallback={thisInput.updateKey}
                        formSubInput={detailContent['key_sub_input']} />

                    <FormSubInput
                        noLabel={noLabel}
                        params={this.props.params}
                        subInputId={subInput['id']}
                        subInputValue={subInput['value']}
                        prefix={`${prefix}_value_${data['pname']}_${subInput['id']}_`}
                        changeCallback={thisInput.updateValue}
                        formSubInput={detailContent['value_sub_input']} />

                    <Button onClick={() => thisInput.remove(subInput['id'])}>删除</Button>
                </Form.Item>
            );
        });

        return (
            <Form.Item
                extra={this.getExtraMessage()}
                label={!noLabel && data['display']}>

                {subInputs}
                <Button onClick={thisInput.add}>添加</Button>

            </Form.Item>
        );
    }
});

// json类型
let JsonFormSubInput = React.createClass({
    mixins: [CommonSubInputMixin],
    getInitialState: function() {
        return {
            submitValue: basic.decode(this.getCurrentValue()),
        };
    },

    update(key, value) {
        const { formSubInputData: data, subInputId } = this.props;

        const submitValue = this.state.submitValue;
        submitValue[key] = value;

        this.setState({
            submitValue: submitValue,
        });

        this.props.changeCallback(subInputId, submitValue);
    },

    componentWillReceiveProps: function(nextProps) {
        if (nextProps != this.props) {
            this.setState({
                submitValue: basic.decode(this.getCurrentValue(nextProps)),
            });
        }
    },

    render: function() {
        const { remoteData, formSubInputData: data, noLabel } = this.props;
        const { submitValue } = this.state;
        const detailContent = basic.decode(data['detail']);

        let inputList = basic.keys(detailContent['structure']).map((key) => {
            let value = detailContent['structure'][key];
            return (
                <JsonField
                    key={key}
                    display={key}
                    hintData={value}
                    submitData={submitValue}
                    params={this.props.params}
                    changeCallback={this.update} />
            );
        });

        return (
            <Form.Item
                extra={this.getExtraMessage()}
                label={!noLabel && data['display']}>

                {inputList}
            </Form.Item>
        );
    }
});
