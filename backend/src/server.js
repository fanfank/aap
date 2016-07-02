/**
 * @author  reetsee.com
 * @date    20160621
 */
var path = require("path");
var ROOT_PATH = path.resolve(__dirname);

var bodyParser = require('body-parser');
var express = require('express');

var apiRoutes = require(ROOT_PATH + '/routes/api');
var bootstrapRoutes = require(ROOT_PATH + '/routes/bootstrap');
var db = require(ROOT_PATH + '/db.js');

var app = express();
app.use( bodyParser.json() );   // support JSON-encoded bodies
app.use(bodyParser.urlencoded({ // support URL-encoded bodies
  extended: true
})); 

app.use('/api', apiRoutes);
app.use('/bootstrap', bootstrapRoutes);
app.use('/statics', express.static(ROOT_PATH + '/static'));
app.use('/', function(req, res, next) { res.sendFile(ROOT_PATH + '/static/index.html'); });

app.listen(3093, function() {
    console.log('AAP backend listening on port 3093');
});
