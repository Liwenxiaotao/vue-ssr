<template>
  <div class="hello "> <span class="my-font">明月几时有</span>
    hello worldsxa!{{item}}
    <p><img src="../asset/imgs/1.jpg" height="100px"></p>
    <router-link to="/hello1">hello1 link</router-link>
  </div>
</template>

<script>
import head from '../util/util.js'
export default {
  asyncData: ({ store }) => {
    return store.dispatch('getDataAction')
  },
  created() {
    head(['a', 'b'])
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
  color: green;
}
.aaaaa {
  background: #fff;
}
</style>