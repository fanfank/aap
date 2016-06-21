/**
 * @author  reetsee.com
 * @date    20160621
 */
var path = require('path');
var ROOT_PATH = path.resolve(__dirname, '..');

var basic = require(ROOT_PATH + '/libs/basic');
var sqlBuilder = require(ROOT_PATH + '/libs/sql');

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
var PAGE_FIELDS = [
    'id', 'name', 'title', 'components', 'content', 
    'page_type', 'op_user', 'ctime', 'mtime', 'ext'
];

function buildFieldDict(r, fieldList) {
    var resDict = {};
    fieldList.forEach(function(field) {
        var val = basic.safeGet(r, [field]);
        if (!basic.isVoid(val)) {
            resDict[field] = val;
        }
    });
    return resDict;
};

exports.addPage = function(r, cb) {
    var sql = sqlBuilder(
        dbConf.detail.aapdb_name,
        buildFieldDict(
            addPageReq,
            [
                'name', 'title', 'components', 'content', 'page_type', 
                'op_user', 'ctime', 'ctime', 'mtime', 'ext'
            ]
        )
    );
    writePool.query(sql, function(err, rows, fields) {
        if (!err) {
            cb({
                errno: 0,
                errmsg: 'success',
            });
            return;
        } else {
            cb({
                errno: -1,
                errmsg: 'Add page failed',
            });
            console.log(err);
        }
    });
};

exports.getPage = function(r, cb) {
    var sql = sqlBuilder.getSqlSelect(
        dbConf.detail.aapdb_name,
        PAGE_FIELDS,
        {
            'id=': r.id
        }
    );

    readPool.query(sql, function(err, rows, fields) {
        if (rows.length <= 0) {
            cb({
                errno: -1,
                errmsg: 'Page ' + r.id + ' not exists',
            });
            return;

        } else if (!err && rows) {
            cb({
                errno: 0,
                errmsg: 'success',
                data: buildFieldDict(rows[0], PAGE_FIELDS),
            });
            return;

        } else {
            cb({
                errno: -1,
                errmsg: 'Get page failed',
            });
            console.log(err);
            return;
        }
    });
};
