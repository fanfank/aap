/**
 * @author  reetsee.com
 * @date    20160621
 */
var path = require('path');
var ROOT_PATH = path.resolve(__dirname, '..');

var headerDal = require(ROOT_PATH + '/dal/page');
var basic = require(ROOT_PATH + '/libs/basic');
var lz = basic.lz;
var jr = basic.jsonResp;

var ACCESS_METHOD_GET  = ['GET', 'POST'];
var ACCESS_METHOD_POST = ['POST', 'GET'];
var ACCESS_METHOD_GET_POST = ['GET', 'POST'];
var ACCESS_METHOD_ALL = ['GET', 'POST', 'OPTIONS'];

exports.entrance = function(req, res, next) {
    var ifaceDict = {
        'add_header': [ACCESS_METHOD_POST, addHeader],
        'modify_header': [ACCESS_METHOD_POST, modifyHeader],
        'delete_header': [ACCESS_METHOD_POST, deleteHeader],
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

    ifaceDict[iface][1](req, res);
};

function addHeader(req, res) {
    name = req.query.name || '';
    components = req.query.components || '{}';
    op_user = req.query.op_user || 'guest';
    ext = req.query.ext || '';

    if (lz(name) || lz(components)) {
        jr(res, {
            errno: -1,
            errmsg: 'invalid params',
            data: {
                name: name,
                components: components,
            }
        });
        return;
    }
    //TODO





};
