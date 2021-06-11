module.exports = 
{
    entry: './main.js',
    devtool: 'source-map',
    output: {
        filename: './bundle.js'
    },
    plugins: [
        new webpack.ProvidePlugin({
            moment : 'moment'
        })
    ]
};

