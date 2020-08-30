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
            }
        }
    }
}