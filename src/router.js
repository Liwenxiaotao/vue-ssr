import Vue from 'vue'
import Router from 'vue-router'
// import Hello from './components/Hello.vue'

Vue.use(Router)

export function createRouter () {
  return new Router({
    mode: 'history',
    routes: [
      // ...
      {
        path: '/',
        component: () => import(/* webpackChunkName: 'hello' */'./components/Hello.vue')
      },
      {
        path: '/hello1',
        component: () => import(/* webpackChunkName: 'hello1' */'./components/Hello1.vue')
      }
    ]
  })
}
