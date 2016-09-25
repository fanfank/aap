/**
 * @author  reetsee.com
 * @date    20160619
 */
import React from 'react';

import { Spin } from 'antd';

import { Avatar } from './avatar/avatar.jsx';
import { Header } from './header/header.jsx';
import { Lefter } from './lefter/lefter.jsx';

import * as basic from '../libs/basic.jsx';

import { pageCtl } from './controller.jsx';

import '../layout.css';

import * as contentProvider from '../custom/init.jsx';

export let Page = React.createClass({
    getInitialState: function() {
        return {
            'pageData': undefined,
            'contentProviderClass': undefined,
        };
    },

    getData: function(props) {
        props = props || this.props;
        let urlmark = props.params.page;
        let thisPage = this;
        pageCtl.getPage(urlmark).then(
            (pageData) => { // 成功
                // 获取Page Content
                let contentProviderClass = undefined;
                let className = undefined;

                const contentContent = basic.decode(pageData['content']);

                switch(basic.safeGet(
                        contentContent, ['type'])) {
                case 'list':
                    className = 'DefaultPageContent';
                    contentProviderClass = contentProvider[className];
                    break;
                case 'custom':
                    className = contentContent['class_name'];
                    contentProviderClass = contentProvider[className];
                    break;
                };

                thisPage.setState({
                    'pageData': pageData,
                    'contentProviderClass': contentProviderClass,
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
        if (this.props.params.page != nextProps.params.page) {
            this.getData(nextProps);
        }
    },

    refreshContent: function() {
        if (this.contentProviderRef && this.contentProviderRef.refresh) {
            this.contentProviderRef.refresh();
        }
    },
    
    render: function() {
        if (this.state.pageData == undefined) {
            return (
                <div style={{textAlign: 'center', verticalAlign: 'center', position: 'fixed', top: '50%', left: '50%', marginTop: '-48px', marginLeft: '-48px'}}>
                    <Spin size={'large'} />
                </div>
            );
        } else {
            // 页面中间的详细内容
            let pageContent = null;
            if (this.state.contentProviderClass) {
                // 一定要大写驼峰
                const ContentProviderClass = this.state.contentProviderClass;
                pageContent = (
                    <ContentProviderClass ref={(ref) => this.contentProviderRef = ref}
                        pageData={this.state.pageData}/>
                );
            }

            // 改变页面的title
            document.title = basic.safeGet(this.state.pageData, ['title'], 'AAP');

            // 给所有的children加上page对象，以便它们可以根据表单行为
            // 更新当前page的content部分
            const childrenWithProps = React.Children.map(
                this.props.children,
                (child) => React.cloneElement(child, {
                    page: this,
                })
            );

            // 获得页面的组件
            const componentsContent = basic.decode(
                this.state.pageData['components']
            );
            const { header, lefter, sub_header: subHeader } = componentsContent;

            // 单独对sub header做判断
            let SubHeaderContent = null;
            if (subHeader) {
                SubHeaderContent = (
                    <div className="ant-layout-subheader">
                    <div className="ant-layout-wrapper">
                        <Header params={this.props.params} subHeader={subHeader} />
                    </div>
                    </div>
                );
            }

            return (
                <div className="ant-layout-topaside">
                    <Avatar />
                    <div className="ant-layout-header">
                    <div className="ant-layout-wrapper">
                        <Header params={this.props.params} header={header} />
                    </div>
                    </div>

                    {SubHeaderContent}

                    <div className="ant-layout-wrapper">
                    <div className="ant-layout-container">
                        <aside className="ant-layout-sider">
                            <Lefter params={this.props.params} lefter={lefter} />
                        </aside>
                        <div className="ant-layout-content">
                            <div>
                            <div style={{clear: 'both'}}>
                            {pageContent}
                            {childrenWithProps} 
                            </div>
                            </div>
                        </div>
                    </div>
                    </div>

                </div>
            );
        }
    }
});
