/**
 * @author  reetsee.com
 * @date    20160623
 */
var path = require('path');
var ROOT_PATH = path.resolve(__dirname, '..');

var itemDal = require(ROOT_PATH + '/dal/item');
var basic = require(ROOT_PATH + '/libs/basic');
var hdlrmw = require(ROOT_PATH + '/libs/hdlrmw');
var lz = basic.lz;
var jr = basic.jsonResp;

var ACCESS_METHOD_GET  = ['GET'];
var ACCESS_METHOD_POST = ['POST'];
var ACCESS_METHOD_GET_POST = ['GET', 'POST'];
var ACCESS_METHOD_ALL = ['GET', 'POST', 'OPTIONS'];

var W_PRE_MW_LIST = [hdlrmw.validateSession];

exports.entrance = function(req, res, next) {
    var ifaceDict = {
        'add_item': [ACCESS_METHOD_POST, addItem, W_PRE_MW_LIST],
        'modify_item': [ACCESS_METHOD_POST, modifyItem, W_PRE_MW_LIST],
        'delete_item': [ACCESS_METHOD_POST, deleteItem, W_PRE_MW_LIST],
        'get_item': [ACCESS_METHOD_GET, getItem],
        'get_item_list': [ACCESS_METHOD_GET, getItemList],
        'get_item_suggest_list': [ACCESS_METHOD_GET, getItemSuggestList],
    };
    
    var iface = req.params.iface;
    if (!ifaceDict[iface]) {
        res.status(404).send('iface ' + iface + ' not found');
        return;
    }
    if (ifaceDict[iface][0].indexOf(req.method) < 0) {
        res.status(403).send(
            'iface ' + iface 
            + ' is not allowed to access with method ' 
            + req.method
        );
        return;
    }

    if (ifaceDict[iface].length > 2) {
        var preMwList = ifaceDict[iface][2];
        for (var i = 0; i < preMwList.length; ++i) {
            var errmsg = preMwList[i](req, res, next);
            if (errmsg) {
                jr(res, {
                    "errno": -999,
                    "errmsg": errmsg,
                });
                return;
            }
        }
    }

    ifaceDict[iface][1](req, res);
};

function addItem(req, res) {
    name = req.body.name || '';
    uniqkey = req.body.uniqkey || '';
    item_type = req.body.item_type || '';
    display = req.body.display || '';
    icon = req.body.icon || '';
    detail = req.body.detail || '';
    op_user = req.body.op_user || '';
    ext = req.body.ext || '';

    if (lz(name) || lz(item_type) || lz(detail) || lz(display) || lz(uniqkey)) {
        jr(res, {
            errno: -1,
            errmsg: 'invalid params',
            data: {
                name: name,
                item_type: item_type,
                detail: detail,
                display: display,
                uniqkey: uniqkey,
            }
        });
        return;
    }

    rq = {
        name: name,
        uniqkey: uniqkey,
        item_type: item_type,
        display: display,
        icon: icon,
        detail: detail,
        op_user: op_user,
        ext: ext,
    };

    itemDal.addItem(rq, function(rsp) {
        jr(res, rsp);
        return;
    });
};

function modifyItem(req, res) {
    id = req.body.id || 0;
    name = req.body.name || '';
    uniqkey = req.body.uniqkey || '';
    item_type = req.body.item_type || '';
    display = req.body.display || '';
    icon = req.body.icon || '';
    detail = req.body.detail || '';
    op_user = req.body.op_user || '';
    ext = req.body.ext || '';

    if (lz(name) || lz(item_type) || lz(detail) || lz(display) || lz(uniqkey) || id <= 0) {
        jr(res, {
            errno: -1,
            errmsg: 'invalid params',
            data: {
                id: id,
                name: name,
                uniqkey: uniqkey,
                item_type: item_type,
                detail: detail,
                display: display,
            }
        });
        return;
    }

    rq = {
        id: id,
        name: name,
        uniqkey: uniqkey,
        item_type: item_type,
        display: display,
        icon: icon,
        detail: detail,
        op_user: op_user,
        ext: ext,
    };

    itemDal.modifyItem(rq, function(rsp) {
        jr(res, rsp);
        return;
    });
};

function deleteItem(req, res) {
    id = req.body.id || 0;

    if (id <= 0) {
        jr(res, {
            errno: -1,
            errmsg: 'invalid params',
            data: {
                id: id,
            }
        });
        return;
    }

    rq = {
        id: id
    };

    itemDal.deleteItem(rq, function(rsp) {
        jr(res, rsp);
        return;
    });
};

function getItem(req, res) {
    id = req.query.id || 0;
    uniqkey = req.query.uniqkey || '';
    
    if (lz(uniqkey) && id <= 0) {
        jr(res, {
            errno: -1,
            errmsg: 'invalid params',
            data: {
                id: id,
                uniqkey: uniqkey,
            }
        });
        return;
    }

    rq = {
        id: id,
        uniqkey: uniqkey,
    };

    itemDal.getItem(rq, function(rsp) {
        jr(res, rsp);
        return;
    });
};

function getItemList(req, res) {
    pn = req.query.pn || 0;
    rn = req.query.rn || 0;
    user = req.query.user;

    if (pn <= 0) {
        pn = 1;
    }
    if (rn <= 0) {
        rn = 10;
    }
    if (rn > 500) {
        rn = 500;
    }

    rq = {
        pn: pn,
        rn: rn,
        op_user: user
    };

    itemDal.getItemList(rq, function(rsp) {
        jr(res, rsp);
        return;
    });
};

function getItemSuggestList(req, res) {
    user = req.query.user;
    rq = {
        pn: 1,
        rn: 200,
        op_user: user,
    };

    itemDal.getItemList(rq, function(rsp) {
        if (rsp['errno'] != 0) {
            jr(res, rsp);
            return;
        }

        suggestList = [];
        rsp['data']['item_list'].forEach(function(item) {
            suggestList.push({
                display: item['name'],
                value: item['uniqkey'],
            });
        });

        jr(res, {
            errno: 0,
            errmsg: 'success',
            data: {
                suggest_list: suggestList,
            },
        });
        return;
    });
};
