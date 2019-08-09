const path = require('path');
const cacheId = "bookshelf-cache";


module.exports = {
    pages: {
        index: {
            // 最初に実行されるファイル名
            entry: 'src/main.ts',
            // テンプレートファイル
            template: 'dist/index.html',
            // 出力されるファイル名
            filename: 'index.html',
            // チャンクの指定
            //chunks: ['chunk-vendors', 'chunk-common', 'index']
        },
    },


    pwa: {
        workboxPluginMode: 'GenerateSW',
        workboxOptions: {
            swDest: path.join(__dirname, '/dist/service-worker.js'),
            globDirectory: path.join(__dirname, '/dist/'),
            globPatterns: ['*.{html,js,css}'],
            runtimeCaching: [
                {
                    urlPattern: /.+(\/|.html)$/,
                    handler: "networkFirst",
                    options: {
                        cacheName: cacheId + "html-cache",
                        expiration: {
                            maxEntries: 10,
                            maxAgeSeconds: 60 * 60 * 24 * 7,
                        },
                    },
                },
                {
                    urlPattern: /.+\.(js|css|woff)$/,
                    handler: 'cacheFirst',
                    options: {
                        cacheName: cacheId + "-dependent-cache",
                        expiration: {
                            maxEntries: 10,
                            maxAgeSeconds: 60 * 60 * 24 * 90,
                        },
                    }
                },
                {
                    urlPattern: /.+\.(png|gif|jpg|jpeg|svg)$/,
                    handler: "cacheFirst",
                    options: {
                        cacheName: cacheId + "-image-cache",
                        expiration: {
                            maxEntries: 10,
                            maxAgeSeconds: 60 * 60 * 24 * 30,
                        },
                    },
                },
            ]
        },
    },


     configureWebpack: {
    //     mode: "production",
    //     entry: "./src/main.ts",
        output: {
            //  出力ファイルのディレクトリ名
            path: `${__dirname}/dist`,
            // 出力ファイル名
            filename: "main.js",
            chunkFilename: '[name].bundle.js',
        },
    //     module: {
    //         rules: [
    //             {
    //                 // 拡張子 .ts の場合
    //                 test: /\.ts$/,
    //                 // TypeScript をコンパイルする
    //                 use: "ts-loader"
    //             }
    //         ]
    //     },
        optimization: {
            splitChunks: {
                cacheGroups: {
                    vendor: {
                        minChunks: 2
                    },
                    app: {
                        minChunks: 3
                    },
                    commons: {
                        minSize: 10000,
                        maxSize: 250000,
                        test: /[\\/]node_modules[\\/]/,
                        name: "vendor",
                        chunks: "all"
                    }
                }
            }
        },
    //     // import 文で .ts ファイルを解決するため
    //     resolve: {
    //         extensions: [".ts"],
    //         // Webpackで利用するときの設定
    //         alias: {
    //             vue: "vue/dist/vue.js"
    //         }
    //     }
    //
     },

};
