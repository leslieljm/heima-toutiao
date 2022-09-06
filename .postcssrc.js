// 从文件用来配置post-css
// 所有的配置文件都要暴露出来一个配置项对象：module.exports = {}
// 所有的post-css的生态插件都是一个函数，且这个调用这个函数一定要传一个配置项：去npmjs.com官网找插件的文档查看有哪些配置项
const pxToRem = require('postcss-pxtorem')
module.exports = {
    //插件配置在plugins数组里
    plugins: [
        pxToRem({
            // 配置项
            // 根节点字体大小。以37.5px转成rem
            // 如果是vant 37.5；如果是自己的代码 75：写成一个函数，接收一个参数module，module是一个对象，把每个css文件都遍历了一遍。module对象里的file属性值为每个css文件的地址/路径。利用正则去匹配css文件的路径，如果是vant的css文件，则把里面的px以37.5转换成rem，如果不是，则以75把px转换成rem
            // 如果是vant的css文件设成37.5，因为vant组件库是以375px的视口宽度来写的
            // 解构出module对象里的file，file属性值为当前编译的css的文件路径
            rootValue: ({ file }) => (/vant/.test(file) ? 37.5: 75),
            propList: ['*']   // 代表所有的css样式属性都转成rem
        })
    ]
}