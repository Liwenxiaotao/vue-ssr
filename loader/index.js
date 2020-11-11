// 1、use:[xx1-loader,xx2-loader]
// 2、最后的loader最早调用，传入原始的资源
// 3、中间loader执行的时候，传入的就是上一个loaderd的执行结果
// 4、loader需要异步， this.async()、this.callback()
module.exports = function(content, map, meta) {
  console.log('执行了。。。。。。'+ this.data.value)
  return content
}

// 5、前置钩子
module.exports.pitch = function(remainRequest, preRequest,data) {
  data.value = 'aaa'
}
// 前置钩子的执行顺序
// xx1loader -> pitch
// xx2loader ->pitch
// xx2loader
// xx1loader
