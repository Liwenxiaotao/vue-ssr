const config = require("./webpack.simple.config")
// 根据不同传值使用不同配置
module.exports = (env) => {
  console.log(env);  // { product: true }
  return config
}