const path = require("path");
var webpack = require('webpack');
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
    entry: ["regenerator-runtime/runtime.js", "./src/index.js"],
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "main.js"
    },
    module: {
        rules: [
            {
                test: /\.css$/i,
                use: ["style-loader", "css-loader"],
            },
            {
                test: /\.s[ac]ss$/i,
                use: [
                    // Creates `style` nodes from JS strings
                    "style-loader",
                    // Translates CSS into CommonJS
                    "css-loader",
                    // Compiles Sass to CSS
                    "sass-loader",
                ],
            },
            // {
            //     test: /\.css$/i,
            //     use: [
            //         {
            //             loader: 'file-loader',
            //             options: {
            //                 emitFile: false,
            //             },
            //         },
            //     ],
            // },
        ]
    },
    plugins: [
        /* HTML Webpack Plugin */
        new HtmlWebpackPlugin({
            template: "./src/template_index.html",
            filename: "index.html"
        }),
        new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery"
        }),
        new CopyPlugin({
            patterns: [
                {
                    from: "cryptocurrency-icons/svg/color/*.svg",
                    to: "./images",
                    context: "node_modules",
                },
            ],
        }),
    ]
}