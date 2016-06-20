/**
 * @author  reetsee.com
 * @date    20160621
 */
import React from 'react';
import { Link } from 'react-router';

import { Popconfirm, Table, Notification } from 'antd';

import $ from 'jquery';

import * as basic from '../../libs/basic.jsx';

export let DefaultPageContent = React.createClass({
    getInitialState: function() {
        return {
            contentData: [],
            pagination: {},
            loading: false,
        };
    },

    handleTableChange: function(pagination, filters, sorter) {
        this.fetch(pagination.current, pagination.pageSize);
    },

    fetch: function(pn, rn, props) {
        this.setState({ loading: true });
        const { pageData } = (props || this.props);
        const contentContent = basic.decode(pageData['content']);

        pn = pn || 1;
        rn = rn || 10;
        $.ajax({
            type: 'GET',
            url: basic.hostPortPrefix + contentContent['api'],
            data: {
                ie: 'utf-8',
                pn: pn,
                rn: rn,
            },
            success: function(data, status) {
                if (basic.statusOk(status) !== '') {
                    this.setState({
                        contentData: [],
                        pagination: {},
                        loading: false,
                    });
                    alert('获取列表数据失败');
                    return;
                }

                let dataList = basic.getField(
                    data, 
                    contentContent['data_path']
                );

                let pageInfo = basic.getField(
                    data,
                    contentContent['page_info_path'],
                    ['data', 'page_info']
                );

                const pagination = this.state.pagination;
                pagination.total = pageInfo['total'];
                pagination.current = pageInfo['pn'] || pn;
                pagination.pageSize = pageInfo['rn'] || rn;
                pagination.showSizeChanger = true;

                this.setState({
                    loading: false,
                    contentData: dataList,
                    pagination,
                });
            }.bind(this)
        });
    },

    refresh: function() {
        this.handleTableChange(
            this.state.pagination
        );
    },

    componentDidMount: function() {
        this.fetch();
    },

    componentWillReceiveProps: function(nextProps) {
        if (this.props.pageData['id'] != nextProps.pageData['id']) {
            this.fetch(undefined, undefined, nextProps);
        }
    },

    buildLastColumn: function() {
        const contentContent = basic.decode(this.props.pageData['content']);
        let operationList = basic.getField(
            contentContent,
            ['operation_list'],
            []
        );
        if (operationList.length == 0) {
            return null;
        }

        // 需要构建最后一列的操作列表及操作函数
        let renderFunction = function(text, record) {
            let spanList = [];
            operationList.forEach((operation) => {
                let formId = operation['form'];
                let pageId = this.props.pageData['id'];
                let display = '';

                // 加一个竖线分割
                if (spanList.length > 0) {
                    spanList.push(
                        <span
                            key={spanList.length}
                            className="ant-divider">
                        </span>
                    );
                }

                switch(operation['type']) {
                case 'view':
                case 'edit':
                case 'duplicate':
                    if (operation['type'] == 'view') {display = '查看';}
                    else if (operation['type'] == 'edit') {display = '修改';}
                    else {display = '复制';}

                    // 加链接
                    let jumpPath = `/page/${pageId}/form/${formId}`;
                    let query = {
                        type: operation['type'],
                        api: operation['api'],
                        post_api: operation['post_api'],
                        id: record['id'],
                        dataPath: JSON.stringify(
                            operation['data_path'] || []
                        ),
                    };
                    spanList.push(
                        <Link
                            key={spanList.length}
                            to={{
                                pathname: jumpPath,
                                query: query,
                            }}>{display}</Link>
                    );

                    break;
                case 'delete':
                    display = '删除';
                    let thisIns = this;
                    let deleteFunction = function(e) {
                        $.ajax({
                            type: 'POST',
                            url: basic.hostPortPrefix + operation['api'],
                            data: {
                                ie: 'utf-8',
                                id: record['id'],
                            },
                            success: function(data, status) {
                                if (basic.statusOk(status) !== '') {
                                    alert(
                                        '删除失败：' + 
                                        JSON.stringify(data)
                                    );
                                    return;
                                } 
                                Notification['success']({
                                    message: '删除成功',
                                    duration: 1,
                                });
                                thisIns.handleTableChange(
                                    thisIns.state.pagination
                                );
                            }
                        });
                    };
                    spanList.push(
                        <Popconfirm 
                            key={spanList.length} 
                            title="Are you sure?" 
                            onConfirm={deleteFunction}>

                            <span 
                                key={spanList.length}
                                style={{cursor: 'pointer', color: 'red'}}
                                >{display}</span>
                        </Popconfirm>
                    );
                }
            });
            return (
                <div>
                    {spanList}
                </div>
            );
        }.bind(this);

        let lastColumn = {
            title: '操作',
            dataIndex: '',
            render: renderFunction, 
        };

        return lastColumn;
    },

    buildColumns: function() {
        const columns = [];
        const contentContent = basic.decode(this.props.pageData['content']);
        basic.getField(
            contentContent,
            ['display_field_list'], 
            []
        ).forEach((column) => {
            columns.push({
                title: column['display'],
                dataIndex: column['field'],
            });
        });

        let lastColumn = this.buildLastColumn();
        if (lastColumn) {
            columns.push(lastColumn);
        }

        return columns;
    },

    render: function() {
        const columns = this.buildColumns();

        return (
            <Table columns={columns}
                dataSource={this.state.contentData}
                pagination={this.state.pagination}
                loading={this.state.loading}
                rowKey={record => record.id}
                onChange={this.handleTableChange} />
        );
    },
});
