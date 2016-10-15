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
        formInputId = parseInt(formInputId);
        if (this.formInputDict[formInputId] == undefined || forceUpdate) {
            this.formInputDict[formInputId] = this.getFormInput(
                FORM_INPUT_API.URL_GET_FORM_INPUT,
                {ie: 'utf-8', id: formInputId}
            );
        }
        return this.formInputDict[formInputId];
    }
    getFormSubInputById(formSubInputId, forceUpdate) {
        return this.getFormInputById(formSubInputId, forceUpdate);
    }

    /**
     * @author  xuruiqi
     * @desc    通过form input unique key获取form input的详细信息
     */
    getFormInputByUniqkey(formInputUniqkey, forceUpdate) {
        if (this.formInputDict[formInputUniqkey] == undefined || forceUpdate) {
            this.formInputDict[formInputUniqkey] = this.getFormInput(
                FORM_INPUT_API.URL_GET_FORM_INPUT,
                {ie: 'utf-8', id: formInputUniqkey}
            );
        }
        return this.formInputDict[formInputUniqkey];
    }
    getFormSubInputByUniqkey(formSubInputUniqkey, forceUpdate) {
        return this.getFormInputByUniqkey(formSubInputUniqkey, forceUpdate);
    }

    getFormInput(url, pdata) {
        return (new Promise((resolve, reject) => {
            $.ajax({
                type: 'GET',
                url: url,
                data: pdata,
                success: function(data, status) {
                    if (basic.statusOk(status, false) !== ""
                            || basic.errnoOk(data, false) !== "") {
                        reject("Get form item data failed");
                        return;
                    }
                    resolve(data['data']);
                }
            });
        })).catch((reason) => {
            console.log(reason);
        });
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
                    if (basic.statusOk(status, false) !== ''
                            || basic.errnoOk(data, false) !== '') {
                        reject("Get form input list failed");
                        return;
                    }

                    // 将列表中的内容进行替换
                    data['data']['form_input_list'].forEach((formInput) => {
                        let formInputUniqkey = formInput['uniqkey'];
                        thisCtl.formInputDict[formInputUniqkey] = new Promise((rs, rj) => {
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
        let cached = basic.safeGet(this.selectOptionCache, [detailContent['api']]);
        if (cached && (mts - cached['lastTime'] < 10000)) {
            console.log('cache hit: ' + detailContent['api']);
            thisSel.setState({
                optionList: cached['data'],
            });
            return;
        }

        $.ajax({
            type: 'GET',
            url: detailContent['api'],
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
