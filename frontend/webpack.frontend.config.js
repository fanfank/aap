/**
 * @author  reetsee.com
 * @date    20160616
 */
var path = require("path");
var HtmlwebpackPlugin = require("html-webpack-plugin")
var webpack = require("webpack");

var ROOT_PATH = path.resolve(__dirname);
var APP_PATH = path.resolve(ROOT_PATH, "src");
var DIST_PATH = path.resolve(ROOT_PATH, "dist");
var TEM_PATH = path.resolve(ROOT_PATH, "templates");

module.exports = {
    entry: {
        app: path.resolve(APP_PATH, "index.jsx"),
    },
    output: {
        path: DIST_PATH,
        publicPath: "/statics",
        filename: "aap.js",
        //filename: "[hash].[name].js",
    },
    plugins: [
        new HtmlwebpackPlugin({
            title: "AAP",
            template: path.resolve(TEM_PATH, "index.html"),
            filename: "index.html",
            chunks: ["app"],
            inject: "body",
        }),
        new webpack.DefinePlugin({
            DEBUG: false,
        }),
    ],
    module: {
        loaders: [
            {   
                test: /\.less$/,
                loader: "style!css!less",
            },  
            {
                test: /\.css$/,
                loader: "style-loader!css-loader",
            },
            {
                test: /\.jsx?$/,
                loader: "babel",
                include: APP_PATH,
                query: {
                    presets: ["react", "es2015"],
                    plugins: [["antd", {style: true}]]
                },
            }
        ],
    },
    resolve: {
        extensions: ["", ".js", ".jsx"],
    },
};
