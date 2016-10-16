/**
 * @author  reetsee.com
 * @date    20160621
 */
var path = require("path");
var ROOT_PATH = path.resolve(__dirname);

var bodyParser = require('body-parser');
var express = require('express');
var cookieParser = require("cookie-parser");

var apiRoutes = require(ROOT_PATH + '/routes/api');
var bootstrapRoutes = require(ROOT_PATH + '/routes/bootstrap');
var db = require(ROOT_PATH + '/db.js');

var app = express();
app.use(cookieParser()); // support cookie parsing
app.use(bodyParser.json());   // support JSON-encoded bodies
app.use(bodyParser.urlencoded({ // support URL-encoded bodies
  extended: true
})); 

app.use('/api', apiRoutes);
app.use('/bootstrap', bootstrapRoutes);
app.use('/statics', express.static(ROOT_PATH + '/static'));
app.use('/', function(req, res, next) { 
    // 检查是否已经初始化数据库，是则返回首页，否则重定向到初始化页面
    if (req.originalUrl == "" || req.originalUrl == "/") {
        res.redirect('/page/timecat');
        return;
    }

    if (db.getWritePool()) {
        res.sendFile(ROOT_PATH + '/static/index.html'); 
    } else {
        res.redirect('/bootstrap/dbwrite.html');
    }
});

port = process.argv[2] || 3093;
app.listen(port, function() {
    console.log('------ AAP backend listening on port ' + port + ' ------');
});
