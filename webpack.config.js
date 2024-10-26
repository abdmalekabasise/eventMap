const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

module.exports = {
    // Entry point for your application
    entry: './src/index.js',

    // Output for the bundled files
    output: {
        path: path.resolve(__dirname, 'dist'),
        publicPath: '/',  // Ensure the correct publicPath is set
        filename: 'bundle.[contenthash].js',  // Cache busting for production
    },

    // Module rules to define how different files should be processed
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: 'babel-loader',
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader'],
            },
            {
                test: /\.(png|jpe?g|gif|svg)$/i,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: '[name].[contenthash].[ext]',
                            outputPath: 'images/',
                            publicPath: '/images/',
                        },
                    },
                ],
            },
        ],
    },

    // Plugins to extend Webpack functionality
    plugins: [
        new HtmlWebpackPlugin({
            template: './public/index.html',
            filename: 'index.html',
        }),
        new CopyWebpackPlugin({
            patterns: [
                { from: 'src/images', to: 'images', noErrorOnMissing: true },
            ],
        }),
        new webpack.DefinePlugin({
            'process.env.REACT_APP_MAPBOX_TOKEN': JSON.stringify(process.env.REACT_APP_MAPBOX_TOKEN),
        }),
    ],

    resolve: {
        extensions: ['.js', '.jsx'],
    },

    devServer: {
        static: {
            directory: path.join(__dirname, 'public'),
        },
        compress: true,
        port: 9000,
        historyApiFallback: true,
    },
};
