/**
 * @author  reetsee.com
 * @date    20160623
 */

var mysql = require('mysql');

var file = require('./libs/file');

var dbConf = {};
var readPool = null;
var writePool = null;

var watcher = new file.Watcher();
watcher.init(
    '/conf/db.json',
    function(content) {
        try {
            dbConf = JSON.parse(content);
            if (readPool) readPool.end(function(err) {});
            if (writePool) writePool.end(function(err) {});

            writePool = mysql.createPool({
                connectionLimit: 10,
                host: dbConf.detail.aapdb_write_host,
                port: dbConf.detail.aapdb_write_port,
                user: dbConf.detail.aapdb_write_user,
                password: dbConf.detail.aapdb_write_password,
                database: dbConf.detail.aapdb_name,
            });

            readPool = mysql.createPool({
                connectionLimit: 10,
                host: dbConf.detail.aapdb_read_host
                    || dbConf.detail.aapdb_write_host,
                port: dbConf.detail.aapdb_read_port
                    || dbConf.detail.aapdb_write_port,
                user: dbConf.detail.aapdb_read_user
                    || dbConf.detail.aapdb_write_user,
                password: dbConf.detail.aapdb_read_password
                    || dbConf.detail.aapdb_write_password,
                database: dbConf.detail.aapdb_name
            });

        } catch(err) {
            console.log(err);
            dbConf = {};
            if (readPool) {
                readPool.end(function (err) {});
            }
            if (writePool) {
                writePool.end(function (err) {});
            }
        }
    }
);

exports.getReadPool = function() {return readPool;};
exports.getWritePool = function() {return writePool;};
