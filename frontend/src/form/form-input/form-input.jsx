/**
 * @author  reetsee.com
 * @date    20160523
 * @desc    表单input相关的代码
 */
import React from 'react';

import { 
    Row, Col, Select, Spin, Form, Input, InputNumber, 
    DatePicker, Button } from 'antd';

import $ from 'jquery';

import * as basic from '../../libs/basic.jsx';

import { FormSubInput } from "./form-sub-input.jsx";
import { JsonField } from './json-field.jsx';
import { formInputCtl } from './controller.jsx';

var CommonInputMixin = {
    getAssignedAttrs: function(props) {
        props = props || this.props;
        const { formInputData: data } = props;
        const assignedAttrs = basic.decode(data['assignedAttrs']);
        return assignedAttrs;
    },

    getExtraMessage: function(props) {
        props = props || this.props;
        const { formInputData: data } = props;
        return basic.safeGet(data, ['help_message']);
    },
};

export let FormInput = React.createClass({
    getInitialState: function() {
        return {
            'formInputData': undefined,
        };
    },

    getData: function(props) {
        props = props || this.props;
        let formInputId = props.formInput;
        formInputCtl.getFormInputById(formInputId).then(
            (formInputData) => { // 成功
                this.setState({
                    formInputData: formInputData,
                });
            },
            (error) => { // 失败
                console.log(error);
            }
        );
    },

    componentDidMount: function() {
        this.getData();
    },

    componentWillReceiveProps: function(nextProps) {
        if (this.props != nextProps) {
            this.getData(nextProps);
        }
    },

    render: function() {
        const { formInputData: data } = this.state;
        if (data == undefined || data['id'] != this.props.formInput) {
            return (
                <div>
                <Spin size="small" />
                {this.props.children}
                </div>
            );
        } else {
            switch(data['form_input_type']) {
            case 'string':
                return (
                    <StringFormInput 
                        {...this.props}
                        formInputData={data} 
                    />
                );
            case 'number':
                return (
                    <NumberFormInput 
                        {...this.props}
                        formInputData={data} 
                    />
                );
            case 'datetime':
                return (
                    <DatetimeFormInput 
                        {...this.props}
                        formInputData={data} 
                    />
                );
            case 'textarea':
                return (
                    <TextareaFormInput 
                        {...this.props}
                        formInputData={data} 
                    />
                );
            case 'select':
                return (
                    <SelectFormInput 
                        {...this.props}
                        formInputData={data} 
                    />
                );
            case 'relation':
                return (
                    <RelationFormInput
                        {...this.props}
                        formInputData={data}
                    />
                );
            case 'mutablelist':
                return (
                    <MutablelistFormInput 
                        {...this.props}
                        formInputData={data} 
                    />
                );
            case 'mutabledict':
                return (
                    <MutabledictFormInput 
                        {...this.props}
                        formInputData={data} 
                    />
                );
            case 'json':
                return (
                    <JsonFormInput 
                        {...this.props}
                        formInputData={data} 
                    />
                );
            //case 'radio':
            //    return (<RadioFormInput formInputData={this.state.formInputData} />);
            //case 'checkbox':
            //    return (<CheckboxFormInput formInputData={this.state.formInputData} />);
            default: 
                alert('Unknown form input: ' + JSON.stringify(data));
                return null;
            }
        }
    }
});

// 普通输入框
let StringFormInput = React.createClass({
    mixins: [CommonInputMixin],
    render: function() {
        const { remoteData, formInputData: data } = this.props;
        const inputProps = this.props.form.getFieldProps(
            data['pname'],
            {
                initialValue: basic.safeGet(remoteData, [data['pname']])
                    || data['default'] 
                    || '',
            }
        );

        return (
            <Form.Item
                labelCol={{span: 4}}
                wrapperCol={{span: 16, offset: 1}}
                extra={this.getExtraMessage()}
                label={data['display']}>

                <Input 
                    {...inputProps}
                    {...this.getAssignedAttrs()} />
            </Form.Item>
        );
    }
});

// 数字输入框
let NumberFormInput = React.createClass({
    mixins: [CommonInputMixin],
    render: function() {
        const { remoteData, formInputData: data } = this.props;
        const inputProps = this.props.form.getFieldProps(
            data['pname'],
            {
                initialValue: basic.safeGet(remoteData, [data['pname']])
                    || data['default'] 
                    || 0,
            }
        );

        return (
            <Form.Item
                labelCol={{span: 4}}
                wrapperCol={{span: 16, offset: 1}}
                extra={this.getExtraMessage()}
                label={data["display"]}>

                <InputNumber
                    {...inputProps}
                    {...this.getAssignedAttrs()} />
            </Form.Item>
        );
    }
});

// 日期时间输入框
let DatetimeFormInput = React.createClass({
    mixins: [CommonInputMixin],
    render: function() {
        const { remoteData, formInputData: data } = this.props;
        const inputProps = this.props.form.getFieldProps(
            data['pname'],
            {
                initialValue: basic.safeGet(remoteData, [data['pname']])
                    || data['default'] 
                    || new Date()
            }
        );
        
        let format = 'yyyy-MM-dd HH:mm:ss';
        if (data['detail'] && data['detail'].length > 0) {
            format = basic.deocde(data['detail'], {})['format'] || format;
        }

        return (
            <Form.Item
                labelCol={{span: 4}}
                wrapperCol={{span: 16, offset: 1}}
                extra={this.getExtraMessage()}
                label={data["display"]}>

                <DatePicker 
                    showTime format={format}
                    {...inputProps}
                    {...this.getAssignedAttrs()} />
            </Form.Item>
        )
    }
});

// 段落框
let TextareaFormInput = React.createClass({
    mixins: [CommonInputMixin],
    render: function() {
        const { remoteData, formInputData: data } = this.props;
        const inputProps = this.props.form.getFieldProps(
            data['pname'],
            {
                initialValue: basic.safeGet(remoteData, [data['pname']])
                    || data['default'] 
                    || ''
            }
        );
        return (
            <Form.Item
                labelCol={{span: 4}}
                wrapperCol={{span: 16, offset: 1}}
                extra={this.getExtraMessage()}
                label={data["display"]}>

                <Input 
                    type="textarea" 
                    {...inputProps}
                    {...this.getAssignedAttrs()} />
            </Form.Item>
        );
    }
});

// 下拉列表
let SelectFormInput = React.createClass({
    mixins: [CommonInputMixin],
    getInitialState: function() {
        const { formInputData: data } = this.props;
        const detailContent = basic.decode(data['detail']);

        return {
            optionList: basic.safeGet(
                detailContent, ['option_list']
            ) || [],
        };
    },

    componentWillMount: function() {
        formInputCtl.getSelectOptionList(this, 'formInputData');
    },

    render: function() {
        const { remoteData, formInputData: data } = this.props;
        const { optionList } = this.state;
        let detailContent = basic.decode(data['detail']);

        const inputProps = this.props.form.getFieldProps(
            data['pname'],
            {
                initialValue: basic.safeGet(remoteData, [data['pname']])
                    || data['default']
            }
        );
        
        return (
            <Form.Item
                labelCol={{span: 4}}
                wrapperCol={{span: 16, offset: 1}}
                extra={this.getExtraMessage()}
                label={data['display']}>

                <Select 
                    tags={basic.safeGet(detailContent, ['multi'], false)}
                    {...inputProps}
                    {...this.getAssignedAttrs()}>

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
let RelationFormInput = React.createClass({
    mixins: [CommonInputMixin],
    getInitialState: function() {
        const { remoteData, formInputData: data } = this.props;
        const detailContent = basic.decode(data['detail']);
        let remoteDataValue = basic.safeGet(remoteData, [data['pname']]);

        return {
            relationList: basic.safeGet(
                detailContent, ['relation_list']
            ) || [],
            selectedValue: remoteDataValue || data['default'],
        };
    },

    componentWillMount: function() {
        formInputCtl.getRelationList(this, 'formInputData');
    },

    componentWillReceiveProps: function(nextProps) {
        if (nextProps.remoteData != this.props.remoteData) {
            const { remoteData, formInputData: data } = nextProps;

            let remoteDataValue = basic.safeGet(remoteData, [data['pname']]);

            this.setState({
                selectedValue: remoteDataValue,
            });
        }
    },

    handleChange: function(value, option) {
        this.setState({
            selectedValue: value,
        });
    },

    render: function() {
        const { remoteData, formInputData: data } = this.props;
        const { relationList, selectedValue } = this.state;
        const detailContent = basic.decode(data['detail']);
        const inputProps = this.props.form.getFieldProps(
            data['pname'],
            {
                initialValue: basic.safeGet(remoteData, [data['pname']]) || data['default']
            }
        );

        let targetRelationList = relationList.filter((relation) => {
            return relation['value'] == selectedValue;
        });

        const relatedInputList = [];
        targetRelationList.forEach((relation) => {
            relation['form_input'].forEach((relatedInput) => {
                const index = relatedInputList.length;
                relatedInputList.push(
                    <FormInput
                        key={index}
                        params={this.props.params}
                        form={this.props.form}
                        formInput={relatedInput}
                        labelCol={{span: 6}}
                        wrapperCol={{span: 14}}
                        remoteData={remoteData}
                    />
                );
            }); 
        });

        return (
            <div>
            <Form.Item
                labelCol={{span: 4}}
                wrapperCol={{span: 16, offset: 1}}
                extra={this.getExtraMessage()}
                label={data['display']}>

                <Select
                    tags={basic.safeGet(detailContent, ['multi'], false)}
                    onSelect={this.handleChange}
                    {...inputProps}
                    {...this.getAssignedAttrs()}>

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
    }
});

// 可动态添加的列表类型
let MutablelistFormInput = React.createClass({
    mixins: [CommonInputMixin],
    getInitialState: function() {
        let subInputList = this.computeSubInputList(this.props);
        return {
            subInputList: subInputList,
        };
    },

    computeSubInputList: function(props) {
        props = props || this.props;
        let { remoteData, formInputData: data } = props;
        let valueList = basic.safeGet(remoteData, [data['pname']])
                || basic.safeGet(data, ['default']);

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
        if (nextProps.remoteData != this.props.remoteData) {
            let subInputList = this.computeSubInputList(nextProps);
            this.setState({
                subInputList: subInputList,
            });
        }
    },

    add: function() {
        let newList = this.state.subInputList.concat({
            id: this.state.subInputList.length,
            value: this.props.formInputData['default'],
        });
        this.setState({
            subInputList: newList
        });
    },

    remove: function(targetId) {
        let newList = this.state.subInputList.filter((subInput) => {
            return subInput['id'] != targetId;
        });

        // 维护id列表
        for (let i = 0; i < newList.length; ++i) {
            newList[i]['id'] = i;
        }

        this.setState(
            {
                subInputList: newList,
            }, 
            () => { // dummy update
                this.update('', '');
            }
        );
    },

    update: function(targetId, targetValue) {
        const { formInputData: data } = this.props;
        const { setFieldsValue } = this.props.form;

        // 永远不要直接修改states的内容
        // 所以开一个新的数组
        let newList = []; 
        let valueList = [];
        this.state.subInputList.forEach((subInput) => {
            let newInput = {id: subInput['id'], value: subInput['value']};
            if (newInput['id'] == parseInt(targetId)) {
                newInput['value'] = targetValue;
            }

            valueList.push(newInput['value']);

            newList.push(newInput);
        });

        let updateDict = {};
        updateDict[data['pname']] = valueList;
        setFieldsValue(updateDict);

        this.setState({
            subInputList: newList
        });
    },

    render: function() {
        const { formInputData: data } = this.props;
        const { getFieldProps, getFieldValue } = this.props.form;
        const { subInputList } = this.state;
        const detailContent = basic.decode(data['detail']);

        const thisInput = this;

        const subInputs = subInputList.map((subInput) => {
            return (
                <Form.Item key={subInput['id']}>
                    <Row justify="space-around">
                    <Col span={18}>
                    <FormSubInput 
                        params={this.props.params}
                        subInputId={subInput['id']}
                        subInputValue={subInput['value']}
                        prefix={`__dummy_${data['pname']}_${subInput['id']}_`}
                        changeCallback={thisInput.update}
                        formSubInput={detailContent['sub_input']} />
                    </Col>
                    <Col span={6}>
                    <Button onClick={() => thisInput.remove(subInput['id'])}>删除</Button>
                    </Col>
                    </Row>
                </Form.Item>
            );
        });

        const primaryItemProps = getFieldProps(
            data['pname'],
            {
                initialValue: [],
            }
        );
        const primaryValue = basic.encode(getFieldValue(data['pname']));

        return (
            <Form.Item
                labelCol={{span: 4}}
                wrapperCol={{span: 16, offset: 1}}
                extra={this.getExtraMessage()}
                label={data['display']}>

                {subInputs}
                <Button onClick={thisInput.add}>添加</Button>

                <Form.Item>
                    <Input value={primaryValue} disabled />
                </Form.Item>
            </Form.Item>
        );
    }
});

// 可动态添加的字典类型
let MutabledictFormInput = React.createClass({
    mixins: [CommonInputMixin],
    getInitialState: function() {
        let subInputList = this.computeSubInputList(this.props);
        return {
            subInputList: subInputList,
        };
    },

    computeSubInputList: function(props) {
        props = props || this.props;
        let { remoteData, formInputData: data } = props;
        let kvDict = basic.safeGet(remoteData, [data['pname']])
                || basic.safeGet(data, ['default']);

        if (kvDict) {
            kvDict = basic.decode(kvDict);
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
        if (nextProps.remoteData != this.props.remoteData) {
            this.setState({
                subInputList: this.computeSubInputList(nextProps),
            });
        }
    },

    add: function() {
        const { formInputData: data } = this.props;
        const defaultContent = basic.decode(data['default']) || {};

        let newList = this.state.subInputList.concat([{
            id: this.state.subInputList.length,
            key: defaultContent['key'],
            value: defaultContent['value'],
        }]);
        this.setState({
            subInputList: newList,
        });
    },

    remove: function(targetId) {
        let newList = this.state.subInputList.filter((subInput) => {
            return subInput['id'] != targetId;
        });

        // 维护id
        for (let i = 0; i < newList.length; ++i) {
            newList[i]['id'] = i;
        }

        this.setState(
            {
                subInputList: newList
            },
            () => {
                this.updateKey('', '');
                this.updateValue('', '');
            }
        );
    },

    _update: function(targetId, targetContent, targetField) {
        const { formInputData: data } = this.props;
        const { setFieldsValue } = this.props.form;

        let newList = [];
        let kvDict = {};
        this.state.subInputList.forEach((subInput) => {
            let newInput = {
                id: subInput['id'],
                key: subInput['key'],
                value: subInput['value'],
            };

            // 0 == '' => true
            // 0 == parseInt('') => false
            if (newInput['id'] == parseInt(targetId)) {
                newInput[targetField] = targetContent;
            }

            kvDict[newInput['key']] = newInput['value'];

            newList.push(newInput);
        });

        let updateDict = {};
        updateDict[data['pname']] = kvDict;
        setFieldsValue(updateDict);

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
        const { formInputData: data } = this.props;
        const { getFieldProps, getFieldValue } = this.props.form;
        const { subInputList } = this.state;
        const detailContent = basic.decode(data['detail']);
        const thisInput = this;

        const subInputs = this.state.subInputList.map((subInput) => {
            return (
                <Form.Item key={subInput['id']}>
                    <FormSubInput
                        params={this.props.params}
                        subInputId={subInput['id']}
                        subInputValue={subInput['key']}
                        prefix={`__dummy_key_${data['pname']}_${subInput['id']}_`}
                        changeCallback={thisInput.updateKey}
                        formSubInput={detailContent['key_sub_input']} />

                    <FormSubInput
                        params={this.props.params}
                        subInputId={subInput['id']}
                        subInputValue={subInput['value']}
                        prefix={`__dummy_value_${data['pname']}_${subInput['id']}`}
                        changeCallback={thisInput.updateValue}
                        formSubInput={detailContent['value_sub_input']} />

                    <Button onClick={() => thisInput.remove(subInput['id'])}>删除</Button>
                </Form.Item>
            );
        });

        const primaryInputProps = getFieldProps(
            data['pname'],
            {
                initialValue: {},
            }
        );
        const primaryValue = basic.encode(getFieldValue(data['pname']));

        return (
            <Form.Item
                labelCol={{span: 4}}
                wrapperCol={{span: 16, offset: 1}}
                extra={this.getExtraMessage()}
                label={data['display']}>

                {subInputs}
                <Button onClick={this.add}>添加</Button>

                <Form.Item>
                    <Input value={primaryValue} disabled />
                </Form.Item>
            </Form.Item>
        );
    }
});

// json数据类型
let JsonFormInput = React.createClass({
    mixins: [CommonInputMixin],
    getInitialState: function() {
        const { remoteData, formInputData: data } = this.props;
        return {
            submitValue: basic.decode(basic.safeGet(remoteData, [data['pname']]))
                || basic.decode(data['default'])
                || {}
        };
    },

    update(key, value) {
        const { formInputData: data } = this.props;
        const { setFieldsValue } = this.props.form;

        const submitValue = this.state.submitValue || {};
        submitValue[key] = value;

        let updateDict = {};
        updateDict[data['pname']] = submitValue;
        setFieldsValue(updateDict);

        this.setState({
            submitValue: submitValue,
        });
    },

    componentWillReceiveProps: function(nextProps) {
        // 如果remoteData发生变化，则更新submitValue
        if (nextProps.remoteData != this.props.remoteData) {
            const { remoteData, formInputData: data } = nextProps;
            let remoteDataValue = basic.decode(basic.safeGet(remoteData, [data['pname']]));

            this.setState({
                submitValue: remoteDataValue,
            });

            const { setFieldsValue } = nextProps.form;
            let updateDict = {};
            updateDict[data['pname']] = remoteDataValue;
            setFieldsValue(updateDict);
        }
    },

    render: function() {
        const { remoteData, formInputData: data } = this.props;
        const { getFieldProps, getFieldValue } = this.props.form;
        const { submitValue } = this.state;
        const detailContent = basic.decode(data['detail']);

        let remoteDataValue = basic.decode(basic.safeGet(remoteData, [data['pname']]));

        // 根据structure构建sub input
        let inputList = basic.keys(detailContent['structure']).map((key) => {
            let value = detailContent['structure'][key];
            return (
                <JsonField 
                    key={key} 
                    display={key} 
                    hintData={value} 
                    remoteData={remoteDataValue}
                    submitData={submitValue}
                    params={this.props.params}
                    changeCallback={this.update} />
            );
        });

        const primaryInputProps = getFieldProps(
            data['pname'],
            {
                initialValue: remoteDataValue || submitValue || {},
            }
        );
        const primaryValue = basic.encode(getFieldValue(data['pname']));

        return (
            <Form.Item 
                labelCol={{span: 4}}
                wrapperCol={{span: 16, offset: 1}}
                extra={this.getExtraMessage()}
                label={data['display']}>

                {inputList}

                <Form.Item>
                    <Input value={primaryValue} disabled />
                </Form.Item>
            </Form.Item>
        );
    }
});
