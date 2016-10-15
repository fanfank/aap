/**
 * @author  reetsee.com
 * @date    20160619
 */
import $ from 'jquery';
import * as basic from '../../libs/basic.jsx';

let HEADER_API = {
    URL_GET_HEADER: '/api/header/get_header',
};

class HeaderCtl {
    constructor() {
        this.headerDict = {};
    }

    /**
     * @author  xuruiqi
     * @desc    通过header id获取header的详细信息
     */
    getHeaderById(headerId, forceUpdate) {
        headerId = parseInt(headerId);
        if (this.headerDict[headerId] == undefined || forceUpdate) {
            this.headerDict[headerId] = this.getHeader(
                HEADER_API.URL_GET_HEADER,
                {ie: 'utf-8', id: headerId}
            );
        }
        return this.headerDict[headerId];
    }

    /**
     * @author  xuruiqi
     * @desc    通过header unique key获取header的详细信息
     */
    getHeaderByUniqkey(uniqkey, forceUpdate) {
        if (this.headerDict[uniqkey] == undefined || forceUpdate) {
            this.headerDict[uniqkey] = this.getHeader(
                HEADER_API.URL_GET_HEADER,
                {ie: 'utf-8', uniqkey: uniqkey}
            );
        }
        return this.headerDict[uniqkey];
    }

    getHeader(url, pdata) {
        return (new Promise((resolve, reject) => {
            $.ajax({
                type: 'GET',
                url: url,
                data: pdata,
                success: function(data, status) {
                    if (basic.statusOk(status) !== ''
                            || basic.errnoOk(data) !== '') {
                        reject('Get header data failed');
                        return;
                    }
                    resolve(data['data']);
                },
                error: function() {
                    reject('Get header data failed')
                }
            });
        })).catch((reason) => {
            console.log(reason);
        });
    }
};
export let headerCtl = new HeaderCtl();
