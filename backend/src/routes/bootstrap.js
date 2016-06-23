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

router.get('/', handler.bootstrap);
router.post('/set', handler.bootstrap);

module.exports = router;
