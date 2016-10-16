/**
 * @author  reetsee.com
 * @date    20160621
 */
var path = require('path');
var ROOT_PATH = path.resolve(__dirname, '..');

var headerDal = require(ROOT_PATH + '/dal/header');
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
        'add_header': [ACCESS_METHOD_POST, addHeader, W_PRE_MW_LIST],
        'modify_header': [ACCESS_METHOD_POST, modifyHeader, W_PRE_MW_LIST],
        'delete_header': [ACCESS_METHOD_POST, deleteHeader, W_PRE_MW_LIST],
        'get_header': [ACCESS_METHOD_GET, getHeader],
        'get_header_list': [ACCESS_METHOD_GET, getHeaderList],
        'get_header_suggest_list': [ACCESS_METHOD_GET, getHeaderSuggestList],
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

function addHeader(req, res) {
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

    headerDal.addHeader(rq, function(rsp) {
        jr(res, rsp);
        return;
    });
};

function modifyHeader(req, res) {
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
                components: components,
                uniqkey: uniqkey,
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

    headerDal.modifyHeader(rq, function(rsp) {
        jr(res, rsp);
        return;
    });
}

function deleteHeader(req, res) {
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

    headerDal.deleteHeader(rq, function(rsp) {
        jr(res, rsp);
        return;
    });
}

function getHeader(req, res) {
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

    headerDal.getHeader(rq, function(rsp) {
        jr(res, rsp);
        return;
    });
}

function getHeaderList(req, res) {
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

    headerDal.getHeaderList(rq, function(rsp) {
        jr(res, rsp);
        return;
    });
}

function getHeaderSuggestList(req, res) {
    user = req.query.user;
    rq = {
        pn: 1,
        rn: 200,
        op_user: user,
    };

    headerDal.getHeaderList(rq, function(rsp) {
        if (rsp['errno'] != 0) {
            jr(res, rsp);
            return;
        }

        suggestList = [];
        rsp['data']['header_list'].forEach(function(header) {
            suggestList.push({
                display: header['name'],
                value: header['uniqkey'],
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
