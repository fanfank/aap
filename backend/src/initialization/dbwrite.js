/**
 * @author  reetsee.com
 * @date    20160626
 */
var fs = require('fs');

var path = require('path');
var ROOT_PATH = path.resolve(__dirname, '..');

function initWriteDb(req, res) {
    var dbConf = {
        db_type: 'mysql',
        detail: basic.buildFieldDict(
            req.body,
            [
                'aapdb_name', 'aapdb_write_host',
                'aapdb_write_port', 'aapdb_write_user',
                'aapdb_write_password',
            ]
        )
    };

    // 初始化DB
    var mysql = require('mysql');
    var connection = mysql.createConnection({
        host: dbConf.detail.aapdb_write_host,
        port: dbConf.detail.aapdb_write_port,
        user: dbConf.detail.aapdb_write_user,
        password: dbConf.detail.aapdb_write_password,
        database: dbConf.detail.aapdb_name
    });
    try {
        dropTable = function(tableName) {
            connection.query(
                'DROP TABLE ' + tableName,
                function(err) {
                    console.log(err);
                }
            );
        };
        connection.connect();

        // 获取初始化query
        var initQuery = JSON.parse(fs.readFileSync(ROOT_PATH + '/../../../sqls/init_query.json'));

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
            dropTable(tableName);
            connection.query(
                initQuery[tableName]['create'], 
                function(errCreate) {
                    if (errCreate) {
                        console.log(errCreate);
                        tableStatus[index] = 1;
                        return;
                    }

                    connection.query(
                        initQuery[tableName]['insert'],
                        function(errInsert) {
                            if (errInsert) {
                                console.log(errInsert);
                                tableStatus[index] = 2;
                                return;
                            }
                            tableStatus[index] = 0;
                        }
                    );
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
                res.redirect('/bootstrap/dbwrite.html#CreateTableOrInsertFailed');
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
                    res.redirect('/bootstrap/dbwrite.html#CreateDBConfFailed');
                    return;
                }

                res.redirect('/bootstrap/dbread.html');
                return;
            }
            
            if (timeElapsed > 20) {
                res.redirect('/bootstrap/dbwrite.html#InitDBTimedout');
                return;
            }

            timeElapsed += 0.5;
            setTimeout(checkFunction, 500);
        };
        checkFunction();

    } catch(err) {
        res.status(503).send('Init DB failed');
        console.log(err);
    }
} 

exports.initWriteDb = initWriteDb;
