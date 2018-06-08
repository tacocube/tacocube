const path = require('path')

const config = {
    entry: {
        index: './front/index.js'
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js'
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: ['style-loader','css-loader']
            }
        ]
    },
    mode: 'production'
}

module.exports = config