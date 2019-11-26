import Vue from 'vue'
import axios from '@/utils/request'
import {
  TENANT_ID
} from '@/store/mutation-types'

const api = {
  getAllIndustryType: '/industryType/getAllIndustryType', // 行业类型列表
  // getBankByDataStatus: '/bank/getBankByDataStatus', // 银行列表
  getRegions: '/region/getRegion', // 获取省市区
  getRegionOfCity: '/region/getRegionByLevel', // 取得市级行政地区列表
  // getTruckTypeByDataStatus: '/truckType/getTruckTypeByDataStatus', // 车辆类型
  // getPackageTypeByDataStatus: '/packageType/getPackageTypeByDataStatus', // 包装类型
  // getCargoTypeByDataStatus: '/cargoType/getCargoTypeByDataStatus', // 货物类型
  // getPriceTypeByDataStatus: '/priceType/getPriceTypeByDataStatus', // 费用类型
  // getCustomAreaByDataStatus: '/customerArea/getCustomAreaByDataStatus', // 自定义区域

  getDictionaryById: '/dictionary/getDictionaryByCatalogId', // 根据字典Id查询
  getSubDictionaryById: '/subDictionary/list', // 二级字典
  getCustomDictionaryByCatalogId: '/customDictionary/getCustomDictionaryByCatalogId', // 根据自定义字典Id查询
  getFeeList: '/tenantexpense/other' // 获取费用类型列表
}

export default api

const API = (url, method = 'get', params = {}, data = {}) => {
  url = `/libraries${url}`
  return axios({
    url,
    method,
    params,
    data
  })
}

/**
 * 获取费用类型列表
 * @param {*} params
 */
export function getFeeList (params) {
  return API(api.getFeeList, 'post', {}, params)
}

/**
 * 审批类型列表
 * @param {*} params
 */
export function getApproveTypeList (params) {
  return getDictionaryById(45)
}

/**
 * 银行列表
 * @param {*} params
 */
export function getBankByDataStatus (params) {
  return getDictionaryById(22)
}
/**
 * 获取省市区
 * @param {*} params
 */
export function getRegions (params) {
  return API(api.getRegions, 'get', params)
}

/**
 * 取得市级行政地区列表
 * @param {*} params
 */
export function getRegionOfCity (params) {
  return API(api.getRegionOfCity, 'get', params)
}

/**
 * 自定义区域
 * @param {*} params
 */
export function getCustomAreaByDataStatus (params) {
  return API(api.getCustomAreaByDataStatus, 'get', params)
}

// 字典相关
function getDictionaryById (catalogId) {
  const tenantId = Vue.ls.get(TENANT_ID)
  return API(api.getDictionaryById, 'get', {
    catalogId,
    tenantId
  })
}

// 二级字典相关
export function getSubDictionaryById (catalogId, dictId, dictIds) {
  const tenantId = Vue.ls.get(TENANT_ID)
  return API(api.getSubDictionaryById, 'get', {
    catalogId,
    tenantId,
    dictId,
    dictIds
  })
}

/**
 *  结算方式 3
 * @param {*} params
 */
export function getSettlementStyles (params) {
  return getDictionaryById(3)
}
/**
 * 车辆归属 9
 * @param {*} params
 */
export function getTruckAffiliations (params) {
  return getDictionaryById(9)
}
/**
 * 车长 10
 * @param {*} params
 */
export function getTruckLongs (params) {
  return getDictionaryById(10)
}

/**
 * 获取厂商/品牌 11
 * @param {*} params
 */
export function getBrandId (params) {
  return getDictionaryById(11)
}

/**
 * 准驾车型 13
 * @param {*} params
 */
export function getTruckDryType (params) {
  return getDictionaryById(13)
}

/**
 * 合同类型 16
 * @param {*} params
 */
export function getContractType (params) {
  return getDictionaryById(16)
}

/**
 * 重抛类型 17
 * @param {*} params
 */
export function getDensityType (params) {
  return getDictionaryById(17)
}

/**
 * 合同类型 18
 * @param {*} params
 */
export function getContractCarry (params) {
  return getDictionaryById(18)
}

/**
 * 运输类型 19
 * @param {*} params
 */
export function getTransportType (params) {
  return getDictionaryById(19)
}

/**
 * 计费单位 20
 * @param {*} params
 */
export function getPriceUnit (params) {
  return getDictionaryById(20)
}

/**
 * 线路价格类型 43
 * @param {*} params
 */
export function getRouteComputeType (params) {
  return getDictionaryById(43)
}

/**
 * 线路区间类型 44
 * @param {*} params
 */
export function getRouteIntervalType (params) {
  return getDictionaryById(44)
}

/**
 * 自定义区域 23
 * @param {*} params
 */
export function getAllIndustryType (params) {
  return getDictionaryById(23)
}

/**
 * 车辆类型 24
 * @param {*} params
 */
export function getTruckTypeByDataStatus (params) {
  return getDictionaryById(24)
}

/**
 * 包装类型 25
 * @param {*} params
 */
export function getPackageTypeByDataStatus (params) {
  return getDictionaryById(25)
}

/**
 * 货物类型 26
 * @param {*} params
 */
export function getCargoTypeByDataStatus (params) {
  return getDictionaryById(26)
}

/**
 * 费用类型 27
 * @param {*} params
 */
export function getCostTypeByDataStatus (params) {
  return getDictionaryById(27)
}

/**
 * 费用类型列表 42
 * @param {*} params
 */
export function getCostTypeListByDataStatus (params) {
  return getDictionaryById(42)
}

/**
 * 回单类型 31
 * @param {*} params
 */
export function getReceiptType (params) {
  return getDictionaryById(31)
}

/**
 * 价格类型 32
 * @param {*} params
 */
export function getPriceTypeByDataStatus (params) {
  return getDictionaryById(32)
}

/**
 * 支付方式 38
 * @param {*} params
 */
export function getpayMothod (params) {
  return getDictionaryById(38)
}
// /**
//  * 是否含税 38
//  * @param {*} params
//  */
// export function getpayMothod (params) {
//   return getDictionaryById(38)
// }
/**
 * 税率比例 41
 * @param {*} params
 */
export function getTaxPercents (params) {
  return getDictionaryById(41)
}

/**
 * 客户 业务类型列表 28
 * @param {*} params
 */
export function getCustomerBizTypeList (params) {
  return getDictionaryById(28)
}

/**
 * 承运商 业务类型列表 28
 * @param {*} params
 */
export function getCarrierBizTypeList (params) {
  return getDictionaryById(29)
}

/**
 * 中转站 获取站点类型 14
 * @param {*} params
 */
export function getSiteType (params) {
  return getDictionaryById(14)
}

export function getSettlementType (params) {
  return getDictionaryById(33)
}

export function getCompanyType (params) {
  return getDictionaryById(2)
}

export function getIndustryType (params) {
  return getDictionaryById(1)
}

export function getBusinessStatusType (params) {
  return getDictionaryById(46)
}
/**
 * 费用类型二级列表 42
 * dictId: 1运费
 */
export function getSubCostTypeListByDataStatus (dictId) {
  return getSubDictionaryById(42, null, dictId)
}
