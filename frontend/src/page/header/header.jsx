/**
 * @author  reetsee.com
 * @date    20160619
 */
import React from 'react';
import { Link } from 'react-router';

import { Icon, Dropdown, Menu, Spin } from 'antd';

import * as basic from '../../libs/basic.jsx';
import G from "../../libs/global.jsx";

import { Item } from '../item/item.jsx';

import { headerCtl } from './controller.jsx';

export let Header = React.createClass({
    getInitialState: function() {
        this.isMobile = G.isMobile();
        return {
            headerData: undefined,
            currentItemKey: undefined, //this.props.params.page,
            pageItemDict: {},
        };
    },

    componentWillReceiveProps: function(nextProps) {
        let pageUrlMark = nextProps.params.page;
        this.setState({
            currentItemKey: '' + this.state.pageItemDict[pageUrlMark],
        });
    },

    getData: function(props) {
        props = props || this.props;
        let headerUniqkey = props.header || props.subHeader;
        headerCtl.getHeaderByUniqkey(headerUniqkey).then(
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

    handleClick: function(e) {
        this.setState({
            currentItemKey: e.key,
        });
    },

    registerPageItem: function(itemKey, pageUrlMark) {
        let { pageItemDict } = this.state;
        pageItemDict[pageUrlMark] = itemKey;
        this.setState({
            currentItemKey: '' + pageItemDict[this.props.params.page],
            pageItemDict: pageItemDict,
        });
    },

    render: function() {
        const { headerData: data } = this.state;
        const componentsContent = basic.decode(
            basic.safeGet(data, ['components'])
        );

        const headerType = this.props.subHeader ? 'subHeader' : 'header';

        if (!this.props[headerType]) {
            return null;
        }

        if (data == undefined || data['uniqkey'] != this.props[headerType]) {
            this.getData();
            return (
                <div style={{textAlign: "center", verticalAlign: "center"}}>
                <Spin />
                {this.props.children}
                </div>
            );
        } else {
            if (!componentsContent['item']
                    || componentsContent['item'].length == 0) {
                return null; 
            }

            const customHeaderAttrs = this.isMobile || headerType == 'subHeader' ? {} :
                {
                    theme: 'dark',
                    style: {
                        lineHeight: '64px',
                        fontSize: '15px',
                    }
                };

            const menu = (
                <Menu 
                    onClick={this.handleClick}
                    selectedKeys={[this.state.currentItemKey]}
                    mode="horizontal"
                    {...customHeaderAttrs} >

                    {componentsContent['item'].map((itemKey) => {
                        return (
                            <Menu.Item key={itemKey}>
                                <Item 
									registerPageItem={this.registerPageItem}
									params={this.props.params} 
									item={itemKey} />
                            </Menu.Item>
                        );
                    })}
                </Menu>
            );

			if (this.isMobile) {
                return (
                    <div>
                        <Dropdown overlay={menu} trigger={['click']}>
                            <a href="#">
                                {"导航"} <Icon type="down" />
                            </a>
                        </Dropdown>
                        {this.props.children}
                    </div>
                )
            } else {
                return (
                    // 展示顶部导航
                    <div>
                        {menu}
                        {this.props.children}
                    </div>
                );
            }
        }
    }
});
