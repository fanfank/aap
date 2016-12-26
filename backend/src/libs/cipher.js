/**
 * @author  reetsee.com
 * @date    20161224
 */
var path = require('path');
var ROOT_PATH = path.resolve(__dirname, '..');

var crypto = require("crypto");
var basic = require("./basic");
var settings = require(ROOT_PATH + "/conf/cipher.secret");
var cipherConf = settings.cipher || {};

function sha256(s) {
	const hash = crypto.createHash('sha256');
	hash.update(s + cipherConf['shaSalt']);
	return hash.digest('hex');
}
exports.sha256 = sha256;
