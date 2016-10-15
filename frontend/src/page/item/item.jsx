/**
 * @author  reetsee.com
 * @date    20160619
 */
import { Menu, Icon, Spin } from 'antd';

import React from 'react';
import { Link } from 'react-router'

import * as basic from '../../libs/basic.jsx';

import { itemCtl } from './controller.jsx'

var CommonItemMixin = {
    getIcon: function(props) {
        props = props || this.props;
        const { itemData: data } = props;

        if (typeof(data['icon']) == 'string' && data['icon'].length > 0) {
            return (<Icon type={data['icon']} />);
        } else {
            return null;
        }
    },
};

export let Item = React.createClass({
    getInitialState: function() {
        return {
            itemData: undefined,
        };
    },

    getData: function(props) {
        props = props || this.props;
        let itemUniqkey = this.props.item;
        itemCtl.getItemByUniqkey(itemUniqkey).then(
            (itemData) => { // 成功
                this.setState({
                    itemData: itemData,
                });
            },
            (error) => { // 失败
                console.log(JSON.stringify(error));
            }
        );
    },

    componentWillMount: function() {
        this.getData();
    },

    componentWillReceiveProps: function(nextProps) {
        if (this.props.item != nextProps.item) {
            this.getData(nextProps);
        }
    },

    render: function() {
        const { itemData: data } = this.state;
        if (data == undefined || data['uniqkey'] != this.props.item) {
            return (
                <div>
                <Spin size="small" />
                {this.props.children}
                </div>
            );
        } else {
            switch(data['item_type']) {
            case 'page':
                return (<PageItem params={this.props.params} itemData={data} />);
            case 'form':
                return (<FormItem params={this.props.params} itemData={data} />);
            case 'hyperlink':
                return (<HyperlinkItem params={this.props.params} itemData={data} />);
            default:
                alert('Unknown item: ' + JSON.stringify(data));
                return (<div></div>);
            }
        }
    }
});

let PageItem = React.createClass({
    mixins: [CommonItemMixin],
    render: function() {
        const { itemData: data } = this.props;
        const detailContent = basic.decode(data['detail']);

        let urlParameters = ''; 
        if (detailContent['preserve_url_parameters'] == 'yes') {
            let url = window.location.href;
            let queryPos = url.indexOf('?');
            if (queryPos != -1) {
                urlParameters = url.substring(queryPos + 1); 
            }   
        }

        return (
            <Link to={'/page/' + detailContent['page'] + "?" + urlParameters}>
            {this.getIcon()}
            {data['display']}
            </Link>
        );
    }
});

let FormItem = React.createClass({
    mixins: [CommonItemMixin],
    render: function() {
        const { itemData: data } = this.props;
        const detailContent = basic.decode(data['detail']);

        return (
            <Link to={'/page/' + this.props.params.page + '/form/' + detailContent['form']}>
            {this.getIcon()}
            {data['display']}
            </Link>
        );
    }
});

let HyperlinkItem = React.createClass({
    mixins: [CommonItemMixin],
    render: function() {
        const { itemData: data } = this.props;
        const detailContent = basic.decode(data['detail']);

        return (
            <a target="_blank" href={detailContent['href']}>{this.getIcon()}{data['display']}</a>
        );
    }
});
