/**
 * @author  reetsee.com
 * @date    20160621
 * @desc    api routes
 */
var path = require('path');
var ROOT_PATH = path.resolve(__dirname, '..');
var express = require('express');
var router = express.Router();

var handler = require(ROOT_PATH + '/handler');

router.get('/:comp/:iface', handler.entrance);
router.get('/:comp/:iface', handler.entrance);
//router.get('/page/:*', pageHandler.entrance)
//router.post('/page/*', pageHandler.entrance)
//router.get('/header/*', headerHandler.entrance)
//router.post('/header/*', headerHandler.entrance)
//router.get('/lefter/*', lefterHandler.entrance)
//router.post('/lefter/*', lefterHandler.entrance)
//router.get('/item/*', itemHandler.entrance)
//router.post('/item/*', itemHandler.entrance)
//router.get('/form/*', formHandler.entrance)
//router.post('/form/*', formHandler.entrance)
//router.get('/form_input/*', formInputHandler.entrance)
//router.post('/form_input/*', formInputHandler.entrance)

module.exports = router;
