/**
 * @author  reetsee.com
 * @date    20160621
 */
var path = require('path');
var ROOT_PATH = path.resolve(__dirname);

exports.entrance = function(req, res, next) {
    console.log(req.params.comp + " " + req.params.iface);
    var compPath = path.resolve(ROOT_PATH, 'handlers', req.params.comp)
    var comp = require(compPath);
    comp.entrance(req, res, next);
};

exports.bootstrap = function(req, res, next) {
    res.sendFile(ROOT_PATH + '/static/bootstrap/dbwrite.html');
};
