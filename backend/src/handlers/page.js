/**
 * @author  reetsee.com
 * @date    20160621
 */
var path = require('path');
var ROOT_PATH = path.resolve(__dirname, '..');

var pageDal = require(ROOT_PATH + '/dal/page');
var basic = require(ROOT_PATH + '/libs/basic');
var lz = basic.lz;
var jr = basic.jsonResp;

var ACCESS_METHOD_GET  = ['GET', 'POST'];
var ACCESS_METHOD_POST = ['POST', 'GET'];
var ACCESS_METHOD_GET_POST = ['GET', 'POST'];
var ACCESS_METHOD_ALL = ['GET', 'POST', 'OPTIONS'];

exports.entrance = function(req, res, next) {
    var ifaceDict = {
        'add_page': [ACCESS_METHOD_POST, addPage],
        'modify_page': [ACCESS_METHOD_POST, modifyPage],
        'delete_page': [ACCESS_METHOD_POST, deletePage],
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

    ifaceDict[iface][1](req, res);
};

function addPage(req, res) {
    title = req.query.title || '';
    name = req.query.name || '';
    urlmark = req.query.urlmark || '';
    components = req.query.components || '{}';
    content = req.query.content || '{}';
    type = req.query.type || 0;
    op_user = req.query.op_user || 'guest';
    ext = req.query.ext || '';

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
        "type": type,
        "op_user": op_user,
        "ext": ext,
    };

    // 插入数据库
    pageDal.addPage(rq, function(rsp) {
        jr(res, rsp);
    });
};

function modifyPage(req, res) {
    id = req.query.id || 0;
    title = req.query.title || '';
    name = req.query.name || '';
    urlmark = req.query.urlmark || '';
    components = req.query.components || '{}';
    content = req.query.content || '{}';
    type = req.query.type || 0;
    op_user = req.query.op_user || 'guest';
    ext = req.query.ext || '';

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
        "type": type,
        "op_user": op_user,
        "ext": ext,
    }

    // 修改数据库
    pageDal.modifyPage(rq, function(rsp) {
        jr(res, rsp);
    });
};

function deletePage(req, res) {
    id = req.query.id || 0;

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
    });
};

function getPage(req, res) {
    id = req.query.id || 0;
    
    if (id <= 0) {
        jr(res, {
            "errno": 0,
            "errmsg": "success",
            "data": {
                "id": id,
            }
        });
        return;
    }

    var rq = {
        "id": id,
    };

    pageDal.getPage(rq, function(rsp) {
        jr(res, rsp);
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
    });
};

function getPageSuggestList(req, res) {
    user = req.query.user || '';
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
                display: page['page_name'],
                value: page['id'],
            });
        });

        jr(res, {
            errno: 0,
            errmsg: 'success',
            data: {
                suggest_list: suggestList,
            },
        });
    });
};
