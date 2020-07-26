const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const isDevelopment = process.env.NODE_ENV === 'development'


const cssLoaders = extra => {
    const loaders = [
        {
            loader: MiniCssExtractPlugin.loader,
            options: {
                hmr: isDevelopment,
                reloadAll: true
            },
        },
        'css-loader'
    ]

    if (extra) {
        loaders.push(extra)
    }

    return loaders
}

const plugins = () => {
    const base = [
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: 'src/index.pug',
            inject: true
        }),
        new MiniCssExtractPlugin({
            filename: '[name].css'
        }),
        ...tests('colors-type')
    ]

    return base
}

function tests() {
    return [].map.call(arguments, page =>  new HtmlWebpackPlugin({
      template: "./src/assets/components/" + page + "/test/index.pug",
      filename: "tests/" + page + ".html"
    }))
  }

const config = {
    mode: 'development',
    entry: {
        main: './src/app.js'
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].bundle.js'
    },
    plugins: plugins(),
    devtool: 'eval-cheap-source-map',
    module: {
        rules: [
            { 
                test: /\.pug$/,
                use: ["pug-loader"]
            },
            {
                test: /\.css$/,
                use: cssLoaders()
            },
            {
                test: /\.s[ac]ss$/,
                use: cssLoaders('sass-loader')
            },
            {
                test: /\.(png|jpg|svg|gif)$/,
                use: ['file-loader']
            },
            {
                test: /\.(ttf|woff|svg)$/,
                use: ['file-loader']
            },

        ]
    },
    devServer: {
        contentBase: path.join(__dirname, 'dist'),
        port: 9000,
        hot: isDevelopment
    }
}

module.exports = config;