/**
 * @author  reetsee.com
 * @date    20160619
 */
import React from 'react';
import { Link } from 'react-router';

import { Menu, Spin } from 'antd';

import * as basic from '../../libs/basic.jsx';

import { Item } from '../item/item.jsx';

import { headerCtl } from './controller.jsx';

export let Header = React.createClass({
    getInitialState: function() {
        return {
            headerData: undefined,
            currentItemKey: undefined, //this.props.params.page,
        };
    },

    getData: function(props) {
        props = props || this.props;
        let headerId = props.header || props.subHeader;
        headerCtl.getHeaderById(headerId).then(
            (headerData) => { // 成功
                this.setState({
                    headerData: headerData,
                });
            },
            (error) => { // 失败
                console.log(error);
            }
        );
    },

    componentWillMount: function() {
        this.getData();
    },

    componentWillReceiveProps: function(nextProps) {
        if (this.props.header != nextProps.header 
                || this.props.subHeader != nextProps.subHeader) {
            this.getData(nextProps);
        }
    },

    handleClick: function(e) {
        this.setState({
            currentItemKey: e.key,
        });
    },

    render: function() {
        const { headerData: data } = this.state;
        const componentsContent = basic.decode(
            basic.safeGet(data, ['components'])
        );

        const headerIdKey = this.props.subHeader ? 'subHeader' : 'header';

        if (data == undefined || data['id'] != this.props[headerIdKey]) {
            return (
                <div style={{textAlign: "center", verticalAlign: "center", marginTop: "5%"}}>
                <Spin />
                {this.props.children}
                </div>
            );
        } else {
            if (!componentsContent['item']
                    || componentsContent['item'].length == 0) {
                return null; 
            }

            const customHeaderAttrs = headerIdKey == 'subHeader' ? {} :
                {
                    theme: 'dark',
                    style: {
                        lineHeight: '64px',
                        fontSize: '15px',
                    }
                };

            return (
                // 展示顶部导航
                <div>
                <Menu 
                    onClick={this.handleClick}
                    selectedKeys={[this.state.currentItemKey]}
                    mode="horizontal"
                    {...customHeaderAttrs} >

                    {componentsContent['item'].map((itemId) => {
                        return (
                            <Menu.Item key={itemId}>
                            <Item 
                                params={this.props.params} 
                                item={itemId} />
                            </Menu.Item>
                        );
                    })}
                </Menu>
                {this.props.children}
                </div>
            );
        }
    }
});
