/**
 * @author  reetsee.com
 * @date    20160621
 */
var path = require('path');
var ROOT_PATH = path.resolve(__dirname, '..');

var lefterDal = require(ROOT_PATH + '/dal/lefter');
var basic = require(ROOT_PATH + '/libs/basic');
var lz = basic.lz;
var jr = basic.jsonResp;

var ACCESS_METHOD_GET  = ['GET'];
var ACCESS_METHOD_POST = ['POST'];
var ACCESS_METHOD_GET_POST = ['GET', 'POST'];
var ACCESS_METHOD_ALL = ['GET', 'POST', 'OPTIONS'];

exports.entrance = function(req, res, next) {
    var ifaceDict = {
        'add_lefter': [ACCESS_METHOD_POST, addLefter],
        'modify_lefter': [ACCESS_METHOD_POST, modifyLefter],
        'delete_lefter': [ACCESS_METHOD_POST, deleteLefter],
        'get_lefter': [ACCESS_METHOD_GET, getLefter],
        'get_lefter_list': [ACCESS_METHOD_GET, getLefterList],
        'get_lefter_suggest_list': [ACCESS_METHOD_GET, getLefterSuggestList],
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

    ifaceDict[iface][1](req, res);
};

function addLefter(req, res) {
    name = req.body.name || '';
    uniqkey = req.body.uniqkey || '';
    components = req.body.components || '{}';
    op_user = req.body.op_user || 'guest';
    ext = req.body.ext || '';

    if (lz(name) || lz(components) || lz(uniqkey)) {
        jr(res, {
            errno: -1,
            errmsg: 'invalid params',
            data: {
                name: name,
                components: components,
                uniqkey: uniqkey,
            }
        });
        return;
    }

    rq = {
        name: name,
        uniqkey: uniqkey,
        components: components,
        op_user: op_user,
        ext: ext
    };

    lefterDal.addLefter(rq, function(rsp) {
        jr(res, rsp);
        return;
    });
};

function modifyLefter(req, res) {
    id = req.body.id || 0;
    name = req.body.name || '';
    uniqkey = req.body.uniqkey || '';
    components = req.body.components || '{}';
    op_user = req.body.op_user || 'guest';
    ext = req.body.ext || '';

    if (lz(name) || lz(components) || lz(uniqkey) || id <= 0) {
        jr(res, {
            errno: -1,
            errmsg: 'invalid params',
            data: {
                id: id,
                name: name,
                uniqkey: uniqkey,
                components: components,
            }
        });
        return;
    }

    rq = {
        id: id,
        name: name,
        uniqkey: uniqkey,
        components: components,
        op_user: op_user,
        ext: ext
    };

    lefterDal.modifyLefter(rq, function(rsp) {
        jr(res, rsp);
        return;
    });
}

function deleteLefter(req, res) {
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

    lefterDal.deleteLefter(rq, function(rsp) {
        jr(res, rsp);
        return;
    });
}

function getLefter(req, res) {
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

    lefterDal.getLefter(rq, function(rsp) {
        jr(res, rsp);
        return;
    });
}

function getLefterList(req, res) {
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

    lefterDal.getLefterList(rq, function(rsp) {
        jr(res, rsp);
        return;
    });
}

function getLefterSuggestList(req, res) {
    user = req.query.user;
    rq = {
        pn: 1,
        rn: 200,
        op_user: user,
    };

    lefterDal.getLefterList(rq, function(rsp) {
        if (rsp['errno'] != 0) {
            jr(res, rsp);
            return;
        }

        suggestList = [];
        rsp['data']['lefter_list'].forEach(function(lefter) {
            suggestList.push({
                display: lefter['name'],
                value: lefter['uniqkey'],
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
}
