import Vue from 'vue'
import {
  PRE_DISPATCH_DATA,
  PRE_DISPATCH_FINAL_DATA
} from '@/store/mutation-types'
// import { resolve, reject } from 'bluebird'

const dispatch = {
  state: {
    preDispatchData: [],
    preDispatchFinalData: {}
  },
  getters: {
    getPreDispatchData: state => {
      if (state.preDispatchData.length <= 0) {
        let data = Vue.ls.get(PRE_DISPATCH_DATA)
        state.preDispatchData = data
      }
      return state.preDispatchData
    },
    getPreDispatchFinalData: state => {
      if (!state.preDispatchFinalData.preDispatchDataFinal) {
        let data = Vue.ls.get(PRE_DISPATCH_FINAL_DATA)
        state.preDispatchFinalData = data
      }
      return state.preDispatchFinalData
    }
  },
  mutations: {
    SET_DISPATCH_DATA: (state, { data }) => {
      Vue.ls.set(PRE_DISPATCH_DATA, data)
      state.preDispatchData = data
    },
    SET_DISPATCH_FINAL_DATA: (state, { data }) => {
      Vue.ls.set(PRE_DISPATCH_FINAL_DATA, data)
      state.preDispatchFinalData = data
    }
  },
  actions: {
    // set调度数据
    setPreDispatchData ({ commit, state }, selectCollection) {
      console.log(selectCollection)
      return new Promise((resolve, reject) => {
        console.log('调度数据==', selectCollection)
        commit('SET_DISPATCH_DATA', { data: selectCollection })
        resolve()
      })
    },
    // set最终的调度数据
    setPreDispatchFinalData ({ commit, state }, formData) {
      console.log(formData)
      return new Promise((resolve, reject) => {
        commit('SET_DISPATCH_FINAL_DATA', {
          data: formData
        })
        resolve()
      })
    }
  }
}

export default dispatch
