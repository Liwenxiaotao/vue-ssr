<template>
  <div class="hello "> <span class="my-font">明月几时有</span>
    hello worldaaa!{{item}}
    <p><img src="../asset/imgs/1.jpg" height="100px"></p>
    <router-link to="/hello1">hello1 link</router-link>
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
  }
}
</script>

<style scoped>
@import "../asset/font/font.css";

.hello {
  display: flex;
  color: red;
}
</style>