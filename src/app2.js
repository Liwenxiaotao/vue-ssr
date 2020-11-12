import head from './util/util.js'

const div =  document.createElement('div');
div.style.color = '#f00'
div.innerHTML = head('hello'.split(''))
document.body.appendChild(div)

// 引入动态数据 - 懒加载
setTimeout(() => {
  // 定义chunk
  import('./util/asycs-data.js').then((res) => {
    console.log(console.log(res.default.a)) // 注意这里的default
  })
}, 10000)