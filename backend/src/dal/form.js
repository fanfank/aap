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

var FORM_FIELDS = [
    'id', 'name', 'post_api', 'content_type', 'components',
    'op_user', 'ctime', 'mtime', 'ext',
];
var FORM_TABLE = 'aap_form;'

exports.addForm = function(r, cb) {
    r.ctime = r.mtime = basic.ts();
    var sql = sqlBuilder.getSqlInsert(
        FORM_TABLE,
        buildFieldDict(
            r,
            [
                'name', 'post_api', 'content_type', 'components',
                'op_user', 'ctime', 'mtime', 'ext',
            ]
        )
    );

    writePool.query(sql, function(err, rows, fields) {
        if (!err) {
            cb({ errno: 0, errmsg: 'success' });
            return;
        } else {
            cb({ errno: -1, errmsg: 'Add form failed', data: err });
            console.log(err);
        }
    });
};

exports.modifyForm = function(r, cb) {
    r.mtime = basic.ts();
    var sql = sqlBuilder.getSqlUpdate(
        FORM_TABLE,
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
            cb({ errno: -1, errmsg: 'Modify form failed', data: err });
            console.log(err);
        }
    });
};

exports.deleteForm = function(r, cb) {
    var sql = sqlBuilder.getSqlDelete(
        FORM_TABLE,
        {
            'id=': r.id,
        } 
    );

    writePool.query(sql, function(err, rows, fields) {
        if (!err) {
            cb({ errno: 0, errmsg: 'success' });
            return;
        } else {
            cb({ errno: -1, errmsg: 'Delete form failed', data: err });
            console.log(err);
        }
    });
};

exports.getFormList = function(r, cb) {
    // FIXME xuruiqi: this callback in callback is ugly

    // 先查出记录总数
    var sql = 'SELECT COUNT(*) AS total FROM ' + FORM_TABLE;
    getReadPool().query(sql, function(err, rows, fields) {
        if (!err) {
            total = rows[0].total;

            // 记录总数不为0则查出具体数据
            var conds = buildFieldDict(r, ['op_user']);
            if (basic.keys(conds).length == 0) {
                conds = null;
            }

            var sql = sqlBuilder.getSqlSelect(
                FORM_TABLE,
                FORM_FIELDS,
                conds,
                ' ORDER BY `id` DESC LIMIT ' 
                    + r.rn + ' OFFSET ' + (r.rn * (r.pn - 1))
            );

            getReadPool().query(sql, function(err, rows, fields) {
                if (err) {
                    cb({ 
                        errno: -1, 
                        errmsg: 'Get form list failed', 
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
                    form_list: [],
                };

                rows.forEach(function(form) {
                    var copiedForm = buildFieldDict(
                        form,
                        FORM_FIELDS
                    )

                    data['form_list'].push(copiedForm);
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
                errmsg: 'Get form count failed', 
                data: err 
            });
            console.log(err);
        }
    });
};

exports.getForm = function(r, cb) {
    var sql = sqlBuilder.getSqlSelect(
        FORM_TABLE,
        FORM_FIELDS,
        {
            'id=': r.id
        }
    );
    getReadPool().query(sql, function(err, rows, fields) {
        if (basic.isVoid(rows) || basic.safeGet(rows, ['length'], 0) <= 0) {
            cb({
                errno: -1,
                errmsg: 'Form ' + r.id + ' not exists',
                data: err,
            });
            return;

        } else if (!err && rows) {
            cb({
                errno: 0,
                errmsg: 'success',
                data: buildFieldDict(rows[0], FORM_FIELDS),
            });
            return;

        } else {
            cb({
                errno: -1,
                errmsg: 'Get form failed',
            });
            console.log(err);
            return;
        }
    });

};
