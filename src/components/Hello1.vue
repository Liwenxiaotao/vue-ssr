<template>
<div>
  <div>hello world1{{item}}</div>
  <router-link to="/">hello1 link</router-link>
</div>

</template>

<script>
import head from '../util/util.js'
export default {
  asyncData: ({ store }) => {
    return store.dispatch('getDataAction')
  },
  computed: {
    item () {
      return this.$store.state.lists
    }
  },
  created() {
    // console.log(process.env.NODE_ENV)
    // console.log(window)
    head(['1', '2', '3'])
  }
}
</script>

<style lang="scss" scoped>
</style>