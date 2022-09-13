// 配置dayjs的文件

// 1. 下载dayjs插件
// 2. 引入dayjs
// 3. dayjs().fromNow()方法返回现在到给dayjs()传的时间的相对时间。
// 4. 使用上面的fromNow()方法需先配置 RelativeTime 插件
import dayjs from 'dayjs'
var relativeTime = require('dayjs/plugin/relativeTime')
require('dayjs/locale/zh-cn')

dayjs.extend(relativeTime)
// 5. dayjs默认的语言是英语，需要改成中文
dayjs.locale('zh-cn')

// 把配置好的dayjs暴露出去
export default dayjs
