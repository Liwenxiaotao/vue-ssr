// store.js
import Vue from 'vue'
import Vuex from 'vuex'

// 假定我们有一个可以返回 Promise 的
// 通用 API（请忽略此 API 具体实现细节）
import { getData } from '@/api/data'

Vue.use(Vuex)

export function createStore () {
  return new Vuex.Store({
    state: {
      lists: []
    },
    actions: {
      getDataAction ({ commit }) {
        console.log('TCL: getDataAction -> commit', commit)
        return getData().then((res) => {
          console.log('TCL: getDataAction -> res', res)
          commit('setData', res)
        })
      }
    },
    mutations: {
      setData (state, data) {
        state.lists = data
      }
      // setItem (state, { id, item }) {
      //   Vue.set(state.items, id, item)
      // }
    }
  })
}
