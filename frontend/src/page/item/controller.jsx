/**
 * @author  reetsee.com
 * @date    20160619
 */
import $ from 'jquery';
import * as basic from '../../libs/basic.jsx';

let ITEM_API = {
    URL_GET_ITEM: '/api/item/get_item',
    //URL_MGET_ITEM: '/item/mget_item',
    URL_GET_ITEM_LIST: '/api/item/get_item_list',
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
        itemId = parseInt(itemId);
        if (this.itemDict[itemId] == undefined || forceUpdate) {
            this.itemDict[itemId] = this.getItem(
                ITEM_API.URL_GET_ITEM,
                {ie: 'utf-8', id: itemId}
            );
        }
        return this.itemDict[itemId];
    }

    /**
     * @author  xuruiqi
     * @desc    通过item uniqkey获取item的详细信息
     */
    getItemByUniqkey(uniqkey, forceUpdate) {
        if (this.itemDict[uniqkey] == undefined || forceUpdate) {
            this.itemDict[uniqkey] = this.getItem(
                ITEM_API.URL_GET_ITEM,
                {ie: 'utf-8', uniqkey: uniqkey}
            );
        }
        return this.itemDict[uniqkey];
    }

    getItem(url, pdata) {
        return (new Promise((resolve, reject) => {
            $.ajax({
                type: 'GET',
                url: url,
                data: pdata,
                success: function(data, status) {
                    if (basic.statusOk(status) !== ''
                            || basic.errnoOk(data) !== '') {
                        reject('Get item data failed');
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
                data: {
                    ie: 'utf-8',
                    pn: pn,
                    rn: rn,
                },
                success: function(data, status) {
                    if (basic.statusOk(status) !== ''
                            || basic.errnoOk(data) !== '') {
                        reject('Get item list failed');
                        return;
                    }
                    
                    // 将列表中的内容进行替换
                    data['data']['item_list'].forEach((item) => {
                        let uniqkey = item['uniqkey'];
                        thisCtl.itemDict[uniqkey] = new Promise((rs, rj) => {
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
