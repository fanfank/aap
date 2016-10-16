/**
 * @author  reetsee.com
 * @date    20160621
 */
var path = require('path');
var ROOT_PATH = path.resolve(__dirname, '..');

var pageDal = require(ROOT_PATH + '/dal/page');
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
        'add_page': [ACCESS_METHOD_POST, addPage, W_PRE_MW_LIST],
        'modify_page': [ACCESS_METHOD_POST, modifyPage, W_PRE_MW_LIST],
        'delete_page': [ACCESS_METHOD_POST, deletePage, W_PRE_MW_LIST],
        'get_page': [ACCESS_METHOD_GET, getPage],
        'get_page_list': [ACCESS_METHOD_GET, getPageList],
        'get_page_suggest_list': [ACCESS_METHOD_GET, getPageSuggestList],
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

function addPage(req, res) {
    title = req.body.title || '';
    name = req.body.name || '';
    urlmark = req.body.urlmark || '';
    components = req.body.components || '{}';
    content = req.body.content || '{}';
    page_type = req.body.page_type || 1;
    op_user = req.body.op_user || 'guest';
    ext = req.body.ext || '';

    if (lz(name) || lz(components) || lz(content)) {
        jr(res, {
            'errno': -1,
            'errmsg': 'invalid params',
            'data': {
                'name': name,
                'components': components,
                'content': content
            }
        });
        return;
    }

    rq = {
        "title": title,
        "name": name,
        "components": components,
        "content": content,
        "urlmark": urlmark,
        "page_type": page_type,
        "op_user": op_user,
        "ext": ext,
    };

    // 插入数据库
    pageDal.addPage(rq, function(rsp) {
        jr(res, rsp);
        return;
    });
};

function modifyPage(req, res) {
    id = req.body.id || 0;
    title = req.body.title || '';
    name = req.body.name || '';
    urlmark = req.body.urlmark || '';
    components = req.body.components || '{}';
    content = req.body.content || '{}';
    page_type = req.body.page_type || 0;
    op_user = req.body.op_user || 'guest';
    ext = req.body.ext || '';

    if (lz(name) || lz(components) || lz(content) || id <= 0) {
        jr(res, {
            'errno': -1,
            'errmsg': 'invalid params',
            'data': {
                'id': id,
                'name': name,
                'components': components,
                'content': content
            }
        });
        return;
    }

    rq = {
        "id": id,
        "title": title,
        "name": name,
        "components": components,
        "content": content,
        "urlmark": urlmark,
        "page_type": page_type,
        "op_user": op_user,
        "ext": ext,
    }

    // 修改数据库
    pageDal.modifyPage(rq, function(rsp) {
        jr(res, rsp);
        return;
    });
};

function deletePage(req, res) {
    id = req.body.id || 0;

    if (id <= 0) {
        jr({
            errno: -1,
            errmsg: 'invalid params',
            data: {
                id: id,
            }
        });
        return;
    }

    rq = {
        "id": id,
    };

    // 从数据库删除
    pageDal.deletePage(rq, function(rsp) {
        jr(res, rsp);
        return;
    });
};

function getPage(req, res) {
    id = req.query.id || undefined;
    urlmark = req.query.urlmark || undefined;

    
    if (!id && !urlmark) {
        jr(res, {
            "errno": 0,
            "errmsg": "success",
            "data": {
                "id": id,
                "urlmark": urlmark,
            }
        });
        return;
    }

    var rq = {
        id: id,
        urlmark: urlmark,
    };

    pageDal.getPage(rq, function(rsp) {
        jr(res, rsp);
        return;
    });
};

function getPageList(req, res) {
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
    
    pageDal.getPageList(rq, function(rsp) {
        jr(res, rsp);
        return;
    });
};

function getPageSuggestList(req, res) {
    user = req.query.user;
    rq = {
        pn: 1,
        rn: 200,
        op_user: user,
    };

    pageDal.getPageList(rq, function(rsp) {
        if (rsp['errno'] != 0) {
            jr(res, rsp);
            return;
        }

        suggestList = [];
        rsp['data']['page_list'].forEach(function(page) {
            suggestList.push({
                display: page['name'],
                value: page['urlmark'],
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
