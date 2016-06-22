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
    'id', 'name', 'title', 'components', 'content', 'urlmark',
    'page_type', 'op_user', 'ctime', 'mtime', 'ext'
];
var PAGE_TABLE = 'aap_page';

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
    r.ctime = r.mtime = basic.ts();
    var sql = sqlBuilder.getSqlInsert(
        PAGE_TABLE,
        buildFieldDict(
            r,
            [
                'name', 'title', 'components', 'content', 'page_type', 
                'op_user', 'urlmark', 'ctime', 'mtime', 'ext'
            ]
        )
    );
    console.log(sql);
    writePool.query(sql, function(err, rows, fields) {
        if (!err) {
            cb({ errno: 0, errmsg: 'success' });
            return;
        } else {
            cb({ errno: -1, errmsg: 'Add page failed', data: err });
            console.log(err);
        }
    });
};

exports.modifyPage = function(r, cb) {
    r.mtime = basic.ts();
    var sql = sqlBuilder.getSqlUpdate(
        PAGE_TABLE,
        buildFieldDict(
            r, 
            [
                'name', 'title', 'components', 'content', 'page_type', 
                'op_user', 'urlmark', 'ctime', 'mtime', 'ext'
            ]
        ),
        {
            'id=': r.id,
        }
    );
    writePool.query(sql, function(err, rows, fields) {
        if (!err) {
            cb({ errno: 0, errmsg: 'success' });
            return;
        } else {
            cb({ errno: -1, errmsg: 'Modify page failed', data: err });
            console.log(err);
        }
    });
};

exports.deletePage = function(r, cb) {
    var sql = sqlBuilder.getSqlDelete(
        PAGE_TABLE,
        {
            'id=': r.id,
        } 
    );

    writePool.query(sql, function(err, rows, fields) {
        if (!err) {
            cb({ errno: 0, errmsg: 'success' });
            return;
        } else {
            cb({ errno: -1, errmsg: 'Delete page failed', data: err });
            console.log(err);
        }
    });
};

exports.getPageList = function(r, cb) {
    // FIXME xuruiqi: this callback in callback is ugly

    // 先查出记录总数
    var sql = 'SELECT COUNT(*) AS total FROM ' + PAGE_TABLE;
    readPool.query(sql, function(err, rows, fields) {
        if (!err) {
            total = rows[0].total;

            // 记录总数不为0则查出具体数据
            var conds = buildFieldDict(r, ['op_user']);
            if (basic.keys(conds).length == 0) {
                conds = null;
            }

            var sql = sqlBuilder.getSqlSelect(
                PAGE_TABLE,
                PAGE_FIELDS,
                conds,
                ' ORDER BY `id` DESC LIMIT ' 
                    + r.rn + ' OFFSET ' + (r.rn * (r.pn - 1))
            );
            console.log(sql);

            readPool.query(sql, function(err, rows, fields) {
                if (err) {
                    cb({ 
                        errno: -1, 
                        errmsg: 'Get page list failed', 
                        data: err 
                    });
                    console.log(err);
                    return; // break
                }

                var data = {
                    page_info: {
                        pn: r.pn,
                        rn: r.rn,
                        total: total,
                    },
                    page_list: [],
                };

                rows.forEach(function(page) {
                    var copiedPage = buildFieldDict(
                        page,
                        PAGE_FIELDS
                    )

                    data['page_list'].push(copiedPage);
                });

                cb({
                    errno: 0,
                    errmsg: 'success',
                    data: data,
                });
                return;
            });

        } else {
            cb({ 
                errno: -1, 
                errmsg: 'Get page countfailed', 
                data: err 
            });
            console.log(err);
        }
    });
};

exports.getPage = function(r, cb) {
    var sql = sqlBuilder.getSqlSelect(
        PAGE_TABLE,
        PAGE_FIELDS,
        {
            'id=': r.id
        }
    );
    console.log(sql);
    readPool.query(sql, function(err, rows, fields) {
        if (basic.isVoid(rows) || basic.safeGet(rows, ['length'], 0) <= 0) {
            cb({
                errno: -1,
                errmsg: 'Page ' + r.id + ' not exists',
                data: err,
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
