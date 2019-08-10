const path = require('path');
const cacheId = "bookshelf-cache";


module.exports = {
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
        optimization: {
            splitChunks: {
                chunks: 'all',
                minSize: 30000,
                maxSize: 0,
                minChunks: 1,
                cacheGroups: {
                    vendors: {
                        maxSize: 200,
                        test: /[\\/]node_modules[\\/]/,
                        priority: -10
                    },
                    default: {
                        minChunks: 2,
                        priority: -20,
                        reuseExistingChunk: true
                    }
                }
            }
        },
    },

};
