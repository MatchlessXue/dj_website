const settlement = {
  namespaced: true,
  state: {
    conditionForm: {}, // 结算单数据，用于ConditionForm
    tableListData: [], // 运单(调度单列表的数据)，用于TableList

    costForm: [], // 添加结算单列表
    clientSelectCondiation: [], // 客户费用盘点select 选项盘点
    costCheckDetailList: [], // 客户费用盘点明细
    total: {}, // 总计的数据
    refuseId: '',
    paymentList: {}, // 添加结款信息数据
    checkDocumentInfo: [], // 对账的相关数据
    documentId: '',
    // checkDocumentInfo: [], // 单挑对账的信息对账的相关数据
    checkAllInfo: {}, // 结算单调差请求详情的数据
    // paymentList: {}, // 添加结款信息数据
    documentData: []
  },

  getters: {
    getConditionForm: (state, getters) => {
      return state.conditionForm
    },
    getTableListData: (state, getters) => {
      return state.tableListData
    },
    getCostForm: (state, getters) => {
      return state.costForm
    },
    getClientSelectCondiation: (state, getters) => {
      return state.clientSelectCondiation
    },
    getTotal: (state, getters) => {
      return state.total
    },
    getRefuseId: (state, getters) => {
      return state.refuseId
    },
    getPaymentList: (state, getters) => {
      return state.paymentList
    },
    getDocumentInfo: (state, getters) => {
      return state.checkDocumentInfo
    },
    getDocumentId: (state, getters) => {
      return state.documentId
    },
    getAllDocumentInfo: (state, getters) => {
      return state.checkAllInfo
    },
    getDocumentData: (state, getters) => {
      return state.documentData
    }
  },

  mutations: {
    conditionForm: (state, data) => {
      state.conditionForm = data
    },
    tableListData: (state, data) => {
      state.tableListData = data
    },
    costForm: (state, data) => {
      state.costForm = data
    },
    clientSelectCondiation: (state, data) => {
      state.clientSelectCondiation = data
    },
    totalMoney: (state, data) => {
      state.total = data
    },
    refuseId: (state, data) => {
      state.refuseId = data
    },
    paymentList: (state, data) => {
      state.paymentList = data
    },
    documentInfo: (state, data) => {
      state.checkDocumentInfo = data
    },
    documentId: (state, data) => {
      state.documentId = data
    },
    allDocumentInfo: (state, data) => {
      state.checkAllInfo = data
    },
    documentData: (state, data) => {
      state.documentData = data
    }

  },

  actions: {
    setConditionForm ({ commit }, data) {
      commit('conditionForm', data)
    },
    setTableListData ({ commit }, data) {
      commit('tableListData', data)
    },
    costForm ({ commit }, data) {
      commit('costForm', data)
    },
    clientSelectCondiation ({ commit }, data) {
      commit('clientSelectCondiation', data)
    },
    totalMoney ({ commit }, data) {
      commit('totalMoney', data)
    },
    setrefuseId ({ commit }, data) {
      commit('refuseId', data)
    },
    paymentList ({ commit }, data) {
      commit('paymentList', data)
    },
    // 对账
    setDocumentInfo ({ commit }, data) {
      commit('documentInfo', data)
    },
    setdocumentId ({ commit }, data) {
      commit('documentId', data)
    },
    // 单条所有信息、包含调差信息
    setDocumentAllInfo ({ commit }, data) {
      console.log('action', data)
      commit('allDocumentInfo', data)
    },
    setdocumentData ({ commit }, data) {
      commit('documentData', data)
    }
  }
}

export default settlement
