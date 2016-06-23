/**
 * @author  reetsee.com
 * @date    20160621
 */
var path = require("path");
var ROOT_PATH = path.resolve(__dirname);

var express = require('express');
var apiRoutes = require(ROOT_PATH + '/routes/api');
var bootstrapRoutes = require(ROOT_PATH + '/routes/bootstrap');

var app = express();

app.use('/api', apiRoutes);
app.use('/bootstrap', bootstrapRoutes);
app.use(express.static(ROOT_PATH + '/static'));

app.listen(3093, function() {
    console.log('AAP backend listening on port 3093');
});
