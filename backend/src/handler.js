/**
 * @author  reetsee.com
 * @date    20160621
 */
var path = require('path');
var ROOT_PATH = path.resolve(__dirname);

exports.entrance = function(req, res, next) {
    console.log(req.params.comp + " " + req.params.iface);
    var comp = require(path.resolve(ROOT_PATH, "handlers", req.params.comp));
    comp.entrance(req, res, next);
};

//var pageHandler   = require(ROOT_PATH + '/handlers/page');
//var headerHandler = require(ROOT_PATH + '/handlers/header');
//var lefterHandler = require(ROOT_PATH + '/handlers/lefter');
//var itemHandler   = require(ROOT_PATH + '/handlers/item');
//var formHandler   = require(ROOT_PATH + '/handlers/form');
//var formInputHandler = require(ROOT_PATH + '/handlers/form-input');
