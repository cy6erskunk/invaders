module.exports = {
    entry: "./src/entry.js",
    output: {
        path: __dirname + '/build',
        filename: "bundle.js"
    },
    module: {
        loaders: [
            { test: /\.css$/, loader: "style!css" },
            {
                test: /\.js$/,
                loader: 'babel',
                query: {
                    // https://github.com/babel/babel-loader#options
                    cacheDirectory: true,
                    presets: ['es2015']
                }
            }
        ]
    }
};
