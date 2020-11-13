import Notification from './notification.vue'

export default {
  extends: Notification,
  data () {
    return {
      bottom: 0,
      autoClose: 3000,
      timer: null,
      visilable: false,
      height: 0
    }
  },
  computed: {
    style () {
      return {
        position: 'fixed',
        bottom: `${this.bottom}px`,
        right: '16px'
      }
    }
  },
  mounted () {
    this.createTimer()
  },
  beforeDestroy () {
    this.clearTimer()
  },
  methods: {
    createTimer () {
      if (this.autoClose) {
        this.timer = setTimeout(() => {
          this.visilable = false
        }, this.autoClose)
      }
    },
    clearTimer () {
      clearTimeout(this.timer)
    },
    afterEnter () {
      this.height = this.$el.offsetHeight
      console.log(this.height)
    }
  }
}
