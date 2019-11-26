const dispatch = {
  state: {
    lodop: null
  },
  getters: {
    lodop: state => state.lodop
  },
  mutations: {
    setLodop (state, lodop) {
      state.lodop = lodop
    }
  },
  actions: {

  }
}

export default dispatch
