import {
  getTruckLongs,
  getTruckTypeByDataStatus,
  getCargoTypeByDataStatus,
  getCostTypeByDataStatus,
  getPriceUnit
} from '@/api/libraries'
import { getContractRoutePriceType, getContractRouteScopeType } from '@/api/resource/price'

const price = {
  namespaced: true,
  state: {
    truckLongsMap: [], // 车长
    truckTypeMap: [], // 车辆类型
    costTypeMap: [], // 费用类型

    cargoTypeMap: [], // 货物类型
    priceUnitMap: [], // 计费单位
    scopeTypeMap: [], // 区间类型
    costTypeMapUsed: [], // 费用类型, 排除运费
    priceTypesMap: [], // 价格类型

    contractTerm: {} // 价格文件对象
  },

  getters: {
    truckLongsMap: (state, getters) => {
      return state.truckLongsMap
    },
    truckTypeMap: (state, getters) => {
      return state.truckTypeMap
    },
    costTypeMap: (state, getters) => {
      return state.costTypeMap
    },
    cargoTypeMap: (state, getters) => {
      return state.costTypeMap
    },
    priceUnitMap: (state, getters) => {
      return state.priceUnitMap
    },
    scopeTypeMap: (state, getters) => {
      return state.scopeTypeMap
    },
    costTypeMapUsed: (state, getters) => {
      return state.costTypeMapUsed
    },
    priceTypesMap: (state, getters) => {
      return state.priceTypesMap
    },
    contractTerm: (state, getters) => {
      return state.contractTerm
    }
  },

  mutations: {
    truckLongsMap: (state, data) => {
      state.truckLongsMap = data
    },
    truckTypeMap: (state, data) => {
      state.truckTypeMap = data
    },
    costTypeMap: (state, data) => {
      state.costTypeMap = data
    },

    cargoTypeMap: (state, data) => {
      state.cargoTypeMap = data
    },
    priceUnitMap: (state, data) => {
      state.priceUnitMap = data
    },
    scopeTypeMap: (state, data) => {
      state.scopeTypeMap = data
    },
    costTypeMapUsed: (state, data) => {
      state.costTypeMapUsed = data
    },
    priceTypesMap: (state, data) => {
      state.priceTypesMap = data
    },
    contractTerm: (state, data) => {
      state.contractTerm = data
    }
  },

  actions: {
    // 初始化所有下拉列表
    initAllMap ({ dispatch, commit }) {
      console.log('initAllMap....', dispatch)
      dispatch('getTruckLongsMap')
      dispatch('getTruckTypeByDataStatusMap')
      dispatch('getCostTypeByDataStatusMap')

      dispatch('getPriceUnitMap')
      dispatch('getCargoTypeByDataStatusMap')
      dispatch('getPriceTypesMap')
      dispatch('getContractRouteScopeTypeMap')
    },
    // 设置价格文件对象
    setContractTerm ({ commit }, data) {
      commit('contractTerm', data)
    },

    /**
     * 车长
     */
    getTruckLongsMap ({ commit }) {
      console.log('truckLongsMap...11')
      return getTruckLongs().then((res) => {
        console.log('truckLongsMap...', res.data)
        commit('truckLongsMap', res.data || [])
      })
    },
    /**
     * 车辆类型
     */
    getTruckTypeByDataStatusMap ({ commit }) {
      console.log('getTruckTypeByDataStatusMap....11')
      return getTruckTypeByDataStatus().then((res) => {
        console.log('cargoTypeMap....', res.data)
        commit('truckTypeMap', res.data || [])
      })
    },
    /**
     * 费用类型
     */
    getCostTypeByDataStatusMap ({ commit }) {
      console.log('getCostTypeByDataStatusMap....11')
      return getCostTypeByDataStatus().then((res) => {
        console.log('cargoTypeMap....', res.data)
        commit('costTypeMap', res.data || [])
      })
    },
    /**
     * 计费单位
     */
    getPriceUnitMap ({ commit }) {
      console.log('getPriceUnitMap....11')
      return getPriceUnit().then((res) => {
        console.log('cargoTypeMap....', res.data)
        commit('priceUnitMap', res.data || [])
      })
    },

    /**
     * 货物类型
     */
    getCargoTypeByDataStatusMap ({ commit }) {
      console.log('getCargoTypeByDataStatusMap....11')

      return getCargoTypeByDataStatus().then((res) => {
        console.log('cargoTypeMap....', res.data)
        commit('cargoTypeMap', res.data || [])
      })
    },

    // 价格类型
    getPriceTypesMap ({ commit }) {
      console.log('getPriceTypesMap....11')
      getContractRoutePriceType().then((res) => {
        console.log('priceTypesMap....', res.data)
        commit('priceTypesMap', res.data || [])
      })
    },
    // 区间类型
    getContractRouteScopeTypeMap ({ commit }) {
      console.log('getContractRouteScopeTypeMap....11')
      getContractRouteScopeType().then((res) => {
        console.log('cargoTypeMap....', res.data)
        commit('scopeTypeMap', res.data || [])
      })
    }

    // costTypeMapUsed (commit) {
    //   return this.costTypeMap && this.isShowTruckCostForm ? this.costTypeMap.filter(costType => costType.dictId !==
    //     1 /* 排除运费 */) : this.costTypeMap
    // }
  }
}

export default price
