const path = require('path')
const defaultSettings = require('./src/settings.js')


function resolve(dir) {
    return path.join(__dirname, dir)
}

const name = defaultSettings.title || '小竹科技' // page title

module.exports = {
    publicPath: process.env.NODE_ENV === "production" ? "./" : "/",
    lintOnSave: true,
    productionSourceMap: false,
    devServer: {
        open: true, //浏览器自动打开页面
        host: "0.0.0.0",
        port: 8080,
        https: false,
        hotOnly: false, //热更新（webpack已实现了，这里false即可）
        proxy: {
            //配置跨域
            '/api2': {
                // target: "http://192.168.10.106:9099",
                // target: "http://192.168.10.225:9099",
                // target: "https://192.168.10.111:8443",
                // target: "http://192.168.10.111:9099",
                target: "https://api.douban.com",
                // target: "http://192.168.10.138:9099",
                changOrigin: true,
                pathRewrite: {
                    '^/api': '/'
                }
            },
            '/bing': {
                // target: "http://192.168.10.106:9099",
                // target: "http://192.168.10.225:9099",
                // target: "https://192.168.10.111:8443",
                // target: "http://192.168.10.111:9099",
                target: "https://cn.bing.com",
                // target: "http://192.168.10.138:9099",
                changOrigin: true,
                pathRewrite: {
                    '^/bing': '/'
                }
            },
            '/mengmian': {
                // target: "http://192.168.10.106:9099",
                // target: "http://192.168.10.225:9099",
                // target: "https://192.168.10.111:8443",
                // target: "http://192.168.10.111:9099",
                target: "https://mengmiandaxia.com",
                // target: "http://192.168.10.138:9099",
                changOrigin: true,
                pathRewrite: {
                    '^/mengmian': '/'
                }
            },
            '/juhui': {
                // target: "http://192.168.10.106:9099",
                // target: "http://192.168.10.225:9099",
                // target: "https://192.168.10.111:8443",
                // target: "http://192.168.10.111:9099",
                target: "https://api.simpleplay.cn",
                // target: "http://192.168.10.138:9099",
                changOrigin: true,
                pathRewrite: {
                    '^/juhui': '/'
                }
            },
            '/nangua': {
                target: "http://api.rbqfccf.com",
                changOrigin: true,
                pathRewrite: {
                    '^/nangua': '/'
                }
            }
        }
    },
    configureWebpack: {
        // provide the app's title in webpack's name field, so that
        // it can be accessed in index.html to inject the correct title.
        name: name,
        // 打包忽略文件
        externals: {
            vant: "vant",
            vue: "Vue",
            "vue-router": "VueRouter",
            vuex: "Vuex",
            axios: "axios",
            moment: "moment",
            // cheerio: "cheerio",
            // "crypto-js": "crypto-js",
            "v-tooltip": "v-tooltip",
            "better-scroll": "@better-scroll",
            cookie: "js-cookie"
        },
        resolve: {
            alias: {
                '@': resolve('src')
            }
        }
    },
    pages: {
        index: {
            entry: 'src/main.js',
            template: 'public/index.html',
            filename: 'index.html',
            chunks: ['chunk-vendors', 'chunk-common', 'index'],
            cdn: {
                css: [
                    'https://cdn.jsdelivr.net/npm/vant@2.10/lib/index.css'
                ],
                js: [
                    "https://cdn.jsdelivr.net/npm/vue@2.6.11/dist/vue.min.js",
                    "https://cdn.jsdelivr.net/npm/vue-router@3.2.0/dist/vue-router.min.js",
                    "https://cdn.jsdelivr.net/npm/vuex@3.4.0/dist/vuex.min.js",
                    "https://cdn.jsdelivr.net/npm/axios@0.19.2/dist/axios.min.js",
                    "https://cdn.jsdelivr.net/npm/moment@2.29.0/moment.min.js",
                    "https://cdn.jsdelivr.net/npm/vue@2.6/dist/vue.min.js",
                    "https://cdn.jsdelivr.net/npm/vant@2.10/lib/vant.min.js",
                    // "https://cdn.jsdelivr.net/npm/cheerio@1.0.0-rc.3/lib/cheerio.min.js",
                    // "https://cdn.jsdelivr.net/npm/crypto-js@4.0.0/crypto-js.min.js",
                    "https://cdn.jsdelivr.net/npm/v-tooltip@2.0.3/dist/v-tooltip.min.js",
                    "https://cdn.jsdelivr.net/npm/better-scroll@2.0.4/dist/better-scroll.min.js",
                    "https://cdn.jsdelivr.net/npm/js-cookie@2/src/js.cookie.min.js"
                ]
            },
        }
    },
}