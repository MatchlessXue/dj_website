const track = {
  namespaced: true,
  state: {
    paymentList: {},
    expendList: {}
  },

  getters: {
    getPaymentList: (state, getters) => {
      return state.paymentList
    },
    getExpendList: (state, getters) => {
      return state.expendList
    }
  },

  mutations: {
    paymentList: (state, data) => {
      state.paymentList = data
    },
    expendList: (state, data) => {
      state.expendList = data
    }
  },

  actions: {
    paymentList ({ commit }, data) {
      // console.log('paymentList>data', data)
      commit('paymentList', data)
    },
    expendList ({ commit }, data) {
      // console.log('expendList>data', data)
      commit('expendList', data)
    }
  }
}

export default track
