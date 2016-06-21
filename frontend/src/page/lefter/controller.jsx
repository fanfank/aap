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
        let thisCtl = this;
        lefterId = parseInt(lefterId);

        if (thisCtl.lefterDict[lefterId] == undefined || forceUpdate) {
            thisCtl.lefterDict[lefterId] = new Promise((resolve, reject) => {
                $.ajax({
                    type: 'GET',
                    url: LEFTER_API.URL_GET_LEFTER,
                    data: {
                        ie: 'utf-8',
                        id: lefterId,
                    },
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
            });
            thisCtl.lefterDict[lefterId].catch((reason) => {
                console.log(reason);
                setTimeout(
                    () => { thisCtl.getLefterById(lefterId, true); },
                    5000
                );
            });
        }

        return thisCtl.lefterCtl[lefterId];
    }
};
export let lefterCtl = new LefterCtl();
