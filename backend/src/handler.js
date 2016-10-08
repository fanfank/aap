/**
 * @author  reetsee.com
 * @date    20160621
 */
var fs = require("fs");
var path = require('path');
var ROOT_PATH = path.resolve(__dirname);

exports.entrance = function(req, res, next) {
    try {
        console.log(req.params.comp + " " + req.params.iface);
        var compPath = path.resolve(ROOT_PATH, 'handlers', req.params.comp)
        var comp = require(compPath);
        comp.entrance(req, res, next);
    } catch (e) {
        console.log(e);
        res.status(500).send("Server is currently under some problems.")
    }
};

exports.bootstrap = function(req, res, next) {
    try {
        var dbConfPath = ROOT_PATH + "/conf/db.json";
        if (fs.statSync(dbConfPath)) {
            res.status(403).send("Database is already init");
            return;
        }
    } catch (e) {
        if (e.code == "ENOENT") {
            //do nothing
        } else {
            res.status(500).send("Server is currently under some problems.");
            return;
        }
    }
    
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
        res.sendFile(ROOT_PATH + '/static/bootstrap/' + urlpath);
    }
};
