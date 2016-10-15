/**
 * @author  reetsee.com
 * @date    20160623
 */
var path = require('path');
var ROOT_PATH = path.resolve(__dirname, '..');

var basic = require(ROOT_PATH + '/libs/basic');
var buildFieldDict = basic.buildFieldDict;

var sqlBuilder = require(ROOT_PATH + '/libs/sql');

var db = require(ROOT_PATH + '/db');
var getReadPool = db.getReadPool;
var getWritePool = db.getWritePool;

var HEADER_FIELDS = [
    'id', 'name', 'uniqkey', 'components', 'op_user', 
    'ctime', 'mtime', 'ext',
];
var HEADER_TABLE = 'aap_header';

exports.addHeader = function(r, cb) {
    r.ctime = r.mtime = basic.ts();
    var sql = sqlBuilder.getSqlInsert(
        HEADER_TABLE,
        buildFieldDict(
            r,
            [
                'name', 'uniqkey', 'components', 'op_user',
                'ctime', 'mtime', 'ext',
            ]
        )
    );

    getWritePool().query(sql, function(err, rows, fields) {
        if (!err) {
            cb({ errno: 0, errmsg: 'success' });
            return;
        } else {
            cb({ errno: -1, errmsg: 'Add header failed', data: err });
            console.log(err);
        }
    });
};

exports.modifyHeader = function(r, cb) {
    r.mtime = basic.ts();
    var sql = sqlBuilder.getSqlUpdate(
        HEADER_TABLE,
        buildFieldDict(
            r, 
            [
                'name', 'uniqkey', 'components', 'op_user',
                'ctime', 'mtime', 'ext',
            ]
        ),
        {
            'id=': r.id,
        }
    );

    getWritePool().query(sql, function(err, rows, fields) {
        if (!err) {
            cb({ errno: 0, errmsg: 'success' });
            return;
        } else {
            cb({ errno: -1, errmsg: 'Modify header failed', data: err });
            console.log(err);
        }
    });
};

exports.deleteHeader = function(r, cb) {
    var sql = sqlBuilder.getSqlDelete(
        HEADER_TABLE,
        {
            'id=': r.id,
        } 
    );

    getWritePool().query(sql, function(err, rows, fields) {
        if (!err) {
            cb({ errno: 0, errmsg: 'success' });
            return;
        } else {
            cb({ errno: -1, errmsg: 'Delete header failed', data: err });
            console.log(err);
        }
    });
};

exports.getHeaderList = function(r, cb) {
    // FIXME xuruiqi: this callback in callback is ugly

    // 先查出记录总数
    var sql = 'SELECT COUNT(*) AS total FROM ' + HEADER_TABLE;
    getReadPool().query(sql, function(err, rows, fields) {
        if (!err) {
            total = rows[0].total;

            // 记录总数不为0则查出具体数据
            var conds = buildFieldDict(r, ['op_user']);
            if (basic.keys(conds).length == 0) {
                conds = null;
            }

            var sql = sqlBuilder.getSqlSelect(
                HEADER_TABLE,
                HEADER_FIELDS,
                conds,
                ' ORDER BY `id` DESC LIMIT ' 
                    + r.rn + ' OFFSET ' + (r.rn * (r.pn - 1))
            );

            getReadPool().query(sql, function(err, rows, fields) {
                if (err) {
                    cb({ 
                        errno: -1, 
                        errmsg: 'Get header list failed', 
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
                    header_list: [],
                };

                rows.forEach(function(header) {
                    var copiedHeader = buildFieldDict(
                        header,
                        HEADER_FIELDS
                    )

                    data['header_list'].push(copiedHeader);
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
                errmsg: 'Get header count failed', 
                data: err 
            });
            console.log(err);
        }
    });
};

exports.getHeader = function(r, cb) {
    var conds = {};
    if (r.id) { conds['id='] = r.id; }
    if (!basic.lz(r.uniqkey)) { conds['uniqkey='] = r.uniqkey; }

    var sql = sqlBuilder.getSqlSelect(
        HEADER_TABLE,
        HEADER_FIELDS,
        conds,
        null,
        null,
        'OR'
    );
    getReadPool().query(sql, function(err, rows, fields) {
        if (basic.isVoid(rows) || basic.safeGet(rows, ['length'], 0) <= 0) {
            cb({
                errno: -1,
                errmsg: 'Header ' + r.id + ' not exists',
                data: err,
            });
            return;

        } else if (!err && rows) {
            cb({
                errno: 0,
                errmsg: 'success',
                data: buildFieldDict(rows[0], HEADER_FIELDS),
            });
            return;

        } else {
            cb({
                errno: -1,
                errmsg: 'Get header failed',
            });
            console.log(err);
            return;
        }
    });
};
