/**
 * @author  reetsee.com
 * @date    20160619
 */
import React from 'react';

import { Menu, Spin } from 'antd';

import * as basic from '../../libs/basic.jsx';

import { Item } from '../item/item.jsx';

import { lefterCtl } from './controller.jsx'

export let Lefter = React.createClass({
    getInitialState: function() {
        return {
            lefterData: undefined,
        };
    },

    getData: function(props) {
        props = props || this.props;
        let lefterId = props.lefter;
        lefterCtl.getLefterById(lefterId).then(
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

    componentWillMount: function() {
        this.getData();
    },

    componentWillReceiveProps: function(nextProps) {
        if (this.props.lefter != nextProps.lefter) {
            this.getData(nextProps);
        }
    },

    handleClick: function(e) {
        //console.log("click ", e);
        //this.setState({
        //    currentItemKey: e.key,
        //});
    },

    render: function() {
        const { lefterData: data } = this.state;
        const componentsContent = basic.decode(
            basic.safeGet(data, ['components'])
        );

        if (!this.props.lefter || this.props.lefter.length == 0) {
            return null; 
        }

        if (data == undefined || data['id'] != this.props.lefter) {
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

            return (
                // 展示侧边导航
                <div>
                    <Menu onClick={this.handleClick}
                            selectedKeys={[this.state.currentItemKey]}
                            mode="inline">

                        {componentsContent['item'].map((itemId) => {
                            return (
                                <Menu.Item key={itemId}>
                                    <Item params={this.props.params} item={itemId} key={itemId} />
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
