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

var ITEM_FIELDS = [
    'id', 'name', 'item_type', 'display', 'icon', 'detail',
    'op_user', 'ctime', 'mtime', 'ext',
];
var ITEM_TABLE = 'aap_item';

exports.addItem = function(r, cb) {
    r.ctime = r.mtime = basic.ts();
    var sql = sqlBuilder.getSqlInsert(
        ITEM_TABLE,
        buildFieldDict(
            r,
            [
                'name', 'item_type', 'display', 'icon', 'detail',
                'op_user', 'ctime', 'mtime', 'ext',
            ]
        )
    );
    writePool.query(sql, function(err, rows, fields) {
        if (!err) {
            cb({ errno: 0, errmsg: 'success' });
            return;
        } else {
            cb({ errno: -1, errmsg: 'Add item failed', data: err });
            console.log(err);
        }
    });
};

exports.modifyItem = function(r, cb) {
    r.mtime = basic.ts();
    var sql = sqlBuilder.getSqlUpdate(
        ITEM_TABLE,
        buildFieldDict(
            r, 
            [
                'name', 'item_type', 'display', 'icon', 'detail',
                'op_user', 'ctime', 'mtime', 'ext',
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
            cb({ errno: -1, errmsg: 'Modify item failed', data: err });
            console.log(err);
        }
    });
};

exports.deleteItem = function(r, cb) {
    var sql = sqlBuilder.getSqlDelete(
        ITEM_TABLE,
        {
            'id=': r.id,
        } 
    );

    writePool.query(sql, function(err, rows, fields) {
        if (!err) {
            cb({ errno: 0, errmsg: 'success' });
            return;
        } else {
            cb({ errno: -1, errmsg: 'Delete item failed', data: err });
            console.log(err);
        }
    });
};

exports.getItemList = function(r, cb) {
    // FIXME xuruiqi: this callback in callback is ugly

    // 先查出记录总数
    var sql = 'SELECT COUNT(*) AS total FROM ' + ITEM_TABLE;
    getReadPool().query(sql, function(err, rows, fields) {
        if (!err) {
            total = rows[0].total;

            // 记录总数不为0则查出具体数据
            var conds = buildFieldDict(r, ['op_user']);
            if (basic.keys(conds).length == 0) {
                conds = null;
            }

            var sql = sqlBuilder.getSqlSelect(
                ITEM_TABLE,
                ITEM_FIELDS,
                conds,
                ' ORDER BY `id` DESC LIMIT ' 
                    + r.rn + ' OFFSET ' + (r.rn * (r.pn - 1))
            );

            getReadPool().query(sql, function(err, rows, fields) {
                if (err) {
                    cb({ 
                        errno: -1, 
                        errmsg: 'Get item list failed', 
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
                    item_list: [],
                };

                rows.forEach(function(item) {
                    var copiedItem = buildFieldDict(
                        item,
                        ITEM_FIELDS
                    )

                    data['item_list'].push(copiedItem);
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
                errmsg: 'Get item count failed', 
                data: err 
            });
            console.log(err);
        }
    });
};

exports.getItem = function(r, cb) {
    var sql = sqlBuilder.getSqlSelect(
        ITEM_TABLE,
        ITEM_FIELDS,
        {
            'id=': r.id
        }
    );
    getReadPool().query(sql, function(err, rows, fields) {
        if (basic.isVoid(rows) || basic.safeGet(rows, ['length'], 0) <= 0) {
            cb({
                errno: -1,
                errmsg: 'Item ' + r.id + ' not exists',
                data: err,
            });
            return;

        } else if (!err && rows) {
            cb({
                errno: 0,
                errmsg: 'success',
                data: buildFieldDict(rows[0], ITEM_FIELDS),
            });
            return;

        } else {
            cb({
                errno: -1,
                errmsg: 'Get item failed',
            });
            console.log(err);
            return;
        }
    });
};
