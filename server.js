const Koa = require('koa');
const Router = require('@koa/router');
const fs = require('fs')
const path = require('path')
const { createBundleRenderer } = require('vue-server-renderer')
const static = require('koa-static')

const app = new Koa();
const router = new Router();
const isProd = process.env.NODE_ENV === 'production'

// 静态资源
app.use(static(path.resolve(__dirname, './dist')))

// const renderer = createBundleRenderer(serverBundle, {
//   runInNewContext: false, // 推荐
//   template, // （可选）页面模板
//   clientManifest // （可选）客户端构建 manifest
// })
const resolve = file => path.resolve(__dirname, file)
const createRenderer = (bundle, options) => {
  return createBundleRenderer(bundle, Object.assign(options, {
    basedir: resolve('./dist'),
    runInNewContext: false,
  }))
}
let renderer, readyPromise
if(isProd) {
  const serverBundle = require('./dist/vue-ssr-server-bundle.json');
  const clientManifest = require('./dist/vue-ssr-client-manifest.json')
  const template = fs.readFileSync(resolve('./src/index.template.html'), 'utf-8')
  renderer = createRenderer(serverBundle, {
    template, // （可选）页面模板
    clientManifest // （可选）客户端构建 manifest
  })
} else {

}

router
  .get('/(.*)', async (ctx, next) => {  // 路由使用path-to-regexp匹配
    console.log(ctx.url)
    const context = {
      title: 'hello ssr with webpack',
      head: `
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="X-UA-Compatible" content="ie=edge">
      `,
      url: ctx.url
    }
    // 这里无需传入一个应用程序，因为在执行 bundle 时已经自动创建过。
    // 现在我们的服务器与应用程序已经解耦！\
    try {
      const html = await renderer.renderToString(context)
      console.log(context.renderResourceHints())
      ctx.status = 200
      ctx.body = html
    } catch(e) {
      console.log(e)
      if (e.code === 404) {
        ctx.status = 404
        ctx.body = 'Page not found'
      } else {
        ctx.status = 500
        ctx.body = ('Internal Server Error')
      }
    }

});

app
  .use(router.routes())
  .use(router.allowedMethods());

app.listen(3000, function() {
  console.log(`服务已启动啦！！！`);
});

// const Vue = require('vue')
// const app = require('express')()
// const { createBundleRenderer } = require('vue-server-renderer')
// const fs = require('fs')
// const path = require('path')
// const resolve = file => path.resolve(__dirname, file)

// const isProd = process.env.NODE_ENV === "production"
// console.log(process.env.NODE_ENV);

// const createRenderer = (bundle, options) => {
//   return createBundleRenderer(bundle, Object.assign(options, {
//     basedir: resolve('./dist'),
//     runInNewContext: false,
//   }))
// }

// let renderer, readyPromise
// const templatePath = resolve('./src/index.template.html')
// if (isProd) {
//   const bundle = require('./dist/vue-ssr-server-bundle.json')
//   const clientManifest = require('./dist/vue-ssr-client-manifest.json')
//   const template = fs.readFileSync(templatePath, 'utf-8')

//   renderer = createRenderer(bundle, {
//     // 推荐
//     template, // （可选）页面模板
//     clientManifest // （可选）客户端构建 manifest
//   })
// } else {
//   // 开发模式
//   // 1. server -> bundle
//   // 2. client -> manifest
//   // 3. 待2个文件编译完成，就可以调用createBundleRenderer -> renderer -> renderToString -> Promise
//   // 1,2 -> setupServer -> webpack -> readyPromise -> 调用 createRender ->  创建renderer实例
//   // readyPromise = require('./config/setup-dev-server')(app, templatePath, (bundle, options) => {
//   //   renderer = createRenderer(bundle, options)
//   // })
// }

// const render = (req, res) => {
//   const context = {
//     title: 'hello ssr with webpack',
//     meta: `
//       <meta charset="UTF-8">
//       <meta name="viewport" content="width=device-width, initial-scale=1.0">
//       <meta http-equiv="X-UA-Compatible" content="ie=edge">
//     `,
//     url: req.url
//   }
//   // 这里无需传入一个应用程序，因为在执行 bundle 时已经自动创建过。
//   // 现在我们的服务器与应用程序已经解耦！
//   renderer.renderToString(context, (err, html) => {
//     if (err) {
//       if (err.code === 404) {
//         res.status(404).end('Page not found')
//       } else {
//         res.status(500).end('Internal Server Error')
//       }
//     } else {
//       res.end(html)
//     }
//   })
// }

// // 在服务器处理函数中……
// app.get('*',render)

// app.listen(3000, () => {
//   console.log('启动成功')
// })