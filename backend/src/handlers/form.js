/**
 * @author  reetsee.com
 * @date    20160623
 */
var path = require('path');
var ROOT_PATH = path.resolve(__dirname, '..');

var formDal = require(ROOT_PATH + '/dal/form');
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
        'add_form': [ACCESS_METHOD_POST, addForm, W_PRE_MW_LIST],
        'modify_form': [ACCESS_METHOD_POST, modifyForm, W_PRE_MW_LIST],
        'delete_form': [ACCESS_METHOD_POST, deleteForm, W_PRE_MW_LIST],
        'get_form': [ACCESS_METHOD_GET, getForm, W_PRE_MW_LIST],
        'get_form_list': [ACCESS_METHOD_GET, getFormList, []],
        'get_form_suggest_list': [ACCESS_METHOD_GET, getFormSuggestList, []],
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

function addForm(req, res) {
    name = req.body.name || '';
    post_api = req.body.post_api || '';
    content_type = req.body.content_type || 'application/x-www-form-urlencoded;charset=utf-8';
    components = req.body.components || '';
    op_user = req.body.op_user || '';
    urlmark = req.body.urlmark || '';
    ext = req.body.ext || '';

    if (lz(name) || lz(post_api) || lz(components) || lz(urlmark)) {
        jr(res, {
            errno: -1,
            errmsg: 'invalid params',
            data: {
                name: name,
                post_api: post_api,
                components: components,
                urlmark: urlmark,
            }
        });
        return;
    }

    rq = {
        name: name,
        post_api: post_api,
        content_type: content_type,
        components: components,
        urlmark: urlmark,
        op_user: op_user,
        ext: ext,
    };

    formDal.addForm(rq, function(rsp) {
        jr(res, rsp);
        return;
    });
};

function modifyForm(req, res) {
    id = req.body.id || id;
    name = req.body.name || '';
    post_api = req.body.post_api || '';
    content_type = req.body.content_type || 'application/x-www-form-urlencoded;charset=utf-8';
    components = req.body.components || '';
    op_user = req.body.op_user || '';
    urlmark = req.body.urlmark || '';
    ext = req.body.ext || '';

    if (lz(name) || lz(post_api) || lz(components) || lz(urlmark) || id <= 0) {
        jr(res, {
            errno: -1,
            errmsg: 'invalid params',
            data: {
                id: id,
                name: name,
                urlmark: urlmark,
                post_api: post_api,
                components: components,
            }
        });
        return;
    }

    rq = {
        id: id,
        name: name,
        post_api: post_api,
        content_type: content_type,
        components: components,
        urlmark: urlmark,
        op_user: op_user,
        ext: ext,
    };

    formDal.modifyForm(rq, function(rsp) {
        jr(res, rsp);
        return;
    });
};

function deleteForm(req, res) {
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

    formDal.deleteForm(rq, function(rsp) {
        jr(res, rsp);
        return;
    });
};

function getForm(req, res) {
    var id = req.query.id || undefined;
    var urlmark = req.query.urlmark || undefined;
    
    if (!id && !urlmark) {
        jr(res, {
            errno: -1,
            errmsg: 'invalid params',
            data: {
                id: id,
                urlmark: urlmark,
            }
        });
        return;
    }

    var rq = {
        id: id,
        urlmark: urlmark,
    };

    formDal.getForm(rq, function(rsp) {
        jr(res, rsp);
        return;
    });
}

function getFormList(req, res) {
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

    formDal.getFormList(rq, function(rsp) {
        jr(res, rsp);
        return;
    });
}

function getFormSuggestList(req, res) {
    user = req.query.user;
    rq = {
        pn: 1,
        rn: 200,
        op_user: user,
    };

    formDal.getFormList(rq, function(rsp) {
        if (rsp['errno'] != 0) {
            jr(res, rsp);
            return;
        }

        suggestList = [];
        rsp['data']['form_list'].forEach(function(form) {
            suggestList.push({
                display: form['name'],
                value: form['urlmark'],
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
