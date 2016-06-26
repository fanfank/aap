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
    if (req.method == 'POST') {
        if (req.path.indexOf('dbwrite') != -1) {
            var hdlr = require(ROOT_PATH + '/initialization/dbwrite').initWriteDb;
            hdlr(req, res);
            
        } else if (req.path.indexOf('dbread') != -1) {
            var hdlr = require(ROOT_PATH + '/initialization/dbread').initReadDb;
            hdlr(req, res);

        } else {
            res.status(404).send('Unknown interface');
        }
        return;

    } else {
        var urlpath = req.path;

        if (urlpath.indexOf('..') != -1) {
            res.status(404).send('".." in path is forbidden');
            return;
        }
        res.sendFile(ROOT_PATH + '/' + urlpath);
    }
};
