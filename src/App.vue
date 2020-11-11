<template>
  <div id="app">
    <div>{{title}}</div>
    <router-view></router-view>
    <!-- <notification content="aaaaaaaa"></notification> -->
    <button @click="notify">notify</button>
    <tabs :value="tabValue" @change="tapChange" ref="tabs">
      <tab label="tab1" index="1">
        <span>tab content1 {{test}}</span>
        <input type="text" v-model="test">
      </tab>
      <tab index="2">
        <span slot="label" style="color: red">tab12</span>
        <span>tab content2</span>
      </tab>
      <tab label="tab3" index="3">
        <span>tab content3</span>
      </tab>
    </tabs>
  </div>
</template>

<script>

export default {
  name: 'App',
  data(){
    return{
      title: '服务端渲染',
      tabValue: '1',
      test: 'aa'
    }
  },
  created() {
    // console.log(window)  报错
    console.log(2222)
  },
  beforeMount() {
    console.log(1313123)
  },
  watch: {
    test() {
      this.$refs.tabs.forceRender()
    }
  },
  methods: {
    notify() {
      this.$notify({
        content: 'sadasdasdadas',
      })
    },
    tapChange(index) {
      console.log(index)
    }
  },
  mounted() {
    console.log(window) // 浏览器正常运行
    // this.$notify({
    //   content: 'sdadadasd',
    //   btn: '关掉',
    //   autoClose: 4000
    // })
  }
}
</script>

<style lang="scss" scoped>
</style>