const TerserPlugin = require('terser-webpack-plugin');
// const path = require('path');
/** @type import('@vue/cli-service').ProjectOptions */
 
module.exports = {
    // https://github.com/neutrinojs/webpack-chain/tree/v4#getting-started
    chainWebpack(config) {
        // Set up all the aliases we use in our app.
        config.resolve.alias.clear().merge(require('./aliases.config').webpack);
        // Don't allow importing .vue files without the extension, as
        // it's necessary for some Vetur autocompletions.
        config.resolve.extensions.delete('.vue');
 
        // Don't apply filename hashing for images
        config.module
            .rule('images')
            .use('url-loader')
            .loader('url-loader')
            .tap((options) => {
                options.fallback.options.name = 'img/[name].[ext]';
                return options;
            });
 
        // Only enable performance hints for production builds,
        // outside of tests.
        // config.performance.hints(process.env.NODE_ENV === 'production' && !process.env.VUE_APP_TEST && 'warning');
 
        // Configurando Terser
        if (process.env.NODE_END === 'production') {
            console.log('Minimizando e Obfuscando Arquivos');
 
            config.optimization = {
                minimize: true,
                minimizer: [
                    new TerserPlugin({
                        extractComments: false,
                        terserOptions: {
                            ecma: undefined,
                            warnings: false,
                            parse: {},
                            compress: {
                                drop_console: true,
                                drop_debugger: true,
                                warnings: false,
                                keep_classnames: false,
                                keep_fnames: false,
                                module: false,
                            },
                            mangle: true, // Note `mangle.properties` is `false` by default.
                            module: false,
                            output: { comments: false },
                            toplevel: false,
                            nameCache: null,
                            ie8: false,
                            keep_classnames: false,
                            keep_fnames: false,
                            safari10: true,
                        },
                    }),
                ],
            };
        }
    },
    // configureWebpack: { output: { filename: '[name].[hash].bundle.js' }, minimizer: { minify: true } },
    filenameHashing: true,
    lintOnSave: false,
    productionSourceMap: process.env.NODE_ENV !== 'production',
    devServer: {
        public: 'localhost:8081',
        progress: true, // always show progress (even in production mode)
    },
};