const waybill = {
  namespaced: true,
  state: {

    totalMoney: 0, // 运费总价
    unitPrice: 0, // 全局的单价
    cargoInfo: [], // 当前的一些货物信息
    currentPartnerId: '', // 当前选择的客户id
    transportWay: 1, // 用户选择的运输类型 默认1 零担
    truckLength: '', // 整车车长
    transportDate: '', // 托运的日期
    sendAddress: [], // 发货方地址数组
    getGoodsAddress: [] // 收货方地址数组

  },

  getters: {
    getTotalMoney: (state, getters) => {
      return state.totalMoney
    },
    getPrice: (state, getters) => {
      return state.unitPrice
    },
    getCargoInfo: (state, getters) => {
      return state.cargoInfo
    },
    getPartnerId: (state, getters) => {
      return state.currentPartnerId
    },
    getTransportWay: (state, getter) => {
      return state.transportWay
    },
    getTransportDate: (state, getters) => {
      console.log('getter', state.tansportDate)
      return state.transportDate
    },
    getterSendGoodAddress: (state, getters) => {
      return state.sendAddress
    },
    gettterGetGoodAddress: (state, getters) => {
      return state.getGoodsAddress
    },
    getterTruckLength: (state, getters) => {
      console.log('getter>getTruckLength', state.truckLength)
      return state.truckLength
    }

  },

  mutations: {
    TotalMoney: (state, data) => {
      state.totalMoney = data
    },
    Price: (state, data) => {
      state.unitPrice = data
    },
    CargoInfo: (state, data) => {
      state.cargoInfo = data
    },
    PartnerId: (state, data) => {
      state.currentPartnerId = data
    },
    transportWay: (state, data) => {
      state.transportWay = data
    },
    tansportDate: (state, data) => {
      console.log('muation', data)

      state.transportDate = data
    },
    sendAddress: (state, data) => {
      state.sendAddress = data
    },
    getAddress: (state, data) => {
      state.getGoodsAddress = data
    },
    truckLength: (state, data) => {
      state.truckLength = data
    }

  },

  actions: {
    setTotal ({ commit }, data) {
      commit('TotalMoney', data)
    },
    setPrice ({ commit }, data) {
      commit('Price', data)
    },
    setCargoInfo ({ commit }, data) {
      commit('CargoInfo', data)
    },
    setPartnerId ({ commit }, data) {
      commit('PartnerId', data)
    },
    settransportWay ({ commit }, data) {
      commit('transportWay', data)
    },
    settransportDate ({ commit }, data) {
      console.log('action', data)
      commit('tansportDate', data)
    },
    setSendAddress ({ commit }, data) {
      commit('sendAddress', data)
    },
    setgetAddress ({ commit }, data) {
      commit('getAddress', data)
    },
    setTruckLength ({ commit }, data) {
      console.log('setTruckLength ({ commit }, data', data)
      commit('truckLength', data)
    }

  }
}

export default waybill
