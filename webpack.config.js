const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const webpack = require('webpack');

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

const fileLoaders = () => {
    const loaders = [
        {
            loader: 'file-loader',
            options: {
                name: '[path][name].[ext]'
            }
        }
    ]

    return loaders
}

const plugins = () => {
    const base = [
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery'
        }),
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: 'src/index.pug',
            inject: true
        }),
        new MiniCssExtractPlugin({
            filename: '[name].css'
        }),
        ...tests('colors-type', 'form-elements')
    ]

    return base
}

function tests() {
    return [].map.call(arguments, page =>  new HtmlWebpackPlugin({
      template: "./src/assets/components/" + page + "/__test__/index.pug",
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
    resolve: {
        modules: [path.resolve(__dirname, '/src'), 'node_modules'],
        alias: {
          '~': path.resolve(__dirname, './')
        }
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
                test: /\.(png|jpg|svg|gif|ttf|woff)$/,
                use: fileLoaders()
            }

        ]
    },
    devServer: {
        contentBase: path.join(__dirname, 'dist'),
        port: 9000,
        hot: isDevelopment
    }
}

module.exports = config;