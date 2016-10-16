/**
 * @author  reetsee.com
 * @date    20160616
 */
var path = require("path");
var HtmlwebpackPlugin = require("html-webpack-plugin")
var webpack = require("webpack");

var ROOT_PATH = path.resolve(__dirname);
var VENDOR_PATH = path.resolve(ROOT_PATH, "..", "node_modules"); 
var APP_PATH = path.resolve(ROOT_PATH, "src");
var DIST_PATH = path.resolve(ROOT_PATH, "dist");
var TEM_PATH = path.resolve(ROOT_PATH, "templates");

var pathToReact    = path.resolve(VENDOR_PATH, 'react/dist/react.min');
var pathToReactDom = path.resolve(VENDOR_PATH, 'react-dom/dist/react-dom.min'); 

module.exports = {
    entry: {
        app: path.resolve(APP_PATH, "index.jsx"),
    },
    output: {
        path: DIST_PATH,
        publicPath: "/statics",
        //filename: "aap.js",
        filename: "bud.[hash].[name].js",
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
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            }
        }),
    ],
    module: {
        loaders: [
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
                    plugins: [["antd", {style: "css"}]]
                },
            }
        ],
        noParse: [pathToReact],
    },
    resolve: {
        extensions: ["", ".js", ".jsx"],
        alias: {
            'react': pathToReact,
            'react-dom': pathToReactDom,
        },
    },
};
