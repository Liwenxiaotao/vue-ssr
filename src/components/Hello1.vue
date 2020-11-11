<template>
<div>
  <div>hello world1{{item}}</div>
  <router-link to="/">hello1 link</router-link>
</div>

</template>

<script>
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
    // console.log(window)
  }
}
</script>

<style lang="scss" scoped>
</style>