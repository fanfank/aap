/**
 * @author  reetsee.com
 * @date    20160619
 */
import React from 'react';

import { Icon, Dropdown, Menu, Spin } from 'antd';

import * as basic from '../../libs/basic.jsx';
import G from "../../libs/global.jsx";

import { Item } from '../item/item.jsx';

import { lefterCtl } from './controller.jsx'

export let Lefter = React.createClass({
    getInitialState: function() {
        this.isMobile = G.isMobile();
        return {
            lefterData: undefined,
            currentItemKey: undefined,
            pageItemDict: {},
        };
    },

    componentWillReceiveProps: function(nextProps) {
        let pageUrlMark = nextProps.params.page;
        this.setState({
            currentItemKey: '' + this.state.pageItemDict[pageUrlMark],
        });
    },

    handleClick: function(itemKey) {
        this.setState({
            currentItemKey: '' + itemKey,
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

    getData: function(props) {
        props = props || this.props;
        let lefterUniqkey = props.lefter;
        lefterCtl.getLefterByUniqkey(lefterUniqkey).then(
            (lefterData) => {
                this.setState({ // 成功
                    lefterData: lefterData,
                });
            },
            (error) => { // 失败
                console.log(error);
            }
        );
    },

    render: function() {
        const { lefterData: data } = this.state;
        const componentsContent = basic.decode(
            basic.safeGet(data, ['components'])
        );

        if (!this.props.lefter || this.props.lefter.length == 0) {
            return null; 
        }

        if (data == undefined || data['uniqkey'] != this.props.lefter) {
            this.getData();
            return (
                <div style={{
                    textAlign: 'center', 
                    verticalAlign: 'center', 
                    marginTop: '45%', 
                    marginLeft: '5%'}}>

                <Spin />
                {this.props.children}
                </div>
            );
        } else {
            if (!componentsContent['item']
                    || componentsContent['item'].length == 0) {
                // 不需要展示
                return null; 
            }

            const menu = (
                <Menu onClick={this.handleClick}
                        selectedKeys={[this.state.currentItemKey]}
                        mode="inline">

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
                                {"页面选项"} <Icon type="down" />
                            </a>
                        </Dropdown>
                        {this.props.children}
                    </div>
                );
            } else {
                return (
                    // 展示侧边导航
                    <div>
                        {menu}
                        {this.props.children}
                    </div>
                );
            }
        }
    }
});
