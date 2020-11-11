import Vue from 'vue'
import Component from './func-notification'
const NotificationCinstruction = Vue.extend(Component)

const instances = []
let seed = 1

const removeInstance = (instance) => {
  if(!instance) return
  const index = instances.findIndex(item => instance.id === item.id)
  instances.splice(index, 1)
  let len = instances.length
  if (len === 0) return
  let removeHeight = instance.height
  for (let i = index; i < len; i++) {
    instances[i].bottom = instances[i].bottom - removeHeight - 16
  }
}
const notify = (option) => {
  if (Vue.prototype.$isServer) return

  const {
    autoClose,
    ...res
  } = option
  const instance = new NotificationCinstruction({
    propsData: {
      ...res
    },
    data: {
      autoClose: autoClose ? autoClose : 3000
    }
  })
  console.log(instance)
  const id = `notification_${seed++}`
  instance.id = id
  instance.$mount()  // 生成dom节点
  document.body.appendChild(instance.$el)
  // 显示notification
  instance.visilable = true
  let verticalOffset = 0
  instances.forEach((item) => {
    verticalOffset += item.$el.offsetHeight + 16
  })
  verticalOffset += 16
  instance.bottom = verticalOffset
  instances.push(instance)
  instance.$on('closed', function() {
    removeInstance(this)
    document.body.removeChild(this.$el)
    this.$destroy()
  })
  instance.$on('close', function() {
    this.visilable = false
  })
  return instance
}

export default notify