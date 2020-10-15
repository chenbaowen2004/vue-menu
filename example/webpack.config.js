const { VueLoaderPlugin } = require('vue-loader')

module.exports = {
    mode: 'development', //development, production or none
    devtool: 'inline-source-map',//inline-source-map, none
    entry: [
        "es6-promise/auto",
        "./src/main.ts",
        "file-loader?name=index.html!./src/index.html",
    ],
    output: {
        path: `${__dirname}/dist`,
        filename: 'bundle.js',
    },
    resolve: {
        extensions: ['.ts', '.js'],
    },
    module: {
        rules: [
            { test: /\.vue$/, use: 'vue-loader' },
            { test: /\.ts$/, loader: 'ts-loader', options: { appendTsSuffixTo: [/\.vue$/] } },
            { test: /\.css/, use: ["style-loader", "css-loader"] },
            { test: /\.scss/, use: ["style-loader", "css-loader", "sass-loader"] },
        ],
    },
    plugins: [
        new VueLoaderPlugin(),
    ],
}