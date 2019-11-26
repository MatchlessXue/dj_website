import API from './API'

const api = {
  list: '/partner/getPage', // 查询列表 /partnerType 1:客户 2:承运商 3:第三方
  selectAllPartners: '/partner/getAllByPrivilege', // 获取所有合作伙伴列表
  save: '/partner/saveOrUpdate', // 新增修改
  getAllByPartnerId: '/partner/getDetail', // 根据合作伙伴Id获取页面信息
  setStatus: '/partner/setStatus', // 修改状态：启用，停用
  delete: '/partner/delete', // 删除

  getPartnersWithLike: '/partner/getPartnersWithLike', // 基础信息名称模糊查询
  getCompanyWithLike: '/coopCompany/getCompanyWithLike', // 公司名称模糊查询
  getInvoiceWithLike: '/invoiceInfo/getInvoiceWithLike', // 开票信息公司名称模糊查询

  // getPartnerAllStatus: '/partner/getPartnerAllStatus', // 合作伙伴状态 启用/停用
  getContactTypes: '/contact/getType', // 联系人类型列表

  getCustomTypes: '/partner/getCustomType', // 客户-客户类型列表
  getCustomBizTypes: '/partner/getCustomBizType', // 客户-业务类型列表

  getCarrierBizTypes: '/partner/getCarrierBizType', // 承运商-业务类型
  getCarrierTypes: '/partner/getCarrierType', // 承运商-类型,

  // getCustomTypes: '/partner/getCustomType', // 客户-客户类型列表
  // getCustomBizTypes: '/customerType/getCustomerTypeByDataStatus', // 客户-业务类型列表

  // getCarrierBizTypes: '/carrierType/getCarrierTypeByDataStatus', // 承运商-业务类型
  // getCarrierTypes: '/partner/getCarrierType', // 承运商-类型,

  // getThirdServerBizTypes: '/srvType/getSrvTypeByDataStatus', // 服务商-业务类型
  getThirdServerBizTypes: '/partner/getThirdServerBizType', // 服务商-业务类型
  getThirdServerTypes: '/partner/getThirdServerType', // 服务商-类型

  getAllByPrivilege: '/partner/getAllByPrivilege' // 获取客户名称列表（全）

}

export default api

/**
 * 查询列表
 * @param {*} params
 */
export function getPartnerList (params) {
  const url = `${api.list}`
  return API(url, 'post', params)
}
/**
 * 获取所有承运商列表
 * @param {*} params
 */
export function selectAllPartners (params) {
  return API(api.selectAllPartners, 'post', params)
}

/**
 * 新增修改
 * @param {*} params
 */
export function savePartner (params) {
  return API(api.save, 'post', {}, params)
}

/**
 * 据合作伙伴Id获取页面信息
 * @param {*} params
 */
export function getAllByPartnerId (params) {
  return API(api.getAllByPartnerId, 'get', params)
}

/**
 * 修改状态：启用，停用
 * @param {*} params
 */
export function setPartnerStatus (params) {
  return API(api.setStatus, 'get', params)
}

/**
 * 删除
 * @param {*} params
 */
export function deletePartner (params) {
  return API(api.delete, 'get', params)
}

/**
 * 基础信息名称模糊查询
 * @param {*} params
 */
export function getPartnersWithLike (params) {
  return API(api.getPartnersWithLike, 'get', params)
}

/**
 * 公司名称模糊查询
 * @param {*} params
 */
export function getCompanyWithLike (params) {
  return API(api.getCompanyWithLike, 'get', params)
}

/**
 * 开票信息公司名称模糊查询
 * @param {*} params
 */
export function getInvoiceWithLike (params) {
  return API(api.getInvoiceWithLike, 'get', params)
}
/**
 * 合作伙伴状态列表
 * @param {*} params
 */
export function getPartnerAllStatus (params) {
  return API(api.getPartnerAllStatus, 'get', params)
}

/**
 * 客户-客户类型列表
 * @param {*} params
 */
export function getCustomTypes (params) {
  return API(api.getCustomTypes, 'get', params)
}

/**
 * 客户-业务类型列表
 * @param {*} params
 */
export function getCustomBizTypes (params) {
  return API(api.getCustomBizTypes, 'get', params)
}

/**
 * 联系人类型列表
 * @param {*} params
 */
export function getContactTypes (params) {
  return API(api.getContactTypes, 'get', params)
}

export function getCarrierBizTypes (params) {
  return API(api.getCarrierBizTypes, 'get', params)
}

export function getCarrierTypes (params) {
  return API(api.getCarrierTypes, 'get', params)
}

export function getThirdServerBizTypes (params) {
  return API(api.getThirdServerBizTypes, 'get', params)
}

export function getThirdServerTypes (params) {
  return API(api.getThirdServerTypes, 'get', params)
}
export function getAllPartners (params) {
  return API(api.getAllByPrivilege, 'post', params)
}
