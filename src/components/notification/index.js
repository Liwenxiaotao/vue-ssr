import notification from './notification.vue'
import notify from './function'

export default (Vue) => {
  Vue.component(notification.name, notification)
  Vue.prototype.$notify = notify
}
