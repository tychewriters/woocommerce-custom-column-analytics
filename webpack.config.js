const defaultConfig = require('@wordpress/scripts/config/webpack.config');
const WooCommerceDependencyExtractionWebpackPlugin = require('@woocommerce/dependency-extraction-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const path = require('path');

module.exports = {
    ...defaultConfig,
    entry: './src/index.js', // Your main JS file
    output: {
        path: path.resolve(__dirname, 'build'), // Output to the build folder
        filename: 'index.js', // Output file name
    },
    module: {
        rules: [
            ...defaultConfig.module.rules,
            {
                test: /\.scss$/, // Target SCSS files
                use: [
                    MiniCssExtractPlugin.loader, // Extract CSS to separate file
                    'css-loader', // Resolves CSS imports
                    {
                        loader: 'sass-loader', // Compiles SCSS to CSS
                        options: {
                            implementation: require('sass'), // Use Dart Sass
                            sourceMap: true, // Enable source maps
                        },
                    },
                ],
            },
        ],
    },
    plugins: [
        ...defaultConfig.plugins.filter(
            (plugin) => plugin.constructor.name !== 'DependencyExtractionWebpackPlugin'
        ),
        new WooCommerceDependencyExtractionWebpackPlugin(),
        new MiniCssExtractPlugin({
            filename: 'style.css', // Output CSS file
        }),
    ],
    mode: 'production', // Ensures the build is optimized for production
    devtool: process.env.NODE_ENV === 'development' ? 'eval-source-map' : 'source-map',
};
