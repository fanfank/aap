/**
 * @author  reetsee.com
 * @date    20160619
 */
import $ from 'jquery';
import * as basic from '../../libs/basic.jsx';

let FORM_INPUT_API = {
    URL_GET_FORM_INPUT: '/api/form_input/get_form_input',
    //URL_MGET_FORM_INPUT: '/form_input/mget_form_input',
    URL_GET_FORM_INPUT_LIST: '/api/form_input/get_form_input_list',
};

class FormInputCtl {
    constructor() {
        this.formInputDict = {};
        this.selectOptionCache = {};
        this.getFormInputList().then(
            (formInputList) => {
                console.log("Get " + formInputList.length + " form inputs");
            },
            (error) => {
                console.log(error);
            }
        );
    }

    /**
     * @author  xuruiqi
     * @desc    通过form input id获取form input的详细信息
     */
    getFormInputById(formInputId, forceUpdate) {
        let thisCtl = this;
        formInputId = parseInt(formInputId);

        if (thisCtl.formInputDict[formInputId] == undefined || forceUpdate) {
            thisCtl.formInputDict[formInputId] = new Promise((resolve, reject) => {

                $.ajax({
                    type: 'GET',
                    url: FORM_INPUT_API.URL_GET_FORM_INPUT,
                    data: {
                        ie: "utf-8",
                        id: formItemId,
                    },
                    success: function(data, status) {
                        if (basic.statusOk(status) !== ""
                                || basic.errnoOk(data) !== "") {
                            reject("Get form item data failed");
                            return;
                        }
                        resolve(data['data']);
                    }
                });
            });
            thisCtl.formInputDict[formInputId].catch((reason) => {
                console.log(reason);
                setTimeout(
                    () => { thisCtl.getFormInputById(formInputId, true); },
                    5000
                );
            });
        }

        return thisCtl.formInputDict[formInputId];
    }

    getFormSubInputById(formSubInputId) {
        return this.getFormInputById(formSubInputId);
    }

    /**
     * @author  xuruiqi
     * @desc    获取form input列表
     */
    getFormInputList(pn, rn) {
        pn = pn || 1;
        rn = rn || 100;
        let thisCtl = this;

        return new Promise(function(resolve, reject) {
            $.ajax({
                type: 'GET',
                url: FORM_INPUT_API.URL_GET_FORM_INPUT_LIST,
                data: {
                    ie: "utf-8",
                    pn: pn,
                    rn: rn,
                },
                success: function(data, status) {
                    if (basic.statusOk(status) !== ''
                            || basic.errnoOk(data) !== '') {
                        reject("Get form input list failed");
                        return;
                    }

                    // 将列表中的内容进行替换
                    data['data']['form_input_list'].forEach((formInput) => {
                        let formInputId = parseInt(formInput['id']);
                        thisCtl.formInputDict[formInputId] = new Promise((rs, rj) => {
                            rs(formInput);
                        });
                    });

                    resolve(data['data']['form_input_list']);
                }
            })
        });
    }

    getFormSubInputList(pn, rn) {
        return getFormInputList(pn, rn);
    }

    // TODO xuruiqi: implement this function
    getRelationList(thisRel, dataPropsName) { }

    getSelectOptionList(thisSel, dataPropsName) {
        const thisCtl = this;

        const data = thisSel.props[dataPropsName];
        const detailContent = basic.decode(data['detail']);
        if (detailContent['type'] != 'api') {
            return;
        }

        let mts = Date.now();
        let cached = basic.safeGet(
            this.selectOptionCache, 
            [detailContent['api']]
        );
        if (cached && (mts - cached['lastTime'] < 10000)) {
            thisSel.setState({
                optionList: cached['data'],
            });
            return;
        }

        $.ajax({
            type: 'GET',
            url: basic.hostPortPrefix + detailContent['api'],
            data: {
                ie: 'utf-8',
            },
            success: function(remoteData, status) {
                if (basic.statusOk(status) !== '') {
                    console.log('Get suggestion data failed ' +
                            'with status ' + status);
                    return;
                }

                const optionList = [];
                basic.safeGet(
                    remoteData,
                    basic.safeGet(detailContent, ['data_path'], [])
                ).forEach((option) => {
                    optionList.push({
                        display: basic.safeGet(
                            option,
                            basic.safeGet(detailContent, ['display_path'], 'display')
                        ),
                        value: basic.safeGet(
                            option,
                            basic.safeGet(detailContent, ['value_path'], 'value')
                        ),
                    });
                });

                thisSel.setState({
                    optionList: optionList,
                });

                thisCtl.selectOptionCache[detailContent['api']] = {
                    lastTime: Date.now(),
                    data: optionList,
                };
            }
        });
    }
}
export let formInputCtl = new FormInputCtl();
export let formSubInputCtl = new FormInputCtl();
