/**
 * @author  reetsee.com
 * @date    20160626
 */
var fs = require('fs');

var path = require('path');
var ROOT_PATH = path.resolve(__dirname, '..');

var basic = require(ROOT_PATH + '/libs/basic');

function initReadDb(req, res) {
    var dbConf = {};
    try {
        dbConf = JSON.parse(
            fs.readFileSync(ROOT_PATH + '/conf/db.json', 'utf8')
        );

        if (!dbConf) {
            throw "invalid db.json";
        }

    } catch(err) {
        console.log(err);
        res.redirect('/bootstrap/dbread.html#ReadConfFailed');
        return;
    }

    dbConf.detail.aapdb_read_host = req.body.aapdb_read_host;
    dbConf.detail.aapdb_read_port = req.body.aapdb_read_port;
    dbConf.detail.aapdb_read_user = req.body.aapdb_read_user;
    dbConf.detail.aapdb_read_password = req.body.aapdb_read_password;

    // 检查新的配置是否能读取DB
    var mysql = require('mysql');
    var connectionConf = {
        host: dbConf.detail.aapdb_read_host
            || dbConf.detail.aapdb_write_host,
        port: dbConf.detail.aapdb_read_port
            || dbConf.detail.aapdb_write_port,
        user: dbConf.detail.aapdb_read_user
            || dbConf.detail.aapdb_write_user,
        password: dbConf.detail.aapdb_read_password
            || dbConf.detail.aapdb_write_password,
        database: dbConf.detail.aapdb_name
    };
    var connection = mysql.createConnection(connectionConf);

    // index 0 ~ 5 corresponds to aap_page to aap_form_input 
    // value < 0: running
    // value 0: success
    // otherwise: error
    var tableStatus = [];
    var tableList = [
        'aap_page', 'aap_header',
        'aap_lefter', 'aap_item',
        'aap_form', 'aap_form_input',
    ];

    for (var i = 0; i < tableList.length; ++i) {
        tableStatus.push(-1);
    }
    
    //FIXME fix this ugly code
    tableList.forEach(function(tableName, index) {
        connection.query(
            'SELECT COUNT(*) AS total FROM ' + tableName,
            function (errSel) {
                if (errSel) {
                    console.log(errSel);
                    tableStatus[index] = 1;
                    return;
                }
                tableStatus[index] = 0;
            }
        );
    });

    // Wait for these async queries
    var timeElapsed = 0;
    var checkFunction = function() {
        var successCount = 0;
        var errorCount = 0;
        for (var i = 0; i < tableStatus.length; ++i) {
            if (tableStatus[i] == 0) {
                successCount += 1;
            } else if (tableStatus[i] > 0) {
                errorCount += 1;
                break;
            }
        }

        if (errorCount > 0) {
            res.redirect('/bootstrap/dbread.html#CheckTableFailed');
            return;
        }
        if (successCount == tableStatus.length) {
            // 验证成功，写入配置文件
            try {
                fs.writeFileSync(
                    ROOT_PATH + '/conf/db.json',
                    JSON.stringify(dbConf),
                    {
                        encoding: 'utf8',
                        flag: 'w'
                    }
                );
            } catch(err) {
                console.log(err);
                res.redirect('/bootstrap/dbread.html#CreateDBConfFailed');
                return;
            }

            res.redirect('/bootstrap/finish.html');
            return;
        }
        
        if (timeElapsed > 20) {
            res.redirect('/bootstrap/dbread.html#CheckDBTimedout');
            return;
        }

        timeElapsed += 0.5;
        setTimeout(checkFunction, 500);
    };
    checkFunction();
}

exports.initReadDb = initReadDb;
