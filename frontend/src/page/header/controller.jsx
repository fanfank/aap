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
        let thisCtl = this;
        headerId = parseInt(headerId);

        if (thisCtl.headerDict[headerId] == undefined || forceUpdate) {
            thisCtl.headerDict[headerId] = new Promise((resolve, reject) => {
                $.ajax({
                    type: 'GET',
                    url: HEADER_API.URL_GET_HEADER,
                    data: {
                        ie: 'utf-8',
                        id: headerId,
                    },
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
            });
            thisCtl.headerDict[headerId].catch((reason) => {
                console.log(reason);
                //setTimeout(
                //    () => { thisCtl.getHeaderById(headerId, true); },
                //    5000
                //);
            });
        }

        return thisCtl.headerDict[headerId];
    }
};
export let headerCtl = new HeaderCtl();
