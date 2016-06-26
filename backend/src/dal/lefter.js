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
var getReadPool() = db.getReadPool();
var writePool = db.writePool;

var LEFTER_FIELDS = [
    'id', 'name', 'components', 'op_user', 
    'ctime', 'mtime', 'ext',
];
var LEFTER_TABLE = 'aap_lefter';

exports.addLefter = function(r, cb) {
    r.ctime = r.mtime = basic.ts();
    var sql = sqlBuilder.getSqlInsert(
        LEFTER_TABLE,
        buildFieldDict(
            r,
            [
                'name', 'components', 'op_user',
                'ctime', 'mtime', 'ext',
            ]
        )
    );
    writePool.query(sql, function(err, rows, fields) {
        if (!err) {
            cb({ errno: 0, errmsg: 'success' });
            return;
        } else {
            cb({ errno: -1, errmsg: 'Add lefter failed', data: err });
            console.log(err);
        }
    });
};

exports.modifyLefter = function(r, cb) {
    r.mtime = basic.ts();
    var sql = sqlBuilder.getSqlUpdate(
        LEFTER_TABLE,
        buildFieldDict(
            r, 
            [
                'name', 'components', 'op_user',
                'ctime', 'mtime', 'ext',
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
            cb({ errno: -1, errmsg: 'Modify lefter failed', data: err });
            console.log(err);
        }
    });
};

exports.deleteLefter = function(r, cb) {
    var sql = sqlBuilder.getSqlDelete(
        LEFTER_TABLE,
        {
            'id=': r.id,
        } 
    );

    writePool.query(sql, function(err, rows, fields) {
        if (!err) {
            cb({ errno: 0, errmsg: 'success' });
            return;
        } else {
            cb({ errno: -1, errmsg: 'Delete lefter failed', data: err });
            console.log(err);
        }
    });
};

exports.getLefterList = function(r, cb) {
    // FIXME xuruiqi: this callback in callback is ugly

    // 先查出记录总数
    var sql = 'SELECT COUNT(*) AS total FROM ' + LEFTER_TABLE;
    getReadPool().query(sql, function(err, rows, fields) {
        if (!err) {
            total = rows[0].total;

            // 记录总数不为0则查出具体数据
            var conds = buildFieldDict(r, ['op_user']);
            if (basic.keys(conds).length == 0) {
                conds = null;
            }

            var sql = sqlBuilder.getSqlSelect(
                LEFTER_TABLE,
                LEFTER_FIELDS,
                conds,
                ' ORDER BY `id` DESC LIMIT ' 
                    + r.rn + ' OFFSET ' + (r.rn * (r.pn - 1))
            );
            console.log(sql);

            getReadPool().query(sql, function(err, rows, fields) {
                if (err) {
                    cb({ 
                        errno: -1, 
                        errmsg: 'Get lefter list failed', 
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
                    lefter_list: [],
                };

                rows.forEach(function(lefter) {
                    var copiedLefter = buildFieldDict(
                        lefter,
                        LEFTER_FIELDS
                    )

                    data['lefter_list'].push(copiedLefter);
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
                errmsg: 'Get lefter count failed', 
                data: err 
            });
            console.log(err);
        }
    });
};

exports.getLefter = function(r, cb) {
    var sql = sqlBuilder.getSqlSelect(
        LEFTER_TABLE,
        LEFTER_FIELDS,
        {
            'id=': r.id
        }
    );
    getReadPool().query(sql, function(err, rows, fields) {
        if (basic.isVoid(rows) || basic.safeGet(rows, ['length'], 0) <= 0) {
            cb({
                errno: -1,
                errmsg: 'Lefter ' + r.id + ' not exists',
                data: err,
            });
            return;

        } else if (!err && rows) {
            cb({
                errno: 0,
                errmsg: 'success',
                data: buildFieldDict(rows[0], LEFTER_FIELDS),
            });
            return;

        } else {
            cb({
                errno: -1,
                errmsg: 'Get lefter failed',
            });
            console.log(err);
            return;
        }
    });

};
