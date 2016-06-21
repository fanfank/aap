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
    components = req.query.components || '{}';
    content = req.query.content || '{}';
    type = req.query.type || 0;
    op_user = req.query.op_user || 'guest';
    ext = req.query.ext || '';

    if (lz(page_name) || lz(components) || lz(content)) {
        jr(res, {
            'errno': -1,
            'errmsg': 'invalid params',
            'data': {
                'name': page_name,
                'components': components,
                'content': content
            }
        });
        return;
    }

    addPageReq = {
        "title": title,
        "name": page_name,
        "components": components,
        "content": content,
        "type": type,
        "op_user": op_user,
        "ext": ext,
    };

    // 插入数据库
    addPageRes = pageDal.addPage(addPageReq, function(addPageRes) => {

        jr(res, addPageRes);
    });
}

function modifyPage(req, res) {

}

function deletePage(req, res) {

}

function getPage(req, res) {
    id = req.query.id || 0;
    
    if id <= 0:
        return jr(res, {
            "errno": 0,
            "errmsg": "success",
            "data": {
                "id": id,
            }
        });

    getPageReq = {
        "id": id,
    };

    getPageRes = pageDal.getPage(getPageReq);

    jr(res, getPageRes);
}

function getPageList(req, res) {

}

function getPageSuggestList(req, res) {

}
