/**
 * @author  reetsee.com
 * @date    20160623
 */

// 读取数据库配置
var fs = require('fs');
var dbConf = JSON.parse(fs.readFileSync(ROOT_PATH + '/conf/db.json', 'utf8'));

var mysql = require('mysql');
var readPool = mysql.createPool({
    connectionLimit: 10,
    host: dbConf.detail.aapdb_read_host,
    port: dbConf.detail.aapdb_read_port,
    user: dbConf.detail.aapdb_read_user,
    password: dbConf.detail.aapdb_read_password,
    database: dbConf.detail.aapdb_name,
});
var writePool = mysql.createPool({
    connectionLimit: 10,
    host: dbConf.detail.aapdb_write_host,
    port: dbConf.detail.aapdb_write_port,
    user: dbConf.detail.aapdb_write_user,
    password: dbConf.detail.aapdb_write_password,
    database: dbConf.detail.aapdb_name,
});

exports.readPool = readPool;
exports.writePool = writePool;
