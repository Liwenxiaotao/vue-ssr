const Koa = require('koa');
const Router = require('@koa/router');
const path = require('path')
const static = require('koa-static')
const fs = require('fs')

const app = new Koa();
const router = new Router();
const isProd = process.env.NODE_ENV === 'production'

// 静态资源
app.use(static(path.resolve(__dirname, './dist')))

router
  .get('/(.*)', async (ctx, next) => {  // 路由使用path-to-regexp匹配
    const html = fs.readFileSync('./index.html')
    ctx.status = 200
    // ctx.response.header = {
    //   'content-type': 'text/html; charset=UTF-8'
    // }
    ctx.type = 'text/html; charset=utf-8';
    ctx.body = html
});

app
  .use(router.routes())
  .use(router.allowedMethods());

app.listen(3333, function() {
  console.log(`服务已启动啦！！！`);
});