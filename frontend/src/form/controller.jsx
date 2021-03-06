/**
 * @author  reetsee.com
 * @date    20160619
 */
import $ from 'jquery';
import * as basic from '../libs/basic.jsx';

let FORM_API = {
    URL_GET_FORM: '/api/form/get_form',    
};

class FormCtl {
    constructor() {
        this.formDict = {};
    }

    /**
     * @author  xuruiqi
     * @desc    通过form id获取表单的详细信息
     */
    getFormById(formId, forceUpdate) {
        let thisCtl = this;
        formId = parseInt(formId);

        if (thisCtl.formDict[formId] == undefined || forceUpdate) {
            thisCtl.formDict[formId] = new Promise((resolve, reject) => {
                $.ajax({
                    type: 'GET',
                    url: FORM_API.URL_GET_FORM,
                    data: {
                        ie: 'utf-8',
                        id: formId,
                    },
                    success: function(data, status) {
                        if (basic.statusOk(status) !== ''
                                || basic.errnoOk(data) !== '') {
                            reject('Get form data failed');
                            return;
                        }

                        let urlmark = data['data']['urlmark'];
                        thisCtl.formDict[urlmark] = new Promise((rs, rj) => {
                            rs(data['data']);
                        });

                        resolve(data['data']);
                    }
                });
            });
            thisCtl.formDict[formId].catch((reason) => {
                console.log(reason);
                //setTimeout(
                //    () => { thisCtl.getFormById(formId, true); },
                //    5000
                //);
            });
        }

        return thisCtl.formDict[formId];
    }

    getForm(urlmark, forceUpdate) {
        let thisCtl = this;

        if (thisCtl.formDict[urlmark] == undefined || forceUpdate) {
            thisCtl.formDict[urlmark] = new Promise((resolve, reject) => {
                $.ajax({
                    type: 'GET',
                    url: FORM_API.URL_GET_FORM,
                    data: {
                        ie: 'utf-8',
                        urlmark: urlmark,
                    },
                    success: function(data, status) {
                        if (basic.statusOk(status) !== ''
                                || basic.errnoOk(data) !== '') {
                            reject('Get form data failed');
                            thisCtl.formDict[urlmark] = undefined;

                            return;
                        }

                        resolve(data['data']);
                    }
                });
            });
            thisCtl.formDict[urlmark].catch((reason) => {
                console.log(reason);
                //setTimeout(
                //    () => { thisCtl.getForm(urlmark, true); },
                //    5000
                //);
            });
        }

        return thisCtl.formDict[urlmark];
    }

    /**
     * @author  xuruiqi
     * @param
     *  query: {
     *      api: 'xxx',
     *      dataPath: JSON.stringify(['a', 'b']),
     *      id: 1,
     *      type: 'view' | 'edit' | 'duplicate'
     *  }
     * @desc    获取要填充到表单中的数据
     */
    getRemoteData(query) {
        let thisCtl = this;
        return new Promise((resolve, reject) => {
            let contentType = basic.safeGet(
                query,
                ['content_type'],
                'application/x-www-form-urlencoded;charset=utf-8'
            );
            let shouldPostJson = contentType.indexOf('json') >= 0 ? true : false;

            let postData = {
                id: query.id,
                type: query.type,
            };
            if (shouldPostJson) {
                postData = JSON.stringify(postData);
            }

            $.ajax({
                type: 'GET',
                url: basic.hostPortPrefix + query.api,
                data: postData,
                contentType: contentType,
                success: function(data, status) {
                    if (basic.statusOk(status) !== '') {
                        reject('Get remote data failed');
                        return;
                    }

                    let dataPath = JSON.parse(
                        basic.safeGet(
                            query, ['dataPath'], 
                            JSON.stringify([])
                        )
                    );

                    let remoteData = {
                        type: query.type,
                        data: basic.safeGet(data, dataPath)
                    };
                    resolve(remoteData);
                }
            })
        });
    }
}
export let formCtl = new FormCtl();
