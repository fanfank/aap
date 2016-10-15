/**
 * @author  reetsee.com
 * @date    20160619
 */

import $ from 'jquery';
import * as basic from '../../libs/basic.jsx';

let LEFTER_API = {
    URL_GET_LEFTER: '/api/lefter/get_lefter',
};

class LefterCtl {
    constructor() {
        this.lefterDict = {};
    }

    /**
     * @author  xuruiqi
     * @desc    通过lefter id 获取lefter的详细信息
     */
    getLefterById(lefterId, forceUpdate) {
        lefterId = parseInt(lefterId);
        if (this.lefterDict[lefterId] == undefined || forceUpdate) {
            this.lefterDict[lefterId] = this.getLefter(
                LEFTER_API.URL_GET_LEFTER,
                {ie: 'utf-8', id: lefterId}
            );
        }
        return this.lefterDict[lefterId];
    }

    /**
     * @author  xuruiqi
     * @desc    通过lefter unique key获取lefter的详细信息
     */
    getLefterByUniqkey(uniqkey, forceUpdate) {
        if (this.lefterDict[uniqkey] == undefined || forceUpdate) {
            this.lefterDict[uniqkey] = this.getLefter(
                LEFTER_API.URL_GET_LEFTER,
                {ie: 'utf-8', uniqkey: uniqkey}
            );
        }
        return this.lefterDict[uniqkey];
    }

    getLefter(url, pdata) {
        return (new Promise((resolve, reject) => {
            $.ajax({
                type: 'GET',
                url: url,
                data: pdata,
                success: function(data, status) {
                    if (basic.statusOk(status) !== ''
                            || basic.errnoOk(data) !== '') {
                        reject('Get lefter data failed');
                        return;
                    }
                    resolve(data['data']);
                },
                error: function() {
                    reject('Get lefter data failed');
                }
            });
        })).catch((reason) => {
            console.log(reason);
        });
    }
};
export let lefterCtl = new LefterCtl();
