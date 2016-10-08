/**
 * @author  reetsee.com
 * @date    20160520
 */
import $ from 'jquery';
import * as basic from '../libs/basic.jsx';

let PAGE_API = {
    URL_GET_PAGE: '/api/page/get_page',
    URL_GET_PAGE_LIST: '/api/page/get_page_list',
};

class PageCtl {
    constructor() {
        this.pageDict = {};
    }

    getPageList(pn, rn) {
        pn = pn || 1;
        rn = rn || 100;
        let thisCtl = this;

        return new Promise(function(resolve, reject) {
            $.ajax({
                type: 'GET',
                url: PAGE_API.URL_GET_PAGE_LIST,
                data: {
                    ie: 'utf-8',
                    pn: pn,
                    rn: rn,
                },
                success: function(data, status) {
                    if (basic.statusOk(status) !== ''
                            || basic.errnoOk(data) !== '') {
                        reject('Get page list failed');
                        return;
                    }

                    data['data']['page_list'].forEach((page) => {
                        let urlmark = page['urlmark'];
                        thisCtl.pageDict[urlmark] = new Promise((rs, rj) => {
                            rs(page);
                        });
                    });

                    resolve(data['data']['page_list']);
                }
            })
        });
    }

    /**
     * @author  xuruiqi
     * @desc    通过page id获取page的详细信息
     */
    getPageById(pageId, forceUpdate) {
        let thisCtl = this;
        pageId = parseInt(pageId);

        if (thisCtl.pageDict[pageId] == undefined || forceUpdate) {
            thisCtl.pageDict[pageId] = new Promise((resolve, reject) => {
                $.ajax({
                    type: 'GET',
                    url: PAGE_API.URL_GET_PAGE,
                    data: {
                        ie: 'utf-8',
                        id: pageId,
                    },
                    success: function(data, status) {
                        if (basic.statusOk(status) !== ''
                                || basic.errnoOk(data) !== '') {
                            reject('Get page data failed');
                            return;
                        }

                        let urlmark = data['data']['urlmark'];
                        thisCtl.pageDict[urlmark] = new Promise((rs, rj) => {
                            rs(data['data']);
                        });

                        resolve(data['data']);
                    },
                    error: function() {
                        reject('Get page data failed');
                    }
                });
            });
            thisCtl.pageDict[pageId].catch((reason) => {
                console.log(reason);
                //setTimeout(
                //    () => { thisCtl.getPageById(pageId, true); },
                //    5000
                //);
            });
        }

        return thisCtl.pageDict[pageId];
    }

    getPage(urlmark, forceUpdate) {
        let thisCtl = this;

        if (thisCtl.pageDict[urlmark] == undefined || forceUpdate) {
            thisCtl.pageDict[urlmark] = new Promise((resolve, reject) => {
                $.ajax({
                    type: 'GET',
                    url: PAGE_API.URL_GET_PAGE,
                    data: {
                        ie: 'utf-8',
                        urlmark: urlmark,
                    },
                    success: function(data, status) {
                        if (basic.statusOk(status) !== ''
                                || basic.errnoOk(data) !== '') {
                            reject('Get page data failed');
                            thisCtl.pageDict[urlmark] = undefined;
                            return;
                        }

                        resolve(data['data']);
                    },
                    error: function() {
                        reject('Get page data failed');
                    }
                });
            });
            thisCtl.pageDict[urlmark].catch((reason) => {
                console.log(reason);
                //setTimeout(
                //    () => { thisCtl.getPage(urlmark, true); },
                //    5000
                //);
            });
        }

        return thisCtl.pageDict[urlmark];
    }
};
export let pageCtl = new PageCtl();
