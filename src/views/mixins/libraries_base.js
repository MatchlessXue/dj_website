import {
  getTruckAffiliations,
  getTruckLongs,
  getTruckTypeByDataStatus,
  getTruckDryType,
  getRegions,
  getAllIndustryType,
  getDensityType,
  getTransportType,
  getCargoTypeByDataStatus,
  getPriceTypeByDataStatus,
  // getCostTypeByDataStatus,
  getSubDictionaryById,
  getPriceUnit,
  getSettlementStyles,
  getRouteComputeType,
  getRouteIntervalType
} from '@/api/libraries'
import {
  getAllStatus
} from '@/api/global'

const librariesBase = {
  data () {
    return {
      statusEnable: 100, // 启用状态

      truckAffiliationsMap: [], // 车辆归属
      truckLongsMap: [], // 车长
      truckTypeMap: [], // 车辆类型
      truckDryTypeMap: [], // 准驾车型
      allStatusMap: [], // 状态
      regionsMap: [], // 省市区
      customAreaMap: [], // 自定义区域
      densityTypeMap: [], // 重抛类型
      transportTypeMap: [], // 运输类型
      cargoTypeMap: [], // 货物类型
      priceTypeMap: [], // 价格类型
      costTypeMap: [], // 费用类型
      priceUnitMap: [], // 计费单位
      computeTypeMap: [], // 线路价格类型
      scopeTypeMap: [], // 线路区间类型
      settlementStylesMap: [] // 结算方式
    }
  },
  methods: {
    /**
     * 车辆归属
     */
    getTruckAffiliationsMap () {
      return getTruckAffiliations().then((res) => {
        this.truckAffiliationsMap = res.data
      })
    },
    /**
     * 车长
     */
    getTruckLongsMap () {
      return getTruckLongs().then((res) => {
        this.truckLongsMap = res.data
      })
    },
    /**
     * 车辆类型
     */
    getTruckTypeByDataStatusMap () {
      return getTruckTypeByDataStatus().then((res) => {
        this.truckTypeMap = res.data
      })
    },
    /**
     * 准驾车型
     */
    getTruckDryTypeMap () {
      return getTruckDryType().then((res) => {
        this.truckDryTypeMap = res.data
      })
    },
    /**
     * 省市区
     */
    getRegions () {
      return getRegions({ level: 3 }).then((res) => {
        this.regionsMap = res.data
      })
    },
    /**
     * 自定义区域
     * @param {*} params
     */
    getCustomAreaMap () {
      // return getCustomAreaByDataStatus().then((res) => {
      return getAllIndustryType().then((res) => {
        this.customAreaMap = res.data
      })
    },
    /**
     * 状态
     */
    getStatusMap () {
      this.allStatusMap = getAllStatus()
      // return getPartnerAllStatus().then((res) => {
      //   this.allStatusMap = res.data
      // })
    },
    /**
     * 重抛类型
     */
    getDensityTypeMap () {
      return getDensityType().then((res) => {
        this.densityTypeMap = res.data
      })
    },
    /**
     * 运输类型
     */
    getTransportTypeMap () {
      return getTransportType().then((res) => {
        this.transportTypeMap = res.data
      })
    },
    /**
     * 货物类型
     */
    getCargoTypeByDataStatusMap () {
      return getCargoTypeByDataStatus().then((res) => {
        this.cargoTypeMap = res.data
      })
    },
    /**
     * 费用类型
     */
    getCostTypeByDataStatusMap () {
      return getSubDictionaryById(42).then((res) => {
        this.costTypeMap = res.data
      })
    },
    /**
     * 价格类型
     */
    getPriceTypeByDataStatusMap () {
      return getPriceTypeByDataStatus().then((res) => {
        this.priceTypeMap = res.data
      })
    },
    /**
     * 计费单位
     */
    getPriceUnitMap () {
      return getPriceUnit().then((res) => {
        this.priceUnitMap = res.data
      })
    },

    /**
     * 价格类型
     */
    getRouteComputeTypeMap () {
      return getRouteComputeType().then((res) => {
        this.computeTypeMap = res.data
      })
    },

    /**
     * 区间类型
     */
    getRouteIntervalTypeMap () {
      return getRouteIntervalType().then((res) => {
        this.scopeTypeMap = res.data
      })
    },
    /**
     * 结算方式
     */
    getSettlementStylesMap () {
      return getSettlementStyles().then((res) => {
        this.settlementStylesMap = res.data
      })
    }
  }
}

export default librariesBase
