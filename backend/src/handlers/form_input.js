/**
 * @author  reetsee.com
 * @date    20160621
 */
var path = require('path');
var ROOT_PATH = path.resolve(__dirname, '..');

var formInputDal = require(ROOT_PATH + '/dal/form_input');
var basic = require(ROOT_PATH + '/libs/basic');
var hdlrmw = require(ROOT_PATH + '/libs/hdlrmw');
var lz = basic.lz;
var jr = basic.jsonResp;

var ACCESS_METHOD_GET  = ['GET'];
var ACCESS_METHOD_POST = ['POST'];
var ACCESS_METHOD_GET_POST = ['GET', 'POST'];
var ACCESS_METHOD_ALL = ['GET', 'POST', 'OPTIONS'];

var W_PRE_MW_LIST = [hdlrmw.validateSession];

exports.entrance = function(req, res, next) {
    var ifaceDict = {
        'add_form_input': [ACCESS_METHOD_POST, addFormInput, W_PRE_MW_LIST],
        'modify_form_input': [ACCESS_METHOD_POST, modifyFormInput, W_PRE_MW_LIST],
        'delete_form_input': [ACCESS_METHOD_POST, deleteFormInput, W_PRE_MW_LIST],
        'get_form_input': [ACCESS_METHOD_GET, getFormInput],
        'get_form_input_list': [ACCESS_METHOD_GET, getFormInputList],
        'get_form_input_suggest_list': [ACCESS_METHOD_GET, getFormInputSuggestList],
    };
    
    var iface = req.params.iface;
    if (!ifaceDict[iface]) {
        res.status(404).send('iface ' + iface + ' not found');
        return;
    }
    if (ifaceDict[iface][0].indexOf(req.method) < 0) {
        res.status(403).send(
            'iface ' + iface 
            + ' is not allowed to access with method ' 
            + req.method
        );
        return;
    }

    if (ifaceDict[iface].length > 2) {
        var preMwList = ifaceDict[iface][2];
        for (var i = 0; i < preMwList.length; ++i) {
            var errmsg = preMwList[i](req, res, next);
            if (errmsg) {
                jr(res, {
                    "errno": -999,
                    "errmsg": errmsg,
                });
                return;
            }
        }
    }

    ifaceDict[iface][1](req, res);
};

function addFormInput(req, res) {
    name = req.body.name || '';
    uniqkey = req.body.uniqkey || '';
    display = req.body.display || '';
    pname = req.body.pname || '';
    help_message = req.body.help_message || '';
    assignedAttrs = req.body.assignedAttrs || '';
    form_input_type = req.body.form_input_type || '';
    detail = req.body.detail || '';
    op_user = req.body.op_user || '';
    ext = req.body.ext || '';

    if (lz(name) || lz(form_input_type) || lz(uniqkey)) {
        jr(res, {
            errno: -1,
            errmsg: 'invalid params',
            data: {
                name: name,
                form_input_type: form_input_type,
                uniqkey: uniqkey,
            }
        });
        return;
    }

    rq = {
        name: name,
        display: display,
        pname: pname,
        uniqkey: uniqkey,
        help_message: help_message,
        assignedAttrs: assignedAttrs,
        form_input_type: form_input_type,
        detail: detail,
        op_user: op_user,
        ext: ext,
    };

    formInputDal.addFormInput(rq, function(rsp) {
        jr(res, rsp);
    });
};

function modifyFormInput(req, res) {
    id = req.body.id || 0;
    name = req.body.name || '';
    uniqkey = req.body.uniqkey || '';
    display = req.body.display || '';
    pname = req.body.pname || '';
    help_message = req.body.help_message || '';
    assignedAttrs = req.body.assignedAttrs || '';
    form_input_type = req.body.form_input_type || '';
    detail = req.body.detail || '';
    op_user = req.body.op_user || '';
    ext = req.body.ext || '';

    if (lz(name) || lz(form_input_type) || lz(uniqkey) || id <= 0) {
        jr(res, {
            errno: -1,
            errmsg: 'invalid params',
            data: {
                id: id,
                name: name,
                form_input_type: form_input_type,
                uniqkey: uniqkey,
            }
        });
        return;
    }

    rq = {
        id: id,
        name: name,
        uniqkey: uniqkey,
        display: display,
        pname: pname,
        help_message: help_message,
        assignedAttrs: assignedAttrs,
        form_input_type: form_input_type,
        detail: detail,
        op_user: op_user,
        ext: ext,
    };

    formInputDal.modifyFormInput(rq, function(rsp) {
        jr(res, rsp);
    });
}

function deleteFormInput(req, res) {
    id = req.body.id || 0;

    if (id <= 0) {
        jr(res, {
            errno: -1,
            errmsg: 'invalid params',
            data: {
                id: id,
            }
        });
    }

    rq = {
        id: id
    };

    formInputDal.deleteFormInput(rq, function(rsp) {
        jr(res, rsp);
    });
}

function getFormInput(req, res) {
    id = req.query.id || 0;
    uniqkey = req.query.uniqkey || "";
    
    if (lz(uniqkey) && id <= 0) {
        jr(res, {
            errno: -1,
            errmsg: 'invalid params',
            data: {
                id: id,
                uniqkey: uniqkey,
            }
        });
    }

    rq = {
        id: id,
        uniqkey: uniqkey,
    };

    formInputDal.getFormInput(rq, function(rsp) {
        jr(res, rsp);
    });
}

function getFormInputList(req, res) {
    pn = req.query.pn || 0;
    rn = req.query.rn || 0;
    user = req.query.user;

    if (pn <= 0) {
        pn = 1;
    }
    if (rn <= 0) {
        rn = 10;
    }
    if (rn > 500) {
        rn = 500;
    }

    rq = {
        pn: pn,
        rn: rn,
        op_user: user
    };

    formInputDal.getFormInputList(rq, function(rsp) {
        jr(res, rsp);
    });
}

function getFormInputSuggestList(req, res) {
    user = req.query.user;
    rq = {
        pn: 1,
        rn: 200,
        op_user: user,
    };

    formInputDal.getFormInputList(rq, function(rsp) {
        if (rsp['errno'] != 0) {
            jr(res, rsp);
            return;
        }

        suggestList = [];
        rsp['data']['form_input_list'].forEach(function(formInput) {
            suggestList.push({
                display: formInput['name'],
                value: formInput['uniqkey'],
            });
        });

        jr(res, {
            errno: 0,
            errmsg: 'success',
            data: {
                suggest_list: suggestList,
            },
        });
    });
}
