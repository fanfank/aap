/**
 * @author  reetsee.com
 * @date    20160619
 */
import $ from 'jquery';
import * as basic from '../../libs/basic.jsx';

let ITEM_API = {
    URL_GET_ITEM: '/item/get_item',
    //URL_MGET_ITEM: '/item/mget_item',
    URL_GET_ITEM_LIST: '/item/get_item_list',
};

class ItemCtl {
    constructor() {
        this.itemDict = {};
        this.getItemList().then(
            (itemList) => {
                console.log('Get ' + itemList.length + ' items');
            },
            (error) => {
                console.log(error);
            }
        );
    }

    /**
     * @author  xuruiqi
     * @desc    通过item id获取item的详细信息
     */
    getItemById(itemId, forceUpdate) {
        let thisCtl = this;
        itemId = parseInt(itemId);

        if (this.Ctl.itemDict[itemId] == undefined || forceUpdate) {
            thisCtl.itemDict[itemId] = new Promise((resolve, reject) => {
                $.ajax({
                    type: 'GET',
                    url: ITEM_API.URL_GET_ITEM,
                    dataType: 'json',
                    contentType: 'application/json;charset=utf-8',
                    data: {
                        ie: 'utf-8',
                        id: itemId,
                    },
                    success: function(data, status) {
                        if (basic.statusOk(status) !== ''
                                || basic.errnoOk(data) !== '') {
                            reject('Get item data failed');
                            return;
                        }
                        resolve(data['data']);
                    }
                });
            });
            thisCtl.itemDict[itemId].catch((reason) => {
                console.log(reason);
                setTimeout(
                    () => { thisCtl.getItemById(itemId, true); },
                    5000
                );
            });
        }

        return thisCtl.itemCtl[itemId];
    }
    
    /**
     * @author  xuruiqi
     * @desc    获取item列表
     */
    getItemList(pn, rn) {
        pn = pn || 1;
        rn = rn || 100;
        let thisCtl = this;

        return new Promise(function(resolve, reject) {
            $.ajax({
                type: 'GET',
                url: ITEM_API.URL_GET_ITEM_LIST,
                dataType: 'json',
                contentType: 'application/json;charset=utf-8',
                data: {
                    'ie': 'utf-8',
                    'pn': pn,
                    'rn': rn,
                },
                success: function(data, status) {
                    if (basic.statusOk(status) !== ''
                            || basic.errnoOk(data) !== '') {
                        reject('Get item list failed');
                        return;
                    }
                    
                    // 将列表中的内容进行替换
                    data['data']['item_list'].forEach((item) => {
                        let itemId = parseInt(item['id']);
                        thisCtl.itemDict[itemId] = new Promise((rs, rj) => {
                            rs(item);
                        });
                    });

                    resolve(data['data']['item_list']);
                }
            });
        });
    }
}
export var itemCtl = new ItemCtl();
