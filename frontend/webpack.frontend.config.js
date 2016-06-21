/**
 * @author  xuruiqi
 * @date    20160616
 */
var HtmlwebpackPlugin = require("html-webpack-plugin")
var path = require("path");
var webpack = require("webpack");

var APP_PATH = path.resolve(ROOT_PATH, "app");
var ROOT_PATH = path.resolve(__dirname);
var VENDOR_PATH = path.resolve(ROOT_PATH, "node_modules");
var DIST_PATH = path.resolve(ROOT_PATH, "dist");
var TEM_PATH = path.resolve(ROOT_PATH, "templates");

module.exports = {
    entry: {
        app: path.resolve(APP_PATH, "index.jsx"),
    },
    output: {
        path: DIST_PATH,
        //filename: "[hash].[name].js",
        filename: "bundle.js",
    },
    plugins: [
        new HtmlwebpackPlugin({
            title: "AAP-DEBUG",
            template: path.resolve(TEM_PATH, "debug_index.html"),
            filename: "index.html",
            chunks: ["app"],
            //inject: "body",
        }),
        new webpack.DefinePlugin({
            DEBUG: true,
        }),
    ],
    module: {
        loaders: [
            {   
                test: /\.less$/,
                loader: "style!css!less",
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
    devServer: {
        host: "0.0.0.0",
        port: 2993,
        hot: true,
        inline: true,
        progress: true,
        historyApiFallback: true,
    },
    devtool: "inline-source-map",
    resolve: {
        extensions: ["", ".js", ".jsx"],
    },
};
