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

var FORM_INPUT_FIELDS = [
    'id', 'name', 'display', 'pname', 'help_message', 'assignedAttrs',
    'form_input_type', 'detail', 'op_user', 'ctime', 'mtime', 'ext',
];
var FORM_INPUT_TABLE = 'aap_form_input';

exports.addFormInput = function(r, cb) {
    r.ctime = r.mtime = basic.ts();
    var sql = sqlBuilder.getSqlInsert(
        FORM_INPUT_TABLE,
        buildFieldDict(
            r,
            [
                'name', 'display', 'pname', 'help_message', 
                'assignedAttrs', 'form_input_type', 'detail', 
                'op_user', 'ctime', 'mtime', 'ext',
            ]
        )
    );

    getWritePool().query(sql, function(err, rows, fields) {
        if (!err) {
            cb({ errno: 0, errmsg: 'success' });
            return;
        } else {
            cb({ errno: -1, errmsg: 'Add form input failed', data: err });
            console.log(err);
        }
    });
};

exports.modifyFormInput = function(r, cb) {
    r.mtime = basic.ts();
    var sql = sqlBuilder.getSqlUpdate(
        FORM_INPUT_TABLE,
        buildFieldDict(
            r, 
            [
                'name', 'display', 'pname', 'help_message', 
                'assignedAttrs', 'form_input_type', 'detail', 
                'op_user', 'ctime', 'mtime', 'ext',
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
            cb({ errno: -1, errmsg: 'Modify form input failed', data: err });
            console.log(err);
        }
    });
};

exports.deleteFormInput = function(r, cb) {
    var sql = sqlBuilder.getSqlDelete(
        FORM_INPUT_TABLE,
        {
            'id=': r.id,
        } 
    );

    getWritePool().query(sql, function(err, rows, fields) {
        if (!err) {
            cb({ errno: 0, errmsg: 'success' });
            return;
        } else {
            cb({ errno: -1, errmsg: 'Delete form input failed', data: err });
            console.log(err);
        }
    });
};

exports.getFormInputList = function(r, cb) {
    // FIXME xuruiqi: this callback in callback is ugly

    // 先查出记录总数
    var sql = 'SELECT COUNT(*) AS total FROM ' + FORM_INPUT_TABLE;
    getReadPool().query(sql, function(err, rows, fields) {
        if (!err) {
            total = rows[0].total;

            // 记录总数不为0则查出具体数据
            var conds = buildFieldDict(r, ['op_user']);
            if (basic.keys(conds).length == 0) {
                conds = null;
            }

            var sql = sqlBuilder.getSqlSelect(
                FORM_INPUT_TABLE,
                FORM_INPUT_FIELDS,
                conds,
                ' ORDER BY `id` DESC LIMIT ' 
                    + r.rn + ' OFFSET ' + (r.rn * (r.pn - 1))
            );

            getReadPool().query(sql, function(err, rows, fields) {
                if (err) {
                    cb({ 
                        errno: -1, 
                        errmsg: 'Get form input list failed', 
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
                    form_input_list: [],
                };

                rows.forEach(function(formInput) {
                    var copiedFormInput = buildFieldDict(
                        formInput,
                        FORM_INPUT_FIELDS
                    )

                    data['form_input_list'].push(copiedFormInput);
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
                errmsg: 'Get form input count failed', 
                data: err 
            });
            console.log(err);
        }
    });
};

exports.getFormInput = function(r, cb) {
    var sql = sqlBuilder.getSqlSelect(
        FORM_INPUT_TABLE,
        FORM_INPUT_FIELDS,
        {
            'id=': r.id
        }
    );

    getReadPool().query(sql, function(err, rows, fields) {
        if (basic.isVoid(rows) || basic.safeGet(rows, ['length'], 0) <= 0) {
            cb({
                errno: -1,
                errmsg: 'Form input ' + r.id + ' not exists',
                data: err,
            });
            return;

        } else if (!err && rows) {
            cb({
                errno: 0,
                errmsg: 'success',
                data: buildFieldDict(rows[0], FORM_INPUT_FIELDS),
            });
            return;

        } else {
            cb({
                errno: -1,
                errmsg: 'Get form input failed',
            });
            console.log(err);
            return;
        }
    });

};
